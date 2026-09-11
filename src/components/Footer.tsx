"use client";

import { useEffect, useState } from "react";

type StoreSettings = {
  storeName?: string | null;
  socialEnabled?: boolean | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeUrl?: string | null;
};

export default function Footer() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  const storeName = settings?.storeName || "RYVEN DEPT.";
  const socialEnabled = settings?.socialEnabled !== false;

  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          
          <div>
            <div className="text-lg font-bold tracking-[0.2em]">
              {storeName}
            </div>

            <p className="mt-3 max-w-sm text-sm text-white/50">
              Premium fashion & lifestyle.
            </p>
          </div>

          {socialEnabled && (
            <div className="flex flex-wrap gap-5 text-sm text-white/60">
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  Instagram
                </a>
              )}

              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  Facebook
                </a>
              )}

              {settings?.tiktokUrl && (
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  TikTok
                </a>
              )}

              {settings?.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  YouTube
                </a>
              )}
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} {storeName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
