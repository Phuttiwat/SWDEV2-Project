export default async function userRegister(
    userName: string,
    userEmail: string,
    userTel: string,
    userRole: "admin" | "staff",
    userPassword: string
) {
    const baseURL = process.env.BACKEND_URL
    if (!baseURL) {
        throw new Error("Backend URL is not configured")
    }
    const response = await fetch(`${baseURL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: userName,
            email: userEmail,
            tel: userTel,
            role: userRole,
            password: userPassword
        }),
    })
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || errorData.message || "Failed to register")
    }

    return await response.json()
}

