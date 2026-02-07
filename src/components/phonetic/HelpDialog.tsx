import { Volume2, Copy, ExternalLink, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getChineseWords, getMDBGUrl, type ChineseWordEntry } from "@/data/chineseWordsData";
import { useTTS } from "@/hooks/useTTS";
import { toast } from "@/hooks/use-toast";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpDialog = ({ open, onOpenChange }: HelpDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full h-full max-h-full sm:max-w-4xl sm:h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Help Guide
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="beginner" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-4 flex-wrap h-auto gap-1 justify-start">
            <TabsTrigger value="beginner" className="text-xs sm:text-sm">
              Total Beginner
            </TabsTrigger>
            <TabsTrigger value="sound" className="text-xs sm:text-sm">
              Troubleshooting Sound
            </TabsTrigger>
            <TabsTrigger value="zhuyin" className="text-xs sm:text-sm">
              I know Zhuyin
            </TabsTrigger>
            <TabsTrigger value="pinyin" className="text-xs sm:text-sm">
              I know Pinyin
            </TabsTrigger>
            <TabsTrigger value="chinese" className="text-xs sm:text-sm">
              ~100 to 500 Chinese Words
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden p-4 pt-2">
            <TabsContent value="beginner" className="h-full mt-0">
              <ScrollArea className="h-full" type="always">
                <div className="pr-4 min-w-max sm:min-w-0">
                  <TotalBeginnerTab />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="sound" className="h-full mt-0">
              <ScrollArea className="h-full" type="always">
                <div className="pr-4 min-w-max sm:min-w-0">
                  <TroubleshootingSoundTab />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="zhuyin" className="h-full mt-0">
              <ScrollArea className="h-full" type="always">
                <div className="pr-4 min-w-max sm:min-w-0">
                  <IKnowZhuyinTab />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="pinyin" className="h-full mt-0">
              <ScrollArea className="h-full" type="always">
                <div className="pr-4 min-w-max sm:min-w-0">
                  <IKnowPinyinTab />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="chinese" className="h-full mt-0">
              <ScrollArea className="h-full" type="always">
                <div className="pr-4 min-w-max sm:min-w-0">
                  <IKnowChineseTab />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const ExternalLink_ = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
    {children}
  </a>
);

