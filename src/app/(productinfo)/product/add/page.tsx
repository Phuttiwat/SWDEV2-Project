import AddProductForm from "@/components/AddProductForm";

export default function AddProductPage() {
    return (
        <main className="p-5">
            <h1 className="text-center text-2xl font-bold mb-6">
                Add New Product
            </h1>

            <div className="flex justify-center">
                <AddProductForm />
            </div>
        </main>
    );
}
