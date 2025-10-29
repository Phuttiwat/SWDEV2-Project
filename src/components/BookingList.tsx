"use client";
import { useAppSelector, AppDispatch} from "@/redux/store"
import {removeBooking} from "@/redux/features/bookSlice";
import { useDispatch } from "react-redux";
;
export default function BookingList() {

    const bookItems = useAppSelector((state) => state.bookSlice.bookItems);
    const dispatch = useDispatch<AppDispatch>();
    if (bookItems.length === 0) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen">
                <span className="text-2xl text-gray-500">No Venue Booking</span>
            </div>
        );
    }
    
    return (
        <div>
            {bookItems.map((bookItem, index) => (
                <div className="bg-slate-200 rounded px-5 mx-5 py-2 my-2"
                key={`${bookItem.venue}-${bookItem.bookDate}-${index}`}>
                    <div className="text-xl">Name-Lastname: {bookItem.nameLastname}</div>
                    <div className="text-xl">Contact Number: {bookItem.tel}</div>
                    <div className="text-xl">Venue: {bookItem.venue}</div>
                    <div className="text-xl">Book Date: {bookItem.bookDate}</div>
                    <button
                        name="Remove "
                        className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2"
                        onClick={() => dispatch(removeBooking(bookItem))}
                    >
                        Remove Booking
                    </button>
                </div>
                
            ))}
            
        </div>
    )
}