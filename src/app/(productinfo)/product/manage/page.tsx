import AddProductForm from "@/components/products/AddProductForm";
import { getProductById } from "@/libs/Product";

export default async function ManageProductPage({
  searchParams,
}: {
  searchParams: { id?: string; success?: string };
}) {
  const id = searchParams.id;
  let product: any = null;

  if (id) {
    const productResponse = await getProductById(id);
    product = productResponse?.data ?? null;
  }

  const isEdit = Boolean(id && product);

  const title = isEdit ? "Edit Product" : "Add New Product";

  return (
    <main className="p-5">
      <h1 className="text-center text-2xl font-bold mb-6">{title}</h1>

      <div className="flex justify-center">
        <AddProductForm product={product} />
      </div>
    </main>
  );
}
