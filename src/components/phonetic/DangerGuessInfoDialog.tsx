import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DangerGuessInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DangerGuessInfoDialog = ({ open, onOpenChange }: DangerGuessInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>English Guess Dangers</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 text-sm">
              <p>
                Sometimes, if you pronounce pinyin with an English Language Guess, you will actually say a completely
                different word that will confuse people.
              </p>
              <p>
                In English, it is like pronouncing the name <strong>"Rick"</strong> as <strong>"Reek"</strong>, which is
                a rude word meaning to smell.
              </p>
              <p>
                Or mixing up R's and L's: someone wants to say they like <strong>"Rice"</strong> (food), but they say
                they like <strong>"Lice"</strong> (insect).
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
