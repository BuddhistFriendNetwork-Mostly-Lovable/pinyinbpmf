## Vowel Trainer: Per-Ending Word Limiting

### Overview

Add the ability to control how many words per ending are shown, with Show More / Show All / Reset buttons.

### Changes (all in `src/pages/VowelTrainer.tsx`)

#### 1. New type: `VowelTrainerEntry`

Extend `RandomWordEntry` with an `ending` field:

```typescript
interface VowelTrainerEntry extends RandomWordEntry {
  ending: string;
}
```

Update all references from `{ word: RandomWordEntry; key: string }` to `{ word: VowelTrainerEntry; key: string }` in VowelTrainer.

#### 2. New state: `maxWordsPerEnding`

```typescript
const [maxWordsPerEnding, setMaxWordsPerEnding] = useState(1);
```

#### 3. Modify `words` useMemo (lines 146-159)

- Store the `ending` in each entry via `toRandomWordEntry` returning a `VowelTrainerEntry` (or just attach it after).
- The result items become `{ word: VowelTrainerEntry; key: string }`.

#### 4. New derived value: `wordsToShow`

A `useMemo` depending on `words` and `maxWordsPerEnding`:

- Loop through `words`, track the current ending and a count of "true so far" for that ending.
- Set `true` for the first `maxWordsPerEnding` entries of each distinct ending, `false` otherwise.
- When the ending changes, reset the counter to 0.

#### 5. Derived `visibleWords` and `visibleCount`

```typescript
const visibleWords = words.filter((_, i) => wordsToShow[i]);
const visibleCount = visibleWords.length;
```

#### 6. Update count display (line 265)

Change from `{words.length} words` to `{visibleCount} words out of {words.length} total`.

#### 7. Add three buttons after the count

- **Show More**: `setMaxWordsPerEnding(prev => prev + 1)`
- **Show All**: `setMaxWordsPerEnding(9999)`
- **Reset (1 per ending)**: `setMaxWordsPerEnding(1)`

#### 8. Update WordCards grid (line 270)

Change `words.map(...)` to `visibleWords.map(...)`.

#### 9. Update `showAll`/`hideAll` callbacks

These iterate over `words` to set hidden rows -- change them to iterate over `visibleWords` instead so they only affect shown cards.