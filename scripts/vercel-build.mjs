import { execSync } from "node:child_process";

const dbUrl = process.env.DATABASE_URL;

if (dbUrl && dbUrl.trim().length > 0) {
  console.log("✅ DATABASE_URL detected. Running migrations and seed...");
  try {
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    execSync("npx tsx prisma/seed.ts --if-empty", { stdio: "inherit" });
  } catch (err) {
    console.error("Migration/seed error:", err);
    process.exit(1);
  }
} else {
  console.warn("⚠️  DATABASE_URL is not set in environment variables.");
  console.warn("⚠️  Skipping 'prisma migrate deploy' and database seed.");
  console.warn("👉  To enable database access, add DATABASE_URL in your Vercel Project Settings > Environment Variables, or attach a Neon/Postgres store in the Vercel Storage tab.");
}

console.log("🚀 Running Next.js build...");
execSync("npx next build", { stdio: "inherit" });
