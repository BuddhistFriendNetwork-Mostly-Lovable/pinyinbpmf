import { useCallback, useEffect, useState } from 'react';

interface UseTTSReturn {
  speak: (text: string) => void;
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
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      setIsLoading(false);
      setError('Speech synthesis not supported in this browser');
      return;
    }

    setIsSupported(true);

    const findMandarinVoice = () => {
      const voices = speechSynthesis.getVoices();
      
      // Priority order: Taiwan Mandarin, then Mainland Mandarin
      // Avoid Cantonese (zh-HK, yue)
      const mandarinPatterns = [
        /zh[-_]TW/i,           // Taiwan Mandarin (preferred)
        /zh[-_]CN/i,           // Mainland Mandarin
        /cmn/i,                // Mandarin language code
        /zh(?![-_]HK)/i,       // Any Chinese except Hong Kong
      ];
      
      // Patterns to explicitly avoid (Cantonese)
      const avoidPatterns = [
        /zh[-_]HK/i,           // Hong Kong (Cantonese)
        /yue/i,                // Cantonese language code
        /cantonese/i,
      ];

      for (const pattern of mandarinPatterns) {
        const found = voices.find(v => {
          const matches = pattern.test(v.lang) || pattern.test(v.name);
          const shouldAvoid = avoidPatterns.some(ap => ap.test(v.lang) || ap.test(v.name));
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
        setError('No Mandarin Chinese voice found. Please install a Chinese language pack.');
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

  const speak = useCallback((text: string) => {
    if (!isSupported || !voice) {
      console.warn('TTS not available:', error);
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.8; // Slightly slower for learning
    utterance.pitch = 1;

    speechSynthesis.speak(utterance);
  }, [isSupported, voice, error]);

  return {
    speak,
    isSupported,
    isLoading,
    error,
  };
};
