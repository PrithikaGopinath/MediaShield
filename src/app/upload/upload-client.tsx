"use client";

import { useState } from "react";
import ResultCard from "../../../components/ResultCard";


export default function UploadClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Detection failed");

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-semibold">MediaShield AI Image Check</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-600"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-sm font-medium"
          >
            {loading ? "Analyzing..." : "Run AI Detection"}
          </button>
        </form>

        {/* NEW RESULT CARD */}
        {result && <ResultCard result={result} />}
      </div>
    </main>
  );
}
