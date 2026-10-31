"use client";

import { useState } from "react";
import NcmResearchDemo from "./NcmResearchDemo";
import SudokuDemo from "./SudokuDemo";

export default function ConceptFirewallDemo() {
  const [mode, setMode] = useState<"research" | "cli">("research");
  return <div className="concept-firewall-demo">
    <div className="concept-demo-modes" role="group" aria-label="Choose Concept Firewall demo">
      <button type="button" aria-pressed={mode === "research"} onClick={() => setMode("research")}>NCM research replay</button>
      <button type="button" aria-pressed={mode === "cli"} onClick={() => setMode("cli")}>Separate exact-solver CLI</button>
    </div>
    {mode === "research" ? <NcmResearchDemo /> : <SudokuDemo />}
  </div>;
}
