// components/requests/RequestCard.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Request } from "../../../interface";
import RequestCardDetails from "./RequestCardDetails";

type Props = {
    request: Request;
    isAdmin: boolean;
    onEdit: (requestId: string) => void;
    onApprove: (requestId: string) => void;
    onDelete: (requestId: string) => void;
};

export default function RequestCard({ request, isAdmin, onEdit, onApprove, onDelete }: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const cardContentRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const product = typeof request.product_id === 'object' && request.product_id !== null
        ? request.product_id
        : null;
    const user = typeof request.user === 'object'
        ? request.user
        : null;
    const isStockOut = request.transactionType === 'stockOut';
    
    // Check if product is deleted (product_id is null/undefined when product is deleted, or isActive is false)
    const isProductDeleted = !product || product === null || (product as any)?.isActive === false;
    
    // Check if stockOut request exceeds current stock
    const currentStock = product && typeof product === 'object' && product !== null
        ? (product as any).stockQuantity 
        : null;
    const exceedsStock = isStockOut && currentStock !== null && currentStock !== undefined && request.itemAmount > currentStock;
    
    // Determine if approve should be disabled
    const canApprove = !isProductDeleted && !exceedsStock;
    
    // Card background color - disabled style if product deleted
    let cardBgColor = isStockOut ? 'bg-red-50' : 'bg-green-50';
    if (isProductDeleted) {
        cardBgColor = 'bg-gray-300 opacity-60';
    }
    
    // Extract product ID from populated or string product_id (no fetch needed - data already populated from backend)
    const extractProductId = () => {
        if (request.product_id === null || request.product_id === undefined) {
            return null;
        }
        if (typeof request.product_id === 'object' && request.product_id._id) {
            return request.product_id._id;
        } else if (typeof request.product_id === 'string') {
            return request.product_id;
        }
        return null;
    };

    const productId = extractProductId();
    
    // Format date to "17 Nov 2025" format
    const formatDate = (date: string | Date) => {
        const d = new Date(date);
        const day = d.getDate();
        const month = d.toLocaleDateString('en-US', { month: 'short' });
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
    };
    
    const transactionDate = formatDate(request.transactionDate);
    const sign = isStockOut ? '-' : '+';
    const productName = product?.name || 'Unknown Product';

    const handleProductClick = () => {
        if (productId) {
            router.push(`/product/${productId}`);
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleEditClick = () => {
        setIsMenuOpen(false);
        onEdit(request._id);
    };

    const handleDeleteClick = () => {
        setIsMenuOpen(false);
        onDelete(request._id);
    };

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Don't toggle if clicking on buttons, links, or menu
        const target = e.target as HTMLElement;
        if (
            target.closest('button') ||
            target.closest('a') ||
            target.closest('[role="button"]') ||
            menuRef.current?.contains(target) ||
            buttonRef.current?.contains(target)
        ) {
            return;
        }
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`${cardBgColor} rounded px-5 mx-5 py-2 my-2 relative ${isExpanded ? 'rounded-b-none' : ''}`}>
            {/* Three vertical dots button */}
            <button
                ref={buttonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-300 rounded-full transition-colors"
                aria-label="Menu"
            >
                <svg
                    className="w-5 h-5 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>

            {/* Dropdown menu */}
            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="absolute top-10 right-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[120px]"
                >
                    <button
                        onClick={handleEditClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            )}

            <div 
                ref={cardContentRef}
                onClick={handleCardClick}
                className={`cursor-pointer ${isExpanded ? 'pb-3' : ''}`}
            >
                <div className="text-lg font-semibold pr-8">
                    <span>{sign}{request.itemAmount} pcs : </span>
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick();
                        }}
                        className={`${productId ? 'cursor-pointer hover:underline text-blue-600' : ''}`}
                    >
                        {productName}
                    </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">{transactionDate}</div>
                
                {/* Status warnings - visible to all users */}
                {!canApprove && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="text-xs text-yellow-800 font-semibold">
                            {isProductDeleted 
                                ? '⚠️ Product has been deleted' 
                                : exceedsStock 
                                ? `⚠️ Request amount (${request.itemAmount}) exceeds current stock (${currentStock} available)`
                                : ''}
                        </div>
                    </div>
                )}
                
                {isAdmin && (
                    <div className="mt-2">
                        <button
                            name="Approve"
                            disabled={!canApprove}
                            className={`block rounded-md px-3 py-2 text-white shadow-md font-semibold !border-none relative z-10 transition-colors ${
                                canApprove
                                    ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
                                    : 'bg-gray-400 cursor-not-allowed opacity-60'
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (canApprove) {
                                    onApprove(request._id);
                                }
                            }}
                            title={
                                isProductDeleted
                                    ? 'Cannot approve: Product has been deleted'
                                    : exceedsStock
                                    ? `Cannot approve: Request amount (${request.itemAmount}) exceeds current stock (${currentStock})`
                                    : 'Approve request'
                            }
                        >
                            Approve
                        </button>
                    </div>
                )}
            </div>
            
            {/* Expanded Details Section */}
            {isExpanded && <RequestCardDetails request={request} isAdmin={isAdmin} />}
        </div>
    );
}

