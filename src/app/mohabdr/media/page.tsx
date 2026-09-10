"use client";
import { useState, useEffect, useRef } from "react";

interface MediaItem { id: string; name: string; type: string; url: string; size: number; createdAt: string; }

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchMedia = () => { setLoading(true); fetch("/api/media").then(r => r.ok ? r.json() : []).then(setMedia).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(fetchMedia, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        await fetch("/api/media", { method: "POST", body: fd });
      }
      fetchMedia();
    } catch { alert("Upload failed"); }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    fetchMedia();
    setPreview(null);
  };

  const filtered = media.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  const formatSize = (bytes: number) => bytes < 1024 ? bytes + " B" : bytes < 1048576 ? (bytes / 1024).toFixed(1) + " KB" : (bytes / 1048576).toFixed(1) + " MB";

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-xl font-bold tracking-wider uppercase">Media</h1>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" multiple onChange={upload} className="hidden" accept="image/*,video/*,audio/*,.pdf" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-white text-black text-xs font-semibold tracking-wider uppercase px-4 py-2 hover:bg-white/90 disabled:opacity-50">
            {uploading ? "Uploading..." : "+ Upload"}
          </button>
        </div>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full sm:w-64 bg-white/5 border border-white/10 rounded px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 mb-4" />

      {filtered.length === 0 ? <p className="text-white/30 py-12 text-center">No media files</p> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(m => (
            <div key={m.id} onClick={() => setPreview(m)} className="group cursor-pointer bg-white/5 border border-white/5 rounded overflow-hidden hover:border-white/20 transition-colors">
              <div className="aspect-square bg-charcoal flex items-center justify-center overflow-hidden">
                {m.type === "image" ? <img src={m.url} alt={m.name} className="w-full h-full object-cover" /> :
                 m.type === "video" ? <div className="text-white/20 text-xs uppercase">Video</div> :
                 m.type === "audio" ? <div className="text-white/20 text-xs uppercase">Audio</div> :
                 <div className="text-white/20 text-xs uppercase">PDF</div>}
              </div>
              <div className="p-2">
                <p className="text-xs truncate">{m.name}</p>
                <p className="text-xs text-white/30">{formatSize(m.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <div><p className="text-sm font-medium">{preview.name}</p><p className="text-xs text-white/40">{preview.type} — {formatSize(preview.size)}</p></div>
              <div className="flex gap-2">
                <a href={preview.url} target="_blank" rel="noopener noreferrer" className="text-xs text-white/50 hover:text-white px-3 py-1 border border-white/10 rounded">Open</a>
                <button onClick={() => del(preview.id)} className="text-xs text-red-400 hover:text-red-300 px-3 py-1 border border-red-400/20 rounded">Delete</button>
                <button onClick={() => setPreview(null)} className="text-xs text-white/50 hover:text-white px-3 py-1 border border-white/10 rounded">Close</button>
              </div>
            </div>
            <div className="bg-charcoal flex items-center justify-center max-h-[70vh] overflow-hidden">
              {preview.type === "image" ? <img src={preview.url} alt={preview.name} className="max-w-full max-h-[70vh] object-contain" /> :
               preview.type === "video" ? <video src={preview.url} controls className="max-w-full max-h-[70vh]" /> :
               preview.type === "audio" ? <audio src={preview.url} controls className="w-full" /> :
               <p className="text-white/30 py-20">Preview not available</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
