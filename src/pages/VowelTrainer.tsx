import { useState, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, ChevronDown, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { WordCard, type WordCardDisplaySettings, type UserDifficulty } from "@/components/random/WordCard";
import { getAllEndingKeys, getChineseWords, type ChineseWordEntry } from "@/data/chineseWordsData";
import { cleanPinyin, stripToneMarks } from "@/lib/zhuyinUtils";
import { useTTS } from "@/hooks/useTTS";
import type { RandomWordEntry } from "@/lib/randomWordsUtils";

interface VowelTrainerEntry extends RandomWordEntry {
  ending: string;
}

const LS_KEY = "vowel-trainer-selected-endings";
const LS_MODE_KEY = "vowel-trainer-select-mode";

const allPinyinFinals = [
  "a",
  "ai",
  "ao",
  "an",
  "ang",
  "e",
  "ei",
  "en",
  "eng",
  "er",
  "i",
  "ia",
  "iao",
  "ie",
  "iu",
  "ian",
  "in",
  "iang",
  "ing",
  "iong",
  "o",
  "ong",
  "ou",
  "u",
  "ua",
  "uo",
  "uai",
  "ui",
  "uan",
  "un",
  "uang",
  "ü",
  "üe",
  "üan",
  "ün",
];

const QUICK_SELECTS = {
  medials: { label: "Medials", keys: ["i", "u", "ü"] },
  finalMono: { label: "Final Mono(ph)thongs", keys: ["a", "e", "o"] },
  finalDip: { label: "Final Di(ph)thongs", keys: ["ai", "ei", "ao", "ou"] },
  finalNasal: { label: "Final Nasals (n, ng)", keys: ["an", "en", "ang", "eng"] },
  comboMono: { label: "Combo Mono", keys: ["ia", "ie", "ua", "uo", "üe"] },
  comboDip: { label: "Combo Dip", keys: ["iao", "iu", "uai", "ui"] },
  comboNasal: { label: "Combo Nasal", keys: ["ian", "in", "iang", "ing", "uan", "un", "uang", "üan", "ün", "iong"] },
  iMedial: { label: "i + Finals", keys: ["i", "ia", "ie", "iao", "iu", "ian", "in", "iang", "ing", "iong"] },
  uMedial: { label: "u + Finals", keys: ["ua", "uo", "uai", "ui", "uan", "un", "uang"] },
  üMedial: { label: "ü + Finals", keys: ["ü", "iong", "üe", "üan", "ün"] },
  all: { label: "All", keys: allPinyinFinals },
} as const;

type QuickSelectId = keyof typeof QUICK_SELECTS;
type SelectMode = "one" | "many";

function loadSelected(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  // Default to medials
  return new Set(QUICK_SELECTS.medials.keys);
}

function loadMode(): SelectMode {
  try {
    const raw = localStorage.getItem(LS_MODE_KEY);
    if (raw === "one" || raw === "many") return raw;
  } catch {}
  return "many";
}

function saveSelected(s: Set<string>) {
  localStorage.setItem(LS_KEY, JSON.stringify([...s]));
}

function saveMode(m: SelectMode) {
  localStorage.setItem(LS_MODE_KEY, m);
}

/** Check if a set exactly matches a quickselect's keys */
function detectQuickSelect(selected: Set<string>, allKeys: string[]): QuickSelectId | null {
  for (const [id, qs] of Object.entries(QUICK_SELECTS)) {
    const validKeys = qs.keys.filter((k) => allKeys.includes(k));
    if (validKeys.length === selected.size && validKeys.every((k) => selected.has(k))) {
      return id as QuickSelectId;
    }
  }
  return null;
}

function toVowelTrainerEntry(entry: ChineseWordEntry, ending: string): VowelTrainerEntry {
  const parts = entry.w.split(",");
  const ct = parts[0];
  const cs = parts.length > 1 ? parts[1] : ct;
  const firstSyllable = entry.short || entry.p;
  const stub = cleanPinyin(stripToneMarks(firstSyllable));
  return { cs, ct, e: entry.m, fp: entry.p, pinyinStub: stub, h: -9, t: -9, ending };
}

/** Generate N distinct colors by varying hue and alternating lightness */
function generateEndingColors(n: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < n; i++) {
    const hue = Math.round((i * 360) / n) % 360;
    const lightness = i % 2 === 0 ? 88 : 78;
    const saturation = i % 3 === 0 ? 55 : 70;
    colors.push(`hsl(${hue} ${saturation}% ${lightness}%)`);
  }
  return colors;
}

