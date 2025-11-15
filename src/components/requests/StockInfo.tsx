import { StockInfoProps } from "../../../interface";

export default function StockInfo({ product, transactionType }: StockInfoProps) {
    if (transactionType !== "stockOut") return null;

    return (
        <div className="text-sm text-gray-600 p-2 bg-yellow-50 rounded">
            <p>Current Stock: {product.stockQuantity} {product.unit}</p>
            <p>Maximum allowed: {Math.min(product.stockQuantity, 50)} {product.unit}</p>
        </div>
    );
}

