export const englishRhymeWords: Record<string, string[]> = {
  // --- The A Group ---
  a: ["mama 100%", "haha 100%", "cha cha 80%"],
  ai: ["pie 100%", "buy 100%", "tie 100%"],
  ao: ["pouch (-ch) 90%", "cow*** (accents) 60%", "ouch 80%", "how 60%"],
  an: ["pawn 80%", "fawn 80%", "(Jamaica) hey *man* 100%", "Indian *naan* 100%", "❌man 20%"],
  ang: ["ping *pong* 80%", "king *kong* 80%", "❌❌bang (see /-ei/ and /eng/) 0%"],

  // --- The E Group ---
  e: ["duh 100%", "the (unstressed) 90%", "❌me (see /-i/) 0%"],
  ei: ["day 100%", "hey 100%", "say 100%"],
  en: ["fun 60%", "*hon*ey 95%", "❌Ben 20%"],
  eng: ["lung 80%", "sung 80%", "❌*eng*lish (see /-ing/) 0%"],
  er: ["grrr 100%", "fur 100%"],

  // --- The I Group ---
  i: ["bee 100%", "tea 100%", "pee 100%"],
  i_buzz: ["zzz (bee sound) 90%", "❌see 0%"],
  ia: ["see-ya 90%", "gee-ah 80%"],
  iao: ["meow 100%"],
  ie: ["yet (drop the t) 100%", "jet (drop the t) 90%", "❌pie 0%"],
  iu: ["yo-yo 90%", "Leo 60%", "(Christian) Dior (drop the r) 60%"],
  ian: ["yen (currency) 95%", "Bien (french) 90%", "Jen 80%"],
  in: ["mean 100%", "bean 90%", "❌pin 20%"],
  iang: ["young 85%", "Zion + G 85%"],
  ing: ["*ding* dong 100%", "*ping* pong 100%", "*eng*lish 90%"],
  iong: ["German 'Jung' 90%", "young (rounded lips) 60%"],

  // --- The O Group ---
  o: ["poor (-r) 80%", "paw 75%", "❌go 20%"],
  ong: ["cone+g 100%", "home+ng 100%", "ping ❌pong (see /-ang/) 0%", "❌long (see /-ang/) 0%"],
  ou: ["go 100%", "oh 100%", "so 100%", "row 100%", "❌you (see /-u/) 0%"],

  // --- The U Group ---
  u: ["boo 100%", "two 100%", "goo 100%"],
  ua: ["guava 100%", "raw 80%"],
  uo: ["war (soft r) 80%", "❌duo 20%"],
  ui: ["way 100%", "sway 100%"],
  uai: ["why 90%", "why (stretch the w as a 'u') 100%", "*Kawhi* Leonard (NBA star, blended) 100%"],
  uan: ["Juan 100%", "swan 95%", "wand (-d) 90%"],
  un: ["when 70%", "Gwen 70%", "one 50%", "dun dun dun (suspense) 40%", "❌sun (see /-en/) 0%", "See /en/, very close sound-alike"],
  uang: ["Juan + g 100%", "wrong (with w sound) 70%", "Swan + g 95%"],

  // --- The Ü (Umlaut) Group ---
  ü: ["French 'brie' 50%", "French 'brie' with puckerd lips, 80%", "see (with super puckered lips) 80%", "❌boo (see /-u/) 0%"],
  üe: ["duet (soft t) 85%", "sweat (puckered lips, soft t) 70%", "you+eh 80%"],
  üan: ["U.N. (United Nations) 80%", "yen (puckered lips) 85%", "Ian 50%", "❌Juan (see /-uan/) 0%"],
  ün: ["jean (puckered lips) 80%", "Queen (minus Q) 80%", "❌sun (see /-en/) 0%"],
};

export const difficultyCategorization: Record<string, number> = {
  // Category 0: Most easy, unambiguous
  ai: 0,
  ei: 0,
  ing: 0,
  uang: 0,
  a: 0,
  er: 0,
  iao: 0,

  // Category 1: Easy, but not obvious (Updated)
  ua: 1,
  ui: 1,
  uai: 1,
  ia: 1,
  iang: 1,

  // Category 2: Increased difficulty (Updated)
  e: 2,
  ie: 2,
  in: 2,
  ong: 2,
  ou: 2,

  // Categories 3 - 6: Unchanged
  üe: 3,
  iong: 3,
  ao: 3,
  an: 3,
  iu: 3,

  // 4
  ian: 4,
  ang: 4,
  eng: 4,

  // 5
  i_buzz: 5,
  o: 5,
  uo: 5,
  en: 5,

  //6
  i: 6,
  u: 6,
  uan: 6,
  un: 6,
  ü: 6,
  üan: 6,
  ün: 6,
};

/**
 * Get rhyme words for a final, returning empty array if none exist
 */
export const getRhymeWords = (finalPinyin: string): string[] => {
  return englishRhymeWords[finalPinyin] || [];
};

/**
 * Parse a rhyme word string into word and percentage
 * e.g., "mama 100%" -> { word: "mama", percentage: "100%" }
 */
export const parseRhymeWord = (rhymeStr: string): { word: string; percentage: string } => {
  const match = rhymeStr.match(/^(.+?)\s+(\d+%)$/);
  if (match) {
    return { word: match[1], percentage: match[2] };
  }
  return { word: rhymeStr, percentage: "" };
};

/**
 * Get the top rhyme word (first in the list, highest similarity)
 */
export const getTopRhymeWord = (finalPinyin: string): string | null => {
  const rhymes = getRhymeWords(finalPinyin);
  if (rhymes.length === 0) return null;
  const { word } = parseRhymeWord(rhymes[0]);
  return word;
};

/**
 * Get the danger text (0% similarity entry) for a given final.
 * Returns the cleaned short label and full original text, or null if none.
 */
export const getDangerWord = (
  finalPinyin: string,
): { shortLabel: string; fullText: string } | null => {
  const rhymes = getRhymeWords(finalPinyin);
  const dangerEntry = rhymes.find((r) => r.includes("0%"));
  if (!dangerEntry) return null;

  // Full text is the raw entry
  const fullText = dangerEntry;

  // Short label: remove emojis (❌, ✅, etc.), take text before first "(", strip percentage, trim
  let short = dangerEntry
    .replace(/[\u274C\u2705\u{1F6D1}]/gu, "") // remove common emojis
    .replace(/❌/g, "")
    .trim();

  // Take text before first "(" if present
  const parenIdx = short.indexOf("(");
  if (parenIdx > 0) {
    short = short.substring(0, parenIdx).trim();
  }

  // Remove percentage at end
  short = short.replace(/\s*\d+%\s*$/, "").trim();

  // Remove asterisks used for emphasis
  short = short.replace(/\*/g, "");

  return { shortLabel: short, fullText };
};
