import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getAuthHeader() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  console.log("ok");

  return {
    Authorization: `Bearer ${token}`,
  };
}
