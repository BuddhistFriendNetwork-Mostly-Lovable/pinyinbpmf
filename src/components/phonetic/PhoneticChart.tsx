import { useState, useEffect, useRef } from "react";
import { HelpCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsPanel, type DisplayMode } from "./SettingsPanel";
import { PhoneticTable } from "./PhoneticTable";
import { GotchaInfoDialog } from "./GotchaInfoDialog";
import { TTSInfoDialog } from "./TTSInfoDialog";
import { EnglishRhymeInfoDialog } from "./EnglishRhymeInfoDialog";
import { DangerGuessInfoDialog } from "./DangerGuessInfoDialog";
import { HelpDialog } from "./HelpDialog";
import { ImageViewerDialog } from "./ImageViewerDialog";
import { gotchaCategories, type GotchaCategory } from "@/data/phoneticData";
import type { AudioMode } from "@/hooks/useTTS";
import { toast } from "@/hooks/use-toast";
import pinyinChartExample from "@/assets/pinyin-chart-example.png";

export const PhoneticChart = () => {
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [autoMinimizeCountdown, setAutoMinimizeCountdown] = useState(5);
  const hasAutoHidden = useRef(false);
  const cancelledRef = useRef(false);

  // Countdown timer for auto-hide
  useEffect(() => {
    if (hasAutoHidden.current || cancelledRef.current) return;

    if (autoMinimizeCountdown <= 0) {
      setSettingsOpen(false);
      hasAutoHidden.current = true;
      setAutoMinimizeCountdown(-1);
      toast({
        description: "Settings hidden. Click `Settings` to show again.",
        duration: 3000,
      });
      return;
    }

    const timer = setTimeout(() => {
      setAutoMinimizeCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoMinimizeCountdown]);

  const handleCancelAutoMinimize = () => {
    cancelledRef.current = true;
    setAutoMinimizeCountdown(-1);
  };
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
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [showDangerGuess, setShowDangerGuess] = useState(false);
  const [dangerGuessInfoOpen, setDangerGuessInfoOpen] = useState(false);
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
        autoMinimizeCountdown={autoMinimizeCountdown}
        onCancelAutoMinimize={handleCancelAutoMinimize}
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
        showDangerGuess={showDangerGuess}
        onShowDangerGuessChange={setShowDangerGuess}
        onOpenDangerGuessInfo={() => setDangerGuessInfoOpen(true)}
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
        showDangerGuess={showDangerGuess}
        tableTextSize={tableTextSize}
        tableBold={tableBold}
      />

      <div className="mt-8 mb-4 text-center space-y-3">
        <Button variant="outline" size="sm" onClick={() => setImageViewerOpen(true)}>
          <Download className="h-4 w-4 mr-2" />
          Download PNG Chart
        </Button>
        <br></br>
        <div>
          <a href="/random-words" className="text-sm text-primary underline hover:text-primary/80">
            🎲 Random Words Practice →
          </a>
        </div>
        <br></br>
        <div>
          <a href="/vowel-trainer" className="text-sm text-primary underline hover:text-primary/80">
            Vowel Trainer 🅰️ 🅾️ →
          </a>
        </div>
      </div>

      <GotchaInfoDialog open={gotchaInfoOpen} onOpenChange={setGotchaInfoOpen} />
      <TTSInfoDialog open={ttsInfoOpen} onOpenChange={setTTSInfoOpen} />
      <EnglishRhymeInfoDialog open={englishRhymeInfoOpen} onOpenChange={setEnglishRhymeInfoOpen} />
      <DangerGuessInfoDialog open={dangerGuessInfoOpen} onOpenChange={setDangerGuessInfoOpen} />
      <HelpDialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen} />
      <ImageViewerDialog
        open={imageViewerOpen}
        onOpenChange={setImageViewerOpen}
        src={pinyinChartExample}
        alt="Pinyin-Zhuyin conversion chart"
      />
    </div>
  );
};
