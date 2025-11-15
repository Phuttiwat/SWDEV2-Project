import { ProductResponse } from "../../../interface";
import Card from "../Card";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteProduct } from "@/libs/Product";
import { revalidatePath } from "next/cache";

export default async function ProductCatalog(props: { productsJson: ProductResponse }) {
  const { data, count } = await Promise.resolve(props.productsJson);

  // 🔐 ดึง session ฝั่ง server
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin"; // ถ้าเก็บ role ที่ field อื่นก็แก้ตรงนี้
  const token = session?.user?.token;

  // 🗑 Server Action สำหรับลบ product
  async function deleteProductAction(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;
    if (!id) return;

    // Get session again in server action
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    await deleteProduct(id, token);

    // refresh หน้าลิสต์หลังลบ
    revalidatePath("/products"); // หรือ path ที่ใช้แสดง ProductCatalog
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
        {data.map((product) => (
          <div key={product._id ?? product.sku} className="w-1/4 flex flex-col items-stretch">
            {/* การ์ด + ลิงก์เข้า detail */}
            <Link href={`/products/${product._id}`} className="block">
              <Card venueName={product.name} imgSrc={product.picture} />
            </Link>

            {/* ปุ่มลบ แสดงเฉพาะ admin */}
            { (
              <form action={deleteProductAction} className="mt-2 self-center">
                <input type="hidden" name="id" value={String(product._id)} />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  Delete
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
