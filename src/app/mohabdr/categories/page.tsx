"use client";
import { useState, useEffect } from "react";
import { generateSlug } from "@/lib/validation";

interface Category { id: string; name: string; slug: string; description?: string; imageUrl?: string; visible: boolean; }
interface MediaItem { id: string; name: string; url: string; type: string; }

const emptyCat = { name: "", slug: "", description: "", imageUrl: "", visible: true };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyCat);
  const [showForm, setShowForm] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/categories?visible=false").then(r => r.ok ? r.json() : []),
      fetch("/api/media").then(r => r.ok ? r.json() : []),
    ]).then(([c, m]) => { setCategories(c); setMedia(m); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetchAll, []);

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const openNew = () => { setEditing(null); setForm(emptyCat); setShowForm(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, slug: c.slug, description: c.description || "", imageUrl: c.imageUrl || "", visible: c.visible }); setShowForm(true); };

  const save = async () => {
    setSaving(true);
    try {
      const res = editing
        ? await fetch(`/api/categories/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
        : await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setShowForm(false); fetchAll(); } else { const d = await res.json(); alert(d.error || "Failed"); }
    } catch { alert("Error"); }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) fetchAll(); else { const d = await res.json(); alert(d.error || "Delete failed"); }
  };

  const toggleVisible = async (c: Category) => {
    await fetch(`/api/categories/${c.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visible: !c.visible }) });
    fetchAll();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-xl font-bold tracking-wider uppercase">Categories</h1>
        <button onClick={openNew} className="bg-white text-black text-xs font-semibold tracking-wider uppercase px-4 py-2 hover:bg-white/90 transition-colors">+ Add Category</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full sm:w-64 bg-white/5 border border-white/10 rounded px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 mb-4" />
      {filtered.length === 0 ? <p className="text-white/30 py-12 text-center">No categories found</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="text-left text-white/40 border-b border-white/5"><th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Slug</th><th className="pb-3 pr-4">Visible</th><th className="pb-3">Actions</th></tr></thead>
            <tbody>{filtered.map(c => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 pr-4"><div className="flex items-center gap-3">{c.imageUrl && <img src={c.imageUrl} alt="" className="w-8 h-8 object-cover bg-charcoal" />}<span>{c.name}</span></div></td>
                <td className="py-3 pr-4 text-white/50">{c.slug}</td>
                <td className="py-3 pr-4"><button onClick={() => toggleVisible(c)} className={`text-xs px-2 py-0.5 rounded ${c.visible ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{c.visible ? "Visible" : "Hidden"}</button></td>
                <td className="py-3"><div className="flex gap-2"><button onClick={() => openEdit(c)} className="text-xs text-white/50 hover:text-white">Edit</button><button onClick={() => del(c.id)} className="text-xs text-red-400/50 hover:text-red-400">Delete</button></div></td>
              </tr>
            ))}</tbody></table>
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center overflow-y-auto py-8 px-4" onClick={() => setShowForm(false)}>
          <div className="bg-charcoal border border-white/10 rounded-lg p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Category" : "New Category"}</h2>
            <div className="space-y-3">
              <div><label className="block text-xs text-white/40 uppercase mb-1">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Slug</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div>
                <label className="block text-xs text-white/40 uppercase mb-1">Image</label>
                <div className="flex gap-2"><input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="URL" className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /><button type="button" onClick={() => setShowMedia(true)} className="bg-white/10 text-xs px-3 py-2 rounded hover:bg-white/20">Browse</button></div>
                {form.imageUrl && <img src={form.imageUrl} alt="" className="mt-2 w-20 h-20 object-cover bg-charcoal" />}
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })} className="accent-white" />Visible</label>
            </div>
            <div className="flex gap-3 mt-6"><button onClick={save} disabled={saving} className="flex-1 bg-white text-black text-sm font-semibold tracking-wider uppercase py-2 rounded hover:bg-white/90 disabled:opacity-50">{saving ? "..." : "Save"}</button><button onClick={() => setShowForm(false)} className="flex-1 border border-white/10 text-sm py-2 rounded hover:bg-white/5">Cancel</button></div>
          </div>
        </div>
      )}
      {showMedia && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-start justify-center overflow-y-auto py-8 px-4" onClick={() => setShowMedia(false)}>
          <div className="bg-charcoal border border-white/10 rounded-lg p-6 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Select Media</h2>
            {media.filter(m => m.type === "image").length === 0 ? <p className="text-white/30">No images</p> : (
              <div className="grid grid-cols-4 gap-3">{media.filter(m => m.type === "image").map(m => (
                <button key={m.id} onClick={() => { setForm({ ...form, imageUrl: m.url }); setShowMedia(false); }} className="aspect-square bg-charcoal-light overflow-hidden border-2 border-transparent hover:border-white/30"><img src={m.url} alt={m.name} className="w-full h-full object-cover" /></button>
              ))}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
