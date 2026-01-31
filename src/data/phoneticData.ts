// Gotcha category types
export type GotchaCategory =
  | "explicit-u" // nü, lü, nüe, lüe
  | "hidden-u" // j/q/x + u
  | "y-as-u" // yu, yue, yuan, yun
  | "iong" // jiong, qiong, xiong, yong
  | "y to e silent" // yi
  | "labial-o" // bo, po, mo, fo
  | "buzzing-i" // zhi, chi, shi, ri, zi, ci, si
  | "iu" // miu, diu, niu, liu, jiu, qiu, xiu, you
  | "ui" // all -ui cells
  | "special" //
  | "w to wu"; // w to wu of zhuyin x only

export interface GotchaCategoryInfo {
  id: GotchaCategory;
  name: string;
  color: string;
  bgClass: string;
}

export const gotchaCategories: GotchaCategoryInfo[] = [
  { id: "explicit-u", name: "Explicit ü (n/l)", color: "hsl(45, 93%, 47%)", bgClass: "bg-amber-200" },
  { id: "hidden-u", name: "Hidden ü (j/q/x)", color: "hsl(24, 94%, 50%)", bgClass: "bg-orange-200" },
  { id: "y-as-u", name: "y- as ㄩ / ü", color: "hsl(350, 89%, 60%)", bgClass: "bg-rose-200" },
  { id: "iong", name: "-iong (ㄩㄥ)", color: "hsl(270, 67%, 60%)", bgClass: "bg-purple-200" },
  { id: "y to e silent", name: "Tricky y; e or silent", color: "hsl(142, 71%, 45%)", bgClass: "bg-green-200" },
  { id: "labial-o", name: "Labial + o", color: "hsl(174, 72%, 56%)", bgClass: "bg-teal-200" },
  { id: "buzzing-i", name: "Buzzing i", color: "hsl(330, 81%, 70%)", bgClass: "bg-pink-200" },
  { id: "iu", name: "-iu (ㄧㄡ)", color: "hsl(30, 41%, 50%)", bgClass: "bg-amber-300" },
  { id: "ui", name: "-ui (ㄨㄟ)", color: "hsl(16, 85%, 65%)", bgClass: "bg-orange-300" },
  { id: "special", name: "special", color: "hsl(82, 78%, 55%)", bgClass: "bg-lime-200" },
  { id: "w to wu", name: "w → wu", color: "hsl(217, 91%, 60%)", bgClass: "bg-blue-200" },
];

// Cell data structure
export interface PhoneticCell {
  pinyin: string;
  zhuyin: string;
  gotchas?: GotchaCategory[];
}

// Finals (columns)
export const finals = [
  { pinyin: "a", zhuyin: "ㄚ", group: "a" },
  { pinyin: "ai", zhuyin: "ㄞ", group: "a" },
  { pinyin: "ao", zhuyin: "ㄠ", group: "a" },
  { pinyin: "an", zhuyin: "ㄢ", group: "a" },
  { pinyin: "ang", zhuyin: "ㄤ", group: "a" },
  { pinyin: "e", zhuyin: "ㄜ/ㄝ", group: "o" },
  { pinyin: "ei", zhuyin: "ㄟ", group: "o" },
  { pinyin: "en", zhuyin: "ㄣ", group: "o" },
  { pinyin: "eng", zhuyin: "ㄥ", group: "o" },
  { pinyin: "er", zhuyin: "ㄦ", group: "o" },
  { pinyin: "i", zhuyin: "ㄧ or ZZZ", group: "i" },
  { pinyin: "ia", zhuyin: "ㄧㄚ", group: "i" },
  { pinyin: "iao", zhuyin: "ㄧㄠ", group: "i" },
  { pinyin: "ie", zhuyin: "ㄧㄝ", group: "i" },
  { pinyin: "iu", zhuyin: "ㄧㄡ", group: "i" },
  { pinyin: "ian", zhuyin: "ㄧㄢ", group: "i" },
  { pinyin: "in", zhuyin: "ㄧㄣ", group: "i" },
  { pinyin: "iang", zhuyin: "ㄧㄤ", group: "i" },
  { pinyin: "ing", zhuyin: "ㄧㄥ", group: "i" },
  { pinyin: "iong", zhuyin: "ㄩㄥ", group: "i" },
  { pinyin: "o", zhuyin: "ㄛ", group: "o" },
  { pinyin: "ong", zhuyin: "ㄨㄥ", group: "o" },
  { pinyin: "ou", zhuyin: "ㄡ", group: "o" },
  { pinyin: "u", zhuyin: "ㄨ", group: "u" },
  { pinyin: "ua", zhuyin: "ㄨㄚ", group: "u" },
  { pinyin: "uo", zhuyin: "ㄨㄛ", group: "u" },
  { pinyin: "ui", zhuyin: "ㄨㄟ", group: "u" },
  { pinyin: "uai", zhuyin: "ㄨㄞ", group: "u" },
  { pinyin: "uan", zhuyin: "ㄨㄢ", group: "u" },
  { pinyin: "un", zhuyin: "ㄨㄣ", group: "u" },
  { pinyin: "uang", zhuyin: "ㄨㄤ", group: "u" },
  { pinyin: "ü", zhuyin: "ㄩ", group: "v" },
  { pinyin: "üe", zhuyin: "ㄩㄝ", group: "v" },
  { pinyin: "üan", zhuyin: "ㄩㄢ", group: "v" },
  { pinyin: "ün", zhuyin: "ㄩㄣ", group: "v" },
];

