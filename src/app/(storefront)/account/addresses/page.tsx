import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { mockStore } from "@/lib/mock-store";
import { AddressBook } from "@/components/account/address-book";

export const metadata: Metadata = { title: "Addresses", robots: { index: false } };

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/addresses");

  let addresses: any[] = [];
  try {
    addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  } catch {}

  if (!addresses || addresses.length === 0) {
    addresses = mockStore.getAddresses(session.user.id);
  }

  return <AddressBook initialAddresses={addresses} />;
}
