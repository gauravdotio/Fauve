import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
      <h1 className="font-serif text-3xl text-ink">Page not found</h1>
      <p className="text-sm text-ink-soft">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="text-sm font-medium text-accent hover:text-accent-dark">
        Back to home
      </Link>
    </div>
  );
}