// Initials (rows) with their zhuyin
export const initials = [
  { pinyin: "y?", zhuyin: "no/(+i)" },
  { pinyin: "w?", zhuyin: "no/(+u)" },
  { pinyin: "*er*", zhuyin: "special" },

  { pinyin: "b", zhuyin: "ㄅ" },
  { pinyin: "p", zhuyin: "ㄆ" },
  { pinyin: "m", zhuyin: "ㄇ" },
  { pinyin: "f", zhuyin: "ㄈ" },
  { pinyin: "d", zhuyin: "ㄉ" },
  { pinyin: "t", zhuyin: "ㄊ" },
  { pinyin: "n", zhuyin: "ㄋ" },
  { pinyin: "l", zhuyin: "ㄌ" },
  { pinyin: "g", zhuyin: "ㄍ" },
  { pinyin: "k", zhuyin: "ㄎ" },
  { pinyin: "h", zhuyin: "ㄏ" },
  { pinyin: "j", zhuyin: "ㄐ" },
  { pinyin: "q", zhuyin: "ㄑ" },
  { pinyin: "x", zhuyin: "ㄒ" },
  { pinyin: "zh", zhuyin: "ㄓ" },
  { pinyin: "ch", zhuyin: "ㄔ" },
  { pinyin: "sh", zhuyin: "ㄕ" },
  { pinyin: "r", zhuyin: "ㄖ" },
  { pinyin: "z", zhuyin: "ㄗ" },
  { pinyin: "c", zhuyin: "ㄘ" },
  { pinyin: "s", zhuyin: "ㄙ" },
];

// Build the chart data - map of "initial-finalPinyin" -> cell data
type ChartData = Record<string, PhoneticCell | null>;

// Helper to create cell
const cell = (pinyin: string, zhuyin: string, gotchas?: GotchaCategory[]): PhoneticCell => ({
  pinyin,
  zhuyin,
  gotchas,
});

