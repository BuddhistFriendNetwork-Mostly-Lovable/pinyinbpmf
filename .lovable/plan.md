
# Add "Show Chinese Words" Feature

## Overview
Add a new "Chinese Words" row above the "English Rhyme Words" row in the phonetic table, showing common Chinese words for each final. The feature will have a toggle in settings (above "Show English Rhyme Words") and display words separated by " / " with a dark red background and white text. Clicking or hovering will show a detailed popup table.

## Files to Create

### 1. `src/data/chineseWordsData.ts`
New data file containing:
- The `EndingCommonChineseWords` record with the structure provided by the user
- Type definition: `interface ChineseWordEntry { w: string; m: string; p: string; }`
- Helper function `getChineseWords(finalPinyin: string)` to retrieve words for a final
- Helper function `getChineseWordsDisplay(finalPinyin: string)` to get just the words joined by " / "

### 2. `src/components/phonetic/ChineseWordsPopup.tsx`
New component similar to `RhymeWordsPopup.tsx`:
- Uses Popover from radix-ui
- Trigger displays words separated by " / " (80% bigger font for Chinese characters)
- Popup content shows a table with columns:
  - "Chinese Word" (clickable, links to MDBG)
  - "Meaning"
  - "Pinyin"
- Each Chinese word links to: `https://www.mdbg.net/chinese/dictionary?page=worddict&email=&wdrst=0&wdqb={CHINESE_TEXT}`
- Chinese text in popup also rendered at ~80% larger size

## Files to Modify

### 3. `src/components/phonetic/PhoneticChart.tsx`
- Add new state: `showChineseWords` (defaulting to `true`)
- Pass the new state and setter to `SettingsPanel`
- Pass the new state to `PhoneticTable`

### 4. `src/components/phonetic/SettingsPanel.tsx`
- Add new props: `showChineseWords`, `onShowChineseWordsChange`
- Add new Switch toggle for "Show Chinese Words" **above** the "Show English Rhyme Words" toggle
- No info button needed (or can add one later)

### 5. `src/components/phonetic/PhoneticTable.tsx`
- Add new prop: `showChineseWords`
- Add new header row **above** the English Rhyme Words row (and above "Init" if English Rhyme is hidden)
- Style: `bg-red-900` background, `text-white` text
- Left header cell: "Chinese Words" label
- Each final column renders `ChineseWordsPopup`

## Visual Layout (Table Header Order)
```text
+------------------+--------+--------+--------+...
| Chinese Words    | 爸爸/馬 | 愛/菜  | 貓/好  |  <- New row (dark red bg, white text)
+------------------+--------+--------+--------+...
| English Rhyme    | mama   | why    | pouch  |  <- Existing row (dark blue bg)
+------------------+--------+--------+--------+...
| Init             | a      | ai     | ao     |  <- Existing header
+------------------+--------+--------+--------+...
```

## Technical Details

### Data Structure
```typescript
interface ChineseWordEntry {
  w: string;  // Chinese word (may contain comma for trad,simp)
  m: string;  // Meaning
  p: string;  // Pinyin with tones
}

const chineseWords: Record<string, ChineseWordEntry[]> = { ... };
```

### MDBG URL Generation
For the Chinese word link, use URL encoding:
```typescript
const url = `https://www.mdbg.net/chinese/dictionary?page=worddict&email=&wdrst=0&wdqb=${encodeURIComponent(word)}`;
```

Note: For words with traditional/simplified variants (e.g., "愛,爱"), use only the first character group before the comma for the MDBG search.

### Styling
- Main row: `bg-red-900 text-white`
- Chinese text size: `text-lg` or `text-xl` (approximately 80% larger than default)
- Hover effect on cells: `hover:bg-red-800`
- Popup table: standard styling with larger Chinese text

### Popup Table Structure
| Chinese Word | Meaning | Pinyin |
|--------------|---------|--------|
| 爸爸 (link)  | daddy   | bàba   |
| 馬 (link)    | horse   | mǎ     |
| ...          | ...     | ...    |

## Implementation Order
1. Create `src/data/chineseWordsData.ts` with all the data and helper functions
2. Create `src/components/phonetic/ChineseWordsPopup.tsx` component
3. Update `SettingsPanel.tsx` to add the new toggle
4. Update `PhoneticChart.tsx` to add state management
5. Update `PhoneticTable.tsx` to render the new row

## Edge Cases
- Finals with no Chinese words data: render empty cell
- Words with comma-separated variants (trad,simp): display both, but link only to first
- Default state: `showChineseWords = true` (on by default as requested)