const displaySettings: WordCardDisplaySettings = {
  showOnlyFirstChar: false,
  showPinyin: true,
  showZhuyin: true,
  zhuyinFormat: "boxes",
  showEnglishSpeaker: false,
  showChineseSpeaker: true,
  showMDBGWord: false,
  showMDBGPinyin: false,
  mdbgIgnoreTone: false,
  showDifficultyDots: false,
};

const VowelTrainer = () => {
  const [selectedEndings, setSelectedEndings] = useState<Set<string>>(loadSelected);
  const [selectMode, setSelectMode] = useState<SelectMode>(loadMode);
  const [activeQuickSelect, setActiveQuickSelect] = useState<QuickSelectId | null>(() => {
    const sel = loadSelected();
    const allKeys = getAllEndingKeys();
    return detectQuickSelect(sel, allKeys);
  });
  const [combosOpen, setCombosOpen] = useState(false);
  const [quickSelectsOpen, setQuickSelectsOpen] = useState(false);
  const [removedKeys, setRemovedKeys] = useState<Set<string>>(new Set());
  const [hiddenRows, setHiddenRows] = useState<Record<string, boolean[]>>({});
  const { speak } = useTTS();
  const allKeys = useMemo(() => getAllEndingKeys(), []);
  const endingColors = useMemo(() => generateEndingColors(allKeys.length), [allKeys]);
  const endingColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    allKeys.forEach((key, i) => {
      map[key] = endingColors[i];
    });
    return map;
  }, [allKeys, endingColors]);
  const lastHideAllTime = useRef<number>(0);

  const applySelection = useCallback((next: Set<string>, qsId: QuickSelectId | null = null) => {
    setSelectedEndings(next);
    saveSelected(next);
    setActiveQuickSelect(qsId);
    setRemovedKeys(new Set());
  }, []);

  const toggleEnding = useCallback(
    (key: string) => {
      setSelectedEndings((prev) => {
        let next: Set<string>;
        if (selectMode === "one") {
          next = prev.has(key) && prev.size === 1 ? new Set<string>() : new Set([key]);
        } else {
          next = new Set(prev);
          if (next.has(key)) next.delete(key);
          else next.add(key);
        }
        saveSelected(next);
        setActiveQuickSelect(null); // manual toggle breaks quickselect match
        return next;
      });
    },
    [selectMode],
  );

  const clearAll = useCallback(() => {
    applySelection(new Set(), null);
  }, [applySelection]);

  const quickSelect = useCallback(
    (id: QuickSelectId) => {
      const keys = QUICK_SELECTS[id].keys;
      const effectiveKeys = id === "all" ? allKeys : keys;
      const next = new Set(effectiveKeys.filter((k: string) => allKeys.includes(k)));
      applySelection(next, id);
    },
    [allKeys, applySelection],
  );

  const toggleMode = useCallback(() => {
    setSelectMode((prev) => {
      const next = prev === "many" ? "one" : "many";
      saveMode(next);
      return next;
    });
  }, []);

  const [maxWordsPerEnding, setMaxWordsPerEnding] = useState(1);

  const words = useMemo(() => {
    const result: { word: VowelTrainerEntry; key: string }[] = [];
    for (const ending of allKeys) {
      if (!selectedEndings.has(ending)) continue;
      const entries = getChineseWords(ending);
      for (const entry of entries) {
        const k = `${ending}-${entry.w}-${entry.p}`;
        if (!removedKeys.has(k)) {
          result.push({ word: toVowelTrainerEntry(entry, ending), key: k });
        }
      }
    }
    return result;
  }, [selectedEndings, allKeys, removedKeys]);

  const wordsToShow = useMemo(() => {
    let currentEnding = "";
    let count = 0;
    return words.map(({ word }) => {
      if (word.ending !== currentEnding) {
        currentEnding = word.ending;
        count = 0;
      }
      count++;
      return count <= maxWordsPerEnding;
    });
  }, [words, maxWordsPerEnding]);

  const visibleWords = useMemo(() => words.filter((_, i) => wordsToShow[i]), [words, wordsToShow]);
  const visibleCount = visibleWords.length;

  const getHidden = (key: string) => hiddenRows[key] || [false, false, false, false];

  const handleReveal = useCallback((key: string, rowIndex: number) => {
    setHiddenRows((prev) => {
      const current = prev[key] || [false, false, false, false];
      const next = [...current];
      if (rowIndex < 0) next[-1 - rowIndex] = true;
      else next[rowIndex] = false;
      return { ...prev, [key]: next };
    });
  }, []);

  const handleSpeak = useCallback(
    (text: string, lang: "zh" | "en") => {
      if (lang === "zh") speak(text);
      else if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US";
        u.rate = 0.9;
        speechSynthesis.speak(u);
      }
    },
    [speak],
  );

  const showAll = useCallback(() => {
    setHiddenRows((prev) => {
      const next = { ...prev };
      for (const { key } of visibleWords) next[key] = [false, false, false, false];
      return next;
    });
  }, [visibleWords]);

  const hideAll = useCallback(() => {
    const now = Date.now();
    const double = now - lastHideAllTime.current < 3000;
    lastHideAllTime.current = now;
    setHiddenRows((prev) => {
      const next = { ...prev };
      for (const { key } of visibleWords) {
        const cur = prev[key] || [false, false, false, false];
        next[key] = double ? [true, true, true, true] : [cur[0], true, true, true];
      }
      return next;
    });
  }, [visibleWords]);

  const displayKey = (key: string) => key.replace(/ü/g, "ü");

  // Title logic: show quickselect name if it's active and mode is "many"
  const titleLabel =
    activeQuickSelect && selectMode === "many" ? `QuickSelect: ${QUICK_SELECTS[activeQuickSelect].label}` : null;

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
          <h1 className="text-2xl font-bold flex-1">Vowel Trainer</h1>
          <Button variant="outline" size="sm" onClick={toggleMode} className="gap-1.5">
            {selectMode === "many" ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            {selectMode === "many" ? "Multi" : "Single"}
          </Button>
        </div>

        {/* Ending toggles (always visible) */}
        <div className="mb-3 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear All
            </Button>
            {titleLabel && <span className="text-sm font-medium text-primary">{titleLabel}</span>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allKeys.map((key) => (
              <button
                key={key}
                onClick={() => toggleEnding(key)}
                style={{ backgroundColor: endingColorMap[key] }}
                className={`px-2 py-1 rounded text-sm transition-colors text-foreground ${
                  selectedEndings.has(key)
                    ? "border-2 border-foreground font-semibold"
                    : "border border-transparent hover:opacity-80"
                }`}
              >
                {displayKey(key)}
              </button>
            ))}
          </div>
        </div>

        {/* Show/Hide all + count */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-muted-foreground">
            {visibleCount} words out of {words.length} total
          </span>
          <Button variant="outline" size="sm" onClick={() => setMaxWordsPerEnding((prev) => prev + 1)}>
            Show More
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMaxWordsPerEnding(9999)}>
            Show All Words
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMaxWordsPerEnding(1)}>
            Reset to 1
          </Button>
        </div>

        {/* Word cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mb-6">
          {visibleWords.map(({ word, key }) => (
            <WordCard
              key={key}
              word={word}
              hidden={getHidden(key)}
              settings={displaySettings}
              userDifficulty={null}
              onReveal={(rowIndex) => handleReveal(key, rowIndex)}
              onSpeak={handleSpeak}
              onSetDifficulty={() => {}}
              onRemove={() => setRemovedKeys((prev) => new Set(prev).add(key))}
              style={{ backgroundColor: endingColorMap[word.ending] }}
            />
          ))}
        </div>

        {/* Bottom: Quick Selects (collapsible) */}
        <Collapsible open={quickSelectsOpen} onOpenChange={setQuickSelectsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 px-3 hover:bg-accent rounded-md text-sm font-medium">
            {quickSelectsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            Quick Selects
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-4 space-y-3">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                <Button
                  variant={activeQuickSelect === "medials" ? "default" : "outline"}
                  size="sm"
                  onClick={() => quickSelect("medials")}
                >
                  Medials
                </Button>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 font-medium">No Medials</p>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    variant={activeQuickSelect === "finalMono" ? "default" : "outline"}
                    size="sm"
                    onClick={() => quickSelect("finalMono")}
                  >
                    Final Monophthongs
                  </Button>
                  <Button
                    variant={activeQuickSelect === "finalDip" ? "default" : "outline"}
                    size="sm"
                    onClick={() => quickSelect("finalDip")}
                  >
                    Final Diphthongs
                  </Button>
                  <Button
                    variant={activeQuickSelect === "finalNasal" ? "default" : "outline"}
                    size="sm"
                    onClick={() => quickSelect("finalNasal")}
                  >
                    Final Nasals (n, ng)
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Button variant="outline" size="sm" onClick={showAll}>
                  <Eye className="h-3.5 w-3.5 mr-1" /> Show Card
                </Button>
                <Button variant="outline" size="sm" onClick={hideAll}>
                  <EyeOff className="h-3.5 w-3.5 mr-1" /> Hide Card Rows
                </Button>
              </div>

              <Collapsible open={combosOpen} onOpenChange={setCombosOpen}>
                <CollapsibleTrigger className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                  {combosOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  Combos (ADVANCED)
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1">
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      variant={activeQuickSelect === "comboMono" ? "default" : "outline"}
                      size="sm"
                      onClick={() => quickSelect("comboMono")}
                    >
                      Combo Mono
                    </Button>
                    <Button
                      variant={activeQuickSelect === "comboDip" ? "default" : "outline"}
                      size="sm"
                      onClick={() => quickSelect("comboDip")}
                    >
                      Combo Dip
                    </Button>
                    <Button
                      variant={activeQuickSelect === "comboNasal" ? "default" : "outline"}
                      size="sm"
                      onClick={() => quickSelect("comboNasal")}
                    >
                      Combo Nasal
                    </Button>
                    <Button
                      variant={activeQuickSelect === "iMedial" ? "default" : "outline"}
                      size="sm"
                      onClick={() => quickSelect("iMedial")}
                    >
                      i + Finals
                    </Button>
                    <Button
                      variant={activeQuickSelect === "uMedial" ? "default" : "outline"}
                      size="sm"
                      onClick={() => quickSelect("uMedial")}
                    >
                      u + Finals
                    </Button>
                    <Button
                      variant={activeQuickSelect === "üMedial" ? "default" : "outline"}
                      size="sm"
                      onClick={() => quickSelect("üMedial")}
                    >
                      ü + Finals
                    </Button>
                    <br></br>
                    <Button
                      variant={activeQuickSelect === "All" ? "default" : "outline"}
                      size="sm"
                      onClick={() => quickSelect("All")}
                    >
                      All
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default VowelTrainer;