// Complete chart data
export const chartData: ChartData = {
  // er singleton
  "*er*-er": cell("er", "ㄦ", ["special"]),

  // y row
  "y?-a": cell("(ya)", "ㄧㄚ → ~ia ", ["y to e silent"]),
  "y?-ia": cell("ya", "ㄧㄚ", ["y to e silent"]), //dup
  "y?-ao": cell("(yao)", "ㄧㄠ → ~iao", ["y to e silent"]),
  "y?-iao": cell("yao", "ㄧㄠ", ["y to e silent"]), //dup
  "y?-an": cell("(yan)", "ㄧㄢ → ~ian", ["y to e silent"]),
  "y?-ian": cell("yan", "ㄧㄢ", ["y to e silent"]), //dup
  "y?-ang": cell("(yang)", "ㄧㄤ → iang", ["y to e silent"]),
  "y?-iang": cell("yang", "ㄧㄤ", ["y to e silent"]), //dup
  "y?-ong": cell("(yong)", "ㄧㄨㄥ → ~iong", ["iong"]),
  "y?-iong": cell("yong", "ㄧㄨㄥ", ["iong"]), // dup
  "y?-ou": cell("(you)", "ㄧㄡ → ~iu", ["iu"]),
  "y?-iu": cell("you", "ㄧㄡ", ["iu"]), // dup
  "y?-e": cell("(ye**)", "ㄧㄝ → ~ie", ["special"]),
  "y?-ie": cell("ye**", "ㄧㄝ", ["special"]), // dup
  "y?-i": cell("yi", "ㄧ", ["special"]),
  "y?-ü": cell("yu", "ㄩ", ["y-as-u"]),
  "y?-üe": cell("yue", "ㄩㄝ", ["y-as-u"]),
  "y?-üan": cell("yuan", "ㄩㄢ", ["y-as-u"]),
  "y?-ün": cell("yun", "ㄩㄣ", ["y-as-u"]),

  "y?-in": cell("yin", "ㄧㄣ", ["y to e silent"]), // missing from initial list
  "y?-ing": cell("ying", "ㄧㄥ", ["y to e silent"]), // missing from initial list

  // w row
  "w?-a": cell("(wa)", "ㄨㄚ → ~ua", ["w to wu"]),
  "w?-ua": cell("wa", "ㄨㄚ", ["w to wu"]), // dup
  "w?-ai": cell("(wai)", "ㄨㄞ → ~uai", ["w to wu"]),
  "w?-uai": cell("wai", "ㄨㄞ", ["w to wu"]), // dup
  "w?-an": cell("(wan)", "ㄨㄢ → ~uan", ["w to wu"]),
  "w?-uan": cell("wan", "ㄨㄢ", ["w to wu"]), // dup
  "w?-ang": cell("(wang)", "ㄨㄤ → ~uang", ["w to wu"]),
  "w?-uang": cell("wang", "ㄨㄤ", ["w to wu"]), // dup
  "w?-o": cell("(wo)", "ㄨㄛ → ~uo", ["w to wu"]),
  "w?-uo": cell("wo", "ㄨㄛ", ["w to wu"]), // dup
  "w?-ei": cell("(wei*)", "ㄨㄟ → ~ui", ["ui"]),
  "w?-ui": cell("wei*", "ㄨㄟ", ["ui"]), // dup
  "w?-en": cell("(wen*)", "ㄨㄣ → ~un", ["special"]),
  "w?-un": cell("wen*", "ㄨㄣ", ["special"]), // dup
  "w?-eng": cell("weng", "ㄨㄥ", ["w to wu"]),
  "w?-u": cell("wu", "ㄨ", ["w to wu"]),

  // b row
  "b-a": cell("ba", "ㄅㄚ"),
  "b-ai": cell("bai", "ㄅㄞ"),
  "b-ao": cell("bao", "ㄅㄠ"),
  "b-an": cell("ban", "ㄅㄢ"),
  "b-ang": cell("bang", "ㄅㄤ"),
  "b-o": cell("bo", "ㄅㄛ", ["labial-o"]),
  "b-ei": cell("bei", "ㄅㄟ"),
  "b-en": cell("ben", "ㄅㄣ"),
  "b-eng": cell("beng", "ㄅㄥ"),
  "b-i": cell("bi", "ㄅㄧ"),
  "b-iao": cell("biao", "ㄅㄧㄠ"),
  "b-ie": cell("bie", "ㄅㄧㄝ"),
  "b-ian": cell("bian", "ㄅㄧㄢ"),
  "b-in": cell("bin", "ㄅㄧㄣ"),
  "b-ing": cell("bing", "ㄅㄧㄥ"),
  "b-u": cell("bu", "ㄅㄨ"),

  // p row
  "p-a": cell("pa", "ㄆㄚ"),
  "p-ai": cell("pai", "ㄆㄞ"),
  "p-ao": cell("pao", "ㄆㄠ"),
  "p-an": cell("pan", "ㄆㄢ"),
  "p-ang": cell("pang", "ㄆㄤ"),
  "p-o": cell("po", "ㄆㄛ", ["labial-o"]),
  "p-ou": cell("pou", "ㄆㄡ"),
  "p-ei": cell("pei", "ㄆㄟ"),
  "p-en": cell("pen", "ㄆㄣ"),
  "p-eng": cell("peng", "ㄆㄥ"),
  "p-i": cell("pi", "ㄆㄧ"),
  "p-iao": cell("piao", "ㄆㄧㄠ"),
  "p-ie": cell("pie", "ㄆㄧㄝ"),
  "p-ian": cell("pian", "ㄆㄧㄢ"),
  "p-in": cell("pin", "ㄆㄧㄣ"),
  "p-ing": cell("ping", "ㄆㄧㄥ"),
  "p-u": cell("pu", "ㄆㄨ"),

  // m row
  "m-a": cell("ma", "ㄇㄚ"),
  "m-ai": cell("mai", "ㄇㄞ"),
  "m-ao": cell("mao", "ㄇㄠ"),
  "m-an": cell("man", "ㄇㄢ"),
  "m-ang": cell("mang", "ㄇㄤ"),
  "m-o": cell("mo", "ㄇㄛ", ["labial-o"]),
  "m-ou": cell("mou", "ㄇㄡ"),
  "m-e": cell("me", "ㄇㄜ"),
  "m-ei": cell("mei", "ㄇㄟ"),
  "m-en": cell("men", "ㄇㄣ"),
  "m-eng": cell("meng", "ㄇㄥ"),
  "m-i": cell("mi", "ㄇㄧ"),
  "m-iao": cell("miao", "ㄇㄧㄠ"),
  "m-ie": cell("mie", "ㄇㄧㄝ"),
  "m-iu": cell("miu", "ㄇㄧㄡ", ["iu"]),
  "m-ian": cell("mian", "ㄇㄧㄢ"),
  "m-in": cell("min", "ㄇㄧㄣ"),
  "m-ing": cell("ming", "ㄇㄧㄥ"),
  "m-u": cell("mu", "ㄇㄨ"),

  // f row
  "f-a": cell("fa", "ㄈㄚ"),
  "f-an": cell("fan", "ㄈㄢ"),
  "f-ang": cell("fang", "ㄈㄤ"),
  "f-o": cell("fo", "ㄈㄛ", ["labial-o"]),
  "f-ou": cell("fou", "ㄈㄡ"),
  "f-ei": cell("fei", "ㄈㄟ"),
  "f-en": cell("fen", "ㄈㄣ"),
  "f-eng": cell("feng", "ㄈㄥ"),
  "f-u": cell("fu", "ㄈㄨ"),

  // d row
  "d-a": cell("da", "ㄉㄚ"),
  "d-ai": cell("dai", "ㄉㄞ"),
  "d-ao": cell("dao", "ㄉㄠ"),
  "d-an": cell("dan", "ㄉㄢ"),
  "d-ang": cell("dang", "ㄉㄤ"),
  "d-ong": cell("dong", "ㄉㄨㄥ"),
  "d-ou": cell("dou", "ㄉㄡ"),
  "d-e": cell("de", "ㄉㄜ"),
  "d-ei": cell("dei", "ㄉㄟ"),
  "d-en": cell("den", "ㄉㄣ"),
  "d-eng": cell("deng", "ㄉㄥ"),
  "d-i": cell("di", "ㄉㄧ"),
  "d-iao": cell("diao", "ㄉㄧㄠ"),
  "d-ie": cell("die", "ㄉㄧㄝ"),
  "d-iu": cell("diu", "ㄉㄧㄡ", ["iu"]),
  "d-ian": cell("dian", "ㄉㄧㄢ"),
  "d-ing": cell("ding", "ㄉㄧㄥ"),
  "d-u": cell("du", "ㄉㄨ"),
  "d-uo": cell("duo", "ㄉㄨㄛ"),
  "d-ui": cell("dui", "ㄉㄨㄟ", ["ui"]),
  "d-uan": cell("duan", "ㄉㄨㄢ"),
  "d-un": cell("dun", "ㄉㄨㄣ"),

  // t row
  "t-a": cell("ta", "ㄊㄚ"),
  "t-ai": cell("tai", "ㄊㄞ"),
  "t-ao": cell("tao", "ㄊㄠ"),
  "t-an": cell("tan", "ㄊㄢ"),
  "t-ang": cell("tang", "ㄊㄤ"),
  "t-ong": cell("tong", "ㄊㄨㄥ"),
  "t-ou": cell("tou", "ㄊㄡ"),
  "t-e": cell("te", "ㄊㄜ"),
  "t-eng": cell("teng", "ㄊㄥ"),
  "t-i": cell("ti", "ㄊㄧ"),
  "t-iao": cell("tiao", "ㄊㄧㄠ"),
  "t-ie": cell("tie", "ㄊㄧㄝ"),
  "t-ian": cell("tian", "ㄊㄧㄢ"),
  "t-ing": cell("ting", "ㄊㄧㄥ"),
  "t-u": cell("tu", "ㄊㄨ"),
  "t-uo": cell("tuo", "ㄊㄨㄛ"),
  "t-ui": cell("tui", "ㄊㄨㄟ", ["ui"]),
  "t-uan": cell("tuan", "ㄊㄨㄢ"),
  "t-un": cell("tun", "ㄊㄨㄣ"),

  // n row
  "n-a": cell("na", "ㄋㄚ"),
  "n-ai": cell("nai", "ㄋㄞ"),
  "n-ao": cell("nao", "ㄋㄠ"),
  "n-an": cell("nan", "ㄋㄢ"),
  "n-ang": cell("nang", "ㄋㄤ"),
  "n-ong": cell("nong", "ㄋㄨㄥ"),
  "n-ou": cell("nou", "ㄋㄡ"),
  "n-e": cell("ne", "ㄋㄜ"),
  "n-ei": cell("nei", "ㄋㄟ"),
  "n-en": cell("nen", "ㄋㄣ"),
  "n-eng": cell("neng", "ㄋㄥ"),
  "n-i": cell("ni", "ㄋㄧ"),
  "n-iao": cell("niao", "ㄋㄧㄠ"),
  "n-ie": cell("nie", "ㄋㄧㄝ"),
  "n-iu": cell("niu", "ㄋㄧㄡ", ["iu"]),
  "n-ian": cell("nian", "ㄋㄧㄢ"),
  "n-in": cell("nin", "ㄋㄧㄣ"),
  "n-iang": cell("niang", "ㄋㄧㄤ"),
  "n-ing": cell("ning", "ㄋㄧㄥ"),
  "n-u": cell("nu", "ㄋㄨ"),
  "n-uo": cell("nuo", "ㄋㄨㄛ"),
  "n-uan": cell("nuan", "ㄋㄨㄢ"),
  "n-ü": cell("nü", "ㄋㄩ", ["explicit-u"]),
  "n-üe": cell("nüe", "ㄋㄩㄝ", ["explicit-u"]),

  // l row
  "l-a": cell("la", "ㄌㄚ"),
  "l-ai": cell("lai", "ㄌㄞ"),
  "l-ao": cell("lao", "ㄌㄠ"),
  "l-an": cell("lan", "ㄌㄢ"),
  "l-ang": cell("lang", "ㄌㄤ"),
  "l-ong": cell("long", "ㄌㄨㄥ"),
  "l-ou": cell("lou", "ㄌㄡ"),
  "l-e": cell("le", "ㄌㄜ"),
  "l-ei": cell("lei", "ㄌㄟ"),
  "l-eng": cell("leng", "ㄌㄥ"),
  "l-i": cell("li", "ㄌㄧ"),
  "l-iao": cell("liao", "ㄌㄧㄠ"),
  "l-ie": cell("lie", "ㄌㄧㄝ"),
  "l-iu": cell("liu", "ㄌㄧㄡ", ["iu"]),
  "l-ian": cell("lian", "ㄌㄧㄢ"),
  "l-in": cell("lin", "ㄌㄧㄣ"),
  "l-iang": cell("liang", "ㄌㄧㄤ"),
  "l-ing": cell("ling", "ㄌㄧㄥ"),
  "l-u": cell("lu", "ㄌㄨ"),
  "l-uo": cell("luo", "ㄌㄨㄛ"),
  "l-uan": cell("luan", "ㄌㄨㄢ"),
  "l-un": cell("lun", "ㄌㄨㄣ"),
  "l-ü": cell("lü", "ㄌㄩ", ["explicit-u"]),
  "l-üe": cell("lüe", "ㄌㄩㄝ", ["explicit-u"]),

  // g row
  "g-a": cell("ga", "ㄍㄚ"),
  "g-ai": cell("gai", "ㄍㄞ"),
  "g-ao": cell("gao", "ㄍㄠ"),
  "g-an": cell("gan", "ㄍㄢ"),
  "g-ang": cell("gang", "ㄍㄤ"),
  "g-ong": cell("gong", "ㄍㄨㄥ"),
  "g-ou": cell("gou", "ㄍㄡ"),
  "g-e": cell("ge", "ㄍㄜ"),
  "g-ei": cell("gei", "ㄍㄟ"),
  "g-en": cell("gen", "ㄍㄣ"),
  "g-eng": cell("geng", "ㄍㄥ"),
  "g-u": cell("gu", "ㄍㄨ"),
  "g-ua": cell("gua", "ㄍㄨㄚ"),
  "g-uo": cell("guo", "ㄍㄨㄛ"),
  "g-ui": cell("gui", "ㄍㄨㄟ", ["ui"]),
  "g-uai": cell("guai", "ㄍㄨㄞ"),
  "g-uan": cell("guan", "ㄍㄨㄢ"),
  "g-un": cell("gun", "ㄍㄨㄣ"),
  "g-uang": cell("guang", "ㄍㄨㄤ"),

  // k row
  "k-a": cell("ka", "ㄎㄚ"),
  "k-ai": cell("kai", "ㄎㄞ"),
  "k-ao": cell("kao", "ㄎㄠ"),
  "k-an": cell("kan", "ㄎㄢ"),
  "k-ang": cell("kang", "ㄎㄤ"),
  "k-ong": cell("kong", "ㄎㄨㄥ"),
  "k-ou": cell("kou", "ㄎㄡ"),
  "k-e": cell("ke", "ㄎㄜ"),
  "k-ei": cell("kei", "ㄎㄟ"),
  "k-en": cell("ken", "ㄎㄣ"),
  "k-eng": cell("keng", "ㄎㄥ"),
  "k-u": cell("ku", "ㄎㄨ"),
  "k-ua": cell("kua", "ㄎㄨㄚ"),
  "k-uo": cell("kuo", "ㄎㄨㄛ"),
  "k-ui": cell("kui", "ㄎㄨㄟ", ["ui"]),
  "k-uai": cell("kuai", "ㄎㄨㄞ"),
  "k-uan": cell("kuan", "ㄎㄨㄢ"),
  "k-un": cell("kun", "ㄎㄨㄣ"),
  "k-uang": cell("kuang", "ㄎㄨㄤ"),

  // h row
  "h-a": cell("ha", "ㄏㄚ"),
  "h-ai": cell("hai", "ㄏㄞ"),
  "h-ao": cell("hao", "ㄏㄠ"),
  "h-an": cell("han", "ㄏㄢ"),
  "h-ang": cell("hang", "ㄏㄤ"),
  "h-ong": cell("hong", "ㄏㄨㄥ"),
  "h-ou": cell("hou", "ㄏㄡ"),
  "h-e": cell("he", "ㄏㄜ"),
  "h-ei": cell("hei", "ㄏㄟ"),
  "h-en": cell("hen", "ㄏㄣ"),
  "h-eng": cell("heng", "ㄏㄥ"),
  "h-u": cell("hu", "ㄏㄨ"),
  "h-ua": cell("hua", "ㄏㄨㄚ"),
  "h-uo": cell("huo", "ㄏㄨㄛ"),
  "h-ui": cell("hui", "ㄏㄨㄟ", ["ui"]),
  "h-uai": cell("huai", "ㄏㄨㄞ"),
  "h-uan": cell("huan", "ㄏㄨㄢ"),
  "h-un": cell("hun", "ㄏㄨㄣ"),
  "h-uang": cell("huang", "ㄏㄨㄤ"),

  // j row
  "j-i": cell("ji", "ㄐㄧ"),
  "j-ia": cell("jia", "ㄐㄧㄚ"),
  "j-iao": cell("jiao", "ㄐㄧㄠ"),
  "j-ie": cell("jie", "ㄐㄧㄝ"),
  "j-iu": cell("jiu", "ㄐㄧㄡ", ["iu"]),
  "j-ian": cell("jian", "ㄐㄧㄢ"),
  "j-in": cell("jin", "ㄐㄧㄣ"),
  "j-iang": cell("jiang", "ㄐㄧㄤ"),
  "j-ing": cell("jing", "ㄐㄧㄥ"),
  "j-iong": cell("jiong", "ㄐㄩㄥ", ["iong"]),
  "j-ü": cell("ju", "ㄐㄩ", ["hidden-u"]),
  "j-üe": cell("jue", "ㄐㄩㄝ", ["hidden-u"]),
  "j-üan": cell("juan", "ㄐㄩㄢ", ["hidden-u"]),
  "j-ün": cell("jun", "ㄐㄩㄣ", ["hidden-u"]),

  // q row
  "q-i": cell("qi", "ㄑㄧ"),
  "q-ia": cell("qia", "ㄑㄧㄚ"),
  "q-iao": cell("qiao", "ㄑㄧㄠ"),
  "q-ie": cell("qie", "ㄑㄧㄝ"),
  "q-iu": cell("qiu", "ㄑㄧㄡ", ["iu"]),
  "q-ian": cell("qian", "ㄑㄧㄢ"),
  "q-in": cell("qin", "ㄑㄧㄣ"),
  "q-iang": cell("qiang", "ㄑㄧㄤ"),
  "q-ing": cell("qing", "ㄑㄧㄥ"),
  "q-iong": cell("qiong", "ㄑㄩㄥ", ["iong"]),
  "q-ü": cell("qu", "ㄑㄩ", ["hidden-u"]),
  "q-üe": cell("que", "ㄑㄩㄝ", ["hidden-u"]),
  "q-üan": cell("quan", "ㄑㄩㄢ", ["hidden-u"]),
  "q-ün": cell("qun", "ㄑㄩㄣ", ["hidden-u"]),

  // x row
  "x-i": cell("xi", "ㄒㄧ"),
  "x-ia": cell("xia", "ㄒㄧㄚ"),
  "x-iao": cell("xiao", "ㄒㄧㄠ"),
  "x-ie": cell("xie", "ㄒㄧㄝ"),
  "x-iu": cell("xiu", "ㄒㄧㄡ", ["iu"]),
  "x-ian": cell("xian", "ㄒㄧㄢ"),
  "x-in": cell("xin", "ㄒㄧㄣ"),
  "x-iang": cell("xiang", "ㄒㄧㄤ"),
  "x-ing": cell("xing", "ㄒㄧㄥ"),
  "x-iong": cell("xiong", "ㄒㄩㄥ", ["iong"]),
  "x-ü": cell("xu", "ㄒㄩ", ["hidden-u"]),
  "x-üe": cell("xue", "ㄒㄩㄝ", ["hidden-u"]),
  "x-üan": cell("xuan", "ㄒㄩㄢ", ["hidden-u"]),
  "x-ün": cell("xun", "ㄒㄩㄣ", ["hidden-u"]),

  // zh row
  "zh-a": cell("zha", "ㄓㄚ"),
  "zh-ai": cell("zhai", "ㄓㄞ"),
  "zh-ao": cell("zhao", "ㄓㄠ"),
  "zh-an": cell("zhan", "ㄓㄢ"),
  "zh-ang": cell("zhang", "ㄓㄤ"),
  "zh-ong": cell("zhong", "ㄓㄨㄥ"),
  "zh-ou": cell("zhou", "ㄓㄡ"),
  "zh-e": cell("zhe", "ㄓㄜ"),
  "zh-ei": cell("zhei", "ㄓㄟ"),
  "zh-en": cell("zhen", "ㄓㄣ"),
  "zh-eng": cell("zheng", "ㄓㄥ"),
  "zh-i": cell("zhi", "ㄓ", ["buzzing-i"]),
  "zh-u": cell("zhu", "ㄓㄨ"),
  "zh-ua": cell("zhua", "ㄓㄨㄚ"),
  "zh-uo": cell("zhuo", "ㄓㄨㄛ"),
  "zh-ui": cell("zhui", "ㄓㄨㄟ", ["ui"]),
  "zh-uai": cell("zhuai", "ㄓㄨㄞ"),
  "zh-uan": cell("zhuan", "ㄓㄨㄢ"),
  "zh-un": cell("zhun", "ㄓㄨㄣ"),
  "zh-uang": cell("zhuang", "ㄓㄨㄤ"),

  // ch row
  "ch-a": cell("cha", "ㄔㄚ"),
  "ch-ai": cell("chai", "ㄔㄞ"),
  "ch-ao": cell("chao", "ㄔㄠ"),
  "ch-an": cell("chan", "ㄔㄢ"),
  "ch-ang": cell("chang", "ㄔㄤ"),
  "ch-ong": cell("chong", "ㄔㄨㄥ"),
  "ch-ou": cell("chou", "ㄔㄡ"),
  "ch-e": cell("che", "ㄔㄜ"),
  "ch-en": cell("chen", "ㄔㄣ"),
  "ch-eng": cell("cheng", "ㄔㄥ"),
  "ch-i": cell("chi", "ㄔ", ["buzzing-i"]),
  "ch-u": cell("chu", "ㄔㄨ"),
  "ch-ua": cell("chua", "ㄔㄨㄚ"),
  "ch-uo": cell("chuo", "ㄔㄨㄛ"),
  "ch-ui": cell("chui", "ㄔㄨㄟ", ["ui"]),
  "ch-uai": cell("chuai", "ㄔㄨㄞ"),
  "ch-uan": cell("chuan", "ㄔㄨㄢ"),
  "ch-un": cell("chun", "ㄔㄨㄣ"),
  "ch-uang": cell("chuang", "ㄔㄨㄤ"),

  // sh row
  "sh-a": cell("sha", "ㄕㄚ"),
  "sh-ai": cell("shai", "ㄕㄞ"),
  "sh-ao": cell("shao", "ㄕㄠ"),
  "sh-an": cell("shan", "ㄕㄢ"),
  "sh-ang": cell("shang", "ㄕㄤ"),
  "sh-ou": cell("shou", "ㄕㄡ"),
  "sh-e": cell("she", "ㄕㄜ"),
  "sh-ei": cell("shei", "ㄕㄟ"),
  "sh-en": cell("shen", "ㄕㄣ"),
  "sh-eng": cell("sheng", "ㄕㄥ"),
  "sh-i": cell("shi", "ㄕ", ["buzzing-i"]),
  "sh-u": cell("shu", "ㄕㄨ"),
  "sh-ua": cell("shua", "ㄕㄨㄚ"),
  "sh-uo": cell("shuo", "ㄕㄨㄛ"),
  "sh-ui": cell("shui", "ㄕㄨㄟ", ["ui"]),
  "sh-uai": cell("shuai", "ㄕㄨㄞ"),
  "sh-uan": cell("shuan", "ㄕㄨㄢ"),
  "sh-un": cell("shun", "ㄕㄨㄣ"),
  "sh-uang": cell("shuang", "ㄕㄨㄤ"),

  // r row
  "r-ao": cell("rao", "ㄖㄠ"),
  "r-an": cell("ran", "ㄖㄢ"),
  "r-ang": cell("rang", "ㄖㄤ"),
  "r-ong": cell("rong", "ㄖㄨㄥ"),
  "r-ou": cell("rou", "ㄖㄡ"),
  "r-e": cell("re", "ㄖㄜ"),
  "r-en": cell("ren", "ㄖㄣ"),
  "r-eng": cell("reng", "ㄖㄥ"),
  "r-i": cell("ri", "ㄖ", ["buzzing-i"]),
  "r-u": cell("ru", "ㄖㄨ"),
  "r-ua": cell("rua", "ㄖㄨㄚ"),
  "r-uo": cell("ruo", "ㄖㄨㄛ"),
  "r-ui": cell("rui", "ㄖㄨㄟ", ["ui"]),
  "r-uan": cell("ruan", "ㄖㄨㄢ"),
  "r-un": cell("run", "ㄖㄨㄣ"),

  // z row
  "z-a": cell("za", "ㄗㄚ"),
  "z-ai": cell("zai", "ㄗㄞ"),
  "z-ao": cell("zao", "ㄗㄠ"),
  "z-an": cell("zan", "ㄗㄢ"),
  "z-ang": cell("zang", "ㄗㄤ"),
  "z-ong": cell("zong", "ㄗㄨㄥ"),
  "z-ou": cell("zou", "ㄗㄡ"),
  "z-e": cell("ze", "ㄗㄜ"),
  "z-ei": cell("zei", "ㄗㄟ"),
  "z-en": cell("zen", "ㄗㄣ"),
  "z-eng": cell("zeng", "ㄗㄥ"),
  "z-i": cell("zi", "ㄗ", ["buzzing-i"]),
  "z-u": cell("zu", "ㄗㄨ"),
  "z-uo": cell("zuo", "ㄗㄨㄛ"),
  "z-ui": cell("zui", "ㄗㄨㄟ", ["ui"]),
  "z-uan": cell("zuan", "ㄗㄨㄢ"),
  "z-un": cell("zun", "ㄗㄨㄣ"),

  // c row
  "c-a": cell("ca", "ㄘㄚ"),
  "c-ai": cell("cai", "ㄘㄞ"),
  "c-ao": cell("cao", "ㄘㄠ"),
  "c-an": cell("can", "ㄘㄢ"),
  "c-ang": cell("cang", "ㄘㄤ"),
  "c-ong": cell("cong", "ㄘㄨㄥ"),
  "c-ou": cell("cou", "ㄘㄡ"),
  "c-e": cell("ce", "ㄘㄜ"),
  "c-en": cell("cen", "ㄘㄣ"),
  "c-eng": cell("ceng", "ㄘㄥ"),
  "c-i": cell("ci", "ㄘ", ["buzzing-i"]),
  "c-u": cell("cu", "ㄘㄨ"),
  "c-uo": cell("cuo", "ㄘㄨㄛ"),
  "c-ui": cell("cui", "ㄘㄨㄟ", ["ui"]),
  "c-uan": cell("cuan", "ㄘㄨㄢ"),
  "c-un": cell("cun", "ㄘㄨㄣ"),

  // s row
  "s-a": cell("sa", "ㄙㄚ"),
  "s-ai": cell("sai", "ㄙㄞ"),
  "s-ao": cell("sao", "ㄙㄠ"),
  "s-an": cell("san", "ㄙㄢ"),
  "s-ang": cell("sang", "ㄙㄤ"),
  "s-ong": cell("song", "ㄙㄨㄥ"),
  "s-ou": cell("sou", "ㄙㄡ"),
  "s-e": cell("se", "ㄙㄜ"),
  "s-en": cell("sen", "ㄙㄣ"),
  "s-eng": cell("seng", "ㄙㄥ"),
  "s-i": cell("si", "ㄙ", ["buzzing-i"]),
  "s-u": cell("su", "ㄙㄨ"),
  "s-uo": cell("suo", "ㄙㄨㄛ"),
  "s-ui": cell("sui", "ㄙㄨㄟ", ["ui"]),
  "s-uan": cell("suan", "ㄙㄨㄢ"),
  "s-un": cell("sun", "ㄙㄨㄣ"),
};

// Get cell by initial and final
export const getCell = (initial: string, finalPinyin: string): PhoneticCell | null => {
  return chartData[`${initial}-${finalPinyin}`] || null;
};
