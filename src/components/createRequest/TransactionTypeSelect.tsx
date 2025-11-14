import { Select, MenuItem } from "@mui/material";
import { TransactionTypeSelectProps, TransactionType } from "../../../interface";

export default function TransactionTypeSelect({ value, onChange }: TransactionTypeSelectProps) {
    return (
        <Select
            variant="standard"
            name="transactionType"
            id="transactionType"
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value as TransactionType)}
        >
            <MenuItem value="stockIn">Stock In (เพิ่มสินค้าเข้าสต๊อก)</MenuItem>
            <MenuItem value="stockOut">Stock Out (นำสินค้าออกจากสต๊อก)</MenuItem>
        </Select>
    );
}

