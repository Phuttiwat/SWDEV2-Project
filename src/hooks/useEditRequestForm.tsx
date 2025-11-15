import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getRequest, updateRequest } from "@/libs/Request";
import { getProducts } from "@/libs/Product";
import { Product, UpdateRequestPayload, TransactionType, Request } from "../../interface";

export function useEditRequestForm(requestId: string) {
    const { data: session } = useSession();
    const router = useRouter();
    const [transactionType, setTransactionType] = useState<TransactionType>("stockIn");
    const [productId, setProductId] = useState("");
    const [itemAmount, setItemAmount] = useState<number>(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [productsLoading, setProductsLoading] = useState(true);
    const [requestLoading, setRequestLoading] = useState(true);
    const [error, setError] = useState("");
    const [unauthorized, setUnauthorized] = useState(false);

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

    // Fetch current request data
    useEffect(() => {
        const fetchRequest = async () => {
            if (!session?.user?.token || !requestId) {
                setRequestLoading(false);
                return;
            }

            setRequestLoading(true);
            try {
                const response = await getRequest(requestId, session.user.token);
                
                // If response is null, it means access denied or request not found
                if (!response) {
                    setUnauthorized(true);
                    setError("You don't have permission to edit this request or the request doesn't exist.");
                    setRequestLoading(false);
                    return;
                }
                
                // Backend returns { success: true, data: request } or just request
                const requestData = (response as any)?.data || response as Request;
                
                // Extract product_id - could be string or populated object
                const productIdValue = typeof requestData.product_id === 'object' 
                    ? requestData.product_id._id 
                    : requestData.product_id;

                setTransactionType(requestData.transactionType);
                setProductId(productIdValue);
                setItemAmount(requestData.itemAmount);
            } catch (err: any) {
                console.error("Failed to fetch request:", err);
                setError(err.message || "Failed to load request");
            } finally {
                setRequestLoading(false);
            }
        };

        if (session && requestId) {
            fetchRequest();
        }
    }, [session, requestId]);

    // Update selected product when productId changes
    useEffect(() => {
        if (productId) {
            const product = products.find(p => p._id === productId);
            setSelectedProduct(product || null);
        } else {
            setSelectedProduct(null);
        }
    }, [productId, products]);

    const handleTransactionTypeChange = (value: TransactionType) => {
        setTransactionType(value);
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

        if (!session?.user?.token) {
            setError("User session not found");
            return;
        }

        setLoading(true);
        try {
            const requestData: UpdateRequestPayload = {
                transactionType: transactionType,
                itemAmount: itemAmount,
                product_id: productId,
            };

            const token = session.user.token;
            await updateRequest(requestId, requestData, token);
            
            // Success - redirect to request list
            router.push("/myrequest");
        } catch (err: any) {
            setError(err.message || "Failed to update request");
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
        requestLoading,
        error,
        unauthorized,
        handleTransactionTypeChange,
        handleProductChange,
        handleItemAmountChange,
        handleSubmit,
    };
}

