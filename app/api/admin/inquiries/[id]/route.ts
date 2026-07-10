import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/client";

const ALLOWED_STATUSES = ["new", "contacted", "booked", "archived"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await req.json();

  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    await writeClient.patch(id).set({ status }).commit();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to update inquiry status:", err);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
