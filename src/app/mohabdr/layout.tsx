"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/mohabdr", label: "Dashboard", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
  { href: "/mohabdr/products", label: "Products", icon: "M20.25 7.5l-.625-1.125a2.25 2.25 0 00-1.927-1.106H6.302a2.25 2.25 0 00-1.927 1.106L3.75 7.5M10 11.25h4M3.75 7.5h16.5m0 0v12a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-12m16.5 0H3.75" },
  { href: "/mohabdr/categories", label: "Categories", icon: "M9.568 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V5.25A2.25 2.25 0 0018.75 3h-4.318M9.568 3L3 9.568M9.568 3h3.096m0 0L21 9.568m-8.336-6.568h3.096" },
  { href: "/mohabdr/orders", label: "Orders", icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.25-3h-15m1.5 0h12m-10.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" },
  { href: "/mohabdr/customers", label: "Customers", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 10.5a3.75 3.75 0 11-7.498 0 3.75 3.75 0 017.498 0zm15 0a3.75 3.75 0 11-7.498 0 3.75 3.75 0 017.498 0zM3 20.25v-.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v.375" },
  { href: "/mohabdr/delivery", label: "Delivery", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375m18 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.875m-18 0H1.875m18 0H18m-4.5 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h3.375m-9 0H7.5" },
  { href: "/mohabdr/media", label: "Media", icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" },
  { href: "/mohabdr/store-builder", label: "Builder", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" },
  { href: "/mohabdr/settings", label: "Settings", icon: "M9.594 3.94C10.6 8.988 7.35 12 7.35 12s3.35 3.012 2.244 8.06c0 0-2.844-.648-5.344-3.348 0 0-2.25 2.748-5.25 3 0 0 .75-5.25 3-7.5 0 0-2.25-2.25-2.25-5.712 0 0 3 .75 5.25 3 0 0 2.244-3.948 2.244-5.56z" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth").then(r => {
      if (r.ok) setAuthed(true);
      else router.replace("/mohabdr/login");
    }).catch(() => router.replace("/mohabdr/login")).finally(() => setChecking(false));
  }, [router]);

  if (checking) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;
  if (!authed) return null;

  if (pathname === "/mohabdr/login") return <>{children}</>;

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.replace("/mohabdr/login");
  };

  return (
    <div className="min-h-screen bg-charcoal flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-black border-r border-white/5 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center h-16 px-6 border-b border-white/5">
          <Link href="/mohabdr" className="text-sm font-bold tracking-[0.25em] uppercase">RYVEN DEPT.</Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/mohabdr" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${isActive ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"}`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-white/50 hover:text-white hover:bg-white/5 w-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 h-14 bg-charcoal/95 backdrop-blur border-b border-white/5 flex items-center px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mr-3 text-white/60 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" /></svg>
          </button>
          <span className="text-xs text-white/40 tracking-wider uppercase">
            {navItems.find(i => pathname === i.href || (i.href !== "/mohabdr" && pathname.startsWith(i.href)))?.label || "Admin"}
          </span>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
