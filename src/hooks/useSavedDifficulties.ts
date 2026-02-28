import { useState, useCallback } from "react";
import type { UserDifficulty } from "@/components/random/WordCard";
import type { RandomWordEntry } from "@/lib/randomWordsUtils";

export interface SavedWordEntry {
  h: number;  // HSK level
  ct: string; // Chinese text (traditional)
  cs: string; // Chinese simplified
  e: string;  // English
  fp: string; // Full pinyin
  t: number;  // Tone
  pinyinStub: string;
  difficulty: "easy" | "medium" | "hard";
  firstSaved: number;
  lastSaved: number;
}

const STORAGE_KEY = "pinyin-saved-difficulties";

function loadFromStorage(): SavedWordEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveToStorage(entries: SavedWordEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useSavedDifficulties() {
  const [savedWords, setSavedWords] = useState<SavedWordEntry[]>(loadFromStorage);

  const saveDifficulties = useCallback(
    (words: RandomWordEntry[], difficulties: (UserDifficulty)[]) => {
      const now = Date.now();
      const existing = loadFromStorage();
      const existingMap = new Map(existing.map((e) => [`${e.ct}-${e.pinyinStub}`, e]));

      for (let i = 0; i < words.length; i++) {
        const d = difficulties[i];
        if (!d) continue; // skip null
        const word = words[i];
        const key = `${word.ct}-${word.pinyinStub}`;
        const prev = existingMap.get(key);
        existingMap.set(key, {
          h: word.h,
          ct: word.ct,
          cs: word.cs,
          e: word.e,
          fp: word.fp,
          t: word.t,
          pinyinStub: word.pinyinStub,
          difficulty: d,
          firstSaved: prev?.firstSaved ?? now,
          lastSaved: now,
        });
      }

      const updated = Array.from(existingMap.values());
      saveToStorage(updated);
      setSavedWords(updated);
      return updated.length;
    },
    [],
  );

  const getByDifficulty = useCallback(
    (d: "easy" | "medium" | "hard") =>
      savedWords.filter((w) => w.difficulty === d).sort((a, b) => b.lastSaved - a.lastSaved),
    [savedWords],
  );

  const hasSavedWords = savedWords.length > 0;

  const refresh = useCallback(() => {
    setSavedWords(loadFromStorage());
  }, []);

  return { savedWords, saveDifficulties, getByDifficulty, hasSavedWords, refresh };
}
