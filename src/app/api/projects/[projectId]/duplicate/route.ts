
import { NextResponse } from "next/server";
import prisma from "@/shared/db/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    const { id, createdAt, updatedAt, ...rest } = project;

    const duplicate = await prisma.project.create({
      data: {
        ...rest,
        name: `Copy of ${project.name}`,
      },
    });

    return NextResponse.json({ data: duplicate });
  } catch (error) {
    console.log("[PROJECT_DUPLICATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
