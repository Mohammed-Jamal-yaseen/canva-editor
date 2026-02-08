import { NextResponse } from "next/server";
import { unsplash } from "@/shared/lib/unsplash";

const DEFAULT_COUNT = 50;
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
      // 2. Random/Default Logic
      const result = await unsplash.photos.getRandom({
        collectionIds: DEFAULT_COLLECTION_IDS,
        count: DEFAULT_COUNT,
      });

      if (result.errors) {
        console.error("[UNSPLASH_RANDOM_ERROR]", result.errors[0]);
        return NextResponse.json({ data: [], error: result.errors[0] }, { status: 400 });
      }

      if (result.response) {
        // getRandom can return an array or a single object
        images = Array.isArray(result.response) 
          ? result.response 
          : [result.response];
      }
    }

    // Always return a clean JSON object
    return NextResponse.json({ data: images });

  } catch (error) {
    console.error("[IMAGES_GET_CRASH]", error);
    // Return empty data instead of a 500 to keep the frontend from crashing
    return NextResponse.json({ data: [], error: "Internal Server Error" }, { status: 200 });
  }
}