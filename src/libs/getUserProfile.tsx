export default async function getUserProfile(token: string) {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
    const response = await fetch(`${baseURL}/auth/me`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}`,
        }
    })

    if (!response.ok) {
        throw new Error("Cannot get user profile")
    }

    return await response.json()
}