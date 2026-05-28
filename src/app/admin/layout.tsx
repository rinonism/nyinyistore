"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecking(false);
      setAuthenticated(true);
      return;
    }

    const hasToken = document.cookie.includes("admin_token=");
    if (!hasToken) {
      // Try API check since cookie is httpOnly
      fetch("/api/admin/orders").then(res => {
        if (!res.ok) {
          router.push("/admin/login");
        } else {
          setAuthenticated(true);
        }
        setChecking(false);
      }).catch(() => {
        router.push("/admin/login");
        setChecking(false);
      });
      return;
    }
    setAuthenticated(true);
    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-[#d4af37]">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/orders", label: "Orders", icon: "📦" },
    { href: "/", label: "Back to Store", icon: "🏪" },
  ];

  return (
    <div className="min-h-screen bg-[#121212] flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col">
        <div className="p-5 border-b border-[#2a2a2a]">
          <h1 className="text-lg font-bold text-[#d4af37]">NyinyiStore</h1>
          <p className="text-[10px] text-[#777] mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs transition-colors ${
                  isActive
                    ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30"
                    : "text-[#b0b0b0] hover:bg-[#252525] hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[#2a2a2a]">
          <button
            onClick={() => {
              document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              router.push("/admin/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs text-[#777] hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
