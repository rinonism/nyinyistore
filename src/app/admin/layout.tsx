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
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecking(false);
      setAuthenticated(true);
      return;
    }

    // Verify auth via API call (cookie is httpOnly, can't read from JS)
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
  }, [pathname, router]);

  // Close mobile drawer on route change
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

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

  const NavLinks = () => (
    <>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
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
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            router.push("/admin/login");
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#777] hover:bg-red-900/20 hover:text-red-400 transition-colors"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#121212] md:flex">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-3">
        <button
          onClick={() => setNavOpen(true)}
          aria-label="Open menu"
          className="text-[#d4af37] p-1 -ml-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-[#d4af37]">NyinyiStore</h1>
        <span className="w-6" />
      </header>

      {/* Mobile drawer + backdrop */}
      {navOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setNavOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 max-w-[80vw] bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col">
            <div className="p-5 border-b border-[#2a2a2a] flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-[#d4af37]">NyinyiStore</h1>
                <p className="text-[10px] text-[#777] mt-0.5">Admin Panel</p>
              </div>
              <button
                onClick={() => setNavOpen(false)}
                aria-label="Close menu"
                className="text-[#777] hover:text-white p-1"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <NavLinks />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-[#1a1a1a] border-r border-[#2a2a2a] flex-col">
        <div className="p-5 border-b border-[#2a2a2a]">
          <h1 className="text-lg font-bold text-[#d4af37]">NyinyiStore</h1>
          <p className="text-[10px] text-[#777] mt-0.5">Admin Panel</p>
        </div>
        <NavLinks />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
