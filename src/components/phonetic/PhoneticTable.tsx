import { useCallback, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { finals, initials, getCell, gotchaCategories, type GotchaCategory } from "@/data/phoneticData";
import { RhymeWordsPopup } from "./RhymeWordsPopup";
import { ChineseWordsPopup } from "./ChineseWordsPopup";
import { useTTS, type AudioMode } from "@/hooks/useTTS";
import type { DisplayMode } from "./SettingsPanel";
import { CellPopup } from "./CellPopup";
import { cn } from "@/lib/utils";

interface PhoneticTableProps {
  displayMode: DisplayMode;
  highlightGotchas: boolean;
  activeGotchaCategories: Set<GotchaCategory>;
  audioMode: AudioMode;
  showMDBGPopup: boolean;
  showChineseWords: boolean;
  showEnglishRhyme: boolean;
  onOpenEnglishRhymeInfo: () => void;
  tableTextSize: number;
  tableBold: boolean;
}

const groupColors: Record<string, string> = {
  a: "bg-blue-50 dark:bg-blue-950/30",
  o: "bg-orange-50 dark:bg-orange-950/30",
  i: "bg-green-50 dark:bg-green-950/30",
  u: "bg-purple-50 dark:bg-purple-950/30",
  v: "bg-rose-50 dark:bg-rose-950/30",
};

export const PhoneticTable = ({
  displayMode,
  highlightGotchas,
  activeGotchaCategories,
  audioMode,
  showMDBGPopup,
  showChineseWords,
  showEnglishRhyme,
  onOpenEnglishRhymeInfo,
  tableTextSize,
  tableBold,
}: PhoneticTableProps) => {
  const isCompact = tableTextSize <= 90;
  const dynamicMaxWidth = Math.round(80 * tableTextSize / 100);
  const { speak, isSupported, error } = useTTS();
  const [clickedCell, setClickedCell] = useState<string | null>(null);
  const [popupCell, setPopupCell] = useState<string | null>(null);

  const handleCellClick = useCallback(
    (pinyin: string, zhuyin: string) => {
      // Use zhuyin for pronunciation with current audio mode
      speak(zhuyin, audioMode);

      // Visual feedback
      const key = `${pinyin}-${zhuyin}`;
      setClickedCell(key);
      setTimeout(() => setClickedCell(null), 200);

      // Show popup if enabled
      if (showMDBGPopup) {
        setPopupCell(key);
      }
    },
    [speak, audioMode, showMDBGPopup],
  );

  const getCellHighlightClass = (gotchas?: GotchaCategory[]): string => {
    if (!highlightGotchas || !gotchas || gotchas.length === 0) {
      return "";
    }

    // Find the first active gotcha category that matches this cell
    for (const gotcha of gotchas) {
      if (activeGotchaCategories.has(gotcha)) {
        const category = gotchaCategories.find((c) => c.id === gotcha);
        if (category) {
          return category.bgClass;
        }
      }
    }

    return "";
  };

  const renderCell = (
    cell: { pinyin: string; zhuyin: string; gotchas?: GotchaCategory[] } | null,
    finalPinyin: string,
  ) => {
    if (!cell) {
      return <TableCell key={finalPinyin} className="bg-muted/30" />;
    }

    const cellKey = `${cell.pinyin}-${cell.zhuyin}`;
    const isClicked = clickedCell === cellKey;
    const highlightClass = getCellHighlightClass(cell.gotchas);
    const isPopupOpen = popupCell === cellKey;

    const cellContent = (
      <div
        className={cn(
          "text-center cursor-pointer transition-all duration-150 hover:bg-accent/50",
          isCompact ? "p-1" : "p-2",
          highlightClass,
          isClicked && "scale-95 bg-accent",
        )}
        style={isCompact ? { maxWidth: `${dynamicMaxWidth}px` } : undefined}
        onClick={() => handleCellClick(cell.pinyin, cell.zhuyin)}
      >
        {(displayMode === "pinyin" || displayMode === "both") && (
          <div className={cn("text-sm", tableBold ? "font-bold" : "font-normal")}>{cell.pinyin}</div>
        )}
        {(displayMode === "zhuyin" || displayMode === "both") && (
          <div className={cn("text-xs text-pink-600 dark:text-pink-400", tableBold ? "font-medium" : "font-normal")}>{cell.zhuyin}</div>
        )}
      </div>
    );

    if (showMDBGPopup) {
      return (
        <TableCell key={finalPinyin} className="p-0">
          <CellPopup
            zhuyin={cell.zhuyin}
            open={isPopupOpen}
            onOpenChange={(open) => {
              if (!open) setPopupCell(null);
            }}
          >
            {cellContent}
          </CellPopup>
        </TableCell>
      );
    }

    return (
      <TableCell key={finalPinyin} className="p-0">
        {cellContent}
      </TableCell>
    );
  };

  return (
    <div className="relative">
      {/* TTS status indicator */}
      {error && <div className="mb-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
      {!isSupported && (
        <div className="mb-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          Text-to-speech is not supported in this browser.
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border shadow-sm" style={{ fontSize: `${tableTextSize}%` }}>
        <Table className={isCompact ? "" : "min-w-[1200px]"}>
          <TableHeader>
            {/* Chinese Words Row */}
            {showChineseWords && (
              <TableRow className="bg-red-900">
                <TableHead className={cn("sticky left-0 z-20 bg-red-900 text-white w-16", tableBold ? "font-bold" : "font-normal")}>
                  <span className="text-xs leading-tight">Chinese Words</span>
                </TableHead>
                {finals.map((final) => (
                  <TableHead
                    key={`chinese-${final.pinyin}`}
                    className={cn(
                      "text-center bg-red-900 text-white p-0",
                      tableBold ? "font-normal" : "font-normal",
                      !isCompact && "min-w-[60px]"
                    )}
                    style={isCompact ? { maxWidth: `${dynamicMaxWidth}px` } : undefined}
                  >
                    <ChineseWordsPopup finalPinyin={final.pinyin} />
                  </TableHead>
                ))}
              </TableRow>
            )}

            {/* English Rhyme Words Row */}
            {showEnglishRhyme && (
              <TableRow className="bg-blue-900">
                <TableHead className={cn("sticky left-0 z-20 bg-blue-900 text-yellow-300 w-16", tableBold ? "font-bold" : "font-normal")}>
                  <div className="flex items-center gap-1">
                    <span className="text-xs leading-tight">English Rhyme Words</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 rounded-full p-0 text-yellow-300 hover:text-yellow-100 hover:bg-blue-800"
                      onClick={onOpenEnglishRhymeInfo}
                    >
                      ?
                    </Button>
                  </div>
                </TableHead>
                {finals.map((final) => (
                  <TableHead
                    key={`rhyme-${final.pinyin}`}
                    className={cn(
                      "text-center text-xs bg-blue-900 text-yellow-300 p-0",
                      tableBold ? "font-normal" : "font-normal",
                      !isCompact && "min-w-[60px]"
                    )}
                    style={isCompact ? { maxWidth: `${dynamicMaxWidth}px` } : undefined}
                  >
                    <RhymeWordsPopup finalPinyin={final.pinyin} />
                  </TableHead>
                ))}
              </TableRow>
            )}

            {/* Init Row */}
            <TableRow>
              <TableHead className={cn("sticky left-0 z-20 bg-primary text-primary-foreground w-16", tableBold ? "font-bold" : "font-normal")}>
                Init
              </TableHead>
              {finals.map((final) => (
                <TableHead
                  key={final.pinyin}
                  className={cn(
                    "text-center text-xs",
                    tableBold ? "font-normal" : "font-normal",
                    !isCompact && "min-w-[60px]",
                    groupColors[final.group]
                  )}
                  style={isCompact ? { maxWidth: `${dynamicMaxWidth}px` } : undefined}
                >
                  <div className={tableBold ? "font-bold" : "font-normal"}>
                    {final.pinyin.startsWith("ü")
                      ? `${final.pinyin} / ${final.pinyin.replace("ü", "u")}`
                      : final.pinyin}
                  </div>
                  {final.hint && (
                    <div className="text-amber-600 dark:text-amber-400 text-[10px]">{final.hint}</div>
                  )}
                  <div className="text-muted-foreground">{final.zhuyin}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {initials.map((initial) => (
              <TableRow key={initial.pinyin}>
                <TableCell className={cn("sticky left-0 z-10 bg-primary/90 text-primary-foreground text-center", tableBold ? "font-bold" : "font-normal")}>
                  <div>{initial.pinyin}</div>
                  <div className="text-xs opacity-80">{initial.zhuyin}</div>
                </TableCell>
                {finals.map((final) => {
                  const cell = getCell(initial.pinyin, final.pinyin);
                  return renderCell(cell, final.pinyin);
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Click any cell to hear the pronunciation (first tone). Only works if you have Chinese TTS enabled (works on 50%
        of devices with no setup)
        <br />
        Beta Beta Beta. contact: buddhistfriendnetwork on{" "}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg"
          alt="Gmail icon"
          width="15"
          height="10"
          className="inline"
        />
      </p>
    </div>
  );
};
