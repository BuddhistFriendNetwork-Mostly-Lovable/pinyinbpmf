import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRhymeWords, parseRhymeWord, getTopRhymeWord } from "@/data/englishRhymeData";

interface RhymeWordsPopupProps {
  finalPinyin: string;
}

const getPercentageIndicator = (percentage: string): string => {
  const numMatch = percentage.match(/(\d+)%/);
  if (!numMatch) return "";
  const value = parseInt(numMatch[1], 10);
  if (value === 100) return " ✅";
  if (value === 0) return " ❌";
  return " ?";
};

export const RhymeWordsPopup = ({ finalPinyin }: RhymeWordsPopupProps) => {
  const allRhymes = getRhymeWords(finalPinyin);

  if (allRhymes.length === 0) {
    return null;
  }

  const parsedRhymes = allRhymes.map(parseRhymeWord);
  const topRhyme = parsedRhymes[0];
  const indicator = getPercentageIndicator(topRhyme.percentage);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full text-center cursor-pointer hover:bg-blue-800 transition-colors py-1 px-0.5">
          {topRhyme.word}{indicator}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Rhyme Word</TableHead>
              <TableHead className="font-bold text-right">% Similarity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parsedRhymes.map((rhyme, idx) => (
              <TableRow key={idx}>
                <TableCell className="py-1.5">{rhyme.word}</TableCell>
                <TableCell className="py-1.5 text-right font-mono">{rhyme.percentage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PopoverContent>
    </Popover>
  );
};
