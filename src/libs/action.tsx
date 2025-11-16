"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { addProduct, updateProduct } from "@/libs/Product";

export async function handleSubmitProduct(formData: FormData) {
  const id = formData.get("id") as string | null;

  const payload = {
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    price: Number(formData.get("price")),
    stockQuantity: Number(formData.get("stockQuantity")),
    unit: formData.get("unit") as string,
    picture: formData.get("picture") as string,
    isActive: true,
  };

  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  try {
    if (id) {
      await updateProduct(id, payload, token);
    } else {
      await addProduct(payload, token);
    }
  } catch (error) {
    console.error(error);
    return; 
  }

  revalidatePath("/products");

  if (id) {
    redirect(`/product?success=updated`);
  } else {
    redirect(`/product?success=created`);
  }
}
