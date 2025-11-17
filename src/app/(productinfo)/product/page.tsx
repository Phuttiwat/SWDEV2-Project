import ProductCatalog from "@/components/products/ProductCatalog";
import { getProducts } from "@/libs/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Footer from "@/components/Footer";

export default async function Venue({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;
  const products = await getProducts(token);

  const resolvedSearchParams = await searchParams;
  const success = resolvedSearchParams?.success;

  return (
    <main>
        <ProductCatalog productsJson={products} success={success} />
        <Footer />
    </main>
  );
}
