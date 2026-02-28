## Filters and Restrictions: Quick Presets

### Overview

Replace the "Filters & Restrictions coming soon" stub with a collapsible section containing a "Quick Menu" of preset buttons. Each preset defines which initials, endings, and special pinyin to use when generating words. Selecting a preset changes the active pinyin list used by all word generation actions.

### Changes

#### 1. `src/lib/randomWordsUtils.ts` -- Add QuickPreset type and presets

**New type:**

```typescript
interface QuickPreset {
  name: string;
  autogenInit: string[];
  autogenEndings: string[];
  specialAdds: string[];
  notes: string; // shown when (?) is clicked
}
```

**New function:**

```typescript
function PinyinListFromQuickPreset(preset: QuickPreset): string[]
```

- Resolves `autogenEndings` to their pinyin strings from the `endings` array
- Calls `AllPinyinFromInitialAndEnding(preset.autogenInit, resolvedEndings)`
- Appends `preset.specialAdds`
- Returns the combined list

**Refactor** the existing `DefaultPinyinList`:

- Define an `EasyPreset` QuickPreset with:
  - `autogenInit`: `["b","p","m","f","d","t","n","g","k","h","j","q","x"]`
  - `autogenEndings`: `[...endingsWithDifficulty(0), ...endingsWithDifficulty(1)]`
  - `specialAdds`: `["wo","yi","san","si","wu"]`
  - `notes`: Lists the initials, endings (with counts), and special adds
- `DefaultPinyinList = PinyinListFromQuickPreset(EasyPreset)`

**Define `UmlautPreset`:**

- `autogenInit`: All initials from the `initials` array (filtering out special rows like "y?", "w?", "empty set")
- `autogenEndings`: `["ü", "üe", "üan", "ün", "iong"]`
- `specialAdds`: `[]` (empty)
- `notes`: The provided multi-paragraph explanation about umlauts, the ü/u distinction, and the j/q/x/y tip

**Export** `EasyPreset`, `UmlautPreset`, and an array `quickPresets` containing both, plus the `PinyinListFromQuickPreset` function.

#### 2. `src/pages/RandomWords.tsx` -- Wire up Filters section

**State:**

- `filtersOpen: boolean` (collapsible state, default false)
- `activePreset: QuickPreset` (default `EasyPreset`)
- `activePinyinList: string[]` (derived from active preset)
- `presetInfoOpen: string | null` (which preset's info dialog is showing)

**Replace** the stub Card (lines 596-600) with:

- A `Collapsible` wrapping a Card titled "Filters & Restrictions"
- Inside, a "Quick Menu" section with buttons for each preset
- Each button shows the preset name and a `(?)` icon
- Active preset is visually highlighted
- Clicking a preset button sets it as active and regenerates the pinyin list
- Clicking `(?)` opens a small dialog/popover showing the preset's `notes` text (formatted with initials list, endings list with count, and special adds)

**Update all word generation calls** (`GenerateNwordsFromPinyin`) to use `activePinyinList` instead of the hardcoded `DefaultPinyinList`.

### Technical Details

- The `notes` for "Easy" will be auto-generated from the preset data: "Initials (13): b, p, m, f, d, t, n, g, k, h, j, q, x. Endings (N): a, ai, ... Special Adds (5): wo, yi, san, si, wu."
- The `notes` for "Umlauts" is the provided multi-line explanation text.
- All initials for the Umlaut preset: `["b","p","m","f","d","t","n","l","g","k","h","j","q","x","zh","ch","sh","r","z","c","s"]` (the standard consonant initials, excluding the special y?/w?/empty-set rows).
- Fix the line         // Keep the full parenthesized text in AllPinyinFromInitialAndEnding.   do the regexpression to match the parentheses and the text inside. So "(ye) --> ie" would get converted to "(ye)"