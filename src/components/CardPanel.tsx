'use client'
import {useReducer, useState} from "react";
import Card from "./Card";
import Link from "next/link";
import { useRef } from "react";

type RatingAction = {
    type: 'update' | 'remove';
    venueName: string;
    rating?: number;
};

export default function CardPanel() {

    const countRef = useRef(0);
    const inputRef = useRef<HTMLInputElement>(null);
    // Separate state for Card ratings (persistent)
    const [cardRatings, setCardRatings] = useState<Map<string, number>>(new Map([
        ["The Bloom Pavilion", 0],
        ["Spark Space", 0],
        ["The Grand Table", 0]
    ]));

    // Separate state for list display (can be removed)
    const initialListRatings = new Map<string, number>([
        ["The Bloom Pavilion", 0],
        ["Spark Space", 0],
        ["The Grand Table", 0]
    ]);

    const listReducer = (listRatings: Map<string, number>, action: RatingAction) => {
        const newListRatings = new Map(listRatings);
        switch(action.type) {
            case "update":
                if (action.rating !== undefined) {
                    newListRatings.set(action.venueName, action.rating);
                }
                return newListRatings;
            case "remove":
                newListRatings.delete(action.venueName);
                return newListRatings;
            default:
                return listRatings;
        }
    }

    const [listRatings, dispatchList] = useReducer(listReducer, initialListRatings);

    const handleRatingChange = (venueName: string, rating: number) => {
        // Update both Card ratings and list ratings
        setCardRatings(prev => new Map(prev.set(venueName, rating)));
        dispatchList({ type: "update", venueName, rating });
    };

    const handleRemoveVenue = (venueName: string) => {
        // Only remove from list, keep Card rating
        dispatchList({ type: "remove", venueName });
    };
    // Mock Data for Demonstration Only
    const mockVenueRepo = [
        { vid: "001", name: "The Bloom Pavilion", image: "/img/bloom.jpg"},
        { vid: "002", name: "Spark Space", image: "/img/sparkspace.jpg" },
        { vid: "003", name: "The Grand Table", image: "/img/grandtable.jpg"},
    ]

    return (
        <div className="m-5">
            <div className="m-5 flex flex-row flex-wrap justify-around items-center">
                {
                        mockVenueRepo.map((venueItem)=>(
                        <Link key={venueItem.vid} href={`/venue/${venueItem.vid}`} className="w-1/4">
                            <Card venueName={venueItem.name} imgSrc={venueItem.image}
                            onRatingChange={handleRatingChange}
                            initialRating={cardRatings.get(venueItem.name)}
                            />
                        </Link>
                    ))
                }
            </div>
            <div className="w-full text-xl font-medium ">Venue List with Ratings: {listRatings.size}</div>
            {Array.from(listRatings.entries()).map(([venue, rating]) => (
                <div 
                    key={venue} 
                    data-testid={venue}
                    onClick={() => handleRemoveVenue(venue)}
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                    {venue} Rating: {rating}
                </div>
            ))}
        </div>
    )
}   