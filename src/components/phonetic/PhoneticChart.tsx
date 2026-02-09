import { useState, useEffect, useRef } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsPanel, type DisplayMode } from "./SettingsPanel";
import { PhoneticTable } from "./PhoneticTable";
import { GotchaInfoDialog } from "./GotchaInfoDialog";
import { TTSInfoDialog } from "./TTSInfoDialog";
import { EnglishRhymeInfoDialog } from "./EnglishRhymeInfoDialog";
import { HelpDialog } from "./HelpDialog";
import { gotchaCategories, type GotchaCategory } from "@/data/phoneticData";
import type { AudioMode } from "@/hooks/useTTS";
import { toast } from "@/hooks/use-toast";

export const PhoneticChart = () => {
  const [settingsOpen, setSettingsOpen] = useState(true);
  const hasAutoHidden = useRef(false);

  // Auto-hide settings after 5 seconds on initial load
  useEffect(() => {
    if (hasAutoHidden.current) return;

    const timer = setTimeout(() => {
      setSettingsOpen(false);
      hasAutoHidden.current = true;
      toast({
        description: "Settings Hidden after 5 seconds. Click Settings to Show Again.",
        duration: 4000,
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("both");
  const [highlightGotchas, setHighlightGotchas] = useState(true);
  const [activeGotchaCategories, setActiveGotchaCategories] = useState<Set<GotchaCategory>>(
    new Set(gotchaCategories.map((c) => c.id)),
  );
  const [gotchaInfoOpen, setGotchaInfoOpen] = useState(false);
  const [audioMode, setAudioMode] = useState<AudioMode>("zhuyin-comment");
  const [showMDBGPopup, setShowMDBGPopup] = useState(true);
  const [ttsInfoOpen, setTTSInfoOpen] = useState(false);
  const [showChineseWords, setShowChineseWords] = useState(true);
  const [showEnglishRhyme, setShowEnglishRhyme] = useState(true);
  const [englishRhymeInfoOpen, setEnglishRhymeInfoOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [tableTextSize, setTableTextSize] = useState(100);
  const [tableBold, setTableBold] = useState(true);

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
    <div className="container mx-auto px-1.5 py-2">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Pinyin ↔ Zhuyin Conversion Chart</h1>
        <p className="mt-2 text-muted-foreground">Interactive learning tool for Mandarin Chinese phonetics</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => setHelpDialogOpen(true)}>
          <HelpCircle className="h-4 w-4 mr-2" />
          I'm Confused! Help!
        </Button>
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
        showChineseWords={showChineseWords}
        onShowChineseWordsChange={setShowChineseWords}
        showEnglishRhyme={showEnglishRhyme}
        onShowEnglishRhymeChange={setShowEnglishRhyme}
        onOpenEnglishRhymeInfo={() => setEnglishRhymeInfoOpen(true)}
        tableTextSize={tableTextSize}
        onTableTextSizeChange={setTableTextSize}
        tableBold={tableBold}
        onTableBoldChange={setTableBold}
        isOpen={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      <PhoneticTable
        displayMode={displayMode}
        highlightGotchas={highlightGotchas}
        activeGotchaCategories={activeGotchaCategories}
        audioMode={audioMode}
        showMDBGPopup={showMDBGPopup}
        showChineseWords={showChineseWords}
        showEnglishRhyme={showEnglishRhyme}
        onOpenEnglishRhymeInfo={() => setEnglishRhymeInfoOpen(true)}
        tableTextSize={tableTextSize}
        tableBold={tableBold}
      />

      <GotchaInfoDialog open={gotchaInfoOpen} onOpenChange={setGotchaInfoOpen} />
      <TTSInfoDialog open={ttsInfoOpen} onOpenChange={setTTSInfoOpen} />
      <EnglishRhymeInfoDialog open={englishRhymeInfoOpen} onOpenChange={setEnglishRhymeInfoOpen} />
      <HelpDialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen} />
    </div>
  );
};
