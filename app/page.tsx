"use client";
import POSPage from "./pos/page";

export default function Home() {
  // بدل صفحة الترحيب بتاعة Next.js، هنعرض صفحة الـ POS اللي تعبنا فيها
  return (
    <main className="min-h-screen">
      <POSPage />
    </main>
  );
}