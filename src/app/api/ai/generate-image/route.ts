import { NextResponse } from "next/server";
import { utapi } from "@/shared/lib/uploadthing-server";
import prisma from "@/shared/db/prisma";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Valid prompt is required" }, { status: 400 });
    }

    // Quality modifiers for better results
    const enhancedPrompt = `masterpiece, 8k, highly detailed, cinematic lighting, ${prompt.trim()}`;

    // Using your confirmed working URL
    const HF_MODEL = "stabilityai/stable-diffusion-xl-base-1.0";
    const HF_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

    // 1. Generate the image from Hugging Face
    const hfResponse = await fetch(HF_URL, {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
        "x-wait-for-model": "true", 
      },
      method: "POST",
      body: JSON.stringify({ inputs: enhancedPrompt }),
    });

    if (!hfResponse.ok) {
      const errorData = await hfResponse.text();
      console.error("HF Error:", errorData);
      return NextResponse.json({ error: "Generation failed", details: errorData }, { status: hfResponse.status });
    }

    // 2. Process binary data
    const arrayBuffer = await hfResponse.arrayBuffer();
    const fileName = `generated-${Date.now()}.jpg`;
    
    // Create File object for UploadThing
    const file = new File([arrayBuffer], fileName, { type: "image/jpeg" });

    // 3. Upload to UploadThing
    const uploadResult = await utapi.uploadFiles(file);

    // FIX: Check uploadResult and use ufsUrl (stops deprecation warning)
    if (!uploadResult?.data || uploadResult.error) {
       console.error("UploadThing Error:", uploadResult?.error);
       return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const imageUrl = uploadResult.data.ufsUrl; 

    // 4. Save to Database (FIX: Finding valid user to avoid P2003 error)
    try {
      // Look for the first available user instead of hardcoding "1"
      const user = await prisma.user.findFirst();
      
      if (user) {
        await prisma.media.create({
          data: {
            url: imageUrl,
            name: prompt.slice(0, 50),
            userId: user.id, // Use actual ID from DB
          }
        });
      } else {
        console.warn("No user found in database. Media record skipped.");
      }
    } catch (dbError) {
      // Log the error but don't crash the response—the image is already uploaded!
      console.error("[DATABASE_SAVE_ERROR]", dbError);
    }

    // 5. Return consistent array format for frontend
    return NextResponse.json({ 
      data: [imageUrl] 
    });

  } catch (error) {
    console.error("[IMAGE_GENERATE_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}