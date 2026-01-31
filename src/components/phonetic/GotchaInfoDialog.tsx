import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GotchaInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GotchaInfoDialog = ({ open, onOpenChange }: GotchaInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Pinyin ↔ Zhuyin Gotchas</DialogTitle>
          <DialogDescription>
            Common traps and quirks when converting between Pinyin and Zhuyin
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">1. The "U" and the Invisible Umlaut (ü)</h3>
              <p className="text-muted-foreground mb-2">
                In Pinyin, the letter <strong>u</strong> represents two different Zhuyin symbols depending on what comes before it.
              </p>
              <p className="mb-2">
                <strong>The Rule:</strong> After <span className="font-mono bg-muted px-1 rounded">j</span>, <span className="font-mono bg-muted px-1 rounded">q</span>, <span className="font-mono bg-muted px-1 rounded">x</span>, and <span className="font-mono bg-muted px-1 rounded">y</span>, the Pinyin <strong>u</strong> is actually the Zhuyin <strong>ㄩ</strong> (yu/ü).
              </p>
              <p className="mb-2">
                <strong>The Gotcha:</strong> You write <span className="font-mono bg-muted px-1 rounded">ju</span>, but you say <em>j-yu</em>. To a Zhuyin user, these are distinct; to a Pinyin user, you just have to "know" the dots are missing.
              </p>
              <p className="text-muted-foreground">
                <strong>Standard Pinyin:</strong> You only see the dots (ü) after <span className="font-mono bg-muted px-1 rounded">n</span> and <span className="font-mono bg-muted px-1 rounded">l</span> (e.g., nü vs nu) because those are the only two cases where both sounds are possible.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. The Two Faces of "E"</h3>
              <p className="text-muted-foreground mb-2">
                Pinyin uses the letter <strong>e</strong> for two very different sounds that Zhuyin keeps separate:
              </p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                <li><strong>ㄜ (e):</strong> The "uh" sound (as in <em>de, me, he</em>)</li>
                <li><strong>ㄝ (ê):</strong> The "eh" sound (as in <em>ye, xie, lie</em>)</li>
              </ul>
              <p className="text-muted-foreground">
                <strong>The Gotcha:</strong> In Pinyin, they look the same. In Zhuyin, you can't mix them up. ㄧㄝ (ye) and ㄜ (e) look nothing alike.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. The "Silent" Vowels (Y and W)</h3>
              <p className="text-muted-foreground mb-2">
                In Pinyin, <strong>y</strong> and <strong>w</strong> aren't actually sounds; they are "orthographic markers" used when a syllable starts with i (ㄧ), u (ㄨ), or ü (ㄩ) and has no initial consonant.
              </p>
              <p className="mb-2">
                <strong>The Gotcha:</strong> In Zhuyin, "yi" is just <strong>ㄧ</strong>. The <em>y</em> doesn't exist.
              </p>
              <p className="text-muted-foreground">
                <strong>The "Buzzing" I:</strong> In Pinyin, the <strong>i</strong> in <span className="font-mono bg-muted px-1 rounded">zhi, chi, shi, ri, zi, ci, si</span> is actually a "vocalized consonant." It sounds like a buzz. In Zhuyin, you just write the consonant (e.g., ㄓ). There is no vowel symbol at all!
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. The "Missing" Vowels (The Triphthongs)</h3>
              <p className="text-muted-foreground mb-2">
                Pinyin squeezes three sounds into two letters to save space:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>iou → iu:</strong> <em>Liu</em> is actually <em>l-i-o-u</em>. Zhuyin writes it as ㄌㄧㄡ.</li>
                <li><strong>uei → ui:</strong> <em>Hui</em> is actually <em>h-u-e-i</em>. Zhuyin writes it as ㄏㄨㄟ.</li>
                <li><strong>uen → un:</strong> <em>Lun</em> is actually <em>l-u-e-n</em>. Zhuyin writes it as ㄌㄨㄣ.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. The -iong Final</h3>
              <p className="text-muted-foreground">
                The final <strong>-iong</strong> in Pinyin (as in <em>jiong, qiong, xiong, yong</em>) is written as <strong>ㄩㄥ</strong> in Zhuyin, using the ü sound (ㄩ) rather than i (ㄧ). This is another case where Pinyin's <em>i</em> actually represents ü.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. Labials with O</h3>
              <p className="text-muted-foreground">
                The syllables <span className="font-mono bg-muted px-1 rounded">bo, po, mo, fo</span> are special because they use <strong>ㄛ</strong> directly without a medial vowel. In most other cases, <em>-uo</em> requires <strong>ㄨㄛ</strong>.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
