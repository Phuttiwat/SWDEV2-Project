import { CreateProductPayload, Product, ProductResponse, UpdateProductPayload } from "../../interface";
import { getAuthHeader } from "./authHeader";
import { fetchWithAuth } from "./fetchWithAuth";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ;
if (!baseUrl) {
    console.error("NEXT_PUBLIC_BACKEND_URL is not defined.");
}

// GET /products
export async function getProducts(): Promise<ProductResponse> {
  const res = await fetchWithAuth(`${baseUrl}/products`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}


// GET /products/:id
export async function getProduct(id: string): Promise<Product> {
  const res = await fetchWithAuth(`${baseUrl}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// POST /products
export async function addProduct(data: CreateProductPayload): Promise<Product> {
  const res = await fetchWithAuth(`${baseUrl}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  console.log("HEADERS:", {
  "Content-Type": "application/json",
  ...(await getAuthHeader()),
});
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
}

// PUT /products/:id
export async function updateProduct(
  id: string,
  data: UpdateProductPayload
): Promise<Product> {
  const res = await fetchWithAuth(`${baseUrl}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

// DELETE /products/:id
export async function deleteProduct(id: string): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${baseUrl}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

// PUT /products/:id/stock
export async function updateStock(
  id: string,
  stockQuantity: number
): Promise<Product> {
  const res = await fetchWithAuth(`${baseUrl}/products/${id}/stock`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stockQuantity }),
  });
  if (!res.ok) throw new Error("Failed to update stock");
  return res.json();
}

import { CreateProductPayload, Product, ProductResponse, UpdateProductPayload } from "../../interface";
import { getAuthHeader } from "./authHeader";
import { fetchWithAuth } from "./fetchWithAuth";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ;
if (!baseUrl) {
    console.error("NEXT_PUBLIC_BACKEND_URL is not defined.");
}

// GET /products
export async function getProducts(): Promise<ProductResponse> {
  const res = await fetchWithAuth(`${baseUrl}/products`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}


// GET /products/:id
export async function getProduct(id: string): Promise<Product> {
  const res = await fetchWithAuth(`${baseUrl}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// POST /products
export async function addProduct(data: CreateProductPayload): Promise<Product> {
  const res = await fetchWithAuth(`${baseUrl}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  console.log("HEADERS:", {
  "Content-Type": "application/json",
  ...(await getAuthHeader()),
});
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
}

// PUT /products/:id
export async function updateProduct(
  id: string,
  data: UpdateProductPayload
): Promise<Product> {
  const res = await fetchWithAuth(`${baseUrl}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

// DELETE /products/:id
export async function deleteProduct(id: string): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${baseUrl}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

// PUT /products/:id/stock
export async function updateStock(
  id: string,
  stockQuantity: number
): Promise<Product> {
  const res = await fetchWithAuth(`${baseUrl}/products/${id}/stock`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stockQuantity }),
  });
  if (!res.ok) throw new Error("Failed to update stock");
  return res.json();
}
