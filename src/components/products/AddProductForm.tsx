import { handleSubmitProduct } from "@/libs/action";

type AddProductFormProps = {
  searchParams: { success?: string };
};

export default function AddProductForm({ searchParams }: AddProductFormProps) {
  const isSuccess = searchParams?.success === "1";

  return (
    <div className="w-full max-w-xl">
      {isSuccess && (
        <div className="mb-6 rounded-md border border-green-300 bg-green-100 px-4 py-3 text-green-800">
          ✅ เพิ่มสินค้าสำเร็จแล้ว
        </div>
      )}

      <form action={handleSubmitProduct} className="space-y-5">
        {/* ตอนนี้หน้า /product/add ใช้เพื่อ ADD อย่างเดียว
            ถ้าอยากรองรับ edit ด้วย หน้าอื่นค่อยส่ง <input hidden id> เข้ามา */}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="เช่น Nike Air Force 1"
          />
        </div>

        {/* SKU */}
        <div>
          <label htmlFor="sku" className="block text-sm font-medium mb-1">
            SKU
          </label>
          <input
            id="sku"
            name="sku"
            required
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="เช่น PROD-001"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <input
            id="category"
            name="category"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="เช่น Shoes, Bag, Accessories"
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="1990"
            />
          </div>

          <div>
            <label
              htmlFor="stockQuantity"
              className="block text-sm font-medium mb-1"
            >
              Stock Quantity
            </label>
            <input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min="0"
              required
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="10"
            />
          </div>
        </div>

        {/* Unit */}
        <div>
          <label htmlFor="unit" className="block text-sm font-medium mb-1">
            Unit
          </label>
          <input
            id="unit"
            name="unit"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="pcs, pair, box"
          />
        </div>

        {/* Picture URL */}
        <div>
          <label htmlFor="picture" className="block text-sm font-medium mb-1">
            Picture URL
          </label>
          <input
            id="picture"
            name="picture"
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://..."
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="รายละเอียดสินค้า..."
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
