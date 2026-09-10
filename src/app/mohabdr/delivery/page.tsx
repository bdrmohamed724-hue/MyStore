"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/validation";

interface Zone { id: string; name: string; price: string; estimatedTime?: string; enabled: boolean; }
const emptyZone = { name: "", price: "0", estimatedTime: "", enabled: true };

export default function AdminDelivery() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Zone | null>(null);
  const [form, setForm] = useState(emptyZone);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchZones = () => { setLoading(true); fetch("/api/delivery").then(r => r.ok ? r.json() : []).then(setZones).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(fetchZones, []);

  const openNew = () => { setEditing(null); setForm(emptyZone); setShowForm(true); };
  const openEdit = (z: Zone) => { setEditing(z); setForm({ name: z.name, price: z.price, estimatedTime: z.estimatedTime || "", enabled: z.enabled }); setShowForm(true); };

  const save = async () => {
    setSaving(true);
    try {
      const res = editing
        ? await fetch(`/api/delivery/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
        : await fetch("/api/delivery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setShowForm(false); fetchZones(); } else alert("Failed");
    } catch { alert("Error"); }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this zone?")) return;
    await fetch(`/api/delivery/${id}`, { method: "DELETE" });
    fetchZones();
  };

  const toggleEnabled = async (z: Zone) => {
    await fetch(`/api/delivery/${z.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: !z.enabled }) });
    fetchZones();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold tracking-wider uppercase">Delivery Zones</h1>
        <button onClick={openNew} className="bg-white text-black text-xs font-semibold tracking-wider uppercase px-4 py-2 hover:bg-white/90">+ Add Zone</button>
      </div>
      {zones.length === 0 ? <p className="text-white/30 py-12 text-center">No delivery zones</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="text-left text-white/40 border-b border-white/5"><th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Price</th><th className="pb-3 pr-4">Est. Time</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th></tr></thead>
            <tbody>{zones.map(z => (
              <tr key={z.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 pr-4">{z.name}</td>
                <td className="py-3 pr-4">{formatPrice(z.price)}</td>
                <td className="py-3 pr-4 text-white/60">{z.estimatedTime || "—"}</td>
                <td className="py-3 pr-4"><button onClick={() => toggleEnabled(z)} className={`text-xs px-2 py-0.5 rounded ${z.enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{z.enabled ? "Enabled" : "Disabled"}</button></td>
                <td className="py-3"><div className="flex gap-2"><button onClick={() => openEdit(z)} className="text-xs text-white/50 hover:text-white">Edit</button><button onClick={() => del(z.id)} className="text-xs text-red-400/50 hover:text-red-400">Delete</button></div></td>
              </tr>
            ))}</tbody></table>
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4" onClick={() => setShowForm(false)}>
          <div className="bg-charcoal border border-white/10 rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Zone" : "New Zone"}</h2>
            <div className="space-y-3">
              <div><label className="block text-xs text-white/40 uppercase mb-1">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Price</label><input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Estimated Time</label><input value={form.estimatedTime} onChange={e => setForm({ ...form, estimatedTime: e.target.value })} placeholder="e.g. 2-3 days" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.checked })} className="accent-white" />Enabled</label>
            </div>
            <div className="flex gap-3 mt-6"><button onClick={save} disabled={saving} className="flex-1 bg-white text-black text-sm font-semibold tracking-wider uppercase py-2 rounded hover:bg-white/90 disabled:opacity-50">{saving ? "..." : "Save"}</button><button onClick={() => setShowForm(false)} className="flex-1 border border-white/10 text-sm py-2 rounded hover:bg-white/5">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
