// components/requests/RequestCardDetails.tsx
"use client";
import { Request } from "../../../interface";

type Props = {
    request: Request;
    isAdmin: boolean;
};

export default function RequestCardDetails({ request, isAdmin }: Props) {
    const product = typeof request.product_id === 'object'
        ? request.product_id
        : null;
    const user = typeof request.user === 'object'
        ? request.user
        : null;

    const formatDateTime = (date: string | Date | undefined) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-gray-50 border-t-2 border-gray-300 px-5 py-3 -mx-5 -mb-2 rounded-b mt-3 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Request Information */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Request Information</h3>
                    <div className="space-y-1 text-sm">
                        <div>
                            <span className="font-medium text-gray-600">Request ID:</span>
                            <span className="ml-2 text-gray-800">{request._id}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Transaction Type:</span>
                            <span className="ml-2 text-gray-800">{request.transactionType}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Item Amount:</span>
                            <span className="ml-2 text-gray-800">{request.itemAmount} pcs</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Transaction Date:</span>
                            <span className="ml-2 text-gray-800">{formatDateTime(request.transactionDate)}</span>
                        </div>
                        {request.createdAt && (
                            <div>
                                <span className="font-medium text-gray-600">Created At:</span>
                                <span className="ml-2 text-gray-800">{formatDateTime(request.createdAt)}</span>
                            </div>
                        )}
                        {request.updatedAt && (
                            <div>
                                <span className="font-medium text-gray-600">Updated At:</span>
                                <span className="ml-2 text-gray-800">{formatDateTime(request.updatedAt)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Information */}
                {product && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Product Information</h3>
                        <div className="space-y-1 text-sm">
                            <div>
                                <span className="font-medium text-gray-600">Product Name:</span>
                                <span className="ml-2 text-gray-800">{product.name}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">SKU:</span>
                                <span className="ml-2 text-gray-800">{product.sku}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Category:</span>
                                <span className="ml-2 text-gray-800">{product.category}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Stock Quantity:</span>
                                <span className="ml-2 text-gray-800">{product.stockQuantity}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* User Information - Only for Admin */}
            {isAdmin && user && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">User Information</h3>
                    <div className="space-y-1 text-sm">
                        <div>
                            <span className="font-medium text-gray-600">Name:</span>
                            <span className="ml-2 text-gray-800">{user.name}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Email:</span>
                            <span className="ml-2 text-gray-800">{user.email}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Role:</span>
                            <span className="ml-2 text-gray-800">{user.role}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

