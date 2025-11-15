import ProductCatalog from "@/components/products/ProductCatalog";
import { getProducts } from "@/libs/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Venue() {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;
    const products = await getProducts(token);
    
    return (
        <main>
            <ProductCatalog productsJson={products}/>
        </main>
    );
}
