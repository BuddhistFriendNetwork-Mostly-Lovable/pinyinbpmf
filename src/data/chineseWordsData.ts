export interface ChineseWordEntry {
  w: string; // Chinese word (may contain comma for trad,simp)
  m: string; // Meaning
  p: string; // Pinyin with tones
}

const chineseWords: Record<string, ChineseWordEntry[]> = {
  // --- A Group ---
  a: [
    { w: "爸爸", m: "daddy", p: "bàba" },
    { w: "馬,马", m: "horse", p: "mǎ" },
    { w: "大", m: "big", p: "dà" },
    { w: "怕", m: "scared", p: "pà" },
  ],
  ai: [
    { w: "愛,爱", m: "love", p: "ài" },
    { w: "菜", m: "vegetable/dish", p: "cài" },
    { w: "買,买", m: "to buy", p: "mǎi" },
    { w: "白", m: "white", p: "bái" },
    { w: "來,来", m: "to come", p: "lái" },
  ],
  ao: [
    { w: "貓,猫", m: "cat", p: "māo" },
    { w: "好", m: "good", p: "hǎo" },
    { w: "早", m: "early/morning", p: "zǎo" },
    { w: "高", m: "tall/high", p: "gāo" },
    { w: "跑", m: "to run", p: "pǎo" },
  ],
  an: [
    { w: "飯,饭", m: "rice/meal", p: "fàn" },
    { w: "看", m: "to look/watch", p: "kàn" },
    { w: "慢", m: "slow", p: "màn" },
    { w: "難,难", m: "difficult", p: "nán" },
    { w: "藍,蓝", m: "blue", p: "lán" },
  ],
  ang: [
    { w: "上", m: "up/above", p: "shàng" },
    { w: "湯,汤", m: "soup", p: "tāng" },
    { w: "忙", m: "busy", p: "máng" },
    { w: "胖", m: "fat", p: "pàng" },
    { w: "床", m: "bed", p: "chuáng" },
  ],

  // --- E Group ---
  e: [
    { w: "餓,饿", m: "hungry", p: "è" },
    { w: "喝", m: "to drink", p: "hē" },
    { w: "車,车", m: "car", p: "chē" },
    { w: "哥哥", m: "older brother", p: "gēge" },
  ],
  ei: [
    { w: "水", m: "water", p: "shuǐ" },
    { w: "飛,飞", m: "to fly", p: "fēi" },
    { w: "杯", m: "cup", p: "bēi" },
    { w: "黑", m: "black", p: "hēi" },
    { w: "給,给", m: "to give", p: "gěi" },
  ],
  en: [
    { w: "人", m: "person", p: "rén" },
    { w: "門,门", m: "door", p: "mén" },
    { w: "問,问", m: "to ask", p: "wèn" },
    { w: "本", m: "book (measure word)", p: "běn" },
  ],
  eng: [
    { w: "冷", m: "cold", p: "lěng" },
    { w: "風,风", m: "wind", p: "fēng" },
    { w: "生", m: "raw/life", p: "shēng" },
    { w: "燈,灯", m: "lamp/light", p: "dēng" },
  ],
  er: [
    { w: "二", m: "two", p: "èr" },
    { w: "兒子,儿子", m: "son", p: "érzi" },
    { w: "耳朵", m: "ear", p: "ěrduo" },
  ],

  // --- I Group ---
  i: [
    { w: "你", m: "you", p: "nǐ" },
    { w: "雞,鸡", m: "chicken", p: "jī" },
    { w: "筆,笔", m: "pen", p: "bǐ" },
    { w: "七", m: "seven", p: "qī" },
    { w: "洗", m: "to wash", p: "xǐ" },
  ],
  ia: [
    { w: "家", m: "home/family", p: "jiā" },
    { w: "下", m: "down/below", p: "xià" },
    { w: "蝦,虾", m: "shrimp", p: "xiā" },
    { w: "牙", m: "tooth", p: "yá" },
  ],
  iao: [
    { w: "鳥,鸟", m: "bird", p: "niǎo" },
    { w: "小", m: "small", p: "xiǎo" },
    { w: "要", m: "to want", p: "yào" },
    { w: "腳,脚", m: "foot", p: "jiǎo" },
    { w: "叫", m: "to call/shout", p: "jiào" },
  ],
  ie: [
    { w: "謝謝,谢谢", m: "thanks", p: "xièxie" },
    { w: "姐姐", m: "older sister", p: "jiějie" },
    { w: "鞋", m: "shoe", p: "xié" },
    { w: "寫,写", m: "to write", p: "xiě" },
  ],
  iu: [
    { w: "六", m: "six", p: "liù" },
    { w: "九", m: "nine", p: "jiǔ" },
    { w: "有", m: "to have", p: "yǒu" },
    { w: "牛", m: "cow", p: "niú" },
    { w: "酒", m: "alcohol", p: "jiǔ" },
    { w: "球", m: "ball", p: "qiú" },
  ],
  ian: [
    { w: "麵,面", m: "noodles", p: "miàn" },
    { w: "錢,钱", m: "money", p: "qián" },
    { w: "點,点", m: "o'clock/dot", p: "diǎn" },
    { w: "天", m: "sky/day", p: "tiān" },
    { w: "見,见", m: "to see/meet", p: "jiàn" },
  ],
  in: [
    { w: "心", m: "heart", p: "xīn" },
    { w: "金", m: "gold", p: "jīn" },
    { w: "新", m: "new", p: "xīn" },
    { w: "進,进", m: "to enter", p: "jìn" },
  ],
  iang: [
    { w: "想", m: "to think/want", p: "xiǎng" },
    { w: "講,讲", m: "to speak", p: "jiǎng" },
    { w: "香", m: "fragrant", p: "xiāng" },
    { w: "羊", m: "sheep", p: "yáng" },
  ],
  ing: [
    { w: "聽,听", m: "to listen", p: "tīng" },
    { w: "瓶", m: "bottle", p: "píng" },
    { w: "停", m: "to stop", p: "tíng" },
    { w: "冰", m: "ice", p: "bīng" },
  ],
  iong: [
    { w: "用", m: "to use", p: "yòng" },
    { w: "熊", m: "bear", p: "xióng" },
    { w: "窮,穷", m: "poor", p: "qióng" },
    { w: "兄", m: "elder brother", p: "xiōng" },
  ],

  // --- O Group ---
  o: [
    { w: "摸", m: "to touch", p: "mō" },
    { w: "魔", m: "magic/demon", p: "mó" },
  ],
  ong: [
    { w: "紅,红", m: "red", p: "hóng" },
    { w: "東,东", m: "East", p: "dōng" },
    { w: "空", m: "empty", p: "kōng" },
    { w: "龍,龙", m: "dragon", p: "lóng" },
    { w: "蟲,虫", m: "insect/worm", p: "chóng" },
  ],
  ou: [
    { w: "狗", m: "dog", p: "gǒu" },
    { w: "肉", m: "meat", p: "ròu" },
    { w: "手", m: "hand", p: "shǒu" },
    { w: "頭,头", m: "head", p: "tóu" },
    { w: "口", m: "mouth", p: "kǒu" },
  ],

  // --- U Group ---
  u: [
    { w: "書,书", m: "book", p: "shū" },
    { w: "五", m: "five", p: "wǔ" },
    { w: "哭", m: "to cry", p: "kū" },
    { w: "路", m: "road", p: "lù" },
    { w: "豬,猪", m: "pig", p: "zhū" },
  ],
  ua: [
    { w: "花", m: "flower", p: "huā" },
    { w: "畫,画", m: "picture/to paint", p: "huà" },
    { w: "瓜", m: "melon", p: "guā" },
    { w: "刷", m: "to brush", p: "shuā" },
  ],
  uo: [
    { w: "火", m: "fire", p: "huǒ" },
    { w: "我", m: "I/me", p: "wǒ" },
    { w: "坐", m: "to sit", p: "zuò" },
    { w: "做", m: "to do", p: "zuò" },
    { w: "錯,错", m: "wrong/mistake", p: "cuò" },
    { w: "果", m: "fruit", p: "guǒ" },
  ],
  ui: [
    { w: "水", m: "water", p: "shuǐ" },
    { w: "會,会", m: "can/meeting", p: "huì" },
    { w: "嘴", m: "mouth", p: "zuǐ" },
    { w: "貴,贵", m: "expensive", p: "guì" },
    { w: "睡", m: "to sleep", p: "shuì" },
  ],
  uai: [
    { w: "快", m: "fast", p: "kuài" },
    { w: "壞,坏", m: "bad/broken", p: "huài" },
    { w: "怪", m: "strange/monster", p: "guài" },
  ],
  uan: [
    { w: "玩", m: "to play", p: "wán" },
    { w: "晚", m: "late/night", p: "wǎn" },
    { w: "船", m: "boat", p: "chuán" },
    { w: "換,换", m: "to change", p: "huàn" },
  ],
  un: [
    { w: "春", m: "spring (season)", p: "chūn" },
    { w: "順,顺", m: "smooth/favorable", p: "shùn" },
    { w: "輪,轮", m: "wheel", p: "lún" },
    { w: "困", m: "sleepy", p: "kùn" },
    { w: "村", m: "village", p: "cūn" },
  ],
  uang: [
    { w: "黃,黄", m: "yellow", p: "huáng" },
    { w: "窗", m: "window", p: "chuāng" },
    { w: "光", m: "light", p: "guāng" },
  ],

  // --- Ü (Umlaut) Group ---
  ü: [
    { w: "雨", m: "rain", p: "yǔ" },
    { w: "魚,鱼", m: "fish", p: "yú" },
    { w: "去", m: "to go", p: "qù" },
    { w: "綠,绿", m: "green", p: "lǜ" },
    { w: "女", m: "female", p: "nǚ" },
  ],
  üe: [
    { w: "月", m: "moon/month", p: "yuè" },
    { w: "學,学", m: "to study", p: "xué" },
    { w: "雪", m: "snow", p: "xuě" },
    { w: "靴", m: "boots", p: "xuē" },
  ],
  üan: [
    { w: "圓,圆", m: "round", p: "yuán" },
    { w: "遠,远", m: "far", p: "yuǎn" },
    { w: "全", m: "whole/all", p: "quán" },
    { w: "選,选", m: "to choose", p: "xuǎn" },
  ],
  ün: [
    { w: "雲,云", m: "cloud", p: "yún" },
    { w: "裙", m: "skirt", p: "qún" },
    { w: "軍,军", m: "army", p: "jūn" },
    { w: "運,运", m: "luck/transport", p: "yùn" },
  ],
};

export function getChineseWords(finalPinyin: string): ChineseWordEntry[] {
  return chineseWords[finalPinyin] || [];
}

export function getChineseWordsDisplay(finalPinyin: string): string {
  const words = getChineseWords(finalPinyin);
  if (words.length === 0) return "";

  // Extract just the word part, taking only the first variant if there's a comma
  return words
    .map((entry) => {
      const word = entry.w.split(",")[0];
      return word;
    })
    .join(" / ");
}

export function getMDBGUrl(chineseText: string): string {
  // Use the first variant if there are traditional/simplified options
  const word = chineseText.split(",")[0];
  return `https://www.mdbg.net/chinese/dictionary?page=worddict&email=&wdrst=0&wdqb=${encodeURIComponent(word)}`;
}
