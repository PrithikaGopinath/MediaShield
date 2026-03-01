import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "a16z-infra/faceforensics++:latest",
        input: {
          image: `data:image/jpeg;base64,${base64}`,
        },
      }),
    });

    const result = await response.json();
    console.log("Replicate deepfake result:", result);

    const deepfakeScore = result.output?.score ?? 0.5;

    let finalLabel = "Real";
    if (deepfakeScore > 0.7) finalLabel = "Deepfake";
    else if (deepfakeScore > 0.5) finalLabel = "Uncertain";

    return NextResponse.json({
      deepfake_score: deepfakeScore,
      final_label: finalLabel,
    });
  } catch (err) {
    console.error("Detection error:", err);
    return NextResponse.json({ error: "Detection failed" }, { status: 500 });
  }
}
