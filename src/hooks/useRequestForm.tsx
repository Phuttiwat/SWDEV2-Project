import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { addRequest } from "@/libs/Request";
import { getProducts } from "@/libs/Product";
import { Product, CreateRequestPayload, TransactionType } from "../../interface";

const STORAGE_KEY = "requestFormState";

export function useRequestForm() {
    const { data: session } = useSession();
    
    // Load initial state from localStorage
    const loadSavedState = () => {
        if (typeof window === "undefined") return null;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error("Failed to load saved state:", error);
        }
        return null;
    };

    const savedState = loadSavedState();
    const [transactionType, setTransactionType] = useState<TransactionType>(
        savedState?.transactionType || "stockIn"
    );
    const [productId, setProductId] = useState(savedState?.productId || "");
    const [itemAmount, setItemAmount] = useState<number>(savedState?.itemAmount || 0);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [productsLoading, setProductsLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            if (!session?.user?.token) {
                setProductsLoading(false);
                return;
            }
            setProductsLoading(true);
            try {
                const response = await getProducts(session.user.token);
                console.log("Fetched products response:", response);
                // Backend returns { success: true, data: products }
                const productList = Array.isArray(response) ? response : (response?.data || []);
                if (Array.isArray(productList)) {
                    setProducts(productList);
                } else {
                    console.error("Products is not an array:", productList);
                    setError("Invalid products data format");
                }
            } catch (err: any) {
                console.error("Failed to fetch products:", err);
                setError(err.message || "Failed to load products");
            } finally {
                setProductsLoading(false);
            }
        };
        if (session) {
            fetchProducts();
        }
    }, [session]);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    transactionType,
                    productId,
                    itemAmount,
                }));
            } catch (error) {
                console.error("Failed to save state:", error);
            }
        }
    }, [transactionType, productId, itemAmount]);

    // Update selected product when productId changes
    useEffect(() => {
        if (productId) {
            const product = products.find(p => p._id === productId);
            setSelectedProduct(product || null);
            // Don't reset itemAmount when product changes if it's already set
            // Only reset if productId changes from a different product
        } else {
            setSelectedProduct(null);
        }
    }, [productId, products]);

    const handleTransactionTypeChange = (value: TransactionType) => {
        setTransactionType(value);
        setItemAmount(0);
        setError("");
    };

    const handleProductChange = (value: string) => {
        setProductId(value);
        setError("");
    };

    const handleItemAmountChange = (value: number) => {
        setItemAmount(value);
        setError("");
    };

    const handleSubmit = async () => {
        setError("");
        
        if (!productId) {
            setError("Please select a product");
            return;
        }

        if (!itemAmount || itemAmount <= 0) {
            setError("Please enter a valid item amount");
            return;
        }

        // Validation for stockOut
        if (transactionType === "stockOut") {
            if (!selectedProduct) {
                setError("Please select a product");
                return;
            }
            if (itemAmount > selectedProduct.stockQuantity) {
                setError(`Item amount cannot exceed current stock quantity (${selectedProduct.stockQuantity})`);
                return;
            }
            if (itemAmount > 50) {
                setError("Item amount cannot exceed 50 items for stock-out");
                return;
            }
        }

        if (!session?.user?._id) {
            setError("User session not found");
            return;
        }

        setLoading(true);
        try {
            const requestData: CreateRequestPayload = {
                transactionType: transactionType,
                itemAmount: itemAmount,
                user: session.user._id,
                product_id: productId,
            };

            const token = session.user.token;
            const result = await addRequest(requestData, token);
            
            // Clear saved state from localStorage
            if (typeof window !== "undefined") {
                try {
                    localStorage.removeItem(STORAGE_KEY);
                } catch (error) {
                    console.error("Failed to clear saved state:", error);
                }
            }
            
            // Reset form
            setProductId("");
            setItemAmount(0);
            setSelectedProduct(null);
        } catch (err: any) {
            setError(err.message || "Failed to create request");
        } finally {
            setLoading(false);
        }
    };

    return {
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
    };
}

