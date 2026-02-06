import { useCallback, useEffect, useState } from "react";
import { formatZhuyinForSeparateTTS } from "@/lib/zhuyinUtils";

export type AudioMode = "zhuyin-comment" | "zhuyin-separate" | "none";

interface UseTTSReturn {
  speak: (text: string, mode?: AudioMode) => void;
  isSupported: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useTTS = (): UseTTSReturn => {
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setIsSupported(false);
      setIsLoading(false);
      setError("Speech synthesis not supported in this browser");
      return;
    }

    setIsSupported(true);

    const findMandarinVoice = () => {
      const voices = speechSynthesis.getVoices();

      // Priority order: Taiwan Mandarin, then Mainland Mandarin
      // Avoid Cantonese (zh-HK, yue)
      const mandarinPatterns = [
        /zh[-_]TW/i, // Taiwan Mandarin (preferred)
        /zh[-_]CN/i, // Mainland Mandarin
        /cmn/i, // Mandarin language code
        /zh(?![-_]HK)/i, // Any Chinese except Hong Kong
      ];

      // Patterns to explicitly avoid (Cantonese)
      const avoidPatterns = [
        /zh[-_]HK/i, // Hong Kong (Cantonese)
        /yue/i, // Cantonese language code
        /cantonese/i,
      ];

      for (const pattern of mandarinPatterns) {
        const found = voices.find((v) => {
          const matches = pattern.test(v.lang) || pattern.test(v.name);
          const shouldAvoid = avoidPatterns.some((ap) => ap.test(v.lang) || ap.test(v.name));
          return matches && !shouldAvoid;
        });
        if (found) {
          return found;
        }
      }

      return null;
    };

    const loadVoices = () => {
      const foundVoice = findMandarinVoice();
      if (foundVoice) {
        setVoice(foundVoice);
        setError(null);
      } else {
        setError("No Mandarin Chinese voice found. Please install a Chinese language pack.");
      }
      setIsLoading(false);
    };

    // Voices may load asynchronously
    if (speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback(
    (text: string, mode: AudioMode = "zhuyin-comment") => {
      if (mode === "none") {
        return;
      }

      if (!isSupported) {
        console.warn("TTS not supported in this browser");
        return;
      }

      // Try to get voice lazily if not already set (handles race condition)
      let currentVoice = voice;
      if (!currentVoice) {
        const voices = speechSynthesis.getVoices();
        const mandarinPatterns = [/zh[-_]TW/i, /zh[-_]CN/i, /cmn/i, /zh(?![-_]HK)/i];
        const avoidPatterns = [/zh[-_]HK/i, /yue/i, /cantonese/i];

        for (const pattern of mandarinPatterns) {
          const found = voices.find((v) => {
            const matches = pattern.test(v.lang) || pattern.test(v.name);
            const shouldAvoid = avoidPatterns.some((ap) => ap.test(v.lang) || ap.test(v.name));
            return matches && !shouldAvoid;
          });
          if (found) {
            currentVoice = found;
            break;
          }
        }
      }

      if (!currentVoice) {
        console.warn("TTS not available: No Mandarin voice found");
        return;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      // Determine text and rate based on mode
      let processedText = text;
      let rate = 1.0;

      if (mode === "zhuyin-separate") {
        processedText = formatZhuyinForSeparateTTS(text);
        rate = 0.8;
      }

      const utterance = new SpeechSynthesisUtterance(processedText);
      utterance.voice = currentVoice;
      utterance.lang = currentVoice.lang;
      utterance.rate = rate;
      utterance.pitch = 1;

      speechSynthesis.speak(utterance);
    },
    [isSupported, voice],
  );

  return {
    speak,
    isSupported,
    isLoading,
    error,
  };
};
