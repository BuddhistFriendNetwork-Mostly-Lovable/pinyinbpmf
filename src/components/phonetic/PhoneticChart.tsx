import { useState } from "react";
import { SettingsPanel, type DisplayMode } from "./SettingsPanel";
import { PhoneticTable } from "./PhoneticTable";
import { GotchaInfoDialog } from "./GotchaInfoDialog";
import { TTSInfoDialog } from "./TTSInfoDialog";
import { EnglishRhymeInfoDialog } from "./EnglishRhymeInfoDialog";
import { gotchaCategories, type GotchaCategory } from "@/data/phoneticData";
import type { AudioMode } from "@/hooks/useTTS";

export const PhoneticChart = () => {
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("both");
  const [highlightGotchas, setHighlightGotchas] = useState(true);
  const [activeGotchaCategories, setActiveGotchaCategories] = useState<Set<GotchaCategory>>(
    new Set(gotchaCategories.map((c) => c.id)),
  );
  const [gotchaInfoOpen, setGotchaInfoOpen] = useState(false);
  const [audioMode, setAudioMode] = useState<AudioMode>('zhuyin-comment');
  const [showMDBGPopup, setShowMDBGPopup] = useState(true);
  const [ttsInfoOpen, setTTSInfoOpen] = useState(false);
  const [showEnglishRhyme, setShowEnglishRhyme] = useState(true);
  const [englishRhymeInfoOpen, setEnglishRhymeInfoOpen] = useState(false);

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
        audioMode={audioMode}
        onAudioModeChange={setAudioMode}
        onOpenTTSInfo={() => setTTSInfoOpen(true)}
        showMDBGPopup={showMDBGPopup}
        onShowMDBGPopupChange={setShowMDBGPopup}
        showEnglishRhyme={showEnglishRhyme}
        onShowEnglishRhymeChange={setShowEnglishRhyme}
        onOpenEnglishRhymeInfo={() => setEnglishRhymeInfoOpen(true)}
        isOpen={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      <PhoneticTable
        displayMode={displayMode}
        highlightGotchas={highlightGotchas}
        activeGotchaCategories={activeGotchaCategories}
        audioMode={audioMode}
        showMDBGPopup={showMDBGPopup}
        showEnglishRhyme={showEnglishRhyme}
        onOpenEnglishRhymeInfo={() => setEnglishRhymeInfoOpen(true)}
      />

      <GotchaInfoDialog open={gotchaInfoOpen} onOpenChange={setGotchaInfoOpen} />
      <TTSInfoDialog open={ttsInfoOpen} onOpenChange={setTTSInfoOpen} />
      <EnglishRhymeInfoDialog open={englishRhymeInfoOpen} onOpenChange={setEnglishRhymeInfoOpen} />
    </div>
  );
};
