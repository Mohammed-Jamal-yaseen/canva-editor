
import { NextResponse } from "next/server";
import prisma from "@/shared/db/prisma";

const DEFAULT_LIMIT = "50";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || DEFAULT_LIMIT);
    const search = searchParams.get("search");

    const templates = await prisma.project.findMany({
      where: {
        isTemplate: true,
        isPublished: true,
        name: {
          contains: search || undefined,
          mode: "insensitive",
        },
      },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        updatedAt: "desc",
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (templates.length > limit) {
      const nextItem = templates.pop();
      nextCursor = nextItem?.id;
    }

    return NextResponse.json({ 
      data: templates,
      nextCursor
    });
  } catch (error) {
    console.log("[TEMPLATES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
