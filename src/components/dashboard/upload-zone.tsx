"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onUrlSubmit: (url: string) => void;
}

export function UploadZone({ onFileSelect, onUrlSubmit }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"upload" | "link">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onUrlSubmit(url.trim());
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "upload"
              ? "bg-white text-brand-text shadow-sm"
              : "text-brand-muted hover:text-brand-text"
          }`}
        >
          Upload file
        </button>
        <button
          onClick={() => setMode("link")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "link"
              ? "bg-white text-brand-text shadow-sm"
              : "text-brand-muted hover:text-brand-text"
          }`}
        >
          Paste link
        </button>
      </div>

      {mode === "upload" ? (
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-card border-2 border-dashed p-12 text-center transition-all ${
            isDragging
              ? "border-brand-primary bg-brand-primary/5"
              : "border-brand-border hover:border-brand-primary/50 hover:bg-white"
          }`}
          style={{
            backdropFilter: "blur(8px)",
            background: isDragging
              ? "rgba(79, 70, 229, 0.03)"
              : "rgba(255, 255, 255, 0.6)",
          }}
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.2 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-brand-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1">
            Drop your video here, or click to browse
          </p>
          <p className="text-xs text-brand-muted">
            MP4, MOV, AVI, MKV up to 2GB
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleUrlSubmit} className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a YouTube, Vimeo, or direct video link..."
            className="flex-1 px-4 py-3 rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-medium transition-colors"
          >
            Fetch
          </button>
        </form>
      )}
    </div>
  );
}
