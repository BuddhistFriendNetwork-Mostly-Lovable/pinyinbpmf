import { ExternalLink } from "lucide-react";
import { buildMDBGUrl, buildYablaUrl } from "@/lib/zhuyinUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CellPopupProps {
  pinyin: string;
  zhuyin: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const CellPopup = ({ pinyin, zhuyin, open, onOpenChange, children }: CellPopupProps) => {
  const mdbgUrl = buildMDBGUrl(pinyin);
  const yablaUrl = buildYablaUrl(pinyin);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-3" side="top" sideOffset={5}>
        <p className="text-sm text-muted-foreground mb-2">
          Pinyin audio for <span className="font-bold text-foreground text-base">{pinyin}</span> /{" "}
          <span className="font-bold text-pink-600 dark:text-pink-400 text-base">{zhuyin}</span> is not 100% perfect.
          Varies by browser/phone.
        </p>
        <p className="text-sm text-muted-foreground mb-3">Find real words using the dictionary links below.</p>
        <div className="flex flex-col gap-2">
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
      </PopoverContent>
    </Popover>
  );
};
