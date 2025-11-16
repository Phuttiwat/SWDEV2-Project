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
            // เพิ่ม MenuProps: ย้ายเมนูไปที่ document.body และให้ zIndex สูงกว่า overlay ของ modal
            MenuProps={{
                // ให้แน่ใจว่า render บน body (portal)
                container: typeof document !== "undefined" ? document.body : undefined,
                // ยก z-index ของ Paper (menu) ให้สูงกว่าค่าที่ใช้ใน modal overlay (9999)
                PaperProps: {
                    style: { zIndex: 10001 },
                },
            }}
        >
            <MenuItem value="stockIn">Stock In (เพิ่มสินค้าเข้าสต๊อก)</MenuItem>
            <MenuItem value="stockOut">Stock Out (นำสินค้าออกจากสต๊อก)</MenuItem>
        </Select>
    );
}
