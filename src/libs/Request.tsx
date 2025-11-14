import { CreateRequestPayload, UpdateRequestPayload } from "../../interface";

const baseUrl = process.env.BACKEND_URL;

// GET /requests
export async function getRequests(): Promise<Request[]> {
  const res = await fetch(`${baseUrl}/requests`);
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
}

// GET /requests/:id
export async function getRequest(id: string): Promise<Request> {
  const res = await fetch(`${baseUrl}/requests/${id}`);
  if (!res.ok) throw new Error("Failed to fetch request");
  return res.json();
}

// POST /requests
export async function addRequest(data: CreateRequestPayload): Promise<Request> {
  const res = await fetch(`${baseUrl}/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create request");
  return res.json();
}

// PUT /requests/:id
export async function updateRequest(
  id: string,
  data: UpdateRequestPayload
): Promise<Request> {
  const res = await fetch(`${baseUrl}/requests/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update request");
  return res.json();
}

// DELETE /requests/:id
export async function deleteRequest(id: string): Promise<{ message: string }> {
  const res = await fetch(`${baseUrl}/requests/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete request");
  return res.json();
}
