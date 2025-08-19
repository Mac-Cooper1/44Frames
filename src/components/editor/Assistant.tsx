"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

function Assistant() {
  const { addClip, splitAt, seek } = useAppStore((s) => ({ addClip: s.addClip, splitAt: s.splitAt, seek: s.seek }));
  const [value, setValue] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = value.trim();
    if (!cmd) return;
    if (cmd.startsWith("add ")) {
      const src = cmd.slice(4).trim();
      const id = `clip-${Date.now()}`;
      addClip({ id, src, duration: 5, in: 0, out: 5 });
    } else if (cmd.startsWith("split ")) {
      const t = parseFloat(cmd.slice(6));
      if (!Number.isNaN(t)) splitAt(t);
    } else if (cmd.startsWith("seek ")) {
      const t = parseFloat(cmd.slice(5));
      if (!Number.isNaN(t)) seek(t);
    }
    setValue("");
  };

  return (
    <div className="absolute bottom-4 right-4">
      <form onSubmit={onSubmit} className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-2 flex items-center gap-2">
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="assistant: add / split / seek" className="bg-transparent outline-none text-xs text-white w-56" />
        <button type="submit" className="text-xs text-blue-400">Run</button>
      </form>
    </div>
  );
}

export default Assistant;

