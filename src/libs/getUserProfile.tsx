export default async function getUserProfile(token:string){
    const baseUrl = process.env.BACKEND_URL;

    const response = await fetch(`${baseUrl}/api/v1/auth/me`,{
        method: "GET",
        headers:{
            authorization: `Bearer ${token}`,
        }
    })

    if(!response.ok){
        throw new Error("Cannot get user profile")
    }

    return await response.json()
}