import { useCallback, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { finals, initials, getCell, gotchaCategories, type GotchaCategory } from '@/data/phoneticData';
import { useTTS } from '@/hooks/useTTS';
import type { DisplayMode } from './SettingsPanel';
import { cn } from '@/lib/utils';

interface PhoneticTableProps {
  displayMode: DisplayMode;
  highlightGotchas: boolean;
  activeGotchaCategories: Set<GotchaCategory>;
}

const groupColors: Record<string, string> = {
  a: 'bg-blue-50 dark:bg-blue-950/30',
  o: 'bg-orange-50 dark:bg-orange-950/30',
  i: 'bg-green-50 dark:bg-green-950/30',
  u: 'bg-purple-50 dark:bg-purple-950/30',
  v: 'bg-rose-50 dark:bg-rose-950/30',
};

export const PhoneticTable = ({
  displayMode,
  highlightGotchas,
  activeGotchaCategories,
}: PhoneticTableProps) => {
  const { speak, isSupported, error } = useTTS();
  const [clickedCell, setClickedCell] = useState<string | null>(null);

  const handleCellClick = useCallback((pinyin: string, zhuyin: string) => {
    // Always use zhuyin for pronunciation (first tone)
    speak(zhuyin);
    
    // Visual feedback
    const key = `${pinyin}-${zhuyin}`;
    setClickedCell(key);
    setTimeout(() => setClickedCell(null), 200);
  }, [speak]);

  const getCellHighlightClass = (gotchas?: GotchaCategory[]): string => {
    if (!highlightGotchas || !gotchas || gotchas.length === 0) {
      return '';
    }

    // Find the first active gotcha category that matches this cell
    for (const gotcha of gotchas) {
      if (activeGotchaCategories.has(gotcha)) {
        const category = gotchaCategories.find(c => c.id === gotcha);
        if (category) {
          return category.bgClass;
        }
      }
    }

    return '';
  };

  return (
    <div className="relative">
      {/* TTS status indicator */}
      {error && (
        <div className="mb-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
      {!isSupported && (
        <div className="mb-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          Text-to-speech is not supported in this browser.
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-20 bg-primary text-primary-foreground font-bold w-16">
                Init
              </TableHead>
              {finals.map((final) => (
                <TableHead
                  key={final.pinyin}
                  className={cn(
                    'text-center text-xs font-normal min-w-[60px]',
                    groupColors[final.group]
                  )}
                >
                  <div className="font-bold">
                    {final.pinyin.startsWith('ü') 
                      ? `${final.pinyin} / ${final.pinyin.replace('ü', 'u')}`
                      : final.pinyin}
                  </div>
                  <div className="text-muted-foreground">{final.zhuyin}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {initials.map((initial) => (
              <TableRow key={initial.pinyin}>
                <TableCell className="sticky left-0 z-10 bg-primary/90 text-primary-foreground font-bold text-center">
                  <div>{initial.pinyin}</div>
                  <div className="text-xs opacity-80">{initial.zhuyin}</div>
                </TableCell>
                {finals.map((final) => {
                  const cell = getCell(initial.pinyin, final.pinyin);
                  const cellKey = `${cell?.pinyin}-${cell?.zhuyin}`;
                  const isClicked = clickedCell === cellKey;
                  const highlightClass = getCellHighlightClass(cell?.gotchas);

                  if (!cell) {
                    return (
                      <TableCell
                        key={final.pinyin}
                        className="bg-muted/30"
                      />
                    );
                  }

                  return (
                    <TableCell
                      key={final.pinyin}
                      className={cn(
                        'text-center cursor-pointer transition-all duration-150 hover:bg-accent/50',
                        highlightClass,
                        isClicked && 'scale-95 bg-accent'
                      )}
                      onClick={() => handleCellClick(cell.pinyin, cell.zhuyin)}
                    >
                      {(displayMode === 'pinyin' || displayMode === 'both') && (
                        <div className="font-bold text-sm">{cell.pinyin}</div>
                      )}
                      {(displayMode === 'zhuyin' || displayMode === 'both') && (
                        <div className="text-xs text-pink-600 dark:text-pink-400 font-medium">
                          {cell.zhuyin}
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Click any cell to hear the pronunciation (first tone)
      </p>
    </div>
  );
};
