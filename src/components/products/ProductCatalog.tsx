import { ProductResponse } from "../../../interface";
import ProductCard from "./ProductCard";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { deleteProduct } from "@/libs/Product";
import { revalidatePath } from "next/cache";
import SuccessPopup from "./SuccessPopup";
import getUserRole from "@/libs/getUserRole";

export default async function ProductCatalog(props: {
  productsJson: ProductResponse;
  success?: string;
}) {
  const { data, count } = await Promise.resolve(props.productsJson);
  const { success } = props;

  const session = await getServerSession(authOptions);
  const role = await getUserRole(session?.user?.token);
  const isAdmin = role === "admin";

  async function deleteProductAction(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;
    if (!id) return;

    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    await deleteProduct(id, token);

    revalidatePath("/product");
    revalidatePath("/request");
  }

  const successMessage =
    success === "updated"
      ? "✅ แก้ไขสินค้าสำเร็จแล้ว"
      : success === "created"
      ? "✅ เพิ่มสินค้าสำเร็จแล้ว"
      : "";

  return (
    <>
      {successMessage && <SuccessPopup message={successMessage} />}

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-5 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            {isAdmin && (
              <Link
                href="/product/manage"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Product
              </Link>
            )}
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Product Catalog
            </h1>
            <p className="text-lg text-gray-600">
              Explore our collection of <span className="font-semibold text-indigo-600">{count}</span> products
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-5 pb-10">
        {data.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <p className="text-xl text-gray-600">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((product) => {
              if (!product._id && !product.sku) return null;

              return (
                <div
                  key={product._id ?? product.sku}
                  className="flex flex-col items-stretch"
                >
                  <ProductCard
                    productId={String(product._id)}
                    productName={product.name}
                    productImage={product.picture}
                    isAdmin={isAdmin}
                    deleteProductAction={deleteProductAction}
                    sku={product.sku}
                    stockQuantity={product.stockQuantity}
                    unit={product.unit}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
