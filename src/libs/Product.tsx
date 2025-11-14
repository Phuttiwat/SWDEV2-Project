export default async function getProduct(id: string) {
    const baseUrl = process.env.BACKEND_URL;
    const response = await fetch(`${baseUrl}/api/v1/products/${id}`)
    if (!response.ok){
        throw new Error("Failed to fetch product")
    }

    return await response.json()
}