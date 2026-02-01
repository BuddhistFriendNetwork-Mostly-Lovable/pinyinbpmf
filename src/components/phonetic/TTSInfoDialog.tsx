import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface TTSInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TTSInfoDialog = ({ open, onOpenChange }: TTSInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>What is TTS?</DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <p>
              <strong>TTS</strong> means Text-To-Speech and uses your phone or computer's 
              built-in sound generation. This can vary between different devices and browsers.
            </p>
            <p>
              It also can fail or be disabled if you are viewing within a LINE/Facebook 
              window or "webview" where sound is disabled.
            </p>
            <p className="pt-2">
              If you want a very good pinyin table that also gives you the four tones, go to{' '}
              <a
                href="https://www.digmandarin.com/chinese-pinyin-chart"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                digmandarin.com/chinese-pinyin-chart
              </a>{' '}
              (highly recommended).
            </p>
            <p className="text-muted-foreground text-xs">
              Yabla and other websites have pinyin tables, but the audio is sometimes not good.
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
