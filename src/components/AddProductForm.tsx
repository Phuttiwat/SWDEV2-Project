import { addProduct } from "@/libs/Product";
import { redirect } from "next/navigation";

async function createProduct(formData: FormData) {
  "use server"; // บอก Next ว่านี่คือ Server Action

  const payload = {
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    price: Number(formData.get("price")),
    stockQuantity: Number(formData.get("stockQuantity")),
    unit: formData.get("unit") as string,
    picture: formData.get("picture") as string,
    isActive: true,
  };

  // เรียก backend ผ่าน fetchWithAuth → แนบ Authorization ให้อัตโนมัติ
  await addProduct(payload);

  // เสร็จแล้ว redirect หรือจะแสดงหน้าเดิมก็ได้
  redirect("/add-product?success=1");
}

export default function AddProductPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const success = searchParams?.success === "1";

  return (
    <div className="flex justify-center items-start p-8">
      <form
        action={createProduct} // ⬅ ตรงนี้สำคัญ! ใช้ server action
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl"
      >
        <div className="flex flex-col gap-4">
          <Input label="Name" name="name" required />
          <Input label="SKU" name="sku" required />
          <Input label="Description" name="description" required />
          <Input label="Category" name="category" required />
          <Input label="Price" type="number" name="price" required />
          <Input
            label="Stock Quantity"
            type="number"
            name="stockQuantity"
            required
          />
          <Input label="Unit" name="unit" required />
          <Input label="Picture URL" name="picture" required />

          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow"
          >
            Add Product
          </button>

          {success && (
            <div className="text-center text-sm text-green-600 mt-2">
              Product added successfully!
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        required={required}
        className="border p-2 rounded-md"
      />
    </div>
  );
}
