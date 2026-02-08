import { NextResponse } from "next/server";
import { unsplash } from "@/shared/lib/unsplash";

const DEFAULT_COUNT = 30;
const DEFAULT_COLLECTION_IDS = ["317099"]; 

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    let images: any[] = [];

    if (query) {
      // 1. Search Logic
      const result = await unsplash.search.getPhotos({
        query: query,
        page: 1,
        perPage: DEFAULT_COUNT,
      });

      if (result.errors) {
        console.error("[UNSPLASH_SEARCH_ERROR]", result.errors[0]);
        return NextResponse.json({ data: [], error: result.errors[0] }, { status: 400 });
      }

      if (result.response) {
        images = result.response.results;
      }
    } else {
      // 2. Default Logic - Fetch curated photos using a search for "design"
      // Using search is often more reliable and relevant than completely random photos
      const result = await unsplash.search.getPhotos({
        query: "minimalist background",
        page: 1,
        perPage: DEFAULT_COUNT,
      });

      if (result.errors) {
        console.error("[UNSPLASH_DEFAULT_ERROR]", result.errors[0]);
        return NextResponse.json({ data: [], error: result.errors[0] }, { status: 400 });
      }

      if (result.response) {
        images = result.response.results;
      }
    }

    // Always return a clean JSON object
    return NextResponse.json({ data: images });

  } catch (error) {
    console.error("[IMAGES_GET_CRASH]", error);
    return NextResponse.json({ 
      data: [], 
      error: (error as Error)?.message || "Internal Server Error" 
    }, { status: 500 });
  }
}