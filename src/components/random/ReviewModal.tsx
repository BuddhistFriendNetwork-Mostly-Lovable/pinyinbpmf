import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SavedWordEntry } from "@/hooks/useSavedDifficulties";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getByDifficulty: (d: "easy" | "medium" | "hard") => SavedWordEntry[];
  onLoadTraining: (words: SavedWordEntry[]) => void;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function WordList({ words }: { words: SavedWordEntry[] }) {
  if (words.length === 0) {
    return <p className="text-muted-foreground text-sm py-4 text-center">No words saved.</p>;
  }
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-1 pr-2">
        {words.map((w, i) => (
          <div key={`${w.ct}-${w.pinyinStub}-${i}`} className="flex items-center justify-between border-b border-muted py-1.5 px-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">{w.cs}</span>
              <span className="text-muted-foreground">{w.fp}</span>
              <span className="text-muted-foreground text-xs truncate max-w-[120px]">{w.e}</span>
            </div>
            <div className="text-xs text-muted-foreground text-right shrink-0">
              <div>First: {formatDate(w.firstSaved)}</div>
              <div>Last: {formatDate(w.lastSaved)}</div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const ReviewModal = ({ open, onOpenChange, getByDifficulty, onLoadTraining }: ReviewModalProps) => {
  const greenWords = getByDifficulty("easy");
  const yellowWords = getByDifficulty("medium");
  const redWords = getByDifficulty("hard");
  const allSaved = [...greenWords, ...yellowWords, ...redWords];

  const loadAndClose = (words: SavedWordEntry[]) => {
    onLoadTraining(words);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Saved Words</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="green">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="green" className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Green ({greenWords.length})
            </TabsTrigger>
            <TabsTrigger value="yellow" className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "#FBBF24" }} /> Yellow ({yellowWords.length})
            </TabsTrigger>
            <TabsTrigger value="red" className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Red ({redWords.length})
            </TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>
          <TabsContent value="green"><WordList words={greenWords} /></TabsContent>
          <TabsContent value="yellow"><WordList words={yellowWords} /></TabsContent>
          <TabsContent value="red"><WordList words={redWords} /></TabsContent>
          <TabsContent value="training">
            <div className="space-y-2 py-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={allSaved.length === 0}
                onClick={() => loadAndClose(shuffle(allSaved).slice(0, 20))}
              >
                🎲 20 Words - Mixed
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={yellowWords.length === 0}
                onClick={() => loadAndClose(shuffle(yellowWords.slice(0, 4)))}
              >
                🟡 Last 4 Yellow Words
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={yellowWords.length === 0}
                onClick={() => loadAndClose(shuffle(yellowWords.slice(0, 10)))}
              >
                🟡 Last 10 Yellow Words
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={yellowWords.length === 0}
                onClick={() => loadAndClose(shuffle(yellowWords.slice(0, 20)))}
              >
                🟡 Last 20 Yellow Words
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
