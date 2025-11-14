import Image from "next/image";
import { getProduct } from "@/libs/Product";

export default async function ProductDetailPage({ params }: { params: Promise<{ vid: string }> }) {
    const { vid } = await params;
    const productDetail = await getProduct(vid);

    return (
        <main className="p-5">
            <h1 className="text-center p-5 text-2xl font-bold">
                {productDetail.name}
            </h1>

            <div className="flex flex-row items-center my-5 gap-5">
                <Image
                    src={productDetail.picture}
                    alt="Product Image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="rounded-lg w-[30%]"
                />

                <div className="flex flex-col items-start gap-2">
                    <div className="text-md">Name: {productDetail.name}</div>
                    <div className="text-md">SKU: {productDetail.sku}</div>
                    <div className="text-md">Description: {productDetail.description}</div>
                    <div className="text-md">Category: {productDetail.category}</div>
                    <div className="text-md">Price: {productDetail.price}</div>
                    <div className="text-md">Stock Quantity: {productDetail.stockQuantity}</div>
                    <div className="text-md">Unit: {productDetail.unit}</div>
                    <div className="text-md">Status: {productDetail.isActive ? "Active" : "Inactive"}</div>
                </div>
            </div>
        </main>
    );
}
