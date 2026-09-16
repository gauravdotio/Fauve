import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoPageView } from "@/components/info/info-page-view";
import { SUPPORT_PAGES } from "@/content/info-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SUPPORT_PAGES).map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: PageProps<"/support/[topic]">): Promise<Metadata> {
  const { topic } = await params;
  const page = SUPPORT_PAGES[topic];
  return page ? { title: page.title, description: page.intro } : {};
}

const NAV = Object.entries(SUPPORT_PAGES).map(([slug, page]) => ({ href: `/support/${slug}`, label: page.title }));

export default async function SupportPage({ params }: PageProps<"/support/[topic]">) {
  const { topic } = await params;
  const page = SUPPORT_PAGES[topic];
  if (!page) notFound();

  return <InfoPageView page={page} nav={NAV} activeHref={`/support/${topic}`} />;
}
