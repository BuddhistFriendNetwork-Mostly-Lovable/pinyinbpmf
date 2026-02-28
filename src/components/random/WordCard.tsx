import { Volume2, Eye, EyeOff, ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RandomWordEntry } from "@/lib/randomWordsUtils";
import { cleanZhuyin } from "@/lib/zhuyinUtils";
import { buildMDBGUrl } from "@/lib/zhuyinUtils";
import { chartData, endings } from "@/data/phoneticData";

export interface WordCardDisplaySettings {
  showOnlyFirstChar: boolean;
  showPinyin: boolean;
  showZhuyin: boolean;
  zhuyinFormat: "boxes" | "plain";
  showEnglishSpeaker: boolean;
  showChineseSpeaker: boolean;
  showMDBGWord: boolean;
  showMDBGPinyin: boolean;
  mdbgIgnoreTone: boolean;
  showDifficultyDots?: boolean;
}

export type UserDifficulty = "easy" | "medium" | "hard" | null;

interface WordCardProps {
  word: RandomWordEntry;
  hidden: boolean[];
  settings: WordCardDisplaySettings;
  userDifficulty: UserDifficulty;
  onReveal: (rowIndex: number) => void;
  onSpeak: (text: string, lang: "zh" | "en") => void;
  onSetDifficulty: (d: UserDifficulty) => void;
  onRemove?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

function getZhuyinForStub(stub: string): string {
  // Try to find zhuyin from chartData by searching for a cell with matching stub
  for (const key of Object.keys(chartData)) {
    const cell = chartData[key];
    if (!cell) continue;
    const cellPinyin = cell.pinyin.replace(/[^a-zA-Zü]/g, "").toLowerCase();
    if (cellPinyin === stub) {
      return cell.zhuyin;
    }
  }
  // Fallback: look in endings
  const ending = endings.find((e) => e.pinyin === stub);
  if (ending) return ending.zhuyin;
  console.log("Error with ",stub);
  return "ERR";
}

export const WordCard = ({ word, hidden, settings, userDifficulty, onReveal, onSpeak, onSetDifficulty, onRemove, className, style }: WordCardProps) => {

  const chineseText = settings.showOnlyFirstChar ? word.cs[0] : word.cs;
  const pinyinText = settings.showOnlyFirstChar ? word.fp.split(" ")[0] : word.fp;

  const rawZhuyin = getZhuyinForStub(word.pinyinStub);
  const zhuyinChars = cleanZhuyin(rawZhuyin);

  const mdbgWordUrl = buildMDBGUrl(word.cs);
  const mdbgPinyinUrl = settings.mdbgIgnoreTone
    ? `https://www.mdbg.net/chinese/dictionary?page=worddict&wdqb=p%3A${encodeURIComponent(word.pinyinStub)}*`
    : `https://www.mdbg.net/chinese/dictionary?page=worddict&wdqb=p%3A${encodeURIComponent(word.fp)}*`;

  const renderRow = (
    rowIndex: number,
    content: React.ReactNode,
    extraClass?: string,
  ) => {
    const isHidden = hidden[rowIndex];
    return (
      <div
        className={cn(
          "relative px-2 py-1 flex items-center gap-1 min-h-[1.8rem]",
          extraClass,
        )}
      >
        {isHidden ? (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
            onClick={() => onReveal(rowIndex)}
          >
            <Eye className="h-4 w-4 text-muted-foreground/50" />
          </div>
        ) : null}
        <div className={cn("flex-1 flex items-center gap-1", isHidden && "filter blur-sm select-none")}>
          {content}
        </div>
      </div>
    );
  };

 function splitZhuyin(chars: string): string[] {
  const medials = ['ㄧ', 'ㄨ', 'ㄩ'];
  let boxes = ["", "", ""]; // [Initial, Medial, Final/Tone]

  // Convert string to array to handle multi-character strings correctly
  const charArray = Array.from(chars);

  // Check if any character in the string is a medial
  const medialIndex = charArray.findIndex(c => medials.includes(c));

  if (medialIndex !== -1) {
    // 1. Put the medial in Box 2 (index 1)
    boxes[1] = charArray[medialIndex];

    // 2. Put everything before it in Box 1 (index 0)
    boxes[0] = charArray.slice(0, medialIndex).join("");

    // 3. Put everything after it in Box 3 (index 2)
    boxes[2] = charArray.slice(medialIndex + 1).join("");
  } else {
    // No medial found: First char in Box 1, the rest in Box 3
    boxes[0] = charArray[0] || "";
    boxes[2] = charArray.slice(1).join("");
  }

  return boxes;
}
  
  const zhuyinBoxes = () => {
    if (!zhuyinChars) return null;
    const chars3boxArray = splitZhuyin(zhuyinChars);
    if (settings.zhuyinFormat === "boxes") {

      // look for the medial, if yes, put that in box2 (center) and put everything else at front and end
      // if not, put the first character in box1, and the second character in 3rd box.
      
      // 3 boxes
      return (
        <div className="flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-6 h-6 border border-muted-foreground/30 rounded flex items-center justify-center text-sm"
            >
              {chars3boxArray[i] || ""}
            </div>
          ))}
        </div>
      );
    }
    return <span className="text-sm">{zhuyinChars}</span>;
  };

  return (
    <div className={cn("border rounded-lg overflow-hidden bg-card text-card-foreground shadow-sm relative", className)} style={style}>
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-0.5 right-0.5 z-20 p-0.5 rounded hover:bg-destructive/20 transition-colors"
          title="Remove card"
        >
          <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
        </button>
      )}
      {/* Row 1: Chinese */}
      {renderRow(
        0,
        <>
          <span className="text-lg font-bold">{chineseText}</span>
          {settings.showChineseSpeaker && (
            <button
              onClick={() => onSpeak(chineseText, "zh")}
              className="p-0.5 hover:bg-accent rounded"
            >
              <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
          {settings.showMDBGWord && (
            <a href={mdbgWordUrl} target="_blank" rel="noopener noreferrer" className="p-0.5 hover:bg-accent rounded">
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </a>
          )}
        </>,
      )}

      {/* Divider between row 1 and 2 */}
      <div className="border-t border-dashed border-muted-foreground/30" />

      {/* Row 2: English */}
      {renderRow(
        1,
        <>
          <span className="text-xs text-muted-foreground truncate">{word.e}</span>
          {settings.showEnglishSpeaker && (
            <button
              onClick={() => onSpeak(word.e, "en")}
              className="p-0.5 hover:bg-accent rounded shrink-0"
            >
              <Volume2 className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </>,
      )}

      {/* Row 3: Pinyin */}
      {settings.showPinyin &&
        renderRow(
          2,
          <>
            <span className="text-sm">{pinyinText}</span>
            {settings.showMDBGPinyin && (
              <a href={mdbgPinyinUrl} target="_blank" rel="noopener noreferrer" className="p-0.5 hover:bg-accent rounded">
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </a>
            )}
          </>,
        )}

      {/* Row 4: Zhuyin */}
      {settings.showZhuyin && renderRow(3, zhuyinBoxes())}

      {/* Bottom bar: speaker, hide toggle, difficulty dots */}
      <div className="flex items-center justify-between gap-1 px-1.5 py-1 border-t border-muted-foreground/20">
        {/* Left: speaker */}
        <button
          onClick={() => onSpeak(chineseText, "zh")}
          className="p-0.5 hover:bg-accent rounded"
          title="Speak Chinese"
        >
          <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        {/* Middle: hide/show toggle */}
        <button
          onClick={() => {
            const allVisible = hidden.every((h) => !h);
            if (allVisible) {
              // Hide all 4 rows
              for (let r = 0; r < 4; r++) onReveal(-1 - r); // signal hide
            } else {
              // Show all 4 rows
              for (let r = 0; r < 4; r++) onReveal(r);
            }
          }}
          className="p-0.5 hover:bg-accent rounded"
          title={hidden.every((h) => !h) ? "Hide all rows" : "Show all rows"}
        >
          {hidden.every((h) => !h) ? (
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>

        {/* Right: difficulty dots */}
        {settings.showDifficultyDots !== false && (
          <div className="flex items-center gap-1">
            {(["easy", "medium", "hard"] as const).map((level) => {
              const color = level === "easy" ? "bg-green-500" : level === "hard" ? "bg-red-500" : "";
              const isSelected = userDifficulty === level;
              const isNull = userDifficulty === null;
              return (
                <button
                  key={level}
                  onClick={() => onSetDifficulty(isSelected ? null : level)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    color,
                    !isNull && !isSelected && "opacity-[0.35]",
                    isSelected && "ring-2 ring-blue-500 ring-offset-1",
                  )}
                  style={level === "medium" ? { backgroundColor: "#FBBF24" } : undefined}
                  title={`Mark as ${level}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
