"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const items = [
  ["Dashboard", "/dashboard"],
  ["Customers", "/dashboard/customers"],
  ["Inventory", "/dashboard/inventory"],
  ["Deliveries", "/dashboard/deliveries"],
  ["Purchase Orders", "/dashboard/purchases"],
  ["Reports", "/dashboard/reports"],
  ["Profit & Loss", "/dashboard/profit"],
  ["Settings", "/dashboard/settings"]
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-white p-4">
        <h2 className="mb-4 text-lg font-bold text-primary">Father Gas Agency</h2>
        <nav className="space-y-2">
          {items.map(([label, href]) => (
            <Link key={href} href={href} className={`block rounded px-3 py-2 ${pathname === href ? "bg-blue-100 text-primary" : "hover:bg-gray-100"}`}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <div className="mb-4 flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
          <h1 className="font-semibold">Cylinder Distribution Dashboard</h1>
          <div className="flex gap-2">
            <button className="rounded border px-3 py-1">Notifications</button>
            <button onClick={logout} className="rounded bg-red-500 px-3 py-1 text-white">Logout</button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
