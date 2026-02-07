
import { NextResponse } from "next/server";
import { replicate } from "@/shared/lib/replicate";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b7159d550464e2b",
      {
        input: {
          prompt: prompt,
        }
      }
    );

    return NextResponse.json({ data: output });
  } catch (error) {
    console.log("[IMAGE_GENERATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
