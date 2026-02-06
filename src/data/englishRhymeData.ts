export const englishRhymeWords: Record<string, string[]> = {
  // --- The A Group ---
  a: ["mama 100%", "haha 100%", "cha cha 80%"],
  ai: ["why 100%", "buy 100%", "tie 100%"],
  ao: ["pouch (-ch) 90%", "cow*** (accents) 60%", "ouch 80%", "how 60%"],
  an: ["pawn 80%", "fawn 80%", "(Jamaica) hey *man* 100%", "Indian *naan* 100%", "❌man 0%"],
  ang: ["ping *pong* 80%", "king *kong* 80%", "❌bang 0%"],

  // --- The E Group ---
  e: ["duh 100%", "the (unstressed) 90%", "❌me 0%"],
  ei: ["weigh 100%", "hey 100%", "say 100%"],
  en: ["fun 60%", "*hon*ey 95%", "❌Ben 0%"],
  eng: ["lung 80%", "sung 80%", "❌*eng*lish 0%"],
  er: ["grrr 100%", "fur 100%"],

  // --- The I Group ---
  i: ["see 100%", "tea 100%", "pee 100%"],
  i_buzz: ["zzz (bee sound) 90%", "❌see 0%"],
  ia: ["see-ya 90%", "gee-ah 80%"],
  iao: ["meow 100%"],
  ie: ["yet (drop the t) 100%", "jet (drop the t) 90%", "❌pie 0%"],
  iu: ["yo-yo 90%", "Leo 60%", "(Christian) Dior (drop the r) 60%"],
  ian: ["yen (currency) 95%", "Ben 70%", "❌Ian (name) 0%"],
  in: ["mean 100%", "bean 90%", "❌pin 0%"],
  iang: ["young 85%", "Zion + G 85%"],
  ing: ["*ding* dong 100%", "*ping* pong 100%"],
  iong: ["German 'Jung' 90%", "young (rounded lips) 60%"],

  // --- The O Group ---
  o: ["poor (-r) 80%", "paw 75%", "❌go 0%"],
  ong: ["cone+g 100%", "home+ng 100%", "ping ❌pong (see /-ang/) 0%", "❌long (see /-ang/) 0%"],
  ou: ["oh 100%", "go 100%", "so 100%", "row 100%", "❌you 0%"],

  // --- The U Group ---
  u: ["boo 100%", "two 100%", "goo 100%"],
  ua: ["guava 100%", "raw 80%"],
  uo: ["war (soft r) 80%", "❌duo 0%"],
  ui: ["way 100%", "sway 100%"],
  uai: ["why 90%", "why (stretch the w as a 'u') 100%", "*Kawhi* Leonard (NBA star, blended) 100%"],
  uan: ["Juan 100%", "swan 95%", "wand (-d) 90%"],
  un: ["one 50%", "dun dun dun (suspense) 40%", "❌sun 0%", "See /en/, very close sound-alike"],
  uang: ["Juan + g 100%", "wrong (with w sound) 70%", "Swan + g 95%"],

  // --- The Ü (Umlaut) Group ---
  ü: ["French 'brie' 50%", "see (with super puckered lips) 80%"],
  üe: ["duet (soft t) 85%", "sweat (puckered lips, soft t) 70%", "you+eh 80%"],
  üan: ["U.N. (United Nations) 80%", "yen (puckered lips) 85%", "Ian 50%", "❌Juan 0%"],
  ün: ["jean (puckered lips) 80%", "Queen - Q 80%"],
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
