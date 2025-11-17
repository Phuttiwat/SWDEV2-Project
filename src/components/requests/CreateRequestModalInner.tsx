// components/requests/CreateRequestModalInner.tsx
'use client';
import React from "react";
import RequestForm from "./RequestForm";
import { useRequestForm } from "@/hooks/useRequestForm";

type Props = {
    modalRoot: HTMLElement;
    onClose: () => void;
    onSuccess?: () => void;
};

export default function CreateRequestModalInner({ modalRoot, onClose, onSuccess }: Props) {
    const handleCreateSuccess = () => {
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
        error,
        handleTransactionTypeChange,
        handleProductChange,
        handleItemAmountChange,
        handleTransactionDateChange,
        handleSubmit,
    } = useRequestForm(handleCreateSuccess);

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
                    <div className="text-2xl font-semibold text-gray-800">Create Request</div>
                </div>

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
                    buttonText="Create"
                    loadingText="Creating..."
                />
            </div>
        </div>
    );
}

