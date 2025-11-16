import Image from "next/image";
import { getProductById } from "@/libs/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProductDetailPage({ params }: { params: Promise<{ pid: string }> }) {
    const { pid } = await params;
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;
    let product: any = null;
    if (pid) {
        const productResponse = await getProductById(pid);
        product = productResponse?.data ?? null;
    }


    return (
        <main className="p-5">
            <h1 className="text-center p-5 text-2xl font-bold">
                {product.name}
            </h1>

            <div className="flex flex-row items-center my-5 gap-5">
                <Image
                    src={product.picture}
                    alt="Product Image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="rounded-lg w-[30%]"
                />

                <div className="flex flex-col items-start gap-2">
                    <div className="text-md">Name: {product.name}</div>
                    <div className="text-md">SKU: {product.sku}</div>
                    <div className="text-md">Description: {product.description}</div>
                    <div className="text-md">Category: {product.category}</div>
                    <div className="text-md">Price: {product.price}</div>
                    <div className="text-md">Stock Quantity: {product.stockQuantity}</div>
                    <div className="text-md">Unit: {product.unit}</div>
                    <div className="text-md">Status: {product.isActive ? "Active" : "Inactive"}</div>
                </div>
            </div>
        </main>
    );
}
