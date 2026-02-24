import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EnglishRhymeInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnglishRhymeInfoDialog = ({ open, onOpenChange }: EnglishRhymeInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>English Rhyme Words</DialogTitle>
          <DialogDescription className="pt-2 text-base leading-relaxed">
            Because of English dialects, this is not perfect. But it gives you a quick guide. For correct pronunciation,
            click a cell and then open the MDBG to hear the Chinese word.
            <div className="mt-4">
              <ExternalLink href="https://github.com/BuddhistFriendNetwork-Mostly-Lovable/pinyinbpmf/blob/main/src/data/englishRhymeData.ts">
                View data source on GitHub
              </ExternalLink>
            </div>{" "}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
