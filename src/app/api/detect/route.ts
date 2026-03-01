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
        const imageData = `data:image/jpeg;base64,${base64}`;

        // ----------------------------------------------------
        // 1) Deepfake Detection (Replicate - FaceForensics++)
        // ----------------------------------------------------
        let deepfakeScore: number | null = null;

        try {
            const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    version: "a16z-infra/faceforensics++:latest",
                    input: { image: imageData },
                }),
            });

            const replicateJson = await replicateRes.json();
            deepfakeScore = replicateJson.output?.score ?? null;
        } catch (err) {
            console.error("Deepfake detection error:", err);
        }

        // ----------------------------------------------------
        // 2) AI-Generated Detection (Replicate - Diffusion)
        // ----------------------------------------------------
        let aiScore: number | null = null;

        try {
            const aiRes = await fetch("https://api.replicate.com/v1/predictions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    version: "forensic-diffusion-detector", // diffusion-trained model
                    input: { image: imageData },
                }),
            });

            const aiJson = await aiRes.json();
            aiScore = aiJson.output?.score ?? null;
        } catch (err) {
            console.error("AI detection error:", err);
        }

        // ----------------------------------------------------
        // 3) Normalize scores
        // ----------------------------------------------------
        const normalize = (v: number | null) =>
            v === null ? null : Math.min(Math.max(v, 0), 1);

        const normalizedAI = normalize(aiScore);
        const normalizedDeepfake = normalize(deepfakeScore);

        // ----------------------------------------------------
        // 4) Final Verdict Logic
        // ----------------------------------------------------
        let finalLabel = "Real";

        if (normalizedDeepfake !== null && normalizedDeepfake > 0.7) {
            finalLabel = "Deepfake";
        } else if (normalizedAI !== null && normalizedAI > 0.7) {
            finalLabel = "AI-generated";
        } else if (
            (normalizedAI !== null && normalizedAI > 0.45 && normalizedAI < 0.55) ||
            (normalizedDeepfake !== null && normalizedDeepfake > 0.45 && normalizedDeepfake < 0.55)
        ) {
            finalLabel = "Uncertain";
        }

        return NextResponse.json({
            ai_generated_score: normalizedAI,
            deepfake_score: normalizedDeepfake,
            final_label: finalLabel,
        });
    } catch (err) {
        console.error("Detection error:", err);
        return NextResponse.json({ error: "Detection failed" }, { status: 500 });
    }
}
