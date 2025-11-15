import { Select, MenuItem } from "@mui/material";
import { ProductSelectProps } from "../../../interface";

export default function ProductSelect({ products, value, onChange }: ProductSelectProps) {
    return (
        <Select
            variant="standard"
            name="product"
            id="product"
            fullWidth
            displayEmpty
            value={value}
            onChange={(e) => onChange(e.target.value)}
            MenuProps={{
                container: typeof document !== "undefined" ? document.body : undefined,
                PaperProps: {
                    style: { zIndex: 10001 },
                },
            }}
        >
            <MenuItem value="" disabled>
                <em>Select Product</em>
            </MenuItem>
            {products.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                    {product.name} (Stock: {product.stockQuantity} {product.unit})
                </MenuItem>
            ))}
        </Select>
    );
}
