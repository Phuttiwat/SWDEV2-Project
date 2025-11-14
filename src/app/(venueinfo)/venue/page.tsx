import VenueCatalog from "@/components/VenueCatalog";
import { getProducts } from "@/libs/Product";

export default async function Venue() {
    const venues = await getProducts()
    return (
        <main>
            <VenueCatalog venuesJson={venues}/>
        </main>
    );
}
