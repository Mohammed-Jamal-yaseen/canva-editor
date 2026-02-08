
import { NextResponse } from "next/server";
import prisma from "@/shared/db/prisma";

export async function GET(
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

    return NextResponse.json({ data: project });
  } catch (error) {
    console.log("[PROJECT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const values = await req.json();

    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json({ data: project });
  } catch (error) {
    console.log("[PROJECT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json({ data: { id: projectId } });
  } catch (error) {
    console.log("[PROJECT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
