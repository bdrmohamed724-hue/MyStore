"use client";
import { useState, useEffect } from "react";
import { generateSlug, formatPrice } from "@/lib/validation";

interface Product { id: string; name: string; slug: string; description?: string; price: string; stock: number; imageUrl?: string; categoryId?: string; active: boolean; }
interface Category { id: string; name: string; slug: string; }
interface MediaItem { id: string; name: string; url: string; type: string; }

const emptyProduct = { name: "", slug: "", description: "", price: "0", stock: 0, imageUrl: "", categoryId: "", active: true };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [showForm, setShowForm] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/products?active=false").then(r => r.ok ? r.json() : []),
      fetch("/api/categories?visible=false").then(r => r.ok ? r.json() : []),
      fetch("/api/media").then(r => r.ok ? r.json() : []),
    ]).then(([p, c, m]) => { setProducts(p); setCategories(c); setMedia(m); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(fetchAll, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setEditing(null); setForm(emptyProduct); setShowForm(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, slug: p.slug, description: p.description || "", price: p.price, stock: p.stock, imageUrl: p.imageUrl || "", categoryId: p.categoryId || "", active: p.active }); setShowForm(true); };

  const save = async () => {
    setSaving(true);
    try {
      const body = { ...form, price: String(form.price) };
      const res = editing
        ? await fetch(`/api/products/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); fetchAll(); }
      else { const d = await res.json(); alert(d.error || "Failed"); }
    } catch { alert("Error"); }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const toggleActive = async (p: Product) => {
    await fetch(`/api/products/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !p.active }) });
    fetchAll();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-xl font-bold tracking-wider uppercase">Products</h1>
        <button onClick={openNew} className="bg-white text-black text-xs font-semibold tracking-wider uppercase px-4 py-2 hover:bg-white/90 transition-colors">+ Add Product</button>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full sm:w-64 bg-white/5 border border-white/10 rounded px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 mb-4" />

      {filtered.length === 0 ? (
        <p className="text-white/30 py-12 text-center">No products found</p>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm min-w-[700px]">
            <thead><tr className="text-left text-white/40 border-b border-white/5"><th className="pb-3 pr-4">Product</th><th className="pb-3 pr-4">Price</th><th className="pb-3 pr-4">Stock</th><th className="pb-3 pr-4">Category</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 pr-4"><div className="flex items-center gap-3">{p.imageUrl && <img src={p.imageUrl} alt="" className="w-8 h-10 object-cover bg-charcoal" />}<div><p className="font-medium">{p.name}</p><p className="text-xs text-white/40">{p.slug}</p></div></div></td>
                  <td className="py-3 pr-4">{formatPrice(p.price)}</td>
                  <td className="py-3 pr-4">{p.stock}</td>
                  <td className="py-3 pr-4">{categories.find(c => c.id === p.categoryId)?.name || "—"}</td>
                  <td className="py-3 pr-4"><button onClick={() => toggleActive(p)} className={`text-xs px-2 py-0.5 rounded ${p.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{p.active ? "Active" : "Inactive"}</button></td>
                  <td className="py-3"><div className="flex gap-2"><button onClick={() => openEdit(p)} className="text-xs text-white/50 hover:text-white">Edit</button><button onClick={() => del(p.id)} className="text-xs text-red-400/50 hover:text-red-400">Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center overflow-y-auto py-8 px-4" onClick={() => setShowForm(false)}>
          <div className="bg-charcoal border border-white/10 rounded-lg p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Product" : "New Product"}</h2>
            <div className="space-y-3">
              <div><label className="block text-xs text-white/40 uppercase mb-1">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Slug</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Price</label><input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Stock</label><input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Category</label><select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none"><option value="">None</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div>
                <label className="block text-xs text-white/40 uppercase mb-1">Image</label>
                <div className="flex gap-2">
                  <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="URL" className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
                  <button type="button" onClick={() => setShowMedia(true)} className="bg-white/10 text-white/70 text-xs px-3 py-2 rounded hover:bg-white/20">Browse</button>
                </div>
                {form.imageUrl && <img src={form.imageUrl} alt="" className="mt-2 w-20 h-20 object-cover bg-charcoal" />}
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="accent-white" />Active</label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving} className="flex-1 bg-white text-black text-sm font-semibold tracking-wider uppercase py-2 rounded hover:bg-white/90 disabled:opacity-50">{saving ? "..." : "Save"}</button>
              <button onClick={() => setShowForm(false)} className="flex-1 border border-white/10 text-sm py-2 rounded hover:bg-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker */}
      {showMedia && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-start justify-center overflow-y-auto py-8 px-4" onClick={() => setShowMedia(false)}>
          <div className="bg-charcoal border border-white/10 rounded-lg p-6 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Select Media</h2>
            {media.length === 0 ? <p className="text-white/30">No media files</p> : (
              <div className="grid grid-cols-4 gap-3">
                {media.filter(m => m.type === "image").map(m => (
                  <button key={m.id} onClick={() => { setForm({ ...form, imageUrl: m.url }); setShowMedia(false); }} className="aspect-square bg-charcoal-light overflow-hidden border-2 border-transparent hover:border-white/30">
                    <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
