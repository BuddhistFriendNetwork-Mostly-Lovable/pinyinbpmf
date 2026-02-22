

## Dynamic Import for pinyinStubsToWordsData

### What changes
Only `CellPopup.tsx` imports from `pinyinStubsToWordsData.ts`. We will lazy-load that 25K-line module on first popup open instead of bundling it with the initial page load.

### Steps

1. **Create `src/data/lazyDataLoader.ts`**
   - A small module that exposes `getWordsForPinyinStubAsync(stub: string): Promise<PinyinWordEntry[]>`
   - Uses `import()` to dynamically load `pinyinStubsToWordsData` on first call
   - Caches the module so subsequent calls are instant

2. **Update `CellPopup.tsx`**
   - Remove the static import of `getWordsForPinyinStub`
   - Keep the `PinyinWordEntry` type import (type-only imports have zero runtime cost)
   - Load words asynchronously when the popup opens using `useState` + `useEffect`
   - Show a brief "Loading..." text while data loads on first open
   - After first load, all subsequent popups will be instant (module is cached)

### Technical detail

```text
// lazyDataLoader.ts
let cached: typeof import("@/data/pinyinStubsToWordsData") | null = null;

export async function getWordsForPinyinStubAsync(stub: string) {
  if (!cached) {
    cached = await import("@/data/pinyinStubsToWordsData");
  }
  return cached.getWordsForPinyinStub(stub);
}
```

In CellPopup, the words will be fetched in a `useEffect` keyed on `open` and `pinyinStub`, so data only loads when the popup actually opens.

### Result
- Initial bundle shrinks by ~25K lines of data
- PWA service worker auto-caches the split chunk for offline use
- No visible impact to user experience (sub-100ms lazy load)

