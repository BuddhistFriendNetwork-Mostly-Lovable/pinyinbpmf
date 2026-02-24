import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getDangerWord } from "@/data/englishRhymeData";

interface DangerWordsCellProps {
  finalPinyin: string;
}

export const DangerWordsCell = ({ finalPinyin }: DangerWordsCellProps) => {
  const danger = getDangerWord(finalPinyin);

  if (!danger) {
    return <span className="text-blue-900/40 text-sm">—</span>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity py-0.5">
          <div
            className="w-14 h-14 bg-red-600 flex items-center justify-center"
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            }}
          >
            <span className="text-white font-bold leading-tight text-center" style={{ fontSize: "0.55em" }}>
              {danger.shortLabel}
            </span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-xs p-3" align="center" side="top" sideOffset={5}>
        <div className="space-y-1">
          <h4 className="font-semibold text-sm">⚠️ English Guess Danger for /{finalPinyin}/</h4>
          <p className="text-sm text-muted-foreground">{danger.fullText}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