const TotalBeginnerTab = () => (
  <div className="space-y-4 pb-4">
    <p className="text-muted-foreground">
      Did you know that Chinese has about <strong>410 total sounds</strong>?
    </p>
    <p className="text-muted-foreground">
      If you learn all these sounds, you will know all the sounds of Chinese. This website is getting you familiar with
      the sound system.
    </p>

    <Separator />

    <h3 className="font-semibold text-base">Familiar sounds and new sounds</h3>
    <p className="text-muted-foreground">
      <strong>Good News:</strong> about 50% of these sounds overlap with English, so they are easy to learn.
    </p>
    <p className="text-muted-foreground">
      <strong>Bad News:</strong> about 25% of these sounds are similar to English. And another 25% are totally new or
      hard to learn.
    </p>

    <Separator />

    <h3 className="font-semibold text-base">First steps</h3>
    <p className="text-muted-foreground">
      This website is all about getting you used to the sounds of Chinese. To do this, we try to give you many words
      that sound alike. By listening carefully to these sounds, you will be able to figure out which words are in:
    </p>
    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
      <li>
        <strong>Category 1:</strong> Easy, Same as English
      </li>
      <li>
        <strong>Category 2:</strong> Medium, Similar to English
      </li>
      <li>
        <strong>Category 3:</strong> Difficult, New Sounds not in English
      </li>
    </ul>

    <p className="text-muted-foreground">
      <strong>First,</strong> click on the <span className="text-destructive font-semibold">RED section</span> at the
      top of the table with Chinese words. This shows a bunch of Chinese words and their meaning. Click through the
      speaker icons to hear the sounds. <em>TIP: All the words should rhyme. They have the same ending sound.</em>
    </p>

    <p className="text-muted-foreground">
      <strong>Second,</strong> click on the <span className="text-primary font-semibold">BLUE section</span>. This shows
      the English words that I think are similar and how similar.
    </p>

    <p className="text-muted-foreground">
      Go back and forth between RED and BLUE and see if you can see the link. If I wrote 100%, do you agree? If I wrote
      60%, can you hear the difference?
    </p>

    <p className="text-muted-foreground">
      <strong>Lastly,</strong> look at the "
      <ExternalLink_ href="https://en.wikipedia.org/wiki/Pinyin">pinyin</ExternalLink_>" which is the sound written in a
      standard abc-xyz format used in China. See if this makes sense. Sometimes it is weird.
    </p>

    <Separator />

    <h3 className="font-semibold text-base">Reviewing</h3>
    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
      <li>
        Listen to the sounds of Chinese words. (
        <em>
          BONUS: Try to make the same sound; SUPER BONUS: Try to make the same sound for Google Translate and see if
          Google Translate can understand your copying
        </em>
        )
      </li>
      <li>Look at the similar sounding English words.</li>
      <li>Get a feel for how the pinyin works.</li>
    </ul>
    <p className="text-muted-foreground font-medium">No need to memorize anything. Just explore the sounds.</p>

    <Separator />

    <h3 className="font-semibold text-base">A study game with a friend</h3>
    <p className="text-muted-foreground">
      After you and a friend review some of the columns, have a friend play a game with you. You'll need 2
      phones/devices. Your friend will play a random Chinese word. You listen. And then you have to find that word. You
      succeed when you play the same Chinese word (Compare with your friend). If you get stuck, they can give you a hint
      of 3 columns it might be in.
    </p>
  </div>
);

const TroubleshootingSoundTab = () => (
  <div className="space-y-4 pb-4">
    <p className="text-muted-foreground">
      Sound via Text-to-Speech (TTS) usually just works. You should use a modern web browser like Safari or Chrome on
      iPhone/Android/Web.
    </p>
    <p className="text-muted-foreground">
      If you opened this webpage within Facebook/IG/LINE/App, sound is turned off by default. Click on "Open in External
      Browser" or copy the URL website and paste it into your browser manually.
    </p>

    <Separator />

    <p className="text-muted-foreground">
      If you still cannot get sound working, first try going to my companion app "
      <ExternalLink_ href="https://fivechinese.lovable.app/">Five Chinese</ExternalLink_>" and click "fix voices". Try
      to play that game. If that doesn't work, sorry. Your phone probably does not support TTS. Try a friend's phone.
    </p>
  </div>
);

const IKnowZhuyinTab = () => (
  <div className="space-y-4 pb-4">
    <p className="text-muted-foreground">
      Great! Zhuyin is great because every symbol maps to exactly one sound. It is phonetically correct and unambiguous.
    </p>
    <p className="text-muted-foreground">
      Pinyin is not unambiguous. I have highlighted the "Gotchas" and colored the cells where I think the Pinyin is
      weird. Use the settings switch to explore the Gotchas.
    </p>

    <Separator />

    <p className="text-muted-foreground">
      <strong>Bad news:</strong> "W-" and "Y-" have special and inconsistent rules in pinyin. And "-u", "-ue" and "-i"
      sometimes have two different ending sounds. And "u" is sometimes actually the sound "ü". Sometimes written and
      sometimes not. (pinyin: "ü" links to zhuyin: "ㄩ") And a few other oddities.
    </p>
    <p className="text-muted-foreground">
      <strong>Good news:</strong> 85% of the table is super easy. Row + Column works exactly as you expect.
    </p>

    <Separator />

    <h3 className="font-semibold text-base">Recommended path</h3>
    <p className="text-muted-foreground">
      So, the easy path is to ignore "W-" and "Y-". Learn everything else first. bo, po, mo, fo all the way to ㄗ, ㄘ,
      ㄙ. And then every ending.
    </p>
    <p className="text-muted-foreground">Then, try to figure out the patterns for the "W-" and "Y-" beginnings.</p>
  </div>
);

