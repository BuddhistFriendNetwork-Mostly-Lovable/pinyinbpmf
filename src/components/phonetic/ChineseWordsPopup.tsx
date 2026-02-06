import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getChineseWords, getChineseWordsDisplay, getMDBGUrl, type ChineseWordEntry } from "@/data/chineseWordsData";

interface ChineseWordsPopupProps {
  finalPinyin: string;
}

export const ChineseWordsPopup = ({ finalPinyin }: ChineseWordsPopupProps) => {
  const words = getChineseWords(finalPinyin);
  const displayText = getChineseWordsDisplay(finalPinyin);

  if (words.length === 0) {
    return <span className="text-white/50 text-sm">—</span>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full px-1 py-1 text-lg hover:bg-red-800 transition-colors cursor-pointer text-center">
          {displayText}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-[280px] p-0" align="center">
        <div className="p-2 border-b bg-muted/50">
          <h4 className="font-semibold text-sm">Common words with -{finalPinyin}</h4>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Chinese</TableHead>
              <TableHead>Meaning</TableHead>
              <TableHead>Pinyin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {words.map((entry, index) => (
              <ChineseWordRow key={index} entry={entry} />
            ))}
          </TableBody>
        </Table>
      </PopoverContent>
    </Popover>
  );
};

const ChineseWordRow = ({ entry }: { entry: ChineseWordEntry }) => {
  const url = getMDBGUrl(entry.w);
  
  return (
    <TableRow>
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
