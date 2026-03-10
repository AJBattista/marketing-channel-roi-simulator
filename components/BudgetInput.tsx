"use client";

import { useState } from "react";

interface BudgetInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function BudgetInput({ value, onChange }: BudgetInputProps) {
  const [draft, setDraft] = useState(value.toString());
  const [focused, setFocused] = useState(false);

  const commit = (raw: string) => {
    const parsed = parseInt(raw.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(parsed) && parsed > 0) {
      onChange(parsed);
      setDraft(parsed.toString());
    } else {
      setDraft(value.toString());
    }
  };

  const display = focused
    ? draft
    : "$" + value.toLocaleString("en-US");

  return (
    <div>
      <label
        htmlFor="total-budget"
        className="block text-sm font-medium text-[#5A5A5A] mb-1"
      >
        Total Budget
      </label>
      <input
        id="total-budget"
        type="text"
        inputMode="decimal"
        value={display}
        onFocus={() => {
          setFocused(true);
          setDraft(value.toString());
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => {
          setFocused(false);
          commit(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="w-full min-h-[44px] rounded-lg border border-[#D8D2CA] bg-white px-3 py-2 text-sm text-[#1F1F1F]
                   focus:outline-none focus:ring-2 focus:ring-[#9E2F2F]/30 focus:border-[#C4BDB4]"
      />
    </div>
  );
}
