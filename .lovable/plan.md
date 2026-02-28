## Random Words Page

### Overview

Create a new `/random-words` page that picks random Chinese words from the pinyinStubs data, displays them in a 5x4 grid with configurable visibility/hiding, and offers extensive display settings.

### New Files

#### 1. `src/lib/randomWordsUtils.ts` - Core logic

`**AllPinyinFromInitialAndEnding(initialsArray, endingsArray)**`

- Iterates initials x endings, checks each combo in `chartData` (key format: `"initial-ending"`)
- If cell pinyin starts with `(`, keeps the full parenthesized text; otherwise adds as-is
- Returns array of pinyin strings (may include `*` and `()`)

`**GenerateNwordsFromPinyin(initialWords, N, pinyinList, flags)**`

- Loop with `avoidInfinite` counter (max 10 consecutive failures)
- the flags are for how to handle * and ().  if {includeAsterisk: True, includeParentheses: True} then don't remove any elements (default behavior). If includeAsterisk is false, remove elements with asterisk. If includeParentheses is false, remove elements with parentheses. 
- Randomly picks pinyin from list, cleans it via `cleanPinyin`/`stripToneMarks`, looks up words via `getWordsForPinyinStub`
- Randomly picks a word entry, checks for duplicates (by `ct + pinyinStub`), appends if new
- Returns extended array of a custom type containing the `PinyinWordEntry` plus `pinyinStub`

**Default pinyin list generation**:

- `autogenPart1` = `AllPinyinFromInitialAndEnding(["b","p","m","f","d","t","n","g","k","h","j","q","x"], endingsWithDifficulty(0) concat endingsWithDifficulty(1))`
- `DefaultPinyinList = [...autogenPart1, "wo", "yi", "san", "si", "wu"]`

#### 2. `src/pages/RandomWords.tsx` - Main page component

**State management**:

- `words`: array of generated word objects (starts with 20)
- `hiddenRows`: `boolean[][]` - per-word array of 4 booleans (chinese, english, pinyin, zhuyin)
- All display setting states (toggles described below)

**Layout - 3 sections**:

**Top: Display Settings** (collapsible panels using Collapsible component)

*Word Control/Formatting:*

- "Show only first character" toggle (default off)
- "Show pinyin" toggle (default on)
- "Show zhuyin" toggle (default on)
- "Zhuyin format" two-option toggle: "3 boxes" vs "no boxes" (default 3 boxes)
- "Speak first, auto-reveal" toggle (default on) -- when on, pinyin/zhuyin initially hidden, revealed 1s after TTS

*Speech / Dictionary Links:*

- "English speaker icon" toggle (default on)
- "Chinese speaker icon" toggle (default on)
- "MDBG link for word" toggle (default off)
- "MDBG link for pinyin" toggle (default off)
  - Sub-toggle: "Ignore tone" (default on) -- strips tone number from pinyin before building MDBG URL

*Hiding:*

- "Don't hide first N words" toggle (default on) with N=5.  This will make nothing hidden for those first 5 words.
- "Randomize initial hiding" toggle (default off)
- "Initially hide Chinese" 3-way toggle (always/never/sometimes, default never) + "show all now" / "hide all now" buttons
- "Initially hide English" 3-way (default sometimes) + buttons
- "Initially hide Pinyin" 3-way (default never) + buttons
- "Initially hide Zhuyin" 3-way (default sometimes) + buttons
- "Randomize hiding now" action button

**Middle: Word Grid** (5 columns x 4 rows = 20 cards)

Each card has 4 rows:

1. Chinese text (+ optional speaker icon) -- colored by difficulty (red/yellow/green bg based on `difficultyCategorization` of that word's ending)
2. English meaning (+ optional speaker icon)
3. Pinyin
4. Zhuyin (rendered as 3 boxes or plain text per setting)

Hidden rows are blurred with a greyed-out eye icon; clicking reveals that row for that word.

Have a special divider between the first row and second row.  
  
Action buttons below grid: "Add 20 more" (calls `GenerateNwordsFromPinyin` with current words, target current+20) and "Random New Words" (regenerates from scratch).  
  
  
Also have action buttons to "Hide All" and "Show All" which hides everything. The action doesn't affect the first row.  


**Bottom: Filters/Restrictions** -- Visual stub placeholder with a card saying "Filters coming soon."

#### 3. `src/components/random/WordCard.tsx` - Individual word card

Props: word data, hidden state (4 booleans), display settings, callbacks for reveal/TTS.

- Renders 4 rows with conditional blur (`filter: blur(5px)`) and eye icon overlay
- Difficulty color: The user will set these and these will be saved locally so that this data persists across sessions. This is the fill color for a small box at the bottom right of the WordCard.
- Zhuyin display: uses `cleanZhuyin` on the pinyinStub's zhuyin from `chartData` or `endings`
- "Show only first character" mode: shows only `cs[0]` and first pinyin syllable

#### 4. Route registration in `src/App.tsx`

- Add `<Route path="/random-words" element={<RandomWords />} />`

### Technical Details

- The pinyinStubs data is lazy-loaded (already has `getWordsForPinyinStubAsync`). For this page, since we need it upfront, we'll import the async loader and load on mount.
- The 3-way toggles (always/never/sometimes) will use a `ToggleGroup` with 3 items.
- "Sometimes" hiding means ~50% random chance per word.
- Difficulty-to-color mapping: levels 1-2 = green, 3-4 = yellow, 5-6 = red.

### File Change Summary


| File                                 | Action                       |
| ------------------------------------ | ---------------------------- |
| `src/lib/randomWordsUtils.ts`        | Create - helper functions    |
| `src/pages/RandomWords.tsx`          | Create - main page           |
| `src/components/random/WordCard.tsx` | Create - word card component |
| `src/App.tsx`                        | Edit - add route             |
