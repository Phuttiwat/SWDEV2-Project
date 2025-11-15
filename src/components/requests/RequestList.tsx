// components/requests/RequestList.tsx
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getRequests, deleteRequest } from "@/libs/Request";
import { getProduct, updateStock } from "@/libs/Product";
import getUserRole from "@/libs/getUserRole";
import { Request } from "../../../interface";

type Props = {
    onEditClick?: (id: string) => void;
};

export default function RequestList({ onEditClick }: Props) {
    const { data: session } = useSession();
    const router = useRouter();
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);
    const isAdmin = userRole === 'admin';

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

            const productResponse = await getProduct(productId, session.user.token);
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

            // 4. แสดง confirm dialog พร้อมข้อมูล stock
            if (!confirm(`Are you sure you want to approve this request? This will update the product stock from ${currentStock} to ${newStockQuantity}.`)) {
                return;
            }

            // 5. อัพเดต stockQuantity ใน product
            console.log("Updating stock - ProductId:", productId, "New Stock:", newStockQuantity);
            if (!productId || productId === 'undefined' || productId === 'null') {
                setError("Invalid product ID for stock update");
                return;
            }
            await updateStock(productId, newStockQuantity, session.user.token);

            // 6. ลบ request transaction
            await deleteRequest(requestId, session.user.token);

            // 7. อัพเดต local state (ลบ request ออกจาก list)
            setRequests(prev => prev.filter(req => req._id !== requestId));
        } catch (err: any) {
            console.error("Failed to approve request:", err);
            setError(err.message || "Failed to approve request");
        }
    };

    const handleDelete = async (requestId: string) => {
        if (!session?.user?.token) {
            setError("No session token available");
            return;
        }

        if (!confirm("Are you sure you want to delete this request?")) {
            return;
        }

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
        <div>
            {requests.map((request) => {
                const product = typeof request.product_id === 'object'
                    ? request.product_id
                    : null;
                const user = typeof request.user === 'object'
                    ? request.user
                    : null;
                const transactionDate = new Date(request.transactionDate).toLocaleDateString();
                const isStockOut = request.transactionType === 'stockOut';
                const cardBgColor = isStockOut ? 'bg-red-50' : 'bg-slate-200';

                return (
                    <div
                        className={`${cardBgColor} rounded px-5 mx-5 py-2 my-2`}
                        key={request._id}
                    >
                        {isAdmin && (
                            <div className="text-xl">Request ID: {request._id}</div>
                        )}
                        {product && (
                            <>
                                <div className="text-xl">Product: {product.name}</div>
                                <div className="text-xl">SKU: {product.sku}</div>
                                <div className="text-xl">Category: {product.category}</div>
                            </>
                        )}
                        {user && isAdmin && (
                            <div className="text-xl">User: {user.name} ({user.email})</div>
                        )}
                        <div className="text-xl">Transaction Type: {request.transactionType}</div>
                        <div className="text-xl">Item Amount: {request.itemAmount}</div>
                        <div className="text-xl">Transaction Date: {transactionDate}</div>
                        <div className="mt-2 flex gap-2">
                            {isAdmin && (
                                <button
                                    name="Approve"
                                    className="block rounded-md bg-green-500 hover:bg-green-600 px-3 py-2 text-white shadow-md font-semibold !border-none relative z-10"
                                    onClick={() => handleApprove(request._id)}
                                >
                                    Approve
                                </button>
                            )}
                            <button
                                name="Edit"
                                className="block rounded-md bg-blue-500 hover:bg-blue-600 px-3 py-2 text-white shadow-md font-semibold !border-none relative z-10"
                                onClick={() => handleEdit(request._id)}
                            >
                                Edit
                            </button>
                            <button
                                name="Delete"
                                className="block rounded-md bg-red-500 hover:bg-red-600 px-3 py-2 text-white shadow-md font-semibold !border-none relative z-10"
                                onClick={() => handleDelete(request._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
