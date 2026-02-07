
# Implementation Plan: "I'm Confused! Help!" Modal

## Overview
Add a help button with a full-screen modal containing 5 tabbed sections with comprehensive educational content about learning Chinese phonetics.

## Changes Required

### 1. Create New Component: `HelpDialog.tsx`

Create a new file `src/components/phonetic/HelpDialog.tsx` containing:

- A full-screen Dialog component using the existing `Dialog` UI component
- Tabs component with 5 tabs:
  1. "Total Beginner"
  2. "Troubleshooting Sound"
  3. "I know Zhuyin"
  4. "I know Pinyin"
  5. "I know Chinese"
- Each tab will contain the provided educational content with proper formatting
- Use ScrollArea for scrollable content within each tab
- Include all external links as clickable links opening in new tabs
- For the "I know Pinyin" tab, embed a Chinese Words table for "un" using the existing `getChineseWords` function and similar table styling from `ChineseWordsPopup`

**Component Structure:**
```text
+------------------------------------------+
| Dialog (full-screen)                     |
|   +--------------------------------------+
|   | DialogHeader: "Help Guide"           |
|   +--------------------------------------+
|   | Tabs                                 |
|   |   TabsList (5 tabs, scrollable on   |
|   |             mobile)                  |
|   |   TabsContent (ScrollArea)          |
|   +--------------------------------------+
+------------------------------------------+
```

### 2. Modify: `PhoneticChart.tsx`

- Add state: `const [helpDialogOpen, setHelpDialogOpen] = useState(false);`
- Add the help button after the subtitle text
- Import and render the new `HelpDialog` component

**UI Element:**
- Button styled with a friendly appearance (e.g., outline variant)
- Text: "I'm Confused! Help!"
- Placed directly after the subtitle "Interactive learning tool for Mandarin Chinese phonetics"

---

## Technical Details

### Tab Content Formatting

Each tab will use consistent styling:
- `<h3>` for subheadings with `font-semibold text-base mb-2`
- `<p>` for paragraphs with `text-muted-foreground mb-2`
- `<ul>` with `list-disc list-inside space-y-1` for bullet lists
- External links with `text-primary underline hover:text-primary/80`
- Separators using the existing `Separator` component

### Embedded Chinese Words Table (for "I know Pinyin" tab)

Reuse the table structure from `ChineseWordsPopup.tsx` to display the "un" final words inline within the content, demonstrating how words rhyme.

### Mobile Responsiveness

- The TabsList will use `flex-wrap` or horizontal scroll to handle 5 tabs on smaller screens
- Dialog will be truly full-screen using `className="max-w-full h-full max-h-full sm:max-w-4xl sm:h-[90vh]"`

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/phonetic/HelpDialog.tsx` | Create new file |
| `src/components/phonetic/PhoneticChart.tsx` | Add button + state + import |

---

## Content Summary by Tab

1. **Total Beginner**: Introduction to Chinese sounds (410 total), categories of difficulty, step-by-step instructions for using the chart, study game suggestion
2. **Troubleshooting Sound**: TTS explanation, browser requirements, webview issues, link to companion app
3. **I know Zhuyin**: Pinyin gotchas, recommended learning path avoiding W-/Y- initially
4. **I know Pinyin**: Zhuyin benefits, recommended path with embedded "un" word table example, learning steps
5. **I know Chinese**: Deeper explanation of sound systems, pinyin/zhuyin tables comparison, external resources, ear training methodology, English syllable analogy appendix
