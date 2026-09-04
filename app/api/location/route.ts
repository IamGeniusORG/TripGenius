import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    let ip = "check";
    
    if (forwardedFor) {
      ip = forwardedFor.split(",")[0].trim();
    } else {
      ip = request.headers.get("x-real-ip") || "check";
    }

    const apiKey = process.env.IPSTACK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "IPStack API Key not configured" }, { status: 500 });
    }

    if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") {
      ip = "check";
    }

    const res = await fetch("http://api.ipstack.com/" + ip + "?access_key=" + apiKey);
    const data = await res.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Location API Error:", error);
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 });
  }
}