'use client';
import { Select, MenuItem, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addBooking } from "@/redux/features/bookSlice";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from 'dayjs';

export default function Booking() {

    const dispatch = useDispatch<AppDispatch>();

    const [nameLastname, setNameLastname] = useState("");
    const [tel, setTel] = useState("");
    const [venue, setVenue] = useState("");
    const [bookDate, setBookDate] = useState("");

    const makeBooking = () => {
        if (nameLastname && tel && venue && bookDate) {
            const item: BookingItem = {
                nameLastname: nameLastname,
                tel: tel,
                venue: venue,
                bookDate: bookDate,
            }
            dispatch(addBooking(item));
        }
        else {
            alert("Please fill in all fields");
        }
    }

    return (
        <main className="w-full flex flex-col items-center space-y-6 p-8">
            <div className="text-2xl font-semibold text-gray-800">Venue Booking</div>

            <div className="w-full max-w-md space-y-4">
                <TextField
                    variant="standard"
                    name="Name-Lastname"
                    label="Name-Lastname"
                    fullWidth
                    value={nameLastname}
                    onChange={(e) => setNameLastname(e.target.value)}
                />

                <TextField
                    variant="standard"
                    name="Contact-Number"
                    label="Contact-Number"
                    fullWidth
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                />

                <Select
                    variant="standard"
                    name="location"
                    id="venue"
                    fullWidth
                    displayEmpty
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                >
                    <MenuItem value="" disabled>
                        <em>Select Venue</em>
                    </MenuItem>
                    <MenuItem value="Bloom">The Bloom Pavilion</MenuItem>
                    <MenuItem value="Spark">Spark Space</MenuItem>
                    <MenuItem value="GrandTable">The Grand Table</MenuItem>
                </Select>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Select Date"
                        minDate={dayjs()}
                        onChange={(newValue: Dayjs | null) => {
                            if (newValue) {
                                setBookDate(newValue.format('YYYY-MM-DD'));
                            }
                        }}
                        slotProps={{
                            textField: {
                                variant: "standard",
                                fullWidth: true
                            }
                        }}
                    />
                </LocalizationProvider>

                <button
                    name="Book Venue"
                    className="w-full py-3 px-6 rounded-lg bg-sky-600 hover:bg-indigo-600 text-white font-medium transition-colors duration-200"
                    onClick={makeBooking}
                >
                    Book Venue
                </button>
            </div>
        </main>
    );
}