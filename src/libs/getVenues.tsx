export default async function getVenues() {
    const baseUrl = process.env.BACKEND_URL;
    const response = await fetch(`${baseUrl}/api/v1/venues`)
    if (!response.ok){
        throw new Error("Failed to fetch venues")
    }

    return await response.json()
}