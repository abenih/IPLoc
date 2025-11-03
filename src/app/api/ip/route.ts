import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const IPSTACK_KEY = process.env.IPSTACK_KEY;
  if (!IPSTACK_KEY) {
    return NextResponse.json({ error: "IPSTACK_KEY not configured on server" }, { status: 500 });
  }

  try {
    const url = new URL(req.url);
    const ipParam = url.searchParams.get("ip");

    // Try common headers used by proxies / platforms
    const forwarded = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
    const headerIp = forwarded.split(",").map(s => s.trim()).filter(Boolean)[0] || "";

    // Prefer explicit query `?ip=` then forwarded header; if neither, use 'check' (ipstack will resolve server IP)
    const lookupIp = ipParam || headerIp || "check";

    const apiUrl = `http://api.ipstack.com/${encodeURIComponent(lookupIp)}?access_key=${encodeURIComponent(
      IPSTACK_KEY
    )}&fields=ip,city,region_name,country_name,time_zone,latitude,longitude,zip,connection`;

    const res = await fetch(apiUrl);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json({ error: "ipstack fetch failed", status: res.status, body: text }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "unknown error" }, { status: 500 });
  }
}
