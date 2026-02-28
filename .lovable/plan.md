## Vowel Trainer Page

### Overview

Create a new `/vowel-trainer` page that lets users practice Chinese vocabulary organized by vowel endings (from `chineseWordsData`). The bottom section has a collapsible grid of ending toggles; the top section shows WordCards for all words matching selected endings.

### Changes

#### 1. New file: `src/pages/VowelTrainer.tsx`

**State:**

- `selectedEndings: Set<string>` -- which endings are toggled on. Persisted to `localStorage` key `vowel-trainer-selected-endings`.
- `hiddenRows: boolean[][]` -- per-card row visibility (same pattern as RandomWords).

**Bottom section (collapsible):**

- Title: "Endings" with a Collapsible wrapper (default open).
- "Clear All" button above the grid.
- Grid of toggle buttons for every key in `chineseWordsData` (the keys: `a`, `ai`, `ao`, `an`, `ang`, `e`, `ei`, `en`, `eng`, `er`, `i`, `ia`, `iao`, `ie`, `iu`, `ian`, `in`, `iang`, `ing`, `iong`, `o`, `ong`, `ou`, `u`, `ua`, `uo`, `ui`, `uai`, `uan`, `un`, `uang`, `u:`, `u:e`, `u:an`, `u:n`).
- Each button is a simple toggle (highlighted when selected, muted when not). Clicking toggles inclusion in `selectedEndings`.
- On any change, save to localStorage.

**Top section (word cards):**

- Collect all `ChineseWordEntry` items from selected endings.
- Map each to a `RandomWordEntry`-compatible object:
  - `cs` = first variant from `w` (before comma)
  - `ct` = second variant or same as `cs`
  - `e` = `m` (meaning)
  - `fp` = `p` (pinyin with tones)
  - `pinyinStub` = `stripToneMarks(cleanPinyin(p))` to enable zhuyin lookup
  - `h` = -9 (not applicable)
  - `t` = -9 (not applicable/needed)
- Render using the existing `WordCard` component with simplified settings (show pinyin, zhuyin, no MDBG links).
- Include hide/show all buttons and per-card X to remove.

**Header:**

- Back to Chart link, title "Vowel Trainer".

#### 2. `src/App.tsx` -- Add route

Add `<Route path="/vowel-trainer" element={<VowelTrainer />} />` above the catch-all.

### Technical Details

- Zhuyin lookup: The `WordCard` component's `getZhuyinForStub` already handles looking up zhuyin from `chartData` and `endings` by pinyin stub, so mapping `pinyinStub = stripToneMarks(cleanPinyin(entry.p))` will work for single-syllable words. Multi-syllable words (like "baba") will only show zhuyin for the first syllable, which is acceptable.
- The `chineseWordsData` keys are extracted at render time via `Object.keys()` from the exported data.
- Need to export the raw `chineseWords` record (or add a `getAllEndingKeys()` function) from `chineseWordsData.ts` since currently only `getChineseWords()` is exported.
- localStorage key: `vowel-trainer-selected-endings`, stored as JSON array of strings. On mount, load from localStorage; default to all endings selected if nothing saved.
- Modify the wordCard show there is a setting to not display the bottom-right difficulty colored dots.  In Vowel-trainer, don't display those colored dots. But in RandomWords, do display those colored dots.

#### 3. `src/data/chineseWordsData.ts` -- Export keys accessor

Add:

```typescript
export function getAllEndingKeys(): string[] {
  return Object.keys(chineseWords);
}
```