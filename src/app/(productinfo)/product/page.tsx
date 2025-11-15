import ProductCatalog from "@/components/ProductCatalog";
import { getProducts } from "@/libs/Product";

export default async function Venue() {
    const products = await getProducts()
    
    return (
        <main>
            <ProductCatalog productsJson={products}/>
        </main>
    );
}
