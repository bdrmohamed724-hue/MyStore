"use client";
import { useState, useEffect } from "react";

interface Stat { label: string; value: string | number; }
interface Order { id: string; orderNumber: string; status: string; total: string; customer?: { name: string }; createdAt: string; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/orders").then(r => r.ok ? r.json() : []),
      fetch("/api/products").then(r => r.ok ? r.json() : []),
      fetch("/api/customers").then(r => r.ok ? r.json() : []),
    ]).then(([orders, products, customers]) => {
      const pending = orders.filter((o: Order) => o.status === "Pending").length;
      const revenue = orders.reduce((s: number, o: Order) => s + parseFloat(o.total || "0"), 0);
      const lowStock = products.filter((p: any) => p.stock > 0 && p.stock <= 5).length;

      setStats([
        { label: "Total Orders", value: orders.length },
        { label: "Pending Orders", value: pending },
        { label: "Revenue", value: revenue.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " DZD" },
        { label: "Products", value: products.length },
        { label: "Customers", value: customers.length },
        { label: "Low Stock", value: lowStock },
      ]);

      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-xl font-bold tracking-wider uppercase mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold tracking-wider uppercase mb-4">Recent Orders</h2>
      {recentOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 border-b border-white/5">
                <th className="pb-3 pr-4">Order</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 pr-4 font-mono text-xs">{o.orderNumber}</td>
                  <td className="py-3 pr-4">{o.customer?.name || "—"}</td>
                  <td className="py-3 pr-4">{parseFloat(o.total || "0").toFixed(2)} DZD</td>
                  <td className="py-3 pr-4"><span className={`text-xs px-2 py-0.5 rounded ${o.status === "Pending" ? "bg-yellow-500/20 text-yellow-400" : o.status === "Delivered" ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/60"}`}>{o.status}</span></td>
                  <td className="py-3 text-white/50">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-white/30 py-8">No orders yet</p>
      )}
    </div>
  );
}
