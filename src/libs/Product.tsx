import { CreateProductPayload, Product, UpdateProductPayload } from "../../interface";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ;
if (!baseUrl) {
    console.error("NEXT_PUBLIC_BACKEND_URL is not defined.");
}


// GET /products
export async function getProducts(): Promise<{ success: boolean; data: Product[] } | Product[]> {
    const res = await fetch(`${baseUrl}/products`, {
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }
    const result = await res.json();
    // Backend returns { success: true, data: products }
    return result;
}


// GET /products/:id
export async function getProduct(id: string): Promise<Product> {
    const res = await fetch(`${baseUrl}/products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
}

// POST /products
export async function addProduct(data: CreateProductPayload, token?: string): Promise<Product> {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${baseUrl}/products`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add product");
    return res.json();
}

// PUT /products/:id
export async function updateProduct(
    id: string,
    data: UpdateProductPayload,
    token?: string
): Promise<Product> {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${baseUrl}/products/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
}

// DELETE /products/:id
export async function deleteProduct(id: string, token?: string): Promise<{ message: string }> {
    const headers: HeadersInit = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${baseUrl}/products/${id}`, {
        method: "DELETE",
        headers,
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return res.json();
}

// PUT /products/:id/stock
export async function updateStock(
    id: string,
    stockQuantity: number,
    token?: string
): Promise<Product> {
    console.log("updateStock called with:", { id, stockQuantity });
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${baseUrl}/products/${id}/stock`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ stockQuantity }),
    });
    
    console.log("updateStock response status:", res.status, res.statusText);
    
    if (!res.ok) {
        let errorMessage = "Failed to update stock";
        try {
            const errorData = await res.json();
            errorMessage = errorData?.error || errorData?.message || errorMessage;
            console.error("updateStock error response:", errorData);
        } catch (e) {
            console.error("updateStock error - failed to parse error response:", e);
        }
        console.error(`updateStock failed - Status: ${res.status}, Message: ${errorMessage}`);
        throw new Error(errorMessage);
    }
    
    const result = await res.json();
    console.log("updateStock success:", result);
    return result;
}