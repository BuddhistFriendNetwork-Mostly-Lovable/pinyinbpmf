import { useState, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { WordCard, type WordCardDisplaySettings, type UserDifficulty } from "@/components/random/WordCard";
import { getAllEndingKeys, getChineseWords, type ChineseWordEntry } from "@/data/chineseWordsData";
import { cleanPinyin, stripToneMarks } from "@/lib/zhuyinUtils";
import { useTTS } from "@/hooks/useTTS";
import type { RandomWordEntry } from "@/lib/randomWordsUtils";

const LS_KEY = "vowel-trainer-selected-endings";

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
} as const;

function loadSelected(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set(getAllEndingKeys());
}

function saveSelected(s: Set<string>) {
  localStorage.setItem(LS_KEY, JSON.stringify([...s]));
}

function toRandomWordEntry(entry: ChineseWordEntry): RandomWordEntry {
  const parts = entry.w.split(",");
  const ct = parts[0];
  const cs = parts.length > 1 ? parts[1] : ct;
  const firstSyllable = entry.short || entry.p;
  const stub = stripToneMarks(cleanPinyin(firstSyllable));
  return { cs, ct, e: entry.m, fp: entry.p, pinyinStub: stub, h: -9, t: -9 };
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
  const [endingsOpen, setEndingsOpen] = useState(true);
  const [combosOpen, setCombosOpen] = useState(false);
  const [removedKeys, setRemovedKeys] = useState<Set<string>>(new Set());
  const [hiddenRows, setHiddenRows] = useState<Record<string, boolean[]>>({});
  const { speak } = useTTS();
  const allKeys = useMemo(() => getAllEndingKeys(), []);
  const lastHideAllTime = useRef<number>(0);

  const toggleEnding = useCallback((key: string) => {
    setSelectedEndings((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      saveSelected(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelectedEndings(new Set());
    saveSelected(new Set());
    setRemovedKeys(new Set());
  }, []);

  const quickSelect = useCallback(
    (keys: readonly string[]) => {
      const next = new Set(keys.filter((k) => allKeys.includes(k)));
      setSelectedEndings(next);
      saveSelected(next);
      setRemovedKeys(new Set());
    },
    [allKeys],
  );

  const words = useMemo(() => {
    const result: { word: RandomWordEntry; key: string }[] = [];
    for (const ending of allKeys) {
      if (!selectedEndings.has(ending)) continue;
      const entries = getChineseWords(ending);
      for (const entry of entries) {
        const k = `${ending}-${entry.w}-${entry.p}`;
        if (!removedKeys.has(k)) {
          result.push({ word: toRandomWordEntry(entry), key: k });
        }
      }
    }
    return result;
  }, [selectedEndings, allKeys, removedKeys]);

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
      for (const { key } of words) next[key] = [false, false, false, false];
      return next;
    });
  }, [words]);

  const hideAll = useCallback(() => {
    const now = Date.now();
    const double = now - lastHideAllTime.current < 3000;
    lastHideAllTime.current = now;
    setHiddenRows((prev) => {
      const next = { ...prev };
      for (const { key } of words) {
        const cur = prev[key] || [false, false, false, false];
        next[key] = double ? [true, true, true, true] : [cur[0], true, true, true];
      }
      return next;
    });
  }, [words]);

  // Display ü keys nicely
  const displayKey = (key: string) => key.replace(/ü/g, "ü");

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
        </div>

        {/* Top: Show/Hide all buttons */}
        <div className="flex items-center gap-2 mb-3">
          <Button variant="outline" size="sm" onClick={showAll}>
            <Eye className="h-3.5 w-3.5 mr-1" /> Show All
          </Button>
          <Button variant="outline" size="sm" onClick={hideAll}>
            <EyeOff className="h-3.5 w-3.5 mr-1" /> Hide All
          </Button>
          <span className="text-xs text-muted-foreground">{words.length} words</span>
        </div>

        {/* Word cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mb-6">
          {words.map(({ word, key }) => (
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
            />
          ))}
        </div>

        {/* Bottom: Endings selector */}
        <Collapsible open={endingsOpen} onOpenChange={setEndingsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 px-3 hover:bg-accent rounded-md text-sm font-medium">
            {endingsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            Endings
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-4 space-y-3">
            {/* Quick Selects */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                <Button variant="outline" size="sm" onClick={() => quickSelect(QUICK_SELECTS.medials.keys)}>
                  Medials
                </Button>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1 font-medium">No Medials</p>
                <div className="flex flex-wrap gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => quickSelect(QUICK_SELECTS.finalMono.keys)}>
                    Final Monophthongs
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => quickSelect(QUICK_SELECTS.finalDip.keys)}>
                    Final Diphthongs
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => quickSelect(QUICK_SELECTS.finalNasal.keys)}>
                    Final Nasals (n, ng)
                  </Button>
                </div>
              </div>

              <Collapsible open={combosOpen} onOpenChange={setCombosOpen}>
                <CollapsibleTrigger className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                  {combosOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  Combos (ADVANCED)
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1">
                  <div className="flex flex-wrap gap-1.5">
                    <Button variant="outline" size="sm" onClick={() => quickSelect(QUICK_SELECTS.comboMono.keys)}>
                      Combo Mono
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => quickSelect(QUICK_SELECTS.comboDip.keys)}>
                      Combo Dip
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => quickSelect(QUICK_SELECTS.comboNasal.keys)}>
                      Combo Nasal
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => quickSelect(QUICK_SELECTS.iMedial.keys)}>
                      i + Finals
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => quickSelect(QUICK_SELECTS.uMedial.keys)}>
                      u + Finals
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => quickSelect(QUICK_SELECTS.üMedial.keys)}>
                      ü + Finals
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="flex gap-2 mb-1">
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => toggleEnding(key)}
                  className={`px-2 py-1 rounded text-sm border transition-colors ${
                    selectedEndings.has(key)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:bg-accent"
                  }`}
                >
                  {displayKey(key)}
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default VowelTrainer;
