import TransactionTypeSelect from "./TransactionTypeSelect";
import ProductSelect from "./ProductSelect";
import StockInfo from "./StockInfo";
import ItemAmountInput from "./ItemAmountInput";
import ErrorMessage from "./ErrorMessage";
import SubmitButton from "./SubmitButton";
import TransactionDatePicker from "./TransactionDatePicker";
import { RequestFormProps } from "../../../interface";
import dayjs, { Dayjs } from 'dayjs';

export default function RequestForm({
    transactionType,
    productId,
    itemAmount,
    transactionDate,
    products,
    selectedProduct,
    loading,
    productsLoading,
    error,
    onTransactionTypeChange,
    onProductChange,
    onItemAmountChange,
    onTransactionDateChange,
    onSubmit,
    buttonText,
    loadingText,
}: RequestFormProps) {
    // Convert transactionDate to Dayjs for the picker
    const dateValue = transactionDate 
        ? dayjs(transactionDate instanceof Date ? transactionDate : new Date(transactionDate))
        : null;

    const handleDateChange = (value: Dayjs | null) => {
        if (value) {
            onTransactionDateChange(value.toISOString());
        } else {
            onTransactionDateChange(null);
        }
    };

    return (
        <div className="w-full max-w-md space-y-4">
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

            <TransactionTypeSelect
                value={transactionType}
                onChange={onTransactionTypeChange}
            />

            <ItemAmountInput
                value={itemAmount}
                onChange={onItemAmountChange}
            />

            <TransactionDatePicker
                value={dateValue}
                onChange={handleDateChange}
            />

            <ErrorMessage message={error} />

            <SubmitButton
                loading={loading}
                onClick={onSubmit}
                buttonText={buttonText}
                loadingText={loadingText}
            />
        </div>
    );
}

