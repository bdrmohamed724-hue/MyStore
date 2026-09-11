"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/validation";

interface Wilaya {
  id: string;
  name: string;
  price: string;
  estimatedTime?: string | null;
  enabled: boolean;
  wilayaCode?: number | null;
  wilayaName?: string | null;
  communes: string[];
}

const emptyForm = {
  wilayaCode: "",
  wilayaName: "",
  price: "0",
  estimatedTime: "",
  enabled: true,
  communesText: "",
};

export default function AdminDelivery() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<Wilaya | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const fetchWilayas = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/delivery");

      if (!res.ok) {
        setWilayas([]);
        return;
      }

      const data = await res.json();

      setWilayas(Array.isArray(data) ? data : []);
    } catch {
      setWilayas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWilayas();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (wilaya: Wilaya) => {
    setEditing(wilaya);

    setForm({
      wilayaCode: wilaya.wilayaCode?.toString() || "",
      wilayaName: wilaya.wilayaName || wilaya.name || "",
      price: wilaya.price || "0",
      estimatedTime: wilaya.estimatedTime || "",
      enabled: wilaya.enabled,
      communesText: (wilaya.communes || []).join("\n"),
    });

    setShowForm(true);
  };

  const save = async () => {
    if (!form.wilayaCode || !form.wilayaName.trim()) {
      alert("Please enter Wilaya code and name.");
      return;
    }

    if (Number(form.price) < 0) {
      alert("Invalid delivery price.");
      return;
    }

    setSaving(true);

    try {
      const communes = form.communesText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        wilayaCode: Number(form.wilayaCode),
        wilayaName: form.wilayaName.trim(),
        name: form.wilayaName.trim(),
        price: form.price,
        estimatedTime: form.estimatedTime.trim() || null,
        enabled: form.enabled,
        communes,
      };

      const res = editing
        ? await fetch(`/api/delivery/${editing.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/delivery", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const data = await res.json().catch(() => null);

        alert(data?.error || "Failed to save Wilaya.");
        return;
      }

      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);

      await fetchWilayas();
    } catch {
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = async (wilaya: Wilaya) => {
    try {
      const res = await fetch(`/api/delivery/${wilaya.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: !wilaya.enabled,
        }),
      });

      if (res.ok) {
        await fetchWilayas();
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  const deleteWilaya = async (wilaya: Wilaya) => {
    const confirmed = confirm(
      `Delete ${wilaya.wilayaName || wilaya.name}?`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/delivery/${wilaya.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchWilayas();
      } else {
        alert("Failed to delete Wilaya.");
      }
    } catch {
      alert("Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-wider uppercase">
            Delivery
          </h1>

          <p className="text-xs text-white/40 mt-1">
            Manage Wilaya delivery prices and communes
          </p>
        </div>

        <button
          onClick={openNew}
          className="bg-white text-black text-xs font-semibold tracking-wider uppercase px-4 py-2 hover:bg-white/90"
        >
          + Add Wilaya
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Wilayas
          </p>

          <p className="text-2xl font-semibold mt-1">
            {wilayas.length}
          </p>
        </div>

        <div className="border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Active
          </p>

          <p className="text-2xl font-semibold mt-1">
            {wilayas.filter((w) => w.enabled).length}
          </p>
        </div>

        <div className="border border-white/10 bg-white/[0.03] p-4 col-span-2 sm:col-span-1">
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Communes
          </p>

          <p className="text-2xl font-semibold mt-1">
            {wilayas.reduce(
              (total, w) => total + (w.communes?.length || 0),
              0
            )}
          </p>
        </div>
      </div>

      {/* Empty */}
      {wilayas.length === 0 ? (
        <div className="border border-white/10 py-16 text-center">
          <p className="text-white/40 text-sm">
            No Wilayas configured yet.
          </p>

          <button
            onClick={openNew}
            className="mt-4 text-xs uppercase tracking-wider border border-white/20 px-4 py-2 hover:bg-white/5"
          >
            Add your first Wilaya
          </button>
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 border-b border-white/10 bg-white/[0.02]">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Wilaya</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Communes</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {wilayas.map((wilaya) => (
                <tr
                  key={wilaya.id}
                  className="border-b border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-4 text-white/50 font-mono">
                    {wilaya.wilayaCode ?? "—"}
                  </td>

                  <td className="px-4 py-4 font-medium">
                    {wilaya.wilayaName || wilaya.name}
                  </td>

                  <td className="px-4 py-4">
                    {formatPrice(wilaya.price)}
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-white/60">
                      {wilaya.communes?.length || 0}
                    </span>

                    <span className="text-white/30 ml-1">
                      communes
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleEnabled(wilaya)}
                      className={`text-xs px-2.5 py-1 rounded ${
                        wilaya.enabled
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {wilaya.enabled ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEdit(wilaya)}
                        className="text-xs text-white/50 hover:text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteWilaya(wilaya)}
                        className="text-xs text-red-400/50 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4 py-6"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-charcoal border border-white/10 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold">
                  {editing ? "Edit Wilaya" : "New Wilaya"}
                </h2>

                <p className="text-xs text-white/30 mt-1">
                  Delivery configuration
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="text-white/40 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                  Wilaya Code
                </label>

                <input
                  type="number"
                  value={form.wilayaCode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      wilayaCode: e.target.value,
                    })
                  }
                  placeholder="e.g. 16"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                  Wilaya Name
                </label>

                <input
                  value={form.wilayaName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      wilayaName: e.target.value,
                    })
                  }
                  placeholder="e.g. Alger"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                  Delivery Price
                </label>

                <input
                  type="number"
                  min="0"
                  step="50"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  placeholder="250"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Estimated time */}
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                  Estimated Time
                </label>

                <input
                  value={form.estimatedTime}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      estimatedTime: e.target.value,
                    })
                  }
                  placeholder="2-3 days"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Communes */}
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                  Communes
                </label>

                <textarea
                  value={form.communesText}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      communesText: e.target.value,
                    })
                  }
                  placeholder={"Commune 1\nCommune 2\nCommune 3"}
                  rows={8}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 resize-y"
                />

                <p className="text-[11px] text-white/30 mt-1.5">
                  Enter one commune per line.
                </p>
              </div>

              {/* Status */}
              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      enabled: e.target.checked,
                    })
                  }
                  className="accent-white w-4 h-4"
                />

                <span>Active</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 bg-white text-black text-sm font-semibold tracking-wider uppercase py-2.5 rounded hover:bg-white/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-white/10 text-sm py-2.5 rounded hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
