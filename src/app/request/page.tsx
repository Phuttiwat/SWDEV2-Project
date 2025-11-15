'use client';
import { useRequestForm } from "@/hooks/useRequestForm";
import RequestForm from "@/components/requests/RequestForm";

export default function RequestPage() {
    const {
        transactionType,
        productId,
        itemAmount,
        products,
        selectedProduct,
        loading,
        productsLoading,
        error,
        handleTransactionTypeChange,
        handleProductChange,
        handleItemAmountChange,
        handleSubmit,
    } = useRequestForm();

    return (
        <main className="w-full flex flex-col items-center space-y-6 p-8">
            <div className="text-2xl font-semibold text-gray-800">Create Request</div>

            <RequestForm
                transactionType={transactionType}
                productId={productId}
                itemAmount={itemAmount}
                products={products}
                selectedProduct={selectedProduct}
                loading={loading}
                productsLoading={productsLoading}
                error={error}
                onTransactionTypeChange={handleTransactionTypeChange}
                onProductChange={handleProductChange}
                onItemAmountChange={handleItemAmountChange}
                onSubmit={handleSubmit}
                buttonText="Create Request"
                loadingText="Creating..."
            />
        </main>
    );
}