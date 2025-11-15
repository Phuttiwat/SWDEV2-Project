export default async function userRegister(
    userName: string,
    userEmail: string,
    userTel: string,
    userRole: "admin" | "staff",
    userPassword: string
) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!baseUrl) {
        console.error("NEXT_PUBLIC_BACKEND_URL is not defined.");
    }
    const response = await fetch(`${baseUrl}/auth/register`, {
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

