export default async function getVenue(id: string) {
    const baseUrl = process.env.BACKEND_URL;
    const response = await fetch(`${baseUrl}/api/v1/venues/${id}`)
    if (!response.ok){
        throw new Error("Failed to fetch venue")
    }

    return await response.json()
}