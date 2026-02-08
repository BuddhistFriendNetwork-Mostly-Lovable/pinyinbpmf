
# Implementation Plan: Pinyin Stubs to Words Data Source and Enhanced Cell Popup

## Overview
Create a new data source from the uploaded file containing common Chinese characters grouped by pinyin stub. Then, replace the current cell popup content with an expandable table showing common words for each pinyin, with additional details visible when expanded.

## Data Structure Analysis

The uploaded file contains JSON data with this structure:
- `pinyinStub`: The base pinyin without tone (e.g., "zhi", "chi", "shi")
- `characters`: Array of word entries with:
  - `h`: HSK level (-1 means not in HSK)
  - `ct`: Chinese Traditional character
  - `fp`: Full pinyin with tone marks
  - `e`: English meaning
  - `t`: Tone number (1-4, 5 for neutral)
  - `cs`: Chinese Simplified character

---

## Changes Required

### 1. Create New Data Source: `src/data/pinyinStubsToWordsData.ts`

**Clean up the uploaded JSON:**
- Remove the "ZZZZ First 10" header line
- Parse the JSON array structure

**Define TypeScript interfaces:**
```typescript
interface PinyinWordEntry {
  hskLevel: number;        // h field, -1 = not in HSK
  traditional: string;     // ct field
  fullPinyin: string;      // fp field  
  meaning: string;         // e field
  tone: number;            // t field (1-5)
  simplified: string;      // cs field
}

interface PinyinStubData {
  pinyinStub: string;
  characters: PinyinWordEntry[];
}
```

**Export lookup function:**
```typescript
export function getWordsForPinyin(pinyin: string): PinyinWordEntry[]
```
- Clean the pinyin input using `cleanPinyin()` to strip parentheses/asterisks
- Look up in the data map
- Return empty array if not found

### 2. Add MDBG URL Builder for Chinese Words: `src/lib/zhuyinUtils.ts`

**Add new function:**
```typescript
export const buildMDBGUrlForWord = (chineseWord: string): string => {
  // Uses query format: *{word}*
  return `https://www.mdbg.net/chinese/dictionary?page=worddict&wdqb=*${encodeURIComponent(chineseWord)}*`;
};
```

### 3. Update Cell Popup Component: `src/components/phonetic/CellPopup.tsx`

**Add state for expanded view:**
```typescript
const [isExpanded, setIsExpanded] = useState(false);
```

**Fetch word data:**
```typescript
const words = getWordsForPinyin(pinyin);
```

**New popup layout:**

```
+------------------------------------------------------+
| Common Words for {pinyin}      [Expand ▼] / [Less ▲] |
+------------------------------------------------------+
| DEFAULT VIEW (collapsed):                             |
| Chinese    | Pinyin   | English Meaning              |
|------------|----------|------------------------------|
| 之         | zhi      | possessive particle...       |
| 知         | zhi      | to know, realize             |
+------------------------------------------------------+

| EXPANDED VIEW:                                        |
| HSK | Chinese  | Tone Category | English Meaning  |↗ |
|-----|----------|---------------|------------------|---|
| 1   | 之       | 1 - High      | possessive...    | ↗|
| 1   | 知       | 1 - High      | to know...       | ↗|
+------------------------------------------------------+
```

**Chinese column logic:**
- Show Traditional
- If Simplified differs: show "Traditional - Simplified" (e.g., "時 - 时")
- If same: show only once (e.g., "是")

**Tone category display:**
- 1 - High
- 2 - Rising
- 3 - Dipping
- 4 - Falling
- 5 - Neutral

**Expand/collapse toggle:**
- Use lucide icons: `ChevronDown` / `ChevronUp`
- Button text: "Expand" / "Less"

**External link (expanded view only):**
- Links to MDBG with query: `*{traditional_character}*`
- Use `ExternalLink` icon

**Keep existing content below the table:**
- Audio disclaimer with pinyin/zhuyin
- MDBG and Yabla search links for the pinyin

### 4. Handle Empty States

If no words are found for a pinyin:
- Show the existing popup content (audio disclaimer + dictionary links)
- Skip the table section entirely

---

## Technical Details

### Data File Processing

The uploaded file has:
- Line 1: "ZZZZ First 10" (header to remove)
- Lines 2-4462: JSON array

Processing steps:
1. Remove line 1
2. Parse as JSON
3. Transform field names to readable TypeScript
4. Create a lookup Map keyed by pinyinStub

### Tone Category Labels

```typescript
const TONE_LABELS: Record<number, string> = {
  1: "1 - High",
  2: "2 - Rising", 
  3: "3 - Dipping",
  4: "4 - Falling",
  5: "5 - Neutral"
};
```

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/data/pinyinStubsToWordsData.ts` | **Create** - New data source with cleaned JSON |
| `src/lib/zhuyinUtils.ts` | **Modify** - Add `buildMDBGUrlForWord()` function |
| `src/components/phonetic/CellPopup.tsx` | **Modify** - Complete rewrite with expandable table |

### Component Structure for CellPopup

```typescript
export const CellPopup = ({ pinyin, zhuyin, open, onOpenChange, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const words = getWordsForPinyin(pinyin);
  const cleanedPinyin = cleanPinyin(pinyin);
  
  return (
    <Popover>
      <PopoverTrigger>...</PopoverTrigger>
      <PopoverContent>
        {words.length > 0 && (
          <>
            {/* Header with title and expand toggle */}
            {/* Table with conditional columns */}
          </>
        )}
        {/* Existing audio disclaimer and dictionary links */}
      </PopoverContent>
    </Popover>
  );
};
```

### Table Column Definitions

**Collapsed (default):**
| Column | Width | Content |
|--------|-------|---------|
| Chinese | auto | Traditional + optional "- Simplified" |
| Pinyin | auto | fullPinyin field |
| English Meaning | auto | meaning field (truncated if needed) |

**Expanded:**
| Column | Width | Content |
|--------|-------|---------|
| HSK | narrow | hskLevel (show "-" if -1) |
| Chinese | auto | Traditional + optional "- Simplified" |
| Tone Category | auto | Number + Label (e.g., "1 - High") |
| English Meaning | auto | meaning field |
| Link | icon | ExternalLink to MDBG |

---

## Visual Design

- Popup width: `min-w-[400px]` to accommodate table
- Table uses existing shadcn/ui Table components
- Expand button: Small ghost button with icon + text
- Consistent with existing `ChineseWordsPopup` styling
- External link button styled as ghost, icon-only

