export default async function userLogin(userEmail: string, userPassword: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ;
    if (!baseUrl) {
        console.error("NEXT_PUBLIC_BACKEND_URL is not defined.");
    }
    const response = await fetch(`${baseUrl}/auth/login`, {
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