import { useState } from "react";
import { SettingsPanel, type DisplayMode } from "./SettingsPanel";
import { PhoneticTable } from "./PhoneticTable";
import { GotchaInfoDialog } from "./GotchaInfoDialog";
import { gotchaCategories, type GotchaCategory } from "@/data/phoneticData";

export const PhoneticChart = () => {
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("both");
  const [highlightGotchas, setHighlightGotchas] = useState(true);
  const [activeGotchaCategories, setActiveGotchaCategories] = useState<Set<GotchaCategory>>(
    new Set(gotchaCategories.map((c) => c.id)),
  );
  const [gotchaInfoOpen, setGotchaInfoOpen] = useState(false);

  const handleGotchaCategoryToggle = (category: GotchaCategory) => {
    setActiveGotchaCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Pinyin ↔ Zhuyin Conversion Chart</h1>
        <p className="mt-2 text-muted-foreground">Interactive learning tool for Mandarin Chinese phonetics</p>
      </header>

      <SettingsPanel
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
        highlightGotchas={highlightGotchas}
        onHighlightGotchasChange={setHighlightGotchas}
        activeGotchaCategories={activeGotchaCategories}
        onGotchaCategoryToggle={handleGotchaCategoryToggle}
        onOpenGotchaInfo={() => setGotchaInfoOpen(true)}
        isOpen={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      <PhoneticTable
        displayMode={displayMode}
        highlightGotchas={highlightGotchas}
        activeGotchaCategories={activeGotchaCategories}
      />

      <GotchaInfoDialog open={gotchaInfoOpen} onOpenChange={setGotchaInfoOpen} />
    </div>
  );
};
