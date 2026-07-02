import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/client";

const ALLOWED_TYPES = ["contact", "tripPlanner", "booking", "planSafari"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!ALLOWED_TYPES.includes(body.type)) {
      return NextResponse.json({ error: "Invalid inquiry type" }, { status: 400 });
    }
    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const doc = {
      _type: "inquiry",
      type: body.type,
      status: "new",
      name: body.name || undefined,
      email: body.email,
      phone: body.phone || undefined,
      message: body.message || undefined,
      reference: body.reference || undefined,
      destinations: body.destinations || undefined,
      tier: body.tier || undefined,
      dateStart: body.dateStart || undefined,
      dateEnd: body.dateEnd || undefined,
      adults: body.adults ?? undefined,
      children: body.children ?? undefined,
      destination: body.destination || undefined,
      packageChoice: body.packageChoice || undefined,
      submittedAt: new Date().toISOString(),
    };

    const created = await writeClient.create(doc);

    return NextResponse.json({ ok: true, id: created._id });
  } catch (err) {
    console.error("Failed to create inquiry:", err);
    return NextResponse.json(
      { error: "Something went wrong submitting your request." },
      { status: 500 }
    );
  }
}
