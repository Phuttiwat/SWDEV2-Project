import { CreateProductPayload, Product, ProductResponse, UpdateProductPayload } from "../../interface";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!baseUrl) {
    console.error("NEXT_PUBLIC_BACKEND_URL is not defined.");
}

// GET /products
export async function getProducts(token?: string): Promise<ProductResponse> {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}/products`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}


// GET /products/:id
export async function getProductById(id: string, token?: string): Promise<ProductResponse> {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}/products/${id}`, {
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// POST /products
export async function addProduct(data: any, token?: string) {
  const url = `${baseUrl}/products`; // สมมติใช้แบบนี้
  console.log("📡 POST URL:", url);
  console.log("📦 Payload sent:", data);
  console.log("🔑 Token:", token);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let bodyText: string | undefined;
    let bodyJson: any | undefined;

    try {
      // ลอง parse เป็น JSON ก่อน
      bodyJson = await res.json();
    } catch {
      // ถ้าไม่ใช่ JSON ค่อย fallback เป็น text
      bodyText = await res.text();
    }

    console.error("❌ Add product failed");
    console.error("Status:", res.status, res.statusText);
    if (bodyJson) {
      console.error("Response JSON:", bodyJson);
    }
    if (bodyText) {
      console.error("Response text:", bodyText);
    }
    console.error("Payload sent:", data);

    throw new Error(
      `Failed to add product: ${res.status} ${res.statusText} ${
        bodyJson?.message || bodyText || ""
      }`
    );
  }

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
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}/products/${id}/stock`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ stockQuantity }),
  });
  if (!res.ok) throw new Error("Failed to update stock");
  return res.json();
}