// components/requests/EditRequestModalInner.tsx
'use client';
import React from "react";
import { useRouter } from "next/navigation";
import RequestForm from "./RequestForm";
import { useEditRequestForm } from "@/hooks/useEditRequestForm";

type Props = {
    requestId: string;
    modalRoot: HTMLElement;
    onClose: () => void;
    onSuccess?: () => void;
};

export default function EditRequestModalInner({ requestId, modalRoot, onClose, onSuccess }: Props) {

    const handleEditSuccess = () => {
        if (onSuccess) {
            onSuccess();
        }
        onClose();
    };

    const {
        transactionType,
        productId,
        itemAmount,
        transactionDate,
        products,
        selectedProduct,
        loading,
        productsLoading,
        requestLoading,
        error,
        unauthorized,
        handleTransactionTypeChange,
        handleProductChange,
        handleItemAmountChange,
        handleTransactionDateChange,
        handleSubmit,
    } = useEditRequestForm(requestId, handleEditSuccess);

    // Note: modal overlay + dialog markup -- displayed inside createPortal by parent
    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1300]"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <button
                    onClick={() => onClose()}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                >
                    ×
                </button>

                <div className="mb-6 pr-8">
                    <div className="text-2xl font-semibold text-gray-800">Edit Request</div>
                </div>

                {requestLoading ? (
                    <div className="text-center py-8">
                        <div className="text-gray-500">Loading request data...</div>
                    </div>
                ) : unauthorized ? (
                    <div className="text-center py-6 space-y-4">
                        <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
                        <p className="text-sm text-gray-600">{error || "You don't have permission to edit this request."}</p>
                        <div className="flex gap-3 justify-center mt-4">
                            <button onClick={() => onClose()} className="px-4 py-2 bg-gray-200 rounded">Close</button>
                        </div>
                    </div>
                ) : (
                    <RequestForm
                        transactionType={transactionType}
                        productId={productId}
                        itemAmount={itemAmount}
                        transactionDate={transactionDate}
                        products={products}
                        selectedProduct={selectedProduct}
                        loading={loading}
                        productsLoading={productsLoading}
                        error={error}
                        onTransactionTypeChange={handleTransactionTypeChange}
                        onProductChange={handleProductChange}
                        onItemAmountChange={handleItemAmountChange}
                        onTransactionDateChange={handleTransactionDateChange}
                        onSubmit={handleSubmit}
                        buttonText="Update"
                        loadingText="Updating..."
                    />
                )}
            </div>
        </div>
    );
}
