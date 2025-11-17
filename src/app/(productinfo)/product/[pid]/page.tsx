import Image from "next/image";
import { getProductById, deleteProduct } from "@/libs/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getUserRole from "@/libs/getUserRole";
import ProductDetailMenu from "@/components/products/ProductDetailMenu";
import ProductRequestButton from "@/components/products/ProductRequestButton";
import { revalidatePath } from "next/cache";
import Footer from "@/components/Footer";


export default async function ProductDetailPage({ params }: { params: Promise<{ pid: string }> }) {
    const { pid } = await params;
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;
    const role = await getUserRole(session?.user?.token);
    const isAdmin = role === "admin";
    
    let product: any = null;
    if (pid) {
        const productResponse = await getProductById(pid);
        product = productResponse?.data ?? null;
    }

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

    if (!product) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
                    <p className="text-gray-600">The product you're looking for doesn't exist.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-5 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                            <div className="flex items-center gap-4 text-blue-100">
                                <span className="font-mono text-sm">{product.sku}</span>
                                <span className="text-blue-200">•</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    product.isActive 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-gray-400 text-gray-800'
                                }`}>
                                    {product.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                        {isAdmin && (
                            <ProductDetailMenu
                                productId={String(product._id)}
                                productName={product.name}
                                deleteProductAction={deleteProductAction}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-5 py-10">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                        {/* Image Section */}
                        <div className="relative">
                            <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={product.picture}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex flex-col gap-6">
                            {/* Description */}
                            <div>
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Description
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description || "No description available"}
                                </p>
                            </div>

                            {/* Product Information Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                        Category
                                    </div>
                                    <div className="text-lg font-semibold text-gray-800">
                                        {product.category}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                        Price
                                    </div>
                                    <div className="text-lg font-semibold text-indigo-600">
                                        ฿{product.price.toLocaleString()}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                        Stock Quantity
                                    </div>
                                    <div className="text-lg font-semibold text-gray-800">
                                        {product.stockQuantity.toLocaleString()} {product.unit}
                                    </div>
                                </div>
                            </div>

                            {/* Stock Status Badge */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                        Availability
                                    </span>
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                        product.stockQuantity > 0
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Request Button */}
                            <div className="pt-4">
                                <ProductRequestButton
                                    productId={String(product._id)}
                                    productName={product.name}
                                    isActive={product.isActive}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
