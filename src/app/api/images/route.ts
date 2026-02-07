
import { NextResponse } from "next/server";
import { unsplash } from "@/shared/lib/unsplash";

const DEFAULT_COUNT = 50;
const DEFAULT_COLLECTION_IDS = ["317099"]; 

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    let images;

    if (query) {
      const result = await unsplash.search.getPhotos({
        query: query,
        page: 1,
        perPage: DEFAULT_COUNT,
      });

      if (result.errors) {
        return new NextResponse("Failed to fetch images", { status: 500 });
      }

      images = result.response.results;
    } else {
      const result = await unsplash.photos.getRandom({
        collectionIds: DEFAULT_COLLECTION_IDS,
        count: DEFAULT_COUNT,
      });

      if (result.errors) {
        return new NextResponse("Failed to fetch images", { status: 500 });
      }

      images = result.response;
    }

    if (!images) {
         return new NextResponse("Failed to fetch images", { status: 500 });
    }
    
    return NextResponse.json({ data: images });
  } catch (error) {
    console.log("[IMAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
