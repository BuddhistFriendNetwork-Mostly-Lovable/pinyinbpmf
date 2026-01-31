

## Show Alternate "u" Spelling for ü Finals

A small enhancement to the column headers to help learners understand that ü can be written as "u" in certain contexts (like after j, q, x, y).

---

### What Changes

**File: `src/components/phonetic/PhoneticTable.tsx`**

In the table header section (around line 94), update the display logic:

**Current code:**
```tsx
<div className="font-bold">{final.pinyin}</div>
```

**New code:**
```tsx
<div className="font-bold">
  {final.pinyin.startsWith('ü') 
    ? `${final.pinyin} / ${final.pinyin.replace('ü', 'u')}`
    : final.pinyin}
</div>
```

---

### Result

The column headers for ü-finals will display:
- **ü / u** (instead of just "ü")
- **üe / ue** (instead of just "üe")
- **üan / uan** (instead of just "üan")
- **ün / un** (instead of just "ün")

This helps learners understand the relationship between the "proper" ü spelling and the commonly-used "u" variant.

---

### Technical Notes

- Simple string check using `startsWith('ü')`
- String replacement using `replace('ü', 'u')`
- No data structure changes needed
- Only affects the 4 ü-group column headers

