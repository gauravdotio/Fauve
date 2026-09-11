import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data";

export async function GET(_request: Request, { params }: RouteContext<"/api/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
