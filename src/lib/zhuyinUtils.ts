// Zhuyin character range: ㄅ-ㄩ (U+3105-U+3129)
const ZHUYIN_REGEX = /[\u3105-\u3129]/g;

/**
 * Extracts clean Zhuyin characters from a string.
 * Takes up to the first 3 Zhuyin characters only.
 */
export const cleanZhuyin = (zhuyin: string): string => {
  const matches = zhuyin.match(ZHUYIN_REGEX);
  if (!matches) return '';
  return matches.slice(0, 3).join('');
};

/**
 * Formats Zhuyin for separated TTS pronunciation.
 * Separates each character with Chinese period to force distinct sounds.
 */
export const formatZhuyinForSeparateTTS = (zhuyin: string): string => {
  const clean = cleanZhuyin(zhuyin);
  return clean.split('').join('。') + '。';
};

/**
 * Builds MDBG dictionary search URL for a Zhuyin string.
 */
export const buildMDBGUrl = (zhuyin: string): string => {
  const clean = cleanZhuyin(zhuyin);
  return `https://www.mdbg.net/chinese/dictionary?page=worddict&wdqb=p%3A${encodeURIComponent(clean)}*`;
};
