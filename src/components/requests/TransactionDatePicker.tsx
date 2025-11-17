// components/requests/TransactionDatePicker.tsx
"use client";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from 'dayjs';

type Props = {
    value: Dayjs | null;
    onChange: (value: Dayjs | null) => void;
    label?: string;
};

export default function TransactionDatePicker({ value, onChange, label = "Transaction Date & Time" }: Props) {
    return (
        <div className="w-full">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    label={label}
                    value={value}
                    onChange={(newValue: Dayjs | null) => {
                        onChange(newValue);
                    }}
                    slotProps={{
                        textField: {
                            variant: "standard",
                            fullWidth: true
                        }
                    }}
                />
            </LocalizationProvider>
        </div>
    );
}