const IKnowPinyinTab = () => {
  const { speak } = useTTS();
  const words = getChineseWords("un");

  const handleSpeak = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToSpeak = word.split(",")[0];
    speak(textToSpeak, "zhuyin-comment");
  };

  const handleCopy = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const wordToCopy = word.split(",")[0];
    navigator.clipboard.writeText(wordToCopy);
    toast({ title: "Copied!", description: wordToCopy });
  };

  const handleOpenLink = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getMDBGUrl(word);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-4 pb-4">
      <p className="text-muted-foreground">
        Great. Pinyin is the harder thing to learn because it has Gotchas: things that are spelled similarly but have a
        different sound. Kinda like how "hat" and "cat" and "sat" rhyme, but "what" is a different vowel.
      </p>
      <p className="text-muted-foreground">
        Zhuyin is phonetically unambiguous. 1 symbol always has 1 sound. But you have to memorize the 37 symbols of
        Zhuyin and the combinations.
      </p>

      <Separator />

      <h3 className="font-semibold text-base">Recommended Path</h3>

      <p className="text-muted-foreground">
        <strong>Step 1,</strong> go through all the Red Row of Chinese Characters. Click on the words and listen to
        them. See how they all rhyme. That's good. Try to find words that rhyme that have different spelling (like
        /yong/ in pinyin). That's the tricky part.
      </p>
      <p className="text-muted-foreground">
        If you 100% know pinyin, then it should all make sense. But if your pronunciation is a little weak, you might
        have an "Aha" moment where you can say, "oh! Those are related!". Example:
      </p>

      {/* Embedded table for "un" words */}
      <div className="border rounded-lg overflow-hidden my-4">
        <div className="p-2 border-b bg-muted/50">
          <h4 className="font-semibold text-sm">Common words with /-un/</h4>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="text-center">Chinese</TableHead>
              <TableHead>Meaning</TableHead>
              <TableHead>Pinyin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {words.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className="p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => handleSpeak(entry.w, e)}
                    title="Speak this word"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-xl font-medium">{entry.w}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-1"
                    onClick={(e) => handleOpenLink(entry.w, e)}
                    title="Open in MDBG dictionary"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => handleCopy(entry.w, e)}
                    title="Copy word"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TableCell>
                <TableCell className="text-sm">{entry.m}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{entry.p}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-muted-foreground">
        Those all rhyme. And /wen/ rhymes with /dun/, even though one is "-en" and one is "-un".
      </p>

      <p className="text-muted-foreground">
        <strong>Step 2,</strong> Focus on the words that don't have Gotchas (colored cell). These mostly have
        straightforward pinyin to zhuyin. Be careful with "-u", "-ue" and "-i". This will get you to know all 37 Zhuyin
        and all the Zhuyin combinations. Notice how the symbols are used.
      </p>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
        <li>How are /-eng/, /-iang/, and /-uang/ related?</li>
        <li>How are /-un/, /-uai/, /-ui/, and /-uang/ related?</li>
        <li>
          Are there any places where the initial "consonant" sound for the Pinyin maps to 2 different Zhuyin? (HINT:
          Answer: no)
        </li>
      </ul>

      <p className="text-muted-foreground">
        This website just focuses on the individual symbols with audio:{" "}
        <ExternalLink_ href="https://www.boposounds.com/">boposounds.com</ExternalLink_> The QUIZ on that website is
        very good for learning Zhuyin.
      </p>

      <p className="text-muted-foreground">
        <strong>Step 3,</strong> Ignore the "w-" and "y-" words. Focus on the other colored table cells. Like "-u",
        "-ue" and "-i".
      </p>

      <p className="text-muted-foreground">
        <strong>Step 4,</strong> Tackle the "w-" and "y-" words. "w-" usually adds the "u" or "Zhuyin: ㄨ" sound. "y-"
        usually adds the long "ee" or "Zhuyin: ㄧ" sound. But there are a few weird examples. (Tip: Look for them
        yourself; it's good practice. And they are also highlighted.)
      </p>
    </div>
  );
};

