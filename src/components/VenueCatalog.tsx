import Card from "./Card";
import Link from "next/link";

export default async function VenueCatalog(props : {venuesJson: VenueJson | Promise<VenueJson>}){
    const venues = await Promise.resolve(props.venuesJson);
    return (
        <>
        <div className="p-5">
                <div className="font-medium text-2xl text-center mb-4">Select your venue</div>
                <div className="text-lg text-center mb-6">Explore {venues.count} fabulous venues in our venue catalogs</div>
        </div>
        <div className="m-5 flex flex-row flex-wrap justify-around items-center">
            {
                venues.data.map((venueItem: VenueItem) => (
                    <Link key={venueItem._id} href={`/venue/${venueItem._id}`} className="w-1/4">
                        <Card venueName={venueItem.name} imgSrc={venueItem.picture}/>
                    </Link>
                ))
            }
        </div>
        </>
    )
}