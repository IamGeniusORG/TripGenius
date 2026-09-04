import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "travel";

  try {
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!unsplashKey) {
      throw new Error("No Unsplash key found");
    }

    const res = await fetch(
      "https://api.unsplash.com/search/photos?page=1&per_page=1&query=" + encodeURIComponent(query),
      {
        headers: {
          Authorization: "Client-ID " + unsplashKey,
        },
        // Cache the response heavily so we don't blow through the 50 req/hr limit
        next: { revalidate: 86400 } // Cache for 24 hours
      }
    );

    if (!res.ok) {
      throw new Error("Unsplash API limit reached or error");
    }

    const data = await res.json();
    
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular;
      return NextResponse.redirect(imageUrl);
    } else {
      // Fallback if no images found
      return NextResponse.redirect(https://loremflickr.com/800/400/ + encodeURIComponent(query));
    }
  } catch (error) {
    console.error("Image Fetch Error:", error);
    // Smart Fallback to LoremFlickr if we hit rate limits!
    return NextResponse.redirect(https://loremflickr.com/800/400/ + encodeURIComponent(query));
  }
}
