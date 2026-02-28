import { chartData, endings } from "@/data/phoneticData";
import { difficultyCategorization, endingsWithDifficulty } from "@/data/englishRhymeData";
import { getWordsForPinyinStub, type PinyinWordEntry } from "@/data/pinyinStubsToWordsData";
import { cleanPinyin, stripToneMarks } from "@/lib/zhuyinUtils";

export interface RandomWordEntry extends PinyinWordEntry {
  pinyinStub: string;
}

export interface GenerateFlags {
  includeAsterisk?: boolean;
  includeParentheses?: boolean;
}

export interface QuickPreset {
  name: string;
  autogenInit: string[];
  autogenEndings: string[];
  specialAdds: string[];
  notes: string;
}

/**
 * Get all valid pinyin combinations from given initials and endings arrays.
 */
export function AllPinyinFromInitialAndEnding(
  initialsArray: string[],
  endingsArray: string[],
): string[] {
  const result: string[] = [];

  for (const init of initialsArray) {
    for (const end of endingsArray) {
      const key = `${init}-${end}`;
      const cell = chartData[key];
      if (!cell) continue;

      const pinyin = cell.pinyin;
      // Extract just the parenthesized part, e.g. "(ye) --> ie" becomes "(ye)"
      const parenMatch = pinyin.match(/^(\([^)]+\))/);
      if (parenMatch) {
        result.push(parenMatch[1]);
      } else {
        result.push(pinyin);
      }
    }
  }

  return result;
}

/**
 * Generate a pinyin list from a QuickPreset.
 */
export function PinyinListFromQuickPreset(preset: QuickPreset): string[] {
  const resolvedEndings = preset.autogenEndings.map((e) => {
    const ending = endings.find((end) => end.pinyin === e);
    return ending ? ending.pinyin : e;
  });
  const autogen = AllPinyinFromInitialAndEnding(preset.autogenInit, resolvedEndings);
  return [...autogen, ...preset.specialAdds];
}

/**
 * Clean a pinyin string from the chart for lookup: remove *, (), keep letters and ü
 */
function cleanChartPinyin(pinyin: string): string {
  return stripToneMarks(cleanPinyin(pinyin));
}

/**
 * Generate N words from a pinyin list, avoiding duplicates.
 */
export function GenerateNwordsFromPinyin(
  initialWords: RandomWordEntry[],
  N: number,
  pinyinList: string[],
  flags: GenerateFlags = {},
): RandomWordEntry[] {
  const { includeAsterisk = true, includeParentheses = true } = flags;

  // Filter pinyinList based on flags
  let filteredList = [...pinyinList];
  if (!includeAsterisk) {
    filteredList = filteredList.filter((p) => !p.includes("*"));
  }
  if (!includeParentheses) {
    filteredList = filteredList.filter((p) => !p.startsWith("("));
  }

  if (filteredList.length === 0) return [...initialWords];

  const returnWords: RandomWordEntry[] = [...initialWords];
  // Track existing entries for dedup
  const existing = new Set(returnWords.map((w) => `${w.ct}-${w.pinyinStub}`));

  let avoidInfinite = 0;

  while (avoidInfinite < 10 && returnWords.length < N) {
    const randomPinyin = filteredList[Math.floor(Math.random() * filteredList.length)];
    const stub = cleanChartPinyin(randomPinyin);

    const words = getWordsForPinyinStub(stub);
    if (words.length === 0) {
      avoidInfinite++;
      continue;
    }

    const randomWord = words[Math.floor(Math.random() * words.length)];
    const dedupKey = `${randomWord.ct}-${stub}`;

    if (existing.has(dedupKey)) {
      avoidInfinite++;
      continue;
    }

    returnWords.push({ ...randomWord, pinyinStub: stub });
    existing.add(dedupKey);
    avoidInfinite = 0;
  }

  return returnWords;
}

/**
 * Get the difficulty level for a pinyin stub by finding which ending it uses.
 */
export function getDifficultyForStub(pinyinStub: string): number {
  // Try to match the stub's ending against difficultyCategorization
  // We check from longest ending to shortest
  const sortedEndings = Object.keys(difficultyCategorization).sort(
    (a, b) => b.length - a.length,
  );

  for (const ending of sortedEndings) {
    if (ending === "i_buzz") continue; // special case
    if (pinyinStub.endsWith(ending)) {
      return difficultyCategorization[ending];
    }
  }

  // Check for buzzing i (zhi, chi, shi, ri, zi, ci, si)
  const buzzingInitials = ["zhi", "chi", "shi", "ri", "zi", "ci", "si"];
  if (buzzingInitials.includes(pinyinStub)) {
    return difficultyCategorization["i_buzz"] ?? 5;
  }

  return 3; // default mid difficulty
}

