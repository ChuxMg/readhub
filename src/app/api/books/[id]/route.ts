import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // In Next.js 15+, params is a Promise that must be awaited
    const { id } = await params;

    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 },
    );
  }
}
