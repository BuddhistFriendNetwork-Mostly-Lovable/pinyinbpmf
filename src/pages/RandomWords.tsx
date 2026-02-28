import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Shuffle,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { WordCard, type WordCardDisplaySettings, type UserDifficulty } from "@/components/random/WordCard";
import {
  GenerateNwordsFromPinyin,
  DefaultPinyinList,
  PinyinListFromQuickPreset,
  EasyPreset,
  quickPresets,
  generateHiddenState,
  type RandomWordEntry,
  type HideMode,
  type QuickPreset,
} from "@/lib/randomWordsUtils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useTTS } from "@/hooks/useTTS";
import { toast } from "@/hooks/use-toast";
import { useSavedDifficulties, type SavedWordEntry } from "@/hooks/useSavedDifficulties";
import { ReviewModal } from "@/components/random/ReviewModal";
import { getTotalWordCount } from "@/data/lazyDataLoader";

const RandomWords = () => {
  // Total word count (lazy loaded)
  const [totalWordCount, setTotalWordCount] = useState<number | null>(null);
  useEffect(() => {
    getTotalWordCount().then(setTotalWordCount);
  }, []);

  // Display settings
  const [showOnlyFirstChar, setShowOnlyFirstChar] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showZhuyin, setShowZhuyin] = useState(true);
  const [zhuyinFormat, setZhuyinFormat] = useState<"boxes" | "plain">("boxes");
  const [speakFirstAutoReveal, setSpeakFirstAutoReveal] = useState(true);

  const [showEnglishSpeaker, setShowEnglishSpeaker] = useState(true);
  const [showChineseSpeaker, setShowChineseSpeaker] = useState(true);
  const [showMDBGWord, setShowMDBGWord] = useState(false);
  const [showMDBGPinyin, setShowMDBGPinyin] = useState(false);
  const [mdbgIgnoreTone, setMdbgIgnoreTone] = useState(true);

  // Hiding settings
  const [dontHideFirstN, setDontHideFirstN] = useState(false);
  const [firstN] = useState(4);
  const [randomizeHiding, setRandomizeHiding] = useState(false);
  const [hideChinese, setHideChinese] = useState<HideMode>("never");
  const [hideEnglish, setHideEnglish] = useState<HideMode>("sometimes");
  const [hidePinyin, setHidePinyin] = useState<HideMode>("never");
  const [hideZhuyin, setHideZhuyin] = useState<HideMode>("sometimes");

  // Collapsible states
  const [formattingOpen, setFormattingOpen] = useState(false);
  const [speechOpen, setSpeechOpen] = useState(false);
  const [hidingOpen, setHidingOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Preset state
  const [activePreset, setActivePreset] = useState<QuickPreset>(EasyPreset);
  const activePinyinList = useMemo(() => PinyinListFromQuickPreset(activePreset), [activePreset]);

  // Settings panel auto-collapse
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [autoCollapseCountdown, setAutoCollapseCountdown] = useState(5);
  const hasAutoCollapsed = useRef(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (hasAutoCollapsed.current || cancelledRef.current) return;
    if (autoCollapseCountdown <= 0) {
      setSettingsOpen(false);
      hasAutoCollapsed.current = true;
      setAutoCollapseCountdown(-1);
      toast({ description: "Settings hidden. Click 'Word Display Settings' to show again.", duration: 3000 });
      return;
    }
    const timer = setTimeout(() => setAutoCollapseCountdown((p) => p - 1), 1000);
    return () => clearTimeout(timer);
  }, [autoCollapseCountdown]);

  const handleCancelAutoCollapse = () => {
    cancelledRef.current = true;
    setAutoCollapseCountdown(-1);
  };

  // Words and hidden state
  const [words, setWords] = useState<RandomWordEntry[]>([]);
  const [hiddenRows, setHiddenRows] = useState<boolean[][]>([]);
  const [userDifficulties, setUserDifficulties] = useState<UserDifficulty[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [trainingMode, setTrainingMode] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const { saveDifficulties, getByDifficulty, hasSavedWords } = useSavedDifficulties();

  const { speak } = useTTS();

  // Generate initial words
  useEffect(() => {
    // Dynamic import to lazy load the big data file
    import("@/data/pinyinStubsToWordsData").then(() => {
      const generated = GenerateNwordsFromPinyin([], 4, activePinyinList);
      setWords(generated);
      setHiddenRows(
        generated.map((_, i) =>
          generateHiddenState(
            i,
            hideChinese,
            hideEnglish,
            hidePinyin,
            hideZhuyin,
            dontHideFirstN,
            firstN,
            randomizeHiding,
          ),
        ),
      );
      setUserDifficulties(generated.map(() => null));
      setIsLoaded(true);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReveal = useCallback((wordIndex: number, rowIndex: number) => {
    setHiddenRows((prev) => {
      const next = [...prev];
      next[wordIndex] = [...next[wordIndex]];
      if (rowIndex < 0) {
        // Negative index means hide: -1 => row 0, -2 => row 1, etc.
        next[wordIndex][-1 - rowIndex] = true;
      } else {
        next[wordIndex][rowIndex] = false;
      }
      return next;
    });
  }, []);

  const handleSpeak = useCallback(
    (text: string, lang: "zh" | "en") => {
      if (lang === "zh") {
        speak(text);
      } else {
        // Use browser TTS for English
        if ("speechSynthesis" in window) {
          speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "en-US";
          utterance.rate = 0.9;
          speechSynthesis.speak(utterance);
        }
      }
    },
    [speak],
  );

  const regenerateHiding = useCallback(() => {
    setHiddenRows(
      words.map((_, i) =>
        generateHiddenState(
          i,
          hideChinese,
          hideEnglish,
          hidePinyin,
          hideZhuyin,
          dontHideFirstN,
          firstN,
          randomizeHiding,
        ),
      ),
    );
  }, [words, hideChinese, hideEnglish, hidePinyin, hideZhuyin, dontHideFirstN, firstN, randomizeHiding]);

  const addMore = useCallback(() => {
    const newWords = GenerateNwordsFromPinyin(words, words.length + 5, activePinyinList);
    const newHidden = newWords
      .slice(words.length)
      .map((_, i) =>
        generateHiddenState(
          words.length + i,
          hideChinese,
          hideEnglish,
          hidePinyin,
          hideZhuyin,
          dontHideFirstN,
          firstN,
          randomizeHiding,
        ),
      );
    setWords(newWords);
    setHiddenRows((prev) => [...prev, ...newHidden]);
    setUserDifficulties((prev) => [...prev, ...newWords.slice(words.length).map(() => null as UserDifficulty)]);
  }, [
    words,
    hideChinese,
    hideEnglish,
    hidePinyin,
    hideZhuyin,
    dontHideFirstN,
    firstN,
    randomizeHiding,
    activePinyinList,
  ]);

  const randomizeAll = useCallback(() => {
    const generated = GenerateNwordsFromPinyin([], 4, activePinyinList);
    setWords(generated);
    setHiddenRows(
      generated.map((_, i) =>
        generateHiddenState(
          i,
          hideChinese,
          hideEnglish,
          hidePinyin,
          hideZhuyin,
          dontHideFirstN,
          firstN,
          randomizeHiding,
        ),
      ),
    );
    setUserDifficulties(generated.map(() => null));
    setTrainingMode(false);
  }, [hideChinese, hideEnglish, hidePinyin, hideZhuyin, dontHideFirstN, firstN, randomizeHiding, activePinyinList]);

  const handleSaveDifficulties = useCallback(() => {
    const count = saveDifficulties(words, userDifficulties);
    toast({ description: `Saved! ${count} total words in your collection.`, duration: 2000 });
  }, [words, userDifficulties, saveDifficulties]);

  const handleLoadTraining = useCallback(
    (savedEntries: SavedWordEntry[]) => {
      const asWords: RandomWordEntry[] = savedEntries.map((s) => ({
        h: s.h,
        ct: s.ct,
        cs: s.cs,
        e: s.e,
        fp: s.fp,
        t: s.t,
        pinyinStub: s.pinyinStub,
      }));
      setWords(asWords);
      setHiddenRows(
        asWords.map((_, i) =>
          generateHiddenState(
            i,
            hideChinese,
            hideEnglish,
            hidePinyin,
            hideZhuyin,
            dontHideFirstN,
            firstN,
            randomizeHiding,
          ),
        ),
      );
      setUserDifficulties(savedEntries.map((s) => s.difficulty));
      setTrainingMode(true);
    },
    [hideChinese, hideEnglish, hidePinyin, hideZhuyin, dontHideFirstN, firstN, randomizeHiding],
  );

  const showAllRows = useCallback(
    (rowIndex: number) => {
      setHiddenRows((prev) =>
        prev.map((h, i) => {
          if (dontHideFirstN && i < firstN) return h;
          const next = [...h];
          next[rowIndex] = false;
          return next;
        }),
      );
    },
    [dontHideFirstN, firstN],
  );

  const hideAllRows = useCallback(
    (rowIndex: number) => {
      setHiddenRows((prev) =>
        prev.map((h, i) => {
          if (dontHideFirstN && i < firstN) return h;
          const next = [...h];
          next[rowIndex] = true;
          return next;
        }),
      );
    },
    [dontHideFirstN, firstN],
  );

  const showEverything = useCallback(() => {
    setHiddenRows((prev) => prev.map(() => [false, false, false, false]));
  }, []);

  const lastHideAllTime = useRef<number>(0);

  const hideEverything = useCallback(() => {
    const now = Date.now();
    const doubleClick = now - lastHideAllTime.current < 3000;
    lastHideAllTime.current = now;

    setHiddenRows((prev) =>
      prev.map((h, i) => {
        if (dontHideFirstN && i < firstN) return h;
        if (doubleClick) return [true, true, true, true];
        return [h[0], true, true, true];
      }),
    );
  }, [dontHideFirstN, firstN]);

  const displaySettings: WordCardDisplaySettings = {
    showOnlyFirstChar,
    showPinyin,
    showZhuyin,
    zhuyinFormat,
    showEnglishSpeaker,
    showChineseSpeaker,
    showMDBGWord,
    showMDBGPinyin,
    mdbgIgnoreTone,
  };

  const ThreeWayToggle = ({
    label,
    value,
    onChange,
    rowIndex,
  }: {
    label: string;
    value: HideMode;
    onChange: (v: HideMode) => void;
    rowIndex: number;
  }) => (
    <div className="flex items-center gap-2 flex-wrap">
      <Label className="text-sm min-w-[140px]">{label}</Label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as HideMode)}
        variant="outline"
        size="sm"
      >
        <ToggleGroupItem value="always" className="text-xs px-2">
          Always
        </ToggleGroupItem>
        <ToggleGroupItem value="never" className="text-xs px-2">
          Never
        </ToggleGroupItem>
        <ToggleGroupItem value="sometimes" className="text-xs px-2">
          Sometimes
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => showAllRows(rowIndex)}>
          <Eye className="h-3 w-3 mr-1" /> Show all
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => hideAllRows(rowIndex)}>
          <EyeOff className="h-3 w-3 mr-1" /> Hide all
        </Button>
      </div>
    </div>
  );

  const CollapsibleSection = ({
    title,
    open,
    onOpenChange,
    children,
  }: {
    title: string;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    children: React.ReactNode;
  }) => (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 px-3 hover:bg-accent rounded-md text-sm font-medium">
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6 pr-3 pb-3 space-y-3">{children}</CollapsibleContent>
    </Collapsible>
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading word data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 py-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Chart
            </Button>
          </Link>
          <h1 className="text-2xl font-bold flex-1">Random Sounds Practice</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveDifficulties}>
              <Save className="h-4 w-4 mr-1" /> Save
              {/* Green Dot */}
              <span className="w-3 h-3 rounded-full bg-green-500" />
              {/* Yellow Dot (Using the hex code from your snippet) */}
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FBBF24" }} />
              {/* Red Dot */}
              <span className="w-3 h-3 rounded-full bg-red-500" />
            </Button>
            {hasSavedWords && (
              <Button variant="outline" size="sm" onClick={() => setReviewOpen(true)}>
                <BookOpen className="h-4 w-4 mr-1" /> Review
              </Button>
            )}
          </div>
        </div>

        {/* Settings */}
        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
          <Card className="mb-4">
            <CollapsibleTrigger className="w-full">
              <CardContent className="p-3 flex items-center justify-between cursor-pointer">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  {settingsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  Word Display Settings
                  {autoCollapseCountdown > 0 && (
                    <span className="text-xs text-muted-foreground font-normal">
                      (Auto-collapse in {autoCollapseCountdown}s.{" "}
                      <button
                        className="text-destructive hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelAutoCollapse();
                        }}
                      >
                        ❌
                      </button>
                      )
                    </span>
                  )}
                </h2>
              </CardContent>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-3 pt-0 space-y-1">
                <CollapsibleSection
                  title="Word Control / Formatting"
                  open={formattingOpen}
                  onOpenChange={setFormattingOpen}
                >
                  <div className="flex items-center gap-2">
                    <Switch checked={showOnlyFirstChar} onCheckedChange={setShowOnlyFirstChar} id="firstChar" />
                    <Label htmlFor="firstChar" className="text-sm">
                      Show only first character
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={showPinyin} onCheckedChange={setShowPinyin} id="pinyin" />
                    <Label htmlFor="pinyin" className="text-sm">
                      Show pinyin
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={showZhuyin} onCheckedChange={setShowZhuyin} id="zhuyin" />
                    <Label htmlFor="zhuyin" className="text-sm">
                      Show zhuyin
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Zhuyin format</Label>
                    <ToggleGroup
                      type="single"
                      value={zhuyinFormat}
                      onValueChange={(v) => v && setZhuyinFormat(v as "boxes" | "plain")}
                      variant="outline"
                      size="sm"
                    >
                      <ToggleGroupItem value="boxes" className="text-xs px-2">
                        3 Boxes
                      </ToggleGroupItem>
                      <ToggleGroupItem value="plain" className="text-xs px-2">
                        No Boxes
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={speakFirstAutoReveal} onCheckedChange={setSpeakFirstAutoReveal} id="autoReveal" />
                    <Label htmlFor="autoReveal" className="text-sm">
                      Speak first, auto-reveal 1s later
                    </Label>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Speech / Dictionary Links" open={speechOpen} onOpenChange={setSpeechOpen}>
                  <div className="flex items-center gap-2">
                    <Switch checked={showEnglishSpeaker} onCheckedChange={setShowEnglishSpeaker} id="enSpeak" />
                    <Label htmlFor="enSpeak" className="text-sm">
                      English speaker icon
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={showChineseSpeaker} onCheckedChange={setShowChineseSpeaker} id="zhSpeak" />
                    <Label htmlFor="zhSpeak" className="text-sm">
                      Chinese speaker icon
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={showMDBGWord} onCheckedChange={setShowMDBGWord} id="mdbgWord" />
                    <Label htmlFor="mdbgWord" className="text-sm">
                      MDBG link for word
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={showMDBGPinyin} onCheckedChange={setShowMDBGPinyin} id="mdbgPinyin" />
                    <Label htmlFor="mdbgPinyin" className="text-sm">
                      MDBG link for pinyin
                    </Label>
                  </div>
                  {showMDBGPinyin && (
                    <div className="flex items-center gap-2 pl-6">
                      <Switch checked={mdbgIgnoreTone} onCheckedChange={setMdbgIgnoreTone} id="ignoreTone" />
                      <Label htmlFor="ignoreTone" className="text-sm">
                        Ignore tone
                      </Label>
                    </div>
                  )}
                </CollapsibleSection>

                <CollapsibleSection title="Hiding" open={hidingOpen} onOpenChange={setHidingOpen}>
                  <div className="flex items-center gap-2">
                    <Switch checked={dontHideFirstN} onCheckedChange={setDontHideFirstN} id="dontHide" />
                    <Label htmlFor="dontHide" className="text-sm">
                      Don't hide first {firstN} words
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={randomizeHiding} onCheckedChange={setRandomizeHiding} id="randHide" />
                    <Label htmlFor="randHide" className="text-sm">
                      Randomize initial hiding
                    </Label>
                  </div>

                  <ThreeWayToggle label="Hide Chinese" value={hideChinese} onChange={setHideChinese} rowIndex={0} />
                  <ThreeWayToggle label="Hide English" value={hideEnglish} onChange={setHideEnglish} rowIndex={1} />
                  <ThreeWayToggle label="Hide Pinyin" value={hidePinyin} onChange={setHidePinyin} rowIndex={2} />
                  <ThreeWayToggle label="Hide Zhuyin" value={hideZhuyin} onChange={setHideZhuyin} rowIndex={3} />

                  <Button variant="outline" size="sm" onClick={regenerateHiding}>
                    <Shuffle className="h-3 w-3 mr-1" /> Randomize hiding now
                  </Button>
                </CollapsibleSection>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Word Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
          {words.map((word, i) => (
            <WordCard
              key={`${word.ct}-${word.pinyinStub}-${i}`}
              word={word}
              hidden={hiddenRows[i] || [false, false, false, false]}
              settings={displaySettings}
              userDifficulty={userDifficulties[i] ?? null}
              onReveal={(rowIndex) => handleReveal(i, rowIndex)}
              onSpeak={handleSpeak}
              onSetDifficulty={(d) =>
                setUserDifficulties((prev) => {
                  const next = [...prev];
                  next[i] = d;
                  return next;
                })
              }
              onRemove={() => {
                setWords((prev) => prev.filter((_, idx) => idx !== i));
                setHiddenRows((prev) => prev.filter((_, idx) => idx !== i));
                setUserDifficulties((prev) => prev.filter((_, idx) => idx !== i));
              }}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap justify-center mb-6">
          {trainingMode ? (
            <span className="text-sm font-semibold text-muted-foreground px-4 py-2 border rounded-md bg-muted">
              TRAINING
            </span>
          ) : (
            <>
              {words.length < 10 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const target = 10;
                    const newWords = GenerateNwordsFromPinyin(words, target, activePinyinList);
                    const newHidden = newWords
                      .slice(words.length)
                      .map((_, i) =>
                        generateHiddenState(
                          words.length + i,
                          hideChinese,
                          hideEnglish,
                          hidePinyin,
                          hideZhuyin,
                          dontHideFirstN,
                          firstN,
                          randomizeHiding,
                        ),
                      );
                    setWords(newWords);
                    setHiddenRows((prev) => [...prev, ...newHidden]);
                    setUserDifficulties((prev) => [
                      ...prev,
                      ...newWords.slice(words.length).map(() => null as UserDifficulty),
                    ]);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> More Words (10)
                </Button>
              )}
              {words.length >= 10 && (
                <Button variant="outline" onClick={addMore}>
                  <Plus className="h-4 w-4 mr-1" /> Add 5 more
                </Button>
              )}
              <Button variant="outline" onClick={randomizeAll}>
                <RefreshCw className="h-4 w-4 mr-1" /> Random New Words
              </Button>
            </>
          )}
          <Button variant="outline" onClick={showEverything} disabled={words.length <= 2}>
            <Eye className="h-4 w-4 mr-1" /> Show All
          </Button>
          <Button variant="outline" onClick={hideEverything} disabled={words.length <= 2}>
            <EyeOff className="h-4 w-4 mr-1" /> Hide All
          </Button>
        </div>

        {/* Filters & Restrictions */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <Card className="mb-4">
            <CollapsibleTrigger className="w-full">
              <CardContent className="p-3 flex items-center justify-between cursor-pointer">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  {filtersOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  🔧 Filters & Restrictions
                </h2>
              </CardContent>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-3 pt-0">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Quick Menu</p>
                <div className="flex flex-wrap gap-2">
                  {quickPresets.map((preset) => (
                    <div key={preset.name} className="flex items-center gap-1">
                      <Button
                        variant={activePreset.name === preset.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setActivePreset(preset);
                          // Trigger regeneration with this preset's list
                          const newList = PinyinListFromQuickPreset(preset);
                          const generated = GenerateNwordsFromPinyin([], 4, newList);
                          setWords(generated);
                          setHiddenRows(
                            generated.map((_, i) =>
                              generateHiddenState(
                                i,
                                hideChinese,
                                hideEnglish,
                                hidePinyin,
                                hideZhuyin,
                                dontHideFirstN,
                                firstN,
                                randomizeHiding,
                              ),
                            ),
                          );
                          setUserDifficulties(generated.map(() => null));
                          setTrainingMode(false);
                        }}
                      >
                        {preset.name}
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <HelpCircle className="h-3.5 w-3.5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="text-sm whitespace-pre-line max-w-sm">
                          <p className="font-semibold mb-1">{preset.name}</p>
                          <p className="text-xs text-muted-foreground">{preset.notes}</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
        <br></br>
        <ReviewModal
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          getByDifficulty={getByDifficulty}
          onLoadTraining={handleLoadTraining}
        />
        {totalWordCount !== null && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Total words in database: {totalWordCount.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default RandomWords;
