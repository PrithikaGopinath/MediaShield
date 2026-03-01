"use client";

export default function ResultCard({ result }: { result: any }) {
  const aiScore = result.ai_generated_score ?? null;
  const deepfakeScore = result.deepfake_score ?? null;
  const finalLabel = result.final_label ?? "Unknown";

  const verdictColor =
    finalLabel === "AI-generated" || finalLabel === "Deepfake"
      ? "text-red-400"
      : finalLabel === "Uncertain"
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-3">
      <h2 className="text-lg font-semibold">Detection Result</h2>

      {/* AI Score (only if backend returned it) */}
      {aiScore !== null && (
        <p className="text-sm">
          <span className="font-medium">AI‑Generated Score:</span>{" "}
          {(aiScore * 100).toFixed(1)}%
        </p>
      )}

      {/* Deepfake Score (only if backend returned it) */}
      {deepfakeScore !== null && (
        <p className="text-sm">
          <span className="font-medium">Deepfake Score:</span>{" "}
          {(deepfakeScore * 100).toFixed(1)}%
        </p>
      )}

      <p className={`text-sm font-semibold ${verdictColor}`}>
        Final Verdict: {finalLabel}
      </p>
    </div>
  );
}
