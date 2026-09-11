"use client";

import { useState, useEffect } from "react";

interface Settings {
  storeName: string;
  currency: string;
  defaultLanguage: string;
  darkMode: boolean;
  musicEnabled: boolean;
  musicUrl?: string;
  socialEnabled: boolean;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  codEnabled: boolean;
  cibEnabled: boolean;
  edahabiaEnabled: boolean;
  baridiMobEnabled: boolean;
  cardEnabled: boolean;
}

const defaults: Settings = {
  storeName: "RYVEN DEPT.",
  currency: "DZD",
  defaultLanguage: "en",
  darkMode: true,
  musicEnabled: false,
  musicUrl: "",
  socialEnabled: true,
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
  youtubeUrl: "",
  codEnabled: true,
  cibEnabled: true,
  edahabiaEnabled: true,
  baridiMobEnabled: true,
  cardEnabled: true,
};

export default function AdminSettings() {
  const [form, setForm] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setForm({ ...defaults, ...data });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSaved(true);
      } else {
        alert(
          typeof data.error === "string"
            ? data.error
            : JSON.stringify(data.error)
        );
      }
    } catch (err) {
      alert(
        "Error: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }

    setSaving(false);
  };

  const Toggle = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm">{label}</span>

      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full relative transition-colors ${
          value ? "bg-white" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
            value
              ? "translate-x-5 bg-black"
              : "translate-x-0.5 bg-white/50"
          }`}
        />
      </button>
    </label>
  );

  const Input = ({
    label,
    value,
    onChange,
    type = "text",
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
  }) => (
    <div>
      <label className="block text-xs text-white/40 uppercase mb-1">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold tracking-wider uppercase mb-6">
        Settings
      </h1>

      <div className="space-y-8">

        {/* Store */}
        <section className="bg-white/5 border border-white/5 rounded-lg p-5">
          <h2 className="text-sm font-semibold tracking-wider uppercase mb-4">
            Store
          </h2>

          <div className="space-y-3">
            <Input
              label="Store Name"
              value={form.storeName}
              onChange={(v) =>
                setForm({ ...form, storeName: v })
              }
            />

            <Input
              label="Currency"
              value={form.currency}
              onChange={(v) =>
                setForm({ ...form, currency: v })
              }
            />

            <div>
              <label className="block text-xs text-white/40 uppercase mb-1">
                Language
              </label>

              <select
                value={form.defaultLanguage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    defaultLanguage: e.target.value,
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <Toggle
              label="Dark Mode"
              value={form.darkMode}
              onChange={(v) =>
                setForm({ ...form, darkMode: v })
              }
            />
          </div>
        </section>

        {/* Music */}
        <section className="bg-white/5 border border-white/5 rounded-lg p-5">
          <h2 className="text-sm font-semibold tracking-wider uppercase mb-4">
            Music
          </h2>

          <Toggle
            label="Background Music"
            value={form.musicEnabled}
            onChange={(v) =>
              setForm({ ...form, musicEnabled: v })
            }
          />

          {form.musicEnabled && (
            <Input
              label="Music URL"
              value={form.musicUrl || ""}
              onChange={(v) =>
                setForm({ ...form, musicUrl: v })
              }
            />
          )}
        </section>

        {/* Social */}
        <section className="bg-white/5 border border-white/5 rounded-lg p-5">
          <h2 className="text-sm font-semibold tracking-wider uppercase mb-4">
            Social
          </h2>

          <Toggle
            label="Social Links Enabled"
            value={form.socialEnabled}
            onChange={(v) =>
              setForm({ ...form, socialEnabled: v })
            }
          />

          {form.socialEnabled && (
            <div className="space-y-3 mt-3">
              <Input
                label="Instagram"
                value={form.instagramUrl || ""}
                onChange={(v) =>
                  setForm({ ...form, instagramUrl: v })
                }
              />

              <Input
                label="Facebook"
                value={form.facebookUrl || ""}
                onChange={(v) =>
                  setForm({ ...form, facebookUrl: v })
                }
              />

              <Input
                label="TikTok"
                value={form.tiktokUrl || ""}
                onChange={(v) =>
                  setForm({ ...form, tiktokUrl: v })
                }
              />

              <Input
                label="YouTube"
                value={form.youtubeUrl || ""}
                onChange={(v) =>
                  setForm({ ...form, youtubeUrl: v })
                }
              />
            </div>
          )}
        </section>

        {/* Payments */}
        <section className="bg-white/5 border border-white/5 rounded-lg p-5">
          <h2 className="text-sm font-semibold tracking-wider uppercase mb-4">
            Payment Methods
          </h2>

          <Toggle
            label="Cash on Delivery"
            value={form.codEnabled}
            onChange={(v) =>
              setForm({ ...form, codEnabled: v })
            }
          />

          <Toggle
            label="CIB"
            value={form.cibEnabled}
            onChange={(v) =>
              setForm({ ...form, cibEnabled: v })
            }
          />

          <Toggle
            label="Edahabia"
            value={form.edahabiaEnabled}
            onChange={(v) =>
              setForm({ ...form, edahabiaEnabled: v })
            }
          />

          <Toggle
            label="BaridiMob"
            value={form.baridiMobEnabled}
            onChange={(v) =>
              setForm({ ...form, baridiMobEnabled: v })
            }
          />

          <Toggle
            label="Card"
            value={form.cardEnabled}
            onChange={(v) =>
              setForm({ ...form, cardEnabled: v })
            }
          />
        </section>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-white text-black text-sm font-semibold tracking-wider uppercase px-6 py-2.5 rounded hover:bg-white/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

        {saved && (
          <span className="text-sm text-green-400">
            Saved!
          </span>
        )}
      </div>
    </div>
  );
}
