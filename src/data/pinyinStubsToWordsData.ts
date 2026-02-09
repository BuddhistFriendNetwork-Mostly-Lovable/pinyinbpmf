// TypeScript interfaces for pinyin stub word lookups

export interface PinyinWordEntry {
  h: number;    // HSK level (-1 = not in HSK)
  ct: string;   // Chinese Traditional
  fp: string;   // Full pinyin with tone
  e: string;    // English meaning
  t: number;    // Tone (1-5)
  cs: string;   // Chinese Simplified
}

export interface PinyinStubData {
  pinyinStub: string;
  characters: PinyinWordEntry[];
}

// Raw data array
export const pinyinStubsData: PinyinStubData[] = [
  {
    pinyinStub: "zhi",
    characters: [
      { h: -1, ct: "之", fp: "zhī", e: "possessive particle, formal 'of'", t: 1, cs: "之" },
      { h: 1, ct: "知", fp: "zhī", e: "to know, realize", t: 1, cs: "知" },
      { h: 4, ct: "支", fp: "zhī", e: "to support, branch, measure word", t: 1, cs: "支" },
      { h: 1, ct: "隻", fp: "zhī", e: "measure word for animals/birds", t: 1, cs: "只" },
      { h: 1, ct: "只", fp: "zhǐ", e: "only, merely", t: 3, cs: "只" },
      { h: 2, ct: "指", fp: "zhǐ", e: "finger, to point at", t: 3, cs: "指" },
      { h: 3, ct: "止", fp: "zhǐ", e: "to stop, prohibit", t: 3, cs: "止" },
      { h: 4, ct: "至", fp: "zhì", e: "to arrive, most, extremely", t: 4, cs: "至" },
      { h: 4, ct: "制", fp: "zhì", e: "to manufacture, system, control", t: 4, cs: "制" },
      { h: 3, ct: "治", fp: "zhì", e: "to govern, cure, manage", t: 4, cs: "治" }
    ]
  },
  {
    pinyinStub: "chi",
    characters: [
      { h: 1, ct: "吃", fp: "chī", e: "to eat, consume", t: 1, cs: "吃" },
      { h: 3, ct: "持", fp: "chí", e: "to hold, maintain, support", t: 2, cs: "持" },
      { h: 5, ct: "池", fp: "chí", e: "pond, pool, reservoir", t: 2, cs: "池" },
      { h: 2, ct: "遲", fp: "chí", e: "late, delayed", t: 2, cs: "迟" },
      { h: 4, ct: "尺", fp: "chǐ", e: "ruler, foot (unit of length)", t: 3, cs: "尺" },
      { h: 5, ct: "齒", fp: "chǐ", e: "tooth", t: 3, cs: "齿" },
      { h: 5, ct: "恥", fp: "chǐ", e: "shame, dishonor", t: 3, cs: "耻" },
      { h: 6, ct: "赤", fp: "chì", e: "red, bare, loyal", t: 4, cs: "赤" },
      { h: 6, ct: "翅", fp: "chì", e: "wing", t: 4, cs: "翅" },
      { h: 6, ct: "斥", fp: "chì", e: "to blame, repel, exclude", t: 4, cs: "斥" }
    ]
  },
  {
    pinyinStub: "shi",
    characters: [
      { h: 1, ct: "是", fp: "shì", e: "to be (is, am, are), yes", t: 4, cs: "是" },
      { h: 2, ct: "時", fp: "shí", e: "time, hour, period", t: 2, cs: "时" },
      { h: 2, ct: "十", fp: "shí", e: "ten", t: 2, cs: "十" },
      { h: 3, ct: "事", fp: "shì", e: "matter, affair, thing", t: 4, cs: "事" },
      { h: 3, ct: "市", fp: "shì", e: "city, market", t: 4, cs: "市" },
      { h: 4, ct: "實", fp: "shí", e: "real, true, honest", t: 2, cs: "实" },
      { h: 3, ct: "使", fp: "shǐ", e: "to cause, make, use", t: 3, cs: "使" },
      { h: 4, ct: "世", fp: "shì", e: "world, generation", t: 4, cs: "世" },
      { h: 4, ct: "式", fp: "shì", e: "style, form, formula", t: 4, cs: "式" },
      { h: 4, ct: "失", fp: "shī", e: "to lose, fail", t: 1, cs: "失" }
    ]
  },
  {
    pinyinStub: "ri",
    characters: [
      { h: 1, ct: "日", fp: "rì", e: "sun, day, date", t: 4, cs: "日" },
      { h: -1, ct: "鈤", fp: "rì", e: "Germanium (rare technical usage)", t: 4, cs: "鈤" }
    ]
  },
  {
    pinyinStub: "zi",
    characters: [
      { h: 1, ct: "子", fp: "zǐ", e: "child, son, noun suffix", t: 3, cs: "子" },
      { h: 3, ct: "自", fp: "zì", e: "self, from, naturally", t: 4, cs: "自" },
      { h: 3, ct: "字", fp: "zì", e: "character, word, letter", t: 4, cs: "字" },
      { h: 5, ct: "資", fp: "zī", e: "resources, capital, expenses", t: 1, cs: "资" },
      { h: 5, ct: "紫", fp: "zǐ", e: "purple, violet", t: 3, cs: "紫" },
      { h: 5, ct: "姿", fp: "zī", e: "posture, appearance", t: 1, cs: "姿" },
      { h: 6, ct: "滋", fp: "zī", e: "to nourish, grow, taste", t: 1, cs: "滋" },
      { h: 4, ct: "仔", fp: "zǐ", e: "detailed, young of animal", t: 3, cs: "仔" },
      { h: 5, ct: "諮", fp: "zī", e: "to consult, confer", t: 1, cs: "咨询" },
      { h: -1, ct: "渍", fp: "zì", e: "to soak, stain", t: 4, cs: "渍" }
    ]
  }
];

// Build lookup Map for O(1) access
const pinyinStubMap = new Map<string, PinyinWordEntry[]>(
  pinyinStubsData.map(entry => [entry.pinyinStub, entry.characters])
);

// Get all word entries for a given pinyin stub
export function getWordsForPinyinStub(pinyinStub: string): PinyinWordEntry[] {
  return pinyinStubMap.get(pinyinStub) ?? [];
}
