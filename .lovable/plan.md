
# Create pinyinStubsToWordsData.ts Data File

## Overview
Create a new data file in `src/data/` that stores Chinese word entries grouped by pinyin stub (pinyin without tone marks). This will include TypeScript interfaces and a lookup function.

## Data Structure

The data follows this structure:
- **pinyinStub**: Base pinyin without tone (e.g., "zhi", "chi", "shi")
- **characters**: Array of word entries with:
  - `h`: HSK level (-1 = not in HSK)
  - `ct`: Chinese Traditional character
  - `fp`: Full pinyin with tone marks
  - `e`: English meaning
  - `t`: Tone number (1-5)
  - `cs`: Chinese Simplified character

## File to Create

### `src/data/pinyinStubsToWordsData.ts`

**TypeScript Interfaces:**
```typescript
export interface PinyinWordEntry {
  h: number;    // HSK level (-1 = not in HSK)
  ct: string;   // Chinese Traditional
  fp: string;   // Full pinyin with tone
  e: string;    // English meaning
  t: number;    // Tone (1-5)
  cs: string;   // Chinese Simplified
}

export interface PinyinStubData {
  pinyinStub: string;
  characters: PinyinWordEntry[];
}
```

**Data Storage:**
- Store the array as a constant
- Create a Map for O(1) lookup by pinyinStub

**Exports:**
```typescript
// Get all word entries for a given pinyin stub
export function getWordsForPinyinStub(pinyinStub: string): PinyinWordEntry[]

// Get the raw data array (if needed for iteration)
export const pinyinStubsData: PinyinStubData[]
```

## Sample Data Entries

The file will contain 5 pinyin stubs from the provided data:
| Pinyin Stub | # of Characters |
|-------------|-----------------|
| zhi         | 10              |
| chi         | 10              |
| shi         | 10              |
| ri          | 2               |
| zi          | 10              |

## Implementation Notes

- The lookup function will return an empty array if the pinyin stub is not found
- Data is stored as-is with short property names (`h`, `ct`, `fp`, `e`, `t`, `cs`) to minimize file size
- A Map is built at module load time for efficient lookups
