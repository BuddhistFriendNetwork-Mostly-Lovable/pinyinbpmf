import { ChevronDown, ChevronUp, Settings, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { gotchaCategories, type GotchaCategory } from "@/data/phoneticData";
import { cn } from "@/lib/utils";
import type { AudioMode } from "@/hooks/useTTS";

export type DisplayMode = "zhuyin" | "pinyin" | "both";

const TEXT_SIZE_STEPS = [50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200];

interface SettingsPanelProps {
  autoMinimizeCountdown: number;
  onCancelAutoMinimize: () => void;
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
  highlightGotchas: boolean;
  onHighlightGotchasChange: (enabled: boolean) => void;
  activeGotchaCategories: Set<GotchaCategory>;
  onGotchaCategoryToggle: (category: GotchaCategory) => void;
  onOpenGotchaInfo: () => void;
  audioMode: AudioMode;
  onAudioModeChange: (mode: AudioMode) => void;
  onOpenTTSInfo: () => void;
  showMDBGPopup: boolean;
  onShowMDBGPopupChange: (enabled: boolean) => void;
  showChineseWords: boolean;
  onShowChineseWordsChange: (enabled: boolean) => void;
  showEnglishRhyme: boolean;
  onShowEnglishRhymeChange: (enabled: boolean) => void;
  onOpenEnglishRhymeInfo: () => void;
  showDangerGuess: boolean;
  onShowDangerGuessChange: (enabled: boolean) => void;
  onOpenDangerGuessInfo: () => void;
  tableTextSize: number;
  onTableTextSizeChange: (size: number) => void;
  tableBold: boolean;
  onTableBoldChange: (bold: boolean) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsPanel = ({
  autoMinimizeCountdown,
  onCancelAutoMinimize,
  displayMode,
  onDisplayModeChange,
  highlightGotchas,
  onHighlightGotchasChange,
  activeGotchaCategories,
  onGotchaCategoryToggle,
  onOpenGotchaInfo,
  audioMode,
  onAudioModeChange,
  onOpenTTSInfo,
  showMDBGPopup,
  onShowMDBGPopupChange,
  showChineseWords,
  onShowChineseWordsChange,
  showEnglishRhyme,
  onShowEnglishRhymeChange,
  onOpenEnglishRhymeInfo,
  showDangerGuess,
  onShowDangerGuessChange,
  onOpenDangerGuessInfo,
  tableTextSize,
  onTableTextSizeChange,
  tableBold,
  onTableBoldChange,
  isOpen,
  onOpenChange,
}: SettingsPanelProps) => {
  const handleDecrease = () => {
    const currentIndex = TEXT_SIZE_STEPS.indexOf(tableTextSize);
    if (currentIndex > 0) {
      onTableTextSizeChange(TEXT_SIZE_STEPS[currentIndex - 1]);
    }
  };

  const handleIncrease = () => {
    const currentIndex = TEXT_SIZE_STEPS.indexOf(tableTextSize);
    if (currentIndex < TEXT_SIZE_STEPS.length - 1) {
      onTableTextSizeChange(TEXT_SIZE_STEPS[currentIndex + 1]);
    }
  };
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="mb-4">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
            {autoMinimizeCountdown > 0 && (
              <span className="text-foreground/50 text-xs font-normal flex items-center gap-1">
                (Auto-minimize in {autoMinimizeCountdown}s.{" "}
                <span
                  className="cursor-pointer hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelAutoMinimize();
                  }}
                >
                  ❌
                </span>
                )
              </span>
            )}
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-4 rounded-lg border bg-card p-4">
        {/* Display Mode */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Display Mode</Label>
          <div className="flex flex-wrap gap-2">
            {(["zhuyin", "pinyin", "both"] as DisplayMode[]).map((mode) => (
              <Button
                key={mode}
                variant={displayMode === mode ? "default" : "outline"}
                size="sm"
                onClick={() => onDisplayModeChange(mode)}
                className="capitalize"
              >
                {mode === "both" ? "Both" : mode === "zhuyin" ? "Zhuyin Only" : "Pinyin Only"}
              </Button>
            ))}
          </div>
        </div>

        {/* Highlight Gotchas Toggle */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Switch id="highlight-gotchas" checked={highlightGotchas} onCheckedChange={onHighlightGotchasChange} />
            <Label htmlFor="highlight-gotchas" className="text-sm font-medium cursor-pointer">
              Highlight Gotchas
            </Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:text-foreground"
              onClick={onOpenGotchaInfo}
            >
              ?
            </Button>
          </div>

          {/* Gotcha Category Checkboxes */}
          {highlightGotchas && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {gotchaCategories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <Checkbox
                    id={category.id}
                    checked={activeGotchaCategories.has(category.id)}
                    onCheckedChange={() => onGotchaCategoryToggle(category.id)}
                  />
                  <Label
                    htmlFor={category.id}
                    className={cn(
                      "cursor-pointer text-xs px-2 py-0.5 rounded",
                      activeGotchaCategories.has(category.id) && category.bgClass,
                    )}
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Show Chinese Words Toggle */}
        <div className="flex items-center gap-3">
          <Switch id="show-chinese-words" checked={showChineseWords} onCheckedChange={onShowChineseWordsChange} />
          <Label htmlFor="show-chinese-words" className="text-sm font-medium cursor-pointer">
            Show Chinese Rhyme Words
          </Label>
        </div>

        {/* Show English Rhyme Words Toggle */}
        <div className="flex items-center gap-3">
          <Switch id="show-english-rhyme" checked={showEnglishRhyme} onCheckedChange={onShowEnglishRhymeChange} />
          <Label htmlFor="show-english-rhyme" className="text-sm font-medium cursor-pointer">
            Show English Rhyme Words
          </Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:text-foreground"
            onClick={onOpenEnglishRhymeInfo}
          >
            ?
          </Button>
        </div>

        {/* Show English Guess Dangers Toggle */}
        <div className="flex items-center gap-3">
          <Switch id="show-danger-guess" checked={showDangerGuess} onCheckedChange={onShowDangerGuessChange} />
          <Label htmlFor="show-danger-guess" className="text-sm font-medium cursor-pointer">
            Show English Guess 🛑 Danger 🛑
          </Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:text-foreground"
            onClick={onOpenDangerGuessInfo}
          >
            ?
          </Button>
        </div>

        {/* Table Text Size and Bold Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <Label className="text-sm font-medium">Table Text Size:</Label>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleDecrease}
              disabled={tableTextSize === TEXT_SIZE_STEPS[0]}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-12 text-center text-sm font-medium">{tableTextSize}%</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleIncrease}
              disabled={tableTextSize === TEXT_SIZE_STEPS[TEXT_SIZE_STEPS.length - 1]}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          {tableTextSize !== 100 && (
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => onTableTextSizeChange(100)}>
              Reset to 100%
            </Button>
          )}
          <div className="flex items-center gap-2 ml-2">
            <Switch id="table-bold" checked={tableBold} onCheckedChange={onTableBoldChange} />
            <Label htmlFor="table-bold" className="text-sm font-medium cursor-pointer">
              Bold
            </Label>
          </div>
        </div>

        {/* Other Settings Collapsible */}
        <Collapsible defaultOpen={false} className="space-y-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto font-medium text-sm">
              <span>Other Settings</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]>svg]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-2">
            {/* Audio Section */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Chart Audio</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={audioMode === "zhuyin-comment" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onAudioModeChange("zhuyin-comment")}
                >
                  Pinyin{" "}
                  <span
                    className="ml-1 text-xs underline cursor-pointer opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTTSInfo();
                    }}
                  >
                    (uses TTS ?)
                  </span>
                </Button>
                <Button
                  variant={audioMode === "zhuyin-separate" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onAudioModeChange("zhuyin-separate")}
                >
                  Zhuyin Separate{" "}
                  <span
                    className="ml-1 text-xs underline cursor-pointer opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTTSInfo();
                    }}
                  >
                    (uses TTS ?)
                  </span>
                </Button>
                <Button
                  variant={audioMode === "none" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onAudioModeChange("none")}
                >
                  None
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <p>
                  Planned features 2026:
                  <ul>
                    <li>Speak and show the most common word with each pinyin/zhuyin.</li>
                    <li>Allow specifying tone</li>
                    <li>Use mp3s of audio rather than TTS</li>
                  </ul>
                </p>
              </div>
            </div>

            {/* Popup Section */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Popup</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="mdbg-popup"
                  checked={showMDBGPopup}
                  onCheckedChange={(checked) => onShowMDBGPopupChange(checked === true)}
                />
                <Label htmlFor="mdbg-popup" className="cursor-pointer text-sm">
                  Show the popup. This searches for pinyin/zhuyin on MDBG dictionary. And shows common words with the
                  pinyin stub.
                </Label>
              </div>
              <div className="flex flex-wrap gap-2">
                <p>
                  Planned features 2026:
                  <ul>
                    <li>Show the top 5 most common words with each pinyin/zhuyin.</li>
                    <li>Show word examples for each tone (clickable to MDBG)</li>
                  </ul>
                </p>
              </div>
            </div>

            {/* Game Section */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Game</Label>
              <div className="flex flex-wrap gap-2">
                <p>
                  Planned/wishlist features 2026: Make a game where a word is spoken and you have to search for the
                  right pinyin/zhuyin cell.
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CollapsibleContent>
    </Collapsible>
  );
};
