import { ExternalLink } from "lucide-react";
import { buildMDBGUrl } from "@/lib/zhuyinUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CellPopupProps {
  zhuyin: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const CellPopup = ({ zhuyin, open, onOpenChange, children }: CellPopupProps) => {
  const mdbgUrl = buildMDBGUrl(zhuyin);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-2" side="top" sideOffset={5}>
        Pinyin audio not 100% perfect. <BR></BR>
        Find real words using the MDBG dictionary link.
        <br></br>
        <a
          href={mdbgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 hover:underline"
          onClick={() => onOpenChange(false)}
        >
          Search for words on <span className="font-semibold">MDBG</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </PopoverContent>
    </Popover>
  );
};
