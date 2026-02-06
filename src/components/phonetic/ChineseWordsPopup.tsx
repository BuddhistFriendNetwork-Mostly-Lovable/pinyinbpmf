import { Volume2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getChineseWords, getChineseWordsDisplay, getMDBGUrl, type ChineseWordEntry } from "@/data/chineseWordsData";
import { useTTS } from "@/hooks/useTTS";

interface ChineseWordsPopupProps {
  finalPinyin: string;
}

export const ChineseWordsPopup = ({ finalPinyin }: ChineseWordsPopupProps) => {
  const words = getChineseWords(finalPinyin);
  const displayText = getChineseWordsDisplay(finalPinyin);
  const { speak } = useTTS();

  if (words.length === 0) {
    return <span className="text-white/50 text-sm">—</span>;
  }

  const handleSpeak = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Use the first variant (traditional) if there are multiple
    const textToSpeak = word.split(",")[0];
    speak(textToSpeak, "zhuyin-comment");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full px-1 py-1 text-lg hover:bg-red-800 transition-colors cursor-pointer text-center">
          {displayText}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-[320px] p-0" align="center">
        <div className="p-2 border-b bg-muted/50">
          <h4 className="font-semibold text-sm">Common words with -{finalPinyin}</h4>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="text-center">Chinese</TableHead>
              <TableHead>Meaning</TableHead>
              <TableHead>Pinyin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {words.map((entry, index) => (
              <ChineseWordRow key={index} entry={entry} onSpeak={handleSpeak} />
            ))}
          </TableBody>
        </Table>
      </PopoverContent>
    </Popover>
  );
};

interface ChineseWordRowProps {
  entry: ChineseWordEntry;
  onSpeak: (word: string, e: React.MouseEvent) => void;
}

const ChineseWordRow = ({ entry, onSpeak }: ChineseWordRowProps) => {
  const url = getMDBGUrl(entry.w);
  
  return (
    <TableRow>
      <TableCell className="p-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => onSpeak(entry.w, e)}
          title="Speak this word"
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell className="text-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl font-medium text-primary hover:underline"
        >
          {entry.w}
        </a>
      </TableCell>
      <TableCell className="text-sm">{entry.m}</TableCell>
      <TableCell className="text-sm text-muted-foreground">{entry.p}</TableCell>
    </TableRow>
  );
};