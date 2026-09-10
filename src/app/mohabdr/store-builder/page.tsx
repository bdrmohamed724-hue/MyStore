"use client";
import { useState, useEffect } from "react";
import { generateSlug } from "@/lib/validation";

interface Section { id: string; sectionKey: string; title?: string; type: string; subtitle?: string; imageUrl?: string; buttonText?: string; buttonUrl?: string; visible: boolean; position: number; }
interface MediaItem { id: string; name: string; url: string; type: string; }

const sectionTypes = ["Hero", "Banner", "Featured", "Categories", "Newsletter", "Social", "Generic"];
const emptySection = { sectionKey: "", title: "", type: "Hero", subtitle: "", imageUrl: "", buttonText: "", buttonUrl: "", visible: true, position: 0 };

export default function AdminStoreBuilder() {
  const [sections, setSections] = useState<Section[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Section | null>(null);
  const [form, setForm] = useState(emptySection);
  const [showForm, setShowForm] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/sections").then(r => r.ok ? r.json() : []),
      fetch("/api/media").then(r => r.ok ? r.json() : []),
    ]).then(([s, m]) => { setSections(s); setMedia(m); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetchAll, []);

  const openNew = () => { setEditing(null); setForm({ ...emptySection, position: sections.length }); setShowForm(true); };
  const openEdit = (s: Section) => { setEditing(s); setForm({ sectionKey: s.sectionKey, title: s.title || "", type: s.type, subtitle: s.subtitle || "", imageUrl: s.imageUrl || "", buttonText: s.buttonText || "", buttonUrl: s.buttonUrl || "", visible: s.visible, position: s.position }); setShowForm(true); };

  const save = async () => {
    setSaving(true);
    try {
      const body = { ...form, sectionKey: form.sectionKey || generateSlug(form.title || form.type) };
      const res = editing
        ? await fetch(`/api/sections/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch("/api/sections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); fetchAll(); } else alert("Failed");
    } catch { alert("Error"); }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/sections/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const move = async (id: string, action: "moveUp" | "moveDown") => {
    await fetch(`/api/sections/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    fetchAll();
  };

  const toggleVisible = async (s: Section) => {
    await fetch(`/api/sections/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visible: !s.visible }) });
    fetchAll();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold tracking-wider uppercase">Store Builder</h1>
        <button onClick={openNew} className="bg-white text-black text-xs font-semibold tracking-wider uppercase px-4 py-2 hover:bg-white/90">+ Add Section</button>
      </div>

      {sections.length === 0 ? <p className="text-white/30 py-12 text-center">No sections</p> : (
        <div className="space-y-2">
          {sections.sort((a, b) => a.position - b.position).map((s, idx) => (
            <div key={s.id} className="bg-white/5 border border-white/5 rounded p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30 w-6">{idx + 1}</span>
                {s.imageUrl && <img src={s.imageUrl} alt="" className="w-10 h-10 object-cover bg-charcoal" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{s.title || s.sectionKey}</p>
                <p className="text-xs text-white/40">{s.type} • {s.visible ? "Visible" : "Hidden"}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => toggleVisible(s)} className={`text-xs px-2 py-1 rounded ${s.visible ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"}`}>{s.visible ? "Visible" : "Hidden"}</button>
                <button onClick={() => move(s.id, "moveUp")} disabled={idx === 0} className="text-xs text-white/40 hover:text-white disabled:opacity-20">↑</button>
                <button onClick={() => move(s.id, "moveDown")} disabled={idx === sections.length - 1} className="text-xs text-white/40 hover:text-white disabled:opacity-20">↓</button>
                <button onClick={() => openEdit(s)} className="text-xs text-white/50 hover:text-white">Edit</button>
                <button onClick={() => del(s.id)} className="text-xs text-red-400/50 hover:text-red-400">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center overflow-y-auto py-8 px-4" onClick={() => setShowForm(false)}>
          <div className="bg-charcoal border border-white/10 rounded-lg p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Section" : "New Section"}</h2>
            <div className="space-y-3">
              <div><label className="block text-xs text-white/40 uppercase mb-1">Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none">{sectionTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, sectionKey: form.sectionKey || generateSlug(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Subtitle</label><textarea value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} rows={2} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div>
                <label className="block text-xs text-white/40 uppercase mb-1">Image</label>
                <div className="flex gap-2"><input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="URL" className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /><button type="button" onClick={() => setShowMedia(true)} className="bg-white/10 text-xs px-3 py-2 rounded hover:bg-white/20">Browse</button></div>
                {form.imageUrl && <img src={form.imageUrl} alt="" className="mt-2 w-20 h-12 object-cover bg-charcoal" />}
              </div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Button Text</label><input value={form.buttonText} onChange={e => setForm({ ...form, buttonText: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Button URL</label><input value={form.buttonUrl} onChange={e => setForm({ ...form, buttonUrl: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
              <div><label className="block text-xs text-white/40 uppercase mb-1">Position</label><input type="number" value={form.position} onChange={e => setForm({ ...form, position: parseInt(e.target.value) || 0 })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" /></div>
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
            <div className="grid grid-cols-4 gap-3">{media.filter(m => m.type === "image").map(m => (
              <button key={m.id} onClick={() => { setForm({ ...form, imageUrl: m.url }); setShowMedia(false); }} className="aspect-square bg-charcoal-light overflow-hidden border-2 border-transparent hover:border-white/30"><img src={m.url} alt={m.name} className="w-full h-full object-cover" /></button>
            ))}</div>
          </div>
        </div>
      )}
    </div>
  );
}
