"use client";

import { useState } from "react";
import { LANGUAGES, FREE_LANGUAGES, type LanguageCode } from "@/lib/constants/languages";

interface LanguageSelectorProps {
  value: LanguageCode | "";
  onChange: (code: LanguageCode) => void;
  tier: string;
}

export function LanguageSelector({ value, onChange, tier }: LanguageSelectorProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = LANGUAGES.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = LANGUAGES.find((l) => l.code === value);
  const isFree = tier === "free";

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1.5">Target language</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-brand-border bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className={selected ? "text-brand-text" : "text-brand-muted"}>
          {selected ? `${selected.flag} ${selected.name}` : "Select a language..."}
        </span>
        <svg className="w-4 h-4 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white rounded-xl border border-brand-border shadow-lg max-h-64 overflow-hidden">
          <div className="p-2 border-b border-brand-border">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search languages..."
              className="w-full px-3 py-2 rounded-lg bg-gray-50 text-sm focus:outline-none"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {filtered.map((lang) => {
              const locked = isFree && !FREE_LANGUAGES.includes(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    if (!locked) {
                      onChange(lang.code);
                      setIsOpen(false);
                      setSearch("");
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  } ${value === lang.code ? "bg-brand-primary/5 text-brand-primary" : ""}`}
                >
                  <span>
                    {lang.flag} {lang.name}
                  </span>
                  {locked && (
                    <span className="text-xs bg-gray-100 text-brand-muted px-2 py-0.5 rounded-full">
                      Pro
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
