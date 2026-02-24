

## Rename `finals` to `endings` and Add `medial`/`final` Fields

### Overview
Rename the exported `finals` array to `endings` in `phoneticData.ts`, and add two new fields (`medial` and `final`) to each element based on the zhuyin character count. Then update all references across the codebase.

### Changes

#### 1. `src/data/phoneticData.ts`
- Rename `export const finals` to `export const endings`
- Add `medial` and `final` fields to every element:
  - **1-character zhuyin** (e.g., `ㄚ`, `ㄜ`, `ㄧ`): `medial: ""`, `final: "ㄚ"`
  - **2-character zhuyin** (e.g., `ㄧㄚ`, `ㄨㄟ`): `medial: "ㄧ"`, `final: "ㄚ"`

Examples:
```
{ pinyin: "a",   zhuyin: "ㄚ",   group: "a", medial: "",  final: "ㄚ" }
{ pinyin: "ia",  zhuyin: "ㄧㄚ", group: "i", medial: "ㄧ", final: "ㄚ" }
{ pinyin: "uan", zhuyin: "ㄨㄢ", group: "u", medial: "ㄨ", final: "ㄢ" }
```

#### 2. `src/components/phonetic/PhoneticTable.tsx`
- Update the import: `finals` becomes `endings`
- Update all 4 references where `finals.map(...)` is used, changing to `endings.map(...)`

No other files import `finals` directly (the HelpDialog reference is just alt text, no code change needed there).

