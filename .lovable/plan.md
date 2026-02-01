

## Add Audio and Popup Settings Sections

This plan adds two new settings sections to control audio behavior and enable an MDBG dictionary popup feature.

---

### Overview

1. Create a reusable **Zhuyin cleaning utility function** for extracting pure Zhuyin characters
2. Add **Audio section** with 3 modes and a TTS info dialog
3. Add **Popup section** with MDBG dictionary search feature
4. Update TTS hook to support different speech modes
5. Show popup after cell click when enabled

---

### New Files

#### 1. `src/lib/zhuyinUtils.ts` - Reusable Zhuyin utilities

```typescript
// Zhuyin character range: ㄅ-ㄩ (U+3105-U+3129)
const ZHUYIN_REGEX = /[\u3105-\u3129]/g;

/**
 * Extracts clean Zhuyin characters from a string.
 * Takes up to the first 3 Zhuyin characters only.
 */
export const cleanZhuyin = (zhuyin: string): string => {
  const matches = zhuyin.match(ZHUYIN_REGEX);
  if (!matches) return '';
  return matches.slice(0, 3).join('');
};

/**
 * Formats Zhuyin for separated TTS pronunciation.
 * Separates each character with Chinese period to force distinct sounds.
 */
export const formatZhuyinForSeparateTTS = (zhuyin: string): string => {
  const clean = cleanZhuyin(zhuyin);
  return clean.split('').join('。') + '。';
};

/**
 * Builds MDBG dictionary search URL for a Zhuyin string.
 */
export const buildMDBGUrl = (zhuyin: string): string => {
  const clean = cleanZhuyin(zhuyin);
  return `https://www.mdbg.net/chinese/dictionary?page=worddict&wdqb=p%3A${encodeURIComponent(clean)}*`;
};
```

#### 2. `src/components/phonetic/TTSInfoDialog.tsx` - TTS explanation dialog

```typescript
// Dialog explaining what TTS is and linking to recommended resources
// Content:
// - What TTS means
// - Browser/device variability warning
// - LINE/Facebook webview warning
// - Link to digmandarin.com pinyin chart
```

#### 3. `src/components/phonetic/CellPopup.tsx` - MDBG search popup

```typescript
// Small popup component shown after clicking a cell
// Shows "Search MDBG" link that opens dictionary in new tab
// Uses buildMDBGUrl with cleanZhuyin
```

---

### Modified Files

#### 1. `src/hooks/useTTS.ts`

Add audio mode support:

```typescript
export type AudioMode = 'zhuyin-comment' | 'zhuyin-separate' | 'none';

interface UseTTSReturn {
  speak: (text: string, mode?: AudioMode) => void;
  // ... existing properties
}
```

Update `speak` function:
- `zhuyin-comment`: Current behavior (rate 0.8)
- `zhuyin-separate`: Use `formatZhuyinForSeparateTTS()`, rate 0.64 (80% of 0.8)
- `none`: No speech

#### 2. `src/components/phonetic/SettingsPanel.tsx`

Add new props and UI sections:

```typescript
interface SettingsPanelProps {
  // ... existing props
  audioMode: AudioMode;
  onAudioModeChange: (mode: AudioMode) => void;
  onOpenTTSInfo: () => void;
  showMDBGPopup: boolean;
  onShowMDBGPopupChange: (enabled: boolean) => void;
}
```

Add two new sections after existing ones:

**Audio Section:**
- Label: "Audio"  
- 3 toggle buttons: "Zhuyin + Comment (uses TTS ?)", "Zhuyin Separate (uses TTS ?)", "None"
- The "TTS ?" text is clickable and opens TTSInfoDialog

**Popup Section:**
- Label: "Popup"
- Checkbox: "Search for pinyin/zhuyin on MDBG dictionary" (default checked)

#### 3. `src/components/phonetic/PhoneticChart.tsx`

Add new state and pass to components:

```typescript
const [audioMode, setAudioMode] = useState<AudioMode>('zhuyin-comment');
const [showMDBGPopup, setShowMDBGPopup] = useState(true);
const [ttsInfoOpen, setTTSInfoOpen] = useState(false);
```

Pass to SettingsPanel and PhoneticTable.

#### 4. `src/components/phonetic/PhoneticTable.tsx`

Update to handle:
- Pass `audioMode` to `speak()` function
- After cell click, if `showMDBGPopup` is true, show CellPopup component
- Use Popover component for the popup positioned near the clicked cell

---

### Technical Details

**Zhuyin Character Range:**
- Unicode range U+3105 to U+3129 covers all Bopomofo (Zhuyin) characters
- Regex `/[\u3105-\u3129]/g` matches only these characters

**Audio Mode Behavior:**

| Mode | Text Sent to TTS | Rate |
|------|------------------|------|
| zhuyin-comment | Raw zhuyin string (e.g., "ㄅㄧㄝ") | 0.8 |
| zhuyin-separate | Separated (e.g., "ㄅ。ㄧ。ㄝ。") | 0.64 |
| none | No speech | N/A |

**MDBG URL Format:**
```
https://www.mdbg.net/chinese/dictionary?page=worddict&wdqb=p%3A{zhuyin}*
```
- `p%3A` = URL-encoded `p:` (pronunciation search)
- `*` = wildcard for all tones

---

### Files Summary

| File | Action |
|------|--------|
| `src/lib/zhuyinUtils.ts` | Create |
| `src/components/phonetic/TTSInfoDialog.tsx` | Create |
| `src/components/phonetic/CellPopup.tsx` | Create |
| `src/hooks/useTTS.ts` | Modify |
| `src/components/phonetic/SettingsPanel.tsx` | Modify |
| `src/components/phonetic/PhoneticChart.tsx` | Modify |
| `src/components/phonetic/PhoneticTable.tsx` | Modify |

