// components/requests/RequestList.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getRequests, deleteRequest } from "@/libs/Request";
import { getProductById, updateStock } from "@/libs/Product";
import getUserRole from "@/libs/getUserRole";
import { Request } from "../../../interface";
import RequestCard from "./RequestCard";
import ConfirmModal from "./ConfirmModal";

type Props = {
    onEditClick?: (id: string) => void;
    sortOrder?: 'newest' | 'oldest';
};

export default function RequestList({ onEditClick, sortOrder = 'newest' }: Props) {
    const { data: session } = useSession();
    const router = useRouter();
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);
    const isAdmin = userRole === 'admin';
    
    // Modal states
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'approve' | 'delete' | null;
        requestId: string | null;
        message: string;
        currentStock?: number;
        newStock?: number;
    }>({
        isOpen: false,
        type: null,
        requestId: null,
        message: '',
    });

    // Fetch user role
    useEffect(() => {
        const fetchUserRole = async () => {
            if (session?.user?.token) {
                try {
                    const role = await getUserRole(session.user.token);
                    setUserRole(role);
                } catch (err) {
                    console.error("Failed to fetch user role:", err);
                }
            }
        };

        fetchUserRole();
    }, [session]);

    useEffect(() => {
        const fetchRequests = async () => {
            if (!session?.user?.token) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getRequests(session.user.token);
                // Backend returns { success: true, data: requests } or just requests array
                const requestsData = Array.isArray(response)
                    ? response
                    : (response as any)?.data || [];
                
                // Debug: Check if product_id is populated
                if (requestsData.length > 0) {
                    const firstRequest = requestsData[0];
                    console.log("Sample request from API:", {
                        hasProductId: !!firstRequest.product_id,
                        productIdType: typeof firstRequest.product_id,
                        productIdValue: firstRequest.product_id,
                        isPopulated: typeof firstRequest.product_id === 'object' && firstRequest.product_id !== null
                    });
                }
                
                setRequests(requestsData);
            } catch (err: any) {
                console.error("Failed to fetch requests:", err);
                setError(err.message || "Failed to load requests");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [session]);

    // Sort requests based on sortOrder (memoized for performance)
    const sortedRequests = useMemo(() => {
        return [...requests].sort((a, b) => {
            const dateA = new Date(a.transactionDate).getTime();
            const dateB = new Date(b.transactionDate).getTime();
            
            if (sortOrder === 'newest') {
                // Newest first: descending order
                return dateB - dateA;
            } else {
                // Oldest first: ascending order
                return dateA - dateB;
            }
        });
    }, [requests, sortOrder]);

    // handleEdit now prefers onEditClick prop, fallback to router.push
    const handleEdit = (requestId: string) => {
        if (onEditClick) {
            onEditClick(requestId);
            return;
        }
        router.push(`/request/${requestId}`);
    };

    const handleApprove = async (requestId: string) => {
        if (!session?.user?.token) {
            setError("No session token available");
            return;
        }

        try {
            // 1. หา request จาก list ที่มีอยู่แล้ว (มี product_id populated)
            const request = requests.find(req => req._id === requestId);

            if (!request) {
                setError("Request not found in current list");
                return;
            }

            console.log("Request from list:", request);
            console.log("Request product_id:", request.product_id, "Type:", typeof request.product_id);

            // 2. ดึง product data เพื่อดู stockQuantity ปัจจุบัน
            let productId: string | undefined;

            if (request.product_id) {
                if (typeof request.product_id === 'object' && (request.product_id as any)._id) {
                    productId = (request.product_id as any)._id;
                } else if (typeof request.product_id === 'string') {
                    productId = request.product_id;
                }
            }

            if (!productId || productId === 'undefined' || productId === 'null') {
                console.error("Invalid productId:", productId, "Request:", request);
                setError("Product ID not found in request");
                return;
            }

            console.log("Extracted ProductId:", productId, "Type:", typeof productId);

            const productResponse = await getProductById(productId, session.user.token);
            // Backend returns { success: true, data: product } or just product
            const product = (productResponse as any)?.data || productResponse;
            const currentStock = product?.stockQuantity;

            if (currentStock === undefined || currentStock === null) {
                console.error("Invalid stock quantity:", currentStock, "Product:", product);
                setError("Failed to get current stock quantity");
                return;
            }

            console.log("Current stock:", currentStock);

            // 3. คำนวณ stockQuantity ใหม่
            let newStockQuantity: number;
            if (request.transactionType === 'stockIn') {
                newStockQuantity = currentStock + request.itemAmount;
            } else if (request.transactionType === 'stockOut') {
                newStockQuantity = currentStock - request.itemAmount;
                // ตรวจสอบว่า stock ไม่ติดลบ
                if (newStockQuantity < 0) {
                    setError("Cannot approve: Stock would become negative");
                    return;
                }
            } else {
                setError("Invalid transaction type");
                return;
            }

            // 4. แสดง confirm modal พร้อมข้อมูล stock
            setConfirmModal({
                isOpen: true,
                type: 'approve',
                requestId: requestId,
                message: `Are you sure you want to approve this request?\n\nThis will update the product stock from ${currentStock} to ${newStockQuantity}.`,
                currentStock,
                newStock: newStockQuantity,
            });
        } catch (err: any) {
            console.error("Failed to prepare approve request:", err);
            setError(err.message || "Failed to prepare approve request");
        }
    };

    const executeApprove = async () => {
        if (!session?.user?.token || !confirmModal.requestId) {
            return;
        }

        const requestId = confirmModal.requestId;
        setConfirmModal({ isOpen: false, type: null, requestId: null, message: '' });

        try {
            const request = requests.find(req => req._id === requestId);
            if (!request) {
                setError("Request not found");
                return;
            }

            let productId: string | undefined;
            if (request.product_id) {
                if (typeof request.product_id === 'object' && (request.product_id as any)._id) {
                    productId = (request.product_id as any)._id;
                } else if (typeof request.product_id === 'string') {
                    productId = request.product_id;
                }
            }

            if (!productId || productId === 'undefined' || productId === 'null') {
                setError("Invalid product ID for stock update");
                return;
            }

            // อัพเดต stockQuantity ใน product
            await updateStock(productId, confirmModal.newStock!, session.user.token);

            // ลบ request transaction
            await deleteRequest(requestId, session.user.token);

            // อัพเดต local state (ลบ request ออกจาก list)
            setRequests(prev => prev.filter(req => req._id !== requestId));
        } catch (err: any) {
            console.error("Failed to approve request:", err);
            setError(err.message || "Failed to approve request");
        }
    };

    const handleDelete = (requestId: string) => {
        setConfirmModal({
            isOpen: true,
            type: 'delete',
            requestId: requestId,
            message: "Are you sure you want to delete this request?\n\nThis action cannot be undone.",
        });
    };

    const executeDelete = async () => {
        if (!session?.user?.token || !confirmModal.requestId) {
            return;
        }

        const requestId = confirmModal.requestId;
        setConfirmModal({ isOpen: false, type: null, requestId: null, message: '' });

        try {
            await deleteRequest(requestId, session.user.token);
            // Remove from local state
            setRequests(prev => prev.filter(req => req._id !== requestId));
        } catch (err: any) {
            console.error("Failed to delete request:", err);
            setError(err.message || "Failed to delete request");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen">
                <span className="text-2xl text-gray-500">Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen">
                <span className="text-2xl text-red-500">Error: {error}</span>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen">
                <span className="text-2xl text-gray-500">No Requests Found</span>
            </div>
        );
    }

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.type === 'approve' ? 'Approve Request' : 'Delete Request'}
                message={confirmModal.message}
                confirmText={confirmModal.type === 'approve' ? 'Approve' : 'Delete'}
                cancelText="Cancel"
                type={confirmModal.type === 'delete' ? 'danger' : 'info'}
                onConfirm={() => {
                    if (confirmModal.type === 'approve') {
                        executeApprove();
                    } else if (confirmModal.type === 'delete') {
                        executeDelete();
                    }
                }}
                onCancel={() => setConfirmModal({ isOpen: false, type: null, requestId: null, message: '' })}
            />
            
            <div>
                {sortedRequests.map((request) => (
                    <RequestCard
                        key={request._id}
                        request={request}
                        isAdmin={isAdmin}
                        onEdit={handleEdit}
                        onApprove={handleApprove}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </>
    );
}
