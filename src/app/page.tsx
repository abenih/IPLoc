"use client";

import { useEffect, useState } from "react";

type IpData = {
  ip?: string;
  city?: string;
  region_name?: string;
  country_name?: string;
  time_zone?: { id?: string } | null;
  connection?: { isp?: string } | null;
  latitude?: number;
  longitude?: number;
};

function detectDevice(userAgent: string) {
  const ua = userAgent.toLowerCase();
  if (/mobile|iphone|ipod|android|blackberry|opera mini|windows phone/.test(ua)) return "Mobile";
  if (/tablet|ipad/.test(ua)) return "Tablet";
  return "Desktop";
}

export default function Home() {
  const [ipInfo, setIpInfo] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState<string>("Unknown");
  const [rating, setRating] = useState<"" | "spot" | "close" | "miss">("");

  useEffect(() => {
    setDevice(detectDevice(navigator.userAgent || ""));

    let mounted = true;
    fetch("/api/ip")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setIpInfo(data);
      })
      .catch((e) => {
        console.error("fetch /api/ip failed", e);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const handleRate = (r: "spot" | "close" | "miss") => {
    setRating(r);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black font-sans p-6">
      <div className="w-full max-w-md">
        <div className="card bg-gradient-to-br from-white to-zinc-100 dark:from-[#0b0b0b] dark:to-[#111] shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <span className="text-3xl">🧭</span>
            Guess Who You Are?
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">We made a best guess — how close did we get?</p>

          <div className="info grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between rounded-md bg-white/60 p-3">
              <div>
                <div className="text-xs text-zinc-500">Location</div>
                <div className="text-lg font-medium">
                  {loading ? "Detecting..." : ipInfo?.city ? `${ipInfo.city}, ${ipInfo.country_name}` : "Unknown"}
                </div>
              </div>
              <div className="text-3xl">{!loading && ipInfo?.city ? "📍" : "🤔"}</div>
            </div>

            <div className="flex items-center justify-between rounded-md bg-white/60 p-3">
              <div>
                <div className="text-xs text-zinc-500">IP Address</div>
                <div className="text-lg font-medium">{loading ? "..." : ipInfo?.ip || "Unknown"}</div>
              </div>
              <div className="text-sm text-zinc-500">{device}</div>
            </div>

            <div className="flex items-center justify-between rounded-md bg-white/60 p-3">
              <div>
                <div className="text-xs text-zinc-500">Time Zone</div>
                <div className="text-lg font-medium">{loading ? "..." : ipInfo?.time_zone?.id || "Unknown"}</div>
              </div>
              <div className="text-xs text-zinc-500">ISP: {loading ? "..." : ipInfo?.connection?.isp || "Unknown"}</div>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-sm text-zinc-600 mb-2">How close did we get?</div>
            <div className="flex gap-3">
              <button
                onClick={() => handleRate("spot")}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  rating === "spot" ? "bg-green-500 text-white" : "bg-white/80"
                }`}
              >
                Spot on
              </button>
              <button
                onClick={() => handleRate("close")}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  rating === "close" ? "bg-yellow-400 text-white" : "bg-white/80"
                }`}
              >
                Close
              </button>
              <button
                onClick={() => handleRate("miss")}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  rating === "miss" ? "bg-red-500 text-white" : "bg-white/80"
                }`}
              >
                Missed
              </button>
            </div>

            {rating && (
              <div className="mt-4 p-3 rounded-md bg-white/70 text-center">
                {rating === "spot" && (
                  <div className="text-2xl">🎯 Spot on — thanks for playing!</div>
                )}
                {rating === "close" && <div className="text-2xl">🙂 Close — we’ll try to do better next time!</div>}
                {rating === "miss" && <div className="text-2xl">😅 Missed — thanks for the feedback!</div>}
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-3 text-center">This demo uses a server-side proxy to ipstack (keep your API key secret).</p>
      </div>
    </div>
  );
}
