
import { NextResponse } from "next/server";
import { replicate } from "@/shared/lib/replicate";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return new NextResponse("Image string is required", { status: 400 });
    }

    const output = await replicate.run(
      "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
      {
        input: {
          image: image,
        }
      }
    );

    return NextResponse.json({ data: output });
  } catch (error) {
    console.log("[REMOVE_BG]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
