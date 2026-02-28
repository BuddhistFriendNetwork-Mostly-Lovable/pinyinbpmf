import type { PinyinWordEntry } from "@/data/pinyinStubsToWordsData";

let cached: typeof import("@/data/pinyinStubsToWordsData") | null = null;

async function loadModule() {
  if (!cached) {
    cached = await import("@/data/pinyinStubsToWordsData");
  }
  return cached;
}

export async function getWordsForPinyinStubAsync(stub: string): Promise<PinyinWordEntry[]> {
  const mod = await loadModule();
  return mod.getWordsForPinyinStub(stub);
}

let cachedCount: number | null = null;

export async function getTotalWordCount(): Promise<number> {
  if (cachedCount !== null) return cachedCount;
  const mod = await loadModule();
  cachedCount = mod.pinyinStubsData.reduce((sum, stub) => sum + stub.characters.length, 0);
  return cachedCount;
}
