import type { PinyinWordEntry } from "@/data/pinyinStubsToWordsData";

let cached: typeof import("@/data/pinyinStubsToWordsData") | null = null;

export async function getWordsForPinyinStubAsync(stub: string): Promise<PinyinWordEntry[]> {
  if (!cached) {
    cached = await import("@/data/pinyinStubsToWordsData");
  }
  return cached.getWordsForPinyinStub(stub);
}
