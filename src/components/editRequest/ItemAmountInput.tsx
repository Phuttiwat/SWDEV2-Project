import { TextField } from "@mui/material";
import { ItemAmountInputProps } from "../../../interface";

export default function ItemAmountInput({ value, onChange }: ItemAmountInputProps) {
    return (
        <TextField
            variant="standard"
            name="itemAmount"
            label="Item Amount"
            type="number"
            fullWidth
            value={value || ""}
            onChange={(e) => {
                const numValue = parseInt(e.target.value);
                onChange(isNaN(numValue) ? 0 : numValue);
            }}
        />
    );
}

