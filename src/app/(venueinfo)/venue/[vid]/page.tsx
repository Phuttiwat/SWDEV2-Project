import Image from "next/image";
import getVenue from "@/libs/getVenue";
import Link from "next/link";
export default async function VenueDetailPage({ params }: { params: Promise<{ vid: string }> }) {
    const { vid } = await params;
    const venueDetail= await getVenue(vid);

    return (
        <main className="p-5">
            <h1 className="text-center p-5 text-2xl font-bold">{venueDetail.data.name}</h1>
        <div className="flex flex-row items-center my-5 gap-5">
            <Image
                src={venueDetail.data.picture}
                alt="Venue Image"
                width={0}
                height={0}
                sizes="100vw"
                className="rounded-lg w-[30%]"
            />
            <div className="flex flex-col items-start gap-2">
                <div className="text-md">Name: {venueDetail.data.name}</div>
                <div className="text-md">Address: {venueDetail.data.address}</div>
                <div className="text-md">District: {venueDetail.data.district}</div>
                <div className="text-md">Province: {venueDetail.data.province}</div>
                <div className="text-md">Postal Code: {venueDetail.data.postalcode}</div>
                <div className="text-md">Tel: {venueDetail.data.tel}</div>
                <div className="text-md">Daily Rate: {venueDetail.data.dailyrate}</div>
                {/* <Link href={`/booking?id=${vid}&name=${venueDetail.data.name}`}>
                <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2
                text-white shadow-sm">
                    Make Booking
                </button>
                </Link> */}
            </div>
        </div>
        </main>
    );
}