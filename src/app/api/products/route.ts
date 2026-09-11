import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/data";
import { productQuerySchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = productQuerySchema.safeParse(searchParams);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters", details: parsed.error.flatten() }, { status: 400 });
  }

  const { category, search, sizes, colors, minPrice, maxPrice, sort, page, perPage } = parsed.data;

  const result = await getProducts({
    categorySlug: category,
    search,
    sizes,
    colors,
    minPrice,
    maxPrice,
    sort,
    page,
    perPage,
  });

  return NextResponse.json(result);
}
