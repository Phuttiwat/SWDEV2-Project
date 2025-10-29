"use client";
import { useState } from 'react';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from 'dayjs';

export default function DateReserve() {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    return(
        <div className="w-full">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={(newValue: Dayjs | null) => {
                        setSelectedDate(newValue);
                    }}
                    minDate={dayjs()}
                    slotProps={{
                        textField: {
                            variant: "standard",
                            fullWidth: true
                        }
                    }}
                />
            </LocalizationProvider>
        </div>
    )
}