import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AccountNav } from "@/components/account/account-nav";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page pb-24 pt-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Account" }]} />
      <div className="mt-10 grid grid-cols-1 gap-10 sm:mt-14 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <AccountNav />
          </div>
        </aside>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
