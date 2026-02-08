

# Implementation Plan: Table Text Size and Bold Settings (Updated)

## Overview
Add a "Table Text Size" control with +/- buttons and percentage display, plus a "Bold" toggle. These settings affect all table text including the Chinese Words row, English Rhyme Words row, and the main phonetic cells. When text size is 90% or less, the table becomes more compact with dynamic max-width constraints to maintain word wrap.

## Changes Required

### 1. Update `PhoneticChart.tsx`

Add two new state variables:
- `tableTextSize: number` - defaults to 100
- `tableBold: boolean` - defaults to true

Pass these values and their setters to both `SettingsPanel` and `PhoneticTable`.

### 2. Update `SettingsPanel.tsx`

**Add new props:**
```typescript
tableTextSize: number;
onTableTextSizeChange: (size: number) => void;
tableBold: boolean;
onTableBoldChange: (bold: boolean) => void;
```

**Add new UI row** (single row with all controls):
```text
+-------------------------------------------------------------------------+
| Table Text Size:  [-]  100%  [+]   [Reset to 100%]   Bold [Toggle]      |
+-------------------------------------------------------------------------+
```

**Implementation details:**
- Use `Minus` and `Plus` icons from lucide-react for the buttons
- Text size values: `[50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200]`
- Clicking `-` moves to the previous step in the array (if not at minimum)
- Clicking `+` moves to the next step in the array (if not at maximum)
- Display current percentage between the buttons
- "Reset to 100%" button appears inline, styled as a small ghost button (hidden when already at 100%)
- Bold toggle uses `Switch` component, inline on the same row

### 3. Update `PhoneticTable.tsx`

**Add new props:**
```typescript
tableTextSize: number;
tableBold: boolean;
```

**Apply text size scaling:**
- Wrap the entire table in a container with dynamic `font-size` style
- Use inline style: `style={{ fontSize: \`${tableTextSize}%\` }}`
- This cascades to all child elements including:
  - Main table cells (pinyin/zhuyin text)
  - Chinese Words row trigger text (currently `text-lg` in `ChineseWordsPopup`)
  - English Rhyme Words row trigger text (in `RhymeWordsPopup`)
  - Header row text (Init, finals)

**Apply compact mode when size <= 90%:**
- Conditionally reduce padding: `p-1` instead of `p-2` for cells
- Remove `min-w-[60px]` constraint from column headers
- Add dynamic `max-w` to cells to maintain word wrap:
  - Formula: `max-w-[${Math.round(80 * tableTextSize / 100)}px]`
  - At 100%: max-w-[80px]
  - At 50%: max-w-[40px]
  - At 200%: max-w-[160px] (though compact mode only applies at 90% or less)

**Apply bold toggle:**
- When `tableBold` is false, conditionally remove `font-bold` and `font-medium` classes
- This affects:
  - Pinyin text in cells (currently `font-bold text-sm`)
  - Zhuyin text in cells (currently `font-medium`)
  - Header row text
  - Initial column text

### 4. Confirmation: English Rhyme and Chinese Words Rows

Both rows will be affected by the text size scaling because:

1. **ChineseWordsPopup** (line 32): The trigger button uses `text-lg` class. Since we apply `fontSize` as a percentage to the parent container, this will scale proportionally. At 100%, `text-lg` stays as is. At 50%, the font renders at 50% of `text-lg` size.

2. **RhymeWordsPopup** (line 32): The trigger button inherits the parent's font size. It will scale with the container.

3. Both header rows (`bg-red-900` for Chinese Words and `bg-blue-900` for English Rhyme) will have their `min-w-[60px]` removed in compact mode and will receive the same `max-w` constraint.

---

## Technical Details

### Text Size Step Navigation

```typescript
const TEXT_SIZE_STEPS = [50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200];

const handleDecrease = () => {
  const currentIndex = TEXT_SIZE_STEPS.indexOf(tableTextSize);
  if (currentIndex > 0) {
    onTableTextSizeChange(TEXT_SIZE_STEPS[currentIndex - 1]);
  }
};

const handleIncrease = () => {
  const currentIndex = TEXT_SIZE_STEPS.indexOf(tableTextSize);
  if (currentIndex < TEXT_SIZE_STEPS.length - 1) {
    onTableTextSizeChange(TEXT_SIZE_STEPS[currentIndex + 1]);
  }
};
```

### Compact Mode Logic

When `tableTextSize <= 90`:
- Cell inner padding: `p-1` instead of `p-2`
- Remove `min-w-[60px]` from headers
- Apply dynamic max-width for word wrap: `style={{ maxWidth: \`${Math.round(80 * tableTextSize / 100)}px\` }}`

### Bold Toggle Logic

- When `tableBold` is `true` (default): keep existing `font-bold` and `font-medium` classes
- When `tableBold` is `false`: replace with `font-normal` class

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/phonetic/PhoneticChart.tsx` | Add state for `tableTextSize` and `tableBold`, pass to children |
| `src/components/phonetic/SettingsPanel.tsx` | Add new props, add text size row with +/- buttons, percentage display, reset button, and bold toggle |
| `src/components/phonetic/PhoneticTable.tsx` | Add props, apply dynamic font-size style, compact mode styles with max-width, bold toggle |

---

## UI Layout in Settings

The new setting will be placed after "Show English Rhyme Words" and before "Other Settings":

```text
Table Text Size    [-]  100%  [+]   [Reset to 100%]      Bold [on/off]
```

Single row layout with:
- Label on the left
- Minus button, percentage display, Plus button in the middle
- Reset button (small, ghost variant) - only shown when not at 100%
- Bold toggle with label on the right

