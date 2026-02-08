
import { NextResponse } from "next/server";
import prisma from "@/shared/db/prisma";

export async function POST(req: Request) {
  try {
    const values = await req.json();
    const { name, json, width, height } = values;

    if (!name || !json || !width || !height) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Since auth is mock, find first available user
    const user = await prisma.user.findFirst();

    if (!user) {
        // Create a mock user if none exists for development/deploy testing
        const newUser = await prisma.user.create({
            data: {
                name: "Mock User",
                email: "mock@example.com",
            }
        });
        
        const project = await prisma.project.create({
            data: {
              name,
              json,
              width,
              height,
              userId: newUser.id,
            },
          });
      
          return NextResponse.json({ data: project });
    }

    const project = await prisma.project.create({
      data: {
        name,
        json,
        width,
        height,
        userId: user.id,
      },
    });

    return NextResponse.json({ data: project });
  } catch (error) {
    console.log("[PROJECTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10");

    const projects = await prisma.project.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        updatedAt: "desc",
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (projects.length > limit) {
      const nextItem = projects.pop();
      nextCursor = nextItem?.id;
    }

    return NextResponse.json({ 
      data: projects,
      nextCursor
    });
  } catch (error) {
    console.log("[PROJECTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
