import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp, Volume2 } from "lucide-react";
import { buildMDBGUrl, buildYablaUrl, cleanPinyin, stripToneMarks } from "@/lib/zhuyinUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getWordsForPinyinStub, type PinyinWordEntry } from "@/data/pinyinStubsToWordsData";
import { useTTS } from "@/hooks/useTTS";

interface CellPopupProps {
  pinyin: string;
  zhuyin: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const TONE_LABELS: Record<number, string> = {
  1: "1-High",
  2: "2-Rising",
  3: "3-Dipping",
  4: "4-Falling",
  5: "5-Neutral",
};

const formatChinese = (entry: PinyinWordEntry): string => {
  if (entry.ct === entry.cs) {
    return entry.ct;
  }
  return `${entry.ct} - ${entry.cs}`;
};

const buildWordMDBGUrl = (traditionalChar: string): string => {
  return `https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=1&wdqb=*${encodeURIComponent(traditionalChar)}*`;
};

export const CellPopup = ({ pinyin, zhuyin, open, onOpenChange, children }: CellPopupProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { speak } = useTTS();
  const mdbgUrl = buildMDBGUrl(pinyin);
  const yablaUrl = buildYablaUrl(pinyin);

  // Get words for this pinyin stub
  const pinyinStub = cleanPinyin(stripToneMarks(pinyin));
  const words = getWordsForPinyinStub(pinyinStub);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto min-w-[400px] p-3" side="top" sideOffset={5}>
        <p className="text-sm text-muted-foreground mb-2">
          Pinyin audio for <span className="font-bold text-foreground text-base">{pinyin}</span> /{" "}
          <span className="font-bold text-pink-600 dark:text-pink-400 text-base">{zhuyin}</span> is not 100% perfect.
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          Audio varies by browser/phone.
          <a
            href="https://www.google.com/search?q=state+of+chinese+TTS+default+support+on+phones+and+browsers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary/80 hover:underline"
            onClick={() => onOpenChange(false)}
          >
            <span className="font-italic">Why?</span>
          </a>
        </p>
        <p className="text-sm text-muted-foreground mb-3">Find real words using the dictionary links below.</p>
        <div className="flex flex-col gap-2 mb-4">
          <a
            href={mdbgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 hover:underline"
            onClick={() => onOpenChange(false)}
          >
            Search for words and audio on <span className="font-semibold">MDBG</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href={yablaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 hover:underline"
            onClick={() => onOpenChange(false)}
          >
            Search for words and audio on <span className="font-semibold">Yabla</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Common Words Table */}
        {words.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">Common Words for {pinyin}</h4>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? (
                  <>
                    Less <ChevronUp className="h-3 w-3 ml-1" />
                  </>
                ) : (
                  <>
                    Expand <ChevronDown className="h-3 w-3 ml-1" />
                  </>
                )}
              </Button>
            </div>

            <div className="max-h-[200px] overflow-y-auto overflow-x-auto -mx-1">
              <Table className="text-xs w-max min-w-full ">
                {isExpanded && (
                  <TableHeader>
                    <TableRow className="h-auto">
                      <TableHead className="text-[8px] px-1 py-0.5 w-[1ch] break-all leading-none">HSK</TableHead>
                      <TableHead className="text-xs px-1 py-0.5 w-20">中文</TableHead>
                      <TableHead className="px-1 py-0.5">P</TableHead>
                      <TableHead className="text-xs px-1 py-0.5 w-[1ch] break-all leading-none">T</TableHead>
                      <TableHead className="text-xs px-1 py-0.5">Meaning</TableHead>
                      <TableHead className="px-1 py-0.5  w-[1ch]"></TableHead>
                    </TableRow>
                  </TableHeader>
                )}
                <TableBody>
                  {words.map((entry, index) => (
                    <TableRow key={index} className="h-auto">
                      {isExpanded && <TableCell className="px-1 py-0.5">{entry.h === -1 ? "—" : entry.h}</TableCell>}
                      <TableCell className="text-sm font-medium px-1 py-0.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 min-w-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              speak(entry.ct.split(",")[0], "zhuyin-comment");
                            }}
                            title="Speak this word"
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                          {formatChinese(entry)}
                        </span>
                      </TableCell>
                      {isExpanded && <TableCell className="text-muted-foreground px-1 py-0.5">{entry.fp}</TableCell>}
                      {isExpanded ? (
                        <TableCell className="text-muted-foreground px-0.5 py-0.5 whitespace-nowrap">
                          {entry.t}
                        </TableCell>
                      ) : (
                        <TableCell className="text-muted-foreground px-0.5 py-0.5">{entry.fp}</TableCell>
                      )}
                      <TableCell className="px-1 py-0.5 whitespace-nowrap">{entry.e}</TableCell>
                      {isExpanded && (
                        <TableCell className="px-0 py-0.5">
                          <a
                            href={buildWordMDBGUrl(entry.ct)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
