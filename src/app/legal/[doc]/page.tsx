import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoPageView } from "@/components/info/info-page-view";
import { LEGAL_PAGES } from "@/content/info-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LEGAL_PAGES).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[doc]">): Promise<Metadata> {
  const { doc } = await params;
  const page = LEGAL_PAGES[doc];
  return page ? { title: page.title, description: page.intro } : {};
}

const NAV = Object.entries(LEGAL_PAGES).map(([slug, page]) => ({ href: `/legal/${slug}`, label: page.title }));

export default async function LegalPage({ params }: PageProps<"/legal/[doc]">) {
  const { doc } = await params;
  const page = LEGAL_PAGES[doc];
  if (!page) notFound();

  return <InfoPageView page={page} nav={NAV} activeHref={`/legal/${doc}`} />;
}
