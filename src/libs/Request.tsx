import { CreateRequestPayload, UpdateRequestPayload, Request as RequestType } from "../../interface";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!baseUrl) {
  console.error("NEXT_PUBLIC_BACKEND_URL is not defined.");
}

// GET /requests
export async function getRequests(token?: string): Promise<RequestType[]> {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}/requests`, {
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
}

// GET /requests/:id
export async function getRequest(id: string, token?: string): Promise<RequestType | null> {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}/requests/${id}`, {
    headers,
  });
  if (!res.ok) {
    // Return null for 403/404 errors, let component handle unauthorized state
    if (res.status === 403 || res.status === 404) {
      return null;
    }
    // For other errors, still return null but log the error
    console.error(`Failed to fetch request: ${res.status}`);
    return null;
  }
  return res.json();
}

// POST /requests
export async function addRequest(data: CreateRequestPayload, token?: string): Promise<RequestType> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}/requests`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create request");
  return res.json();
}

// PUT /requests/:id
export async function updateRequest(
  id: string,
  data: UpdateRequestPayload,
  token?: string
): Promise<RequestType> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}/requests/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update request");
  return res.json();
}

// DELETE /requests/:id
export async function deleteRequest(id: string, token?: string): Promise<{ message: string }> {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}/requests/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete request");
  return res.json();
}
