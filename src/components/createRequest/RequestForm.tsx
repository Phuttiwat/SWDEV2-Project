import TransactionTypeSelect from "./TransactionTypeSelect";
import ProductSelect from "./ProductSelect";
import StockInfo from "./StockInfo";
import ItemAmountInput from "./ItemAmountInput";
import ErrorMessage from "./ErrorMessage";
import SubmitButton from "./SubmitButton";
import { RequestFormProps } from "../../../interface";

export default function RequestForm({
    transactionType,
    productId,
    itemAmount,
    products,
    selectedProduct,
    loading,
    productsLoading,
    error,
    onTransactionTypeChange,
    onProductChange,
    onItemAmountChange,
    onSubmit,
}: RequestFormProps) {
    return (
        <div className="w-full max-w-md space-y-4">
            <TransactionTypeSelect
                value={transactionType}
                onChange={onTransactionTypeChange}
            />

            {productsLoading ? (
                <div className="text-gray-500 text-sm">Loading products...</div>
            ) : (
                <ProductSelect
                    products={products}
                    value={productId}
                    onChange={onProductChange}
                />
            )}

            {selectedProduct && (
                <StockInfo
                    product={selectedProduct}
                    transactionType={transactionType}
                />
            )}

            <ItemAmountInput
                value={itemAmount}
                onChange={onItemAmountChange}
            />

            <ErrorMessage message={error} />

            <SubmitButton
                loading={loading}
                onClick={onSubmit}
            />
        </div>
    );
}

