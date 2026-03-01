"use client";

export default function ResultCard({ result }: { result: any }) {
  const aiScore = result.ai_generated_score;
  const deepfakeScore = result.deepfake_score;
  const finalLabel = result.final_label ?? "Unknown";

  const verdictColor =
    finalLabel === "AI-generated" || finalLabel === "Deepfake"
      ? "text-red-400"
      : finalLabel === "Uncertain"
        ? "text-yellow-400"
        : "text-green-400";

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 space-y-4">
      <h2 className="text-xl font-semibold">Detection Result</h2>

      {/* AI Score */}
      {typeof aiScore === "number" && (
        <div className="flex justify-between text-sm">
          <span className="font-medium">AI‑Generated Score:</span>
          <span>{(aiScore * 100).toFixed(1)}%</span>
        </div>
      )}

      {/* Deepfake Score */}
      {typeof deepfakeScore === "number" && (
        <div className="flex justify-between text-sm">
          <span className="font-medium">Deepfake Score:</span>
          <span>{(deepfakeScore * 100).toFixed(1)}%</span>
        </div>
      )}

      {/* Final Verdict */}
      <p className={`text-lg font-semibold ${verdictColor}`}>
        Final Verdict: {finalLabel}
      </p>
    </div>
  );
}
