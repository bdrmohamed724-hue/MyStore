"use client";
import { useState, useEffect } from "react";

interface Customer { id: string; name: string; email: string; phone?: string; wilaya?: string; city?: string; address?: string; orderCount: number; createdAt: string; }

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCustomers = () => {
    setLoading(true);
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    fetch(`/api/customers${q}`).then(r => r.ok ? r.json() : []).then(setCustomers).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(fetchCustomers, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-xl font-bold tracking-wider uppercase mb-6">Customers</h1>
      <div className="flex gap-3 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone..." className="flex-1 sm:max-w-sm bg-white/5 border border-white/10 rounded px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
        <button onClick={fetchCustomers} className="bg-white/10 text-sm px-4 py-2 rounded hover:bg-white/20">Search</button>
      </div>
      {customers.length === 0 ? <p className="text-white/30 py-12 text-center">No customers found</p> : (
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm min-w-[600px]"><thead><tr className="text-left text-white/40 border-b border-white/5"><th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Email</th><th className="pb-3 pr-4">Phone</th><th className="pb-3 pr-4">Location</th><th className="pb-3 pr-4">Orders</th><th className="pb-3">Date</th></tr></thead>
            <tbody>{customers.map(c => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 pr-4">{c.name}</td>
                <td className="py-3 pr-4 text-white/60">{c.email}</td>
                <td className="py-3 pr-4 text-white/60">{c.phone || "—"}</td>
                <td className="py-3 pr-4 text-white/60">{[c.wilaya, c.city].filter(Boolean).join(", ") || "—"}</td>
                <td className="py-3 pr-4">{c.orderCount}</td>
                <td className="py-3 text-white/40">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}</tbody></table>
        </div>
      )}
    </div>
  );
}
