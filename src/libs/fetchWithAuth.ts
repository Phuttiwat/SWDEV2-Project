import { getAuthHeader } from "./authHeader";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = await getAuthHeader();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...headers,
    },
    cache: "no-store",
  });
}
