"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/mohabdr");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-bold tracking-[0.3em] uppercase text-center mb-8">RYVEN DEPT.</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-white text-black text-sm font-semibold tracking-wider uppercase py-3 hover:bg-white/90 transition-colors disabled:opacity-50">
            {loading ? "..." : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-white/20">Default: admin / admin123</p>
      </div>
    </div>
  );
}
