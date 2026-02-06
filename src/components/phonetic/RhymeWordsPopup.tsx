import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRhymeWords, parseRhymeWord, getTopRhymeWord } from "@/data/englishRhymeData";

interface RhymeWordsPopupProps {
  finalPinyin: string;
}

export const RhymeWordsPopup = ({ finalPinyin }: RhymeWordsPopupProps) => {
  const topWord = getTopRhymeWord(finalPinyin);
  const allRhymes = getRhymeWords(finalPinyin);

  if (!topWord || allRhymes.length === 0) {
    return null;
  }

  const parsedRhymes = allRhymes.map(parseRhymeWord);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full text-center cursor-pointer hover:bg-blue-800 transition-colors py-1 px-0.5">
          {topWord}
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
