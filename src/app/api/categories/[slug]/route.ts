import { NextResponse } from "next/server";
import { getCategoryBySlug } from "@/lib/data";

export async function GET(_request: Request, { params }: RouteContext<"/api/categories/[slug]">) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(category);
}