/**
 * Get difficulty color class based on level.
 * 1-2 = green, 3-4 = yellow, 5-6 = red
 */
export function getDifficultyColor(level: number): string {
  if (level <= 2) return "bg-green-100 border-green-300";
  if (level <= 4) return "bg-yellow-100 border-yellow-300";
  return "bg-red-100 border-red-300";
}

/**
 * Get difficulty dot color for the small indicator.
 */
export function getDifficultyDotColor(level: number): string {
  if (level <= 2) return "bg-green-500";
  if (level <= 4) return "bg-yellow-500";
  return "bg-red-500";
}

// --- Quick Presets ---

const easyEndingsList = [...endingsWithDifficulty(0), ...endingsWithDifficulty(1)];

function generateEasyNotes(): string {
  const initials = EasyPreset.autogenInit;
  const endingNames = EasyPreset.autogenEndings;
  const specials = EasyPreset.specialAdds;
  return `Initials (${initials.length}): ${initials.join(", ")}.\nEndings (${endingNames.length}): ${endingNames.join(", ")}.\nSpecial Adds (${specials.length}): ${specials.join(", ")}.`;
}

export const EasyPreset: QuickPreset = {
  name: "Easy",
  autogenInit: ["b", "p", "m", "f", "d", "t", "n", "g", "k", "h", "j", "q", "x"],
  autogenEndings: easyEndingsList,
  specialAdds: ["wo", "yi", "san", "si", "wu"],
  notes: "", // filled below
};
EasyPreset.notes = generateEasyNotes();

const allConsonantInitials = [
  "b", "p", "m", "f", "d", "t", "n", "l",
  "g", "k", "h", "j", "q", "x",
  "zh", "ch", "sh", "r", "z", "c", "s",
];

export const UmlautPreset: QuickPreset = {
  name: "Umlauts",
  autogenInit: allConsonantInitials,
  autogenEndings: ["ü", "üe", "üan", "ün", "iong"],
  specialAdds: [],
  notes: `All Umlaut endings: ü, üe, üan, ün — which also includes "iong". The Zhuyin for "-iong" uses ㄩ, which is the Umlaut sound.\n\nNotice that usually this is written in pinyin without the two dots (ü). So "u" actually is tricky: It can be the ü sound or the u sound like "bu".\n\nTIP: for "j, q, x, and y", the u is always ü. Everything else is the u like english "boo".`,
};

const allEndingsList = endings.map((e) => e.pinyin);

export const AllPreset: QuickPreset = {
  name: "All",
  autogenInit: allConsonantInitials,
  autogenEndings: allEndingsList,
  specialAdds: ["wo", "yi", "san", "si", "wu"],
  notes: "All ~410 pinyin variants.",
};

export const quickPresets: QuickPreset[] = [EasyPreset, UmlautPreset, AllPreset];

export const DefaultPinyinList = PinyinListFromQuickPreset(EasyPreset);

export type HideMode = "always" | "never" | "sometimes";

/**
 * Generate hiding state for a word based on hide modes.
 */
export function generateHiddenState(
  index: number,
  hideChinese: HideMode,
  hideEnglish: HideMode,
  hidePinyin: HideMode,
  hideZhuyin: HideMode,
  dontHideFirstN: boolean,
  firstN: number,
  randomizeHiding: boolean,
): boolean[] {
  if (dontHideFirstN && index < firstN) {
    return [false, false, false, false];
  }

  const resolveHide = (mode: HideMode): boolean => {
    if (mode === "always") return true;
    if (mode === "never") return false;
    // sometimes = 50% chance
    return Math.random() < 0.5;
  };

  if (randomizeHiding) {
    return [
      Math.random() < 0.5,
      Math.random() < 0.5,
      Math.random() < 0.5,
      Math.random() < 0.5,
    ];
  }

  return [
    resolveHide(hideChinese),
    resolveHide(hideEnglish),
    resolveHide(hidePinyin),
    resolveHide(hideZhuyin),
  ];
}
