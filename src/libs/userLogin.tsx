export default async function userLogin(userEmail: string, userPassword: string) {
    const baseURL = process.env.BACKEND_URL
    if (!baseURL) {
        throw new Error("Backend URL is not configured")
    }
    const response = await fetch(`${baseURL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: userEmail,
            password: userPassword
        }),
    })
    if (!response.ok) {
        throw new Error("Failed to log-in")
    }

    return await response.json()
}