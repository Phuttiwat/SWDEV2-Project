import { ProductResponse } from "../../../interface";
import Card from "../Card";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteProduct } from "@/libs/Product";
import { revalidatePath } from "next/cache";
import getUserRole from "@/libs/getUserRole";

export default async function ProductCatalog(props: { productsJson: ProductResponse }) {
  const { data, count } = await Promise.resolve(props.productsJson);

  const session = await getServerSession(authOptions);
  const role = await getUserRole(session?.user?.token);
  const isAdmin = role === "admin";

  console.log("User role in ProductCatalog:", role);

  async function deleteProductAction(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;
    if (!id) return;

    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    await deleteProduct(id, token);

    revalidatePath("/products");
  }

  return (
    <>
      <div className="p-5">
        <div className="font-medium text-2xl text-center mb-4">
          Select your product
        </div>
        <div className="text-lg text-center mb-6">
          Explore {count} products in our catalog
        </div>
      </div>

      <div className="m-5 flex flex-row flex-wrap justify-around items-center">
        {data.map((product) => {
          const deleteButtonForm = isAdmin ? (
            <form action={deleteProductAction} className="self-center">
              <input type="hidden" name="id" value={String(product._id)} />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
              >
                Delete
              </button>
            </form>
          ) : undefined;

          const editButtonLink = isAdmin ? (
            <Link
              href={`/products/manage?id=${product._id}`} // 👈 แก้ตรงนี้
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Edit
            </Link>
          ) : undefined;

          return (
            <div
              key={product._id ?? product.sku}
              className="w-1/3 flex flex-col items-stretch p-2"
            >
              <Link href={`/products/${product._id}`} className="block">
                <Card
                  venueName={product.name}
                  imgSrc={product.picture}
                  deleteButton={deleteButtonForm}
                  editButton={editButtonLink}
                />
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