const IKnowChineseTab = () => (
  <div className="space-y-4 pb-4">
    <p className="text-muted-foreground">
      Did you know that Chinese has about <strong>410 total sounds</strong>?
    </p>
    <p className="text-muted-foreground">
      Why does this matter? Once you learn all 410 sounds, you know all of the sounds in Chinese! (NOTE: What about
      tones? Chinese is a tonal language, so you also have to add the 4 tones. However, the raw "sound" is the same for
      each of the 4 tones; the tones just change the pitch shape.)
    </p>

    <Separator />

    <h3 className="font-semibold text-base">Getting the sounds</h3>
    <p className="text-muted-foreground">
      Babies automatically learn to recognize all 410 words (or a majority of them) before age 5. This is all before
      they learn to read. It's because they hear 100,000 to 1,000,000 words before age 5 just by listening to adults,
      watching TV/YouTube, and talking to other kids.
    </p>
    <p className="text-muted-foreground">
      If you hear 100,000 Chinese words, even if you don't understand, you will pick up the "sound system". But that is
      too slow.
    </p>
    <p className="text-muted-foreground">
      <strong>Good news:</strong> you probably just need to listen to 1,000-10,000 sounds to pick up the sound system.
      That can be done in about 1-4 weeks of focused practice. And you can use "pinyin" tables to do this.
    </p>

    <Separator />

    <h3 className="font-semibold text-base">Pinyin Table and Zhuyin Table</h3>
    <p className="text-muted-foreground">
      Again, there are 410 sounds in Chinese. You can probably listen to all of them in about 1 hour.
    </p>
    <p className="text-muted-foreground">
      There are two main systems of organizing the sounds. In Mainland China, they use pinyin for these sounds, which
      uses 26 symbols (abc-xyz). In Taiwan, they use a phonetic system called zhuyin, which uses 37 phonetic symbols
      like ㄅㄊㄨㄢㄍ.
    </p>
    <p className="text-muted-foreground">Both systems use a table, like the Pinyin↔Zhuyin table on my website.</p>
    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
      <li>
        Along the side, you have all the initial sounds. Think of these as the consonant beginnings. Approx 30 in
        quantity.
      </li>
      <li>Along the top, you have all the "endings". Approx 40 in quantity.</li>
      <li>Every Chinese word is 1 initial sound and 1 ending sound.</li>
    </ul>
    <p className="text-muted-foreground">
      If the table is 30 × 40, there are 1200 combinations. But not every combination is valid, so that's why it gets
      reduced to 410 valid sounds.
    </p>
    <p className="text-muted-foreground">
      That table is exactly what this website uses. Notice, that mine shows both the Pinyin and Zhuyin. This is unique,
      because I couldn't find a good table that showed both.
    </p>
    <p className="text-muted-foreground">
      Mine: <ExternalLink_ href="https://pinyinbopomofo.lovable.app/">pinyinbopomofo.lovable.app</ExternalLink_>
    </p>

    <Separator />

    <p className="text-muted-foreground">
      Much more common are Pinyin tables. Here are some great ones. (Hot tip: If the audio here is weird, cross
      reference with these. They all have audio).
    </p>
    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
      <li>
        (Favorite){" "}
        <ExternalLink_ href="https://www.digmandarin.com/chinese-pinyin-chart">digmandarin.com</ExternalLink_>
      </li>
      <li>
        <ExternalLink_ href="https://chinese.yabla.com/chinese-pinyin-chart.php">yabla.com</ExternalLink_>
      </li>
      <li>
        <ExternalLink_ href="https://yoyochinese.com/chinese-learning-tools/Mandarin-Chinese-pronunciation-lesson/pinyin-chart-table">
          yoyochinese.com
        </ExternalLink_>
      </li>
      <li>
        <ExternalLink_ href="https://www.archchinese.com/chinese_pinyin.html">archchinese.com</ExternalLink_>
      </li>
      <li>
        <ExternalLink_ href="https://studycli.org/pinyin-chart/">studycli.org</ExternalLink_>
      </li>
    </ul>
    <p className="text-muted-foreground text-sm">
      NOTE: The pinyin charts do not have a standard format. They are all 90% the same, but may have small differences.
      Some mix the "-u" endings together because they focus on symbols. Some group by phonetics. You can ignore this and
      just stick to my Pinyin+Zhuyin table.
    </p>

    <Separator />

    <p className="text-muted-foreground">
      Zhuyin also has a table, but I can't find one table that is clickable for audio.
    </p>
    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
      <li>
        (Table, but no audio){" "}
        <ExternalLink_ href="https://en.wikipedia.org/wiki/Zhuyin_table">Wikipedia Zhuyin table</ExternalLink_>
      </li>
      <li>
        (Audio for symbols, but not in table format){" "}
        <ExternalLink_ href="https://www.mdnkids.com/BoPoMo/">mdnkids.com</ExternalLink_>
      </li>
      <li>
        (Alternate audio) <ExternalLink_ href="https://www.boposounds.com/">boposounds.com</ExternalLink_>
      </li>
    </ul>

    <Separator />

    <h3 className="font-semibold text-base">Why show both Zhuyin and Pinyin?</h3>
    <p className="text-muted-foreground">
      By showing Zhuyin and Pinyin, you get the best of both worlds. 1) Pinyin is the most common format in the world.
      2) Zhuyin is phonetically much clearer.
    </p>
    <p className="text-muted-foreground">
      In my table, the "w-" and "y-" initials are where a lot of the phonetic confusion is. I include many "w-" and "y-"
      pinyin in two places. This is because (1) it is spelled one way and (2) pronounced a different way. Example: /wen/
      rhymes with /dun/ and not with /den/. So I write it as "(wen)" in the "-en" column. But put "wen" in the "-un"
      column, where it matches the sound. The parenthesis tells you the sound belongs elsewhere.
    </p>
    <p className="text-muted-foreground">
      Do you have to memorize the Zhuyin symbols? No. You can always go to the website (
      <ExternalLink_ href="https://www.boposounds.com/">boposounds.com</ExternalLink_>) to lookup the 37 symbols and the
      37 sounds. But by having the symbols next to the pinyin, you can find the connections. For example, where is ㄩ
      symbol? How are all the ㄩ symbol pinyin related? And, wow, weird but true: pinyin: "-iong" converts to zhuyin:
      "ㄩㄥ". There is no "ee" sound in pinyin: "-iong". When I learned that, my head exploded.
    </p>
    <p className="text-muted-foreground">If you know what "IPA" is, think of Zhuyin like Chinese IPA.</p>

    <Separator />

    <h3 className="font-semibold text-base">Next steps</h3>
    <p className="text-muted-foreground">
      Since you know some Chinese, try to find the words you know in the chart. If you click on the Pinyin, you can then
      click on "MDBG" which is a dictionary. This will show you all the words with that Pinyin.
    </p>
    <p className="text-muted-foreground">
      Or, guess at the Pinyin and then go to the top red section of Chinese words. Try to see if those words "rhyme" in
      that they have the same ending sound. Really. Go and try it for numbers 1-10.
    </p>

    <Separator />

    <h3 className="font-semibold text-base">Your ear's sound system</h3>
    <p className="text-muted-foreground">
      Pinyin and Zhuyin are great organizational systems, but you really want a way to train your ear system. And this
      might mean writing 3 or 4 notes for any given sound.
    </p>
    <p className="text-muted-foreground">Here is an example I use:</p>
    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
      <li>Word: "好", meaning: "good", pinyin: "hǎo"</li>
      <li>Not "how" in standard English. That sounds like "ow" like in "ouch".</li>
      <li>Pucker the lips forward when saying it.</li>
      <li>
        I imagine it is how Sesame Street's "The Count" would say "how", with a deep voice. Like "how many? 1 2 3, ha ha
        ha".
      </li>
    </ul>
    <p className="text-muted-foreground">
      When you write that many notes, you hone in on the sound you want to make. And you notice sound differences.
    </p>
    <p className="text-muted-foreground">
      Too many student learners go straight for the pinyin and then (sadly) lose the sound.
    </p>
    <p className="text-muted-foreground">
      Although the current standard in teaching Chinese is to use Pinyin, I actually have an (unpopular opinion) that
      people should use whatever notes they want for the first 100 words they learn based on what they actually hear.
    </p>
    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
      <li>Start with Pinyin (clue1)</li>
      <li>Your try here is called Version1.</li>
      <li>If the pinyin does not get you to the right sound, add some letters to make it clearer. (clue2).</li>
      <li>Your try here is called Version2.</li>
      <li>If clue1 and clue2 do not get you consistently to the answer, then add a mouth shape. (clue3)</li>
      <li>Your try here is called Version3.</li>
      <li>
        If clue1-3 do not get you to the answer, say it the way your brain currently wants to say it 3 times, listen to
        audio 3 times, and then try really hard to hear what is still different. Write your notes down.
      </li>
      <li>Your try here is called Version4.</li>
      <li>Record all your tries (3 times each version), and then ask a native speaker which of these sound right.</li>
      <li>If they tell you nothing is right, have them say it 3 times.</li>
      <li>Call this Version5.</li>
    </ul>
    <p className="text-muted-foreground">
      Listen to version 1-5 everyday (should take 1 minute), and remember the progression. If you still can't get it
      after 5 days, just put it aside for a while. Just watch some Chinese or Taiwan TV with Chinese audio and English
      Subtitles. Through low pressure absorption, you might start to pick up the different sounds and the sound system.
    </p>
    <p className="text-muted-foreground">
      <strong>BONUS:</strong> Every 2-5 minutes, rewind the TV show and try to copy the short sentences you hear. It
      doesn't matter if you don't get it right. Just try your best. Like babies do when they start talking. Over time,
      this trains your ear and mouth muscles to get closer to the sounds. Naturally.
    </p>
    <p className="text-muted-foreground">
      (Tip: A lot of Chinese words require puckered lips or mouth shape changes.) For example, pinyin: "wo" meaning
      "I/me"... I prefer to write it as "*wuo". Many learners leave out the "u" sound, which is essential.
    </p>

    <Separator />

    <h3 className="font-semibold text-base">APPENDIX: Analogy to English Syllables</h3>
    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
      <li>The word "rat" can be broken down into "r" + "at".</li>
      <li>The word "song" can be broken into "s" and "ong".</li>
      <li>The word "tie" can be broken down into "t" and "ie".</li>
    </ul>
    <p className="text-muted-foreground">
      Most teachers will further breakdown "song" into "s" + "o (aww)" and "ng", or Consonant-Vowel-Consonant (CVC), but
      in Chinese we group into "Initial"+"Ending".
    </p>
    <p className="text-muted-foreground">
      If we wanted to, we can make a table with consonants on the left and endings on the right. English would then have
      about 30 initials (because you have consonant sounds + blends like "clean" and "bright") and 300+ endings (because
      about 15 vowel sounds and 30 ending sounds). English has thousands of possible syllables. Amazingly, you learned
      them all naturally just by listening, watching, and talking!
    </p>
  </div>
);
