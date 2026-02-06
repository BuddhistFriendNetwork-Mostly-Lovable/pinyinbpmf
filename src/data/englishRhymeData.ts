export const englishRhymeWords: Record<string, string[]> = {
  // --- The A Group ---
  "a": ["mama 100%", "haha 100%", "cha cha 80%"],
  "ai": ["why 100%", "buy 100%", "tie 100%"],
  "ao": ["cow 95%", "ouch 95%", "how 90%"],
  "an": ["pawn 80%", "fawn 80%", "Jamaica 'hey man' 100%", "Indian 'naan' 100%"],
  "ang": ["ping pong 80%", "king kong 80%", "❌bang 0%"],

  // --- The E Group ---
  "e": ["duh 90%", "the (unstressed) 90%", "good 60%"],
  "ei": ["hey 100%", "say 100%", "weigh 100%"],
  "en": ["taken 95%", "chicken 95%", "fun 80%"],
  "eng": ["lung 95%", "sung 95%", "tongue 95%"],
  "er": ["arr (pirate sound) 90%", "grrr 90%", "fur 80%"],

  // --- The I Group ---
  "i": ["see 100%", "tea 100%", "ski 100%"],
  "i_buzz": ["zzz (bee sound) 80%", "grrr (vocalized) 70%", "shirt (no vowel) 60%"],
  "ia": ["see-ya 95%", "media 95%"],
  "iao": ["meow 100%", "wow (with an e start) 95%"],
  "ie": ["ye (Kanye) 95%", "fiesta 90%", "yet (drop the t) 90%"],
  "iu": ["Leo 90%", "yo-yo 90%"],
  "ian": ["yen (currency) 95%", "Ben 95%", "❌Ian (name) 0%"],
  "in": ["in 100%", "bin 100%", "sin 100%"],
  "iang": ["young 85%", "yang 85%"],
  "ing": ["sing 100%", "thing 100%"],
  "iong": ["German 'Jung' 90%", "young (rounded lips) 70%"],

  // --- The O Group ---
  "o": ["saw 85%", "law 85%", "paw 85%"],
  "ong": ["song 90%", "wrong 90%", "long 90%"],
  "ou": ["oh 100%", "dough 100%", "so 100%"],

  // --- The U Group ---
  "u": ["moo 100%", "shoe 100%", "you 100%"],
  "ua": ["guava 95%", "wah (baby crying) 90%"],
  "uo": ["war 90%", "water 85%", "wall 85%"],
  "ui": ["way 100%", "sway 100%"],
  "uai": ["why 100%", "wife (drop the f) 95%"],
  "uan": ["swan 95%", "wand 95%"],
  "un": ["won 100%", "one 100%"],
  "uang": ["wong 95%", "wrong (with w sound) 90%"],

  // --- The Ü (Umlaut) Group ---
  "ü": ["French 'tu' 100%", "see (with puckered lips) 80%", "eww 50%"],
  "üe": ["duet 85%", "sweat (puckered lips) 70%"],
  "üan": ["yen (puckered lips) 85%", "U.N. (United Nations) 70%"],
  "ün": ["win (puckered lips) 90%", "swim (drop m, pucker lips) 85%"],
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
