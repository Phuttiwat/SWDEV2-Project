'use client';
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEditRequestForm } from "@/hooks/useEditRequestForm";
import RequestForm from "@/components/requests/RequestForm";

export default function EditRequestPage() {
    const params = useParams();
    const router = useRouter();
    const requestId = params.id as string;

    const {
        transactionType,
        productId,
        itemAmount,
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
        handleSubmit,
    } = useEditRequestForm(requestId);

    if (requestLoading) {
        return (
            <main className="w-full flex flex-col items-center space-y-6 p-8">
                <div className="text-2xl font-semibold text-gray-800">Edit Request</div>
                <div className="text-gray-500">Loading request data...</div>
            </main>
        );
    }

    // Show unauthorized message if user doesn't have permission
    if (unauthorized) {
        return (
            <main className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
                <div className="text-center space-y-4 max-w-md">
                    <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
                    <p className="text-lg text-gray-700">
                        {error || "You don't have permission to edit this request or the request doesn't exist."}
                    </p>
                    <p className="text-sm text-gray-500">
                        This may happen if:
                    </p>
                    <ul className="text-sm text-gray-500 text-left list-disc list-inside space-y-1">
                        <li>You are not the owner of this request</li>
                        <li>You are not an administrator</li>
                        <li>The request doesn't exist</li>
                    </ul>
                    <div className="flex gap-4 justify-center mt-6">
                        <Link 
                            href="/request"
                            className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                            Create New Request
                        </Link>
                        <Link 
                            href="/myrequest"
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            View My Requests
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="w-full flex flex-col items-center space-y-6 p-8">
            <div className="text-2xl font-semibold text-gray-800">Edit Request</div>

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
                buttonText="Update Request"
                loadingText="Updating..."
            />
        </main>
    );
}

