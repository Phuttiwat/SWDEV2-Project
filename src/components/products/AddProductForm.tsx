import { handleSubmitProduct } from "@/libs/action";
import { Product } from "../../../interface";

type AddProductFormProps = {
  product?: Product | null;
};

export default function AddProductForm({ product }: AddProductFormProps) {
  const isEdit = Boolean(product?._id);
  console.log("Rendering AddProductForm with product:", product);

  return (
    <div className="w-full max-w-xl">
      <form action={handleSubmitProduct} className="space-y-5">
        {isEdit && product?._id && (
          <input type="hidden" name="id" value={String(product._id)} />
        )}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={product?.name ?? ""}
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
            defaultValue={product?.sku ?? ""}
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
            defaultValue={product?.category ?? ""}
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
              defaultValue={product?.price ?? ""}
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
              defaultValue={product?.stockQuantity ?? ""}
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
            defaultValue={product?.unit ?? ""}
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
            defaultValue={product?.picture ?? ""}
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
            defaultValue={product?.description ?? ""}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="รายละเอียดสินค้า..."
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
          >
            {isEdit ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
