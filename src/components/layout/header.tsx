import { auth } from "@/auth";
import { getCategories } from "@/lib/data";
import { HeaderClient } from "@/components/layout/header-client";

export async function Header() {
  const [categories, session] = await Promise.all([getCategories(), auth()]);
  return <HeaderClient categories={categories} session={session} />;
}
