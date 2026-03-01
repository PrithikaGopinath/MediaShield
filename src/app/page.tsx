"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/detect", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-8 gap-6 bg-white text-black">
      <h1 className="text-3xl font-bold">MediaShield Detection</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border p-2 rounded text-black bg-white"
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-64 h-64 object-cover rounded shadow"
        />
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Analyzing..." : "Run Detection"}
      </button>

      {result && (
        <div className="w-full max-w-md mt-6 p-4 border rounded shadow bg-white text-black">
          <h2 className="text-xl font-semibold mb-4">Results</h2>

          <p className="text-lg font-bold mb-4">
            Final Verdict:{" "}
            <span
              className={
                result.final_label === "AI-generated"
                  ? "text-red-700 font-extrabold"
                  : result.final_label === "Deepfake"
                    ? "text-orange-700 font-extrabold"
                    : result.final_label === "Real"
                      ? "text-green-700 font-extrabold"
                      : "text-gray-800 font-extrabold"
              }
            >
              {result.final_label}
            </span>
          </p>

          <div className="mb-4">
            <p className="font-medium">
              AI-generated Score: {(result.ai_generated_score * 100).toFixed(1)}%
            </p>
            <div className="w-full bg-gray-300 h-4 rounded">
              <div
                className="bg-red-600 h-4 rounded"
                style={{ width: `${result.ai_generated_score * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <p className="font-medium">
              Deepfake Score: {(result.deepfake_score * 100).toFixed(1)}%
            </p>
            <div className="w-full bg-gray-300 h-4 rounded">
              <div
                className="bg-orange-600 h-4 rounded"
                style={{ width: `${result.deepfake_score * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
