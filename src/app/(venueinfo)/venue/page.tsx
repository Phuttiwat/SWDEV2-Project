import getVenues from "@/libs/getVenues";
import VenueCatalog from "@/components/VenueCatalog";

export default async function Venue() {
    const venues = await getVenues()
    return (
        <main>
            <VenueCatalog venuesJson={venues}/>
        </main>
    );
}
