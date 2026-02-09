import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { buildMDBGUrl, buildYablaUrl, stripToneMarks } from "@/lib/zhuyinUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getWordsForPinyinStub, type PinyinWordEntry } from "@/data/pinyinStubsToWordsData";

interface CellPopupProps {
  pinyin: string;
  zhuyin: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const TONE_LABELS: Record<number, string> = {
  1: "1 - High",
  2: "2 - Rising",
  3: "3 - Dipping",
  4: "4 - Falling",
  5: "5 - Neutral",
};

const formatChinese = (entry: PinyinWordEntry): string => {
  if (entry.ct === entry.cs) {
    return entry.ct;
  }
  return `${entry.ct} - ${entry.cs}`;
};

const buildWordMDBGUrl = (traditionalChar: string): string => {
  return `https://www.mdbg.net/chinese/dictionary?page=worddict&wdqb=*${encodeURIComponent(traditionalChar)}*`;
};

export const CellPopup = ({ pinyin, zhuyin, open, onOpenChange, children }: CellPopupProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const mdbgUrl = buildMDBGUrl(pinyin);
  const yablaUrl = buildYablaUrl(pinyin);
  
  // Get words for this pinyin stub
  const pinyinStub = stripToneMarks(pinyin);
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
            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 hover:underline"
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
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setIsExpanded(!isExpanded)}
              >
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

            <div className="max-h-[200px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isExpanded && <TableHead className="w-10 text-xs">HSK</TableHead>}
                    <TableHead className="text-xs">Chinese</TableHead>
                    {isExpanded ? (
                      <TableHead className="text-xs">Tone Category</TableHead>
                    ) : (
                      <TableHead className="text-xs">Pinyin</TableHead>
                    )}
                    <TableHead className="text-xs">English Meaning</TableHead>
                    {isExpanded && <TableHead className="w-8"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {words.map((entry, index) => (
                    <TableRow key={index}>
                      {isExpanded && (
                        <TableCell className="text-xs py-1.5">
                          {entry.h === -1 ? "—" : entry.h}
                        </TableCell>
                      )}
                      <TableCell className="text-sm font-medium py-1.5">
                        {formatChinese(entry)}
                      </TableCell>
                      {isExpanded ? (
                        <TableCell className="text-xs text-muted-foreground py-1.5">
                          {TONE_LABELS[entry.t] || entry.t}
                        </TableCell>
                      ) : (
                        <TableCell className="text-xs text-muted-foreground py-1.5">
                          {entry.fp}
                        </TableCell>
                      )}
                      <TableCell className="text-xs py-1.5 max-w-[150px] truncate" title={entry.e}>
                        {entry.e}
                      </TableCell>
                      {isExpanded && (
                        <TableCell className="py-1.5">
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
