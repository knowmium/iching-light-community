# The Oracle - I Ching Divination App Design Document

## Current Product Direction

The shipped application is **I Ching Light**, a monochrome redesign of the earlier Forest Oracle concept. The current interface uses a pure black background, white primary text, gray secondary text and changing lines, clean system sans-serif typography, thin gray borders, and restrained 1-bit imagery. The historical Forest Oracle notes below remain as project history; this current direction governs new interface work.

## Unihertz Titan 2 Elite Layout Target

The primary target is the **Unihertz Titan 2 Elite**, with a verified 1080 × 1200, 4.03-inch near-square display above a physical keyboard. React Native must respond to the runtime window dimensions rather than hard-code physical pixels.

| Layout rule | Standard portrait phone | Titan compact mode |
|---|---:|---:|
| Breakpoint | Height/width above 1.25 | Height/width at or below 1.25 |
| Screen chrome | Existing spacing | 44-point header/footer targets with reduced surrounding padding |
| Reading cards | 16-point outer inset, 24-point content inset | 10-point outer inset, 18-point content inset |
| Generated vision image | Width-derived standard size | Capped to available card height and width |
| Long text | Scrollable | Scrollable with tighter but readable line height |
| Hexagram geometry | Existing sizes | Compact large-size variant while preserving gray changing lines |

All content sections, shake-to-cast behavior, haptics, image caching, changing-line distinction, and AI-generated interpretation/synthesis must remain intact.

## Design Philosophy

This app channels the aesthetic sensibilities of Wes Anderson films combined with early Macintosh MacPaint-era graphics. The result is a contemplative, whimsical, yet deeply intentional divination experience that feels both nostalgic and timeless.

The design embraces **symmetrical compositions**, **restrained color palettes**, **distinctive serif typography**, and **1-bit black-and-white illustrations** that evoke the charm of early personal computing while maintaining the gravitas appropriate for an ancient oracle.

---

## Color Palette

The app uses a warm, cream-based palette inspired by aged paper and vintage book design:

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| background | #FDF6E3 (cream) | #1A1814 (warm black) | Main screen background |
| foreground | #2C2416 (dark brown) | #F5E6D3 (warm cream) | Primary text |
| muted | #8B7355 (warm brown) | #A89880 (muted tan) | Secondary text |
| primary | #2C2416 (dark brown) | #F5E6D3 (cream) | Accent, buttons |
| surface | #F5ECD8 (light cream) | #2A2520 (dark surface) | Cards, elevated areas |
| border | #D4C4A8 (tan) | #4A4035 (dark tan) | Borders, dividers |

---

## Typography

The app uses a combination of serif and monospace typefaces to create a literary, contemplative mood:

**Headings**: System serif (Georgia/Times) - elegant, classical feel for hexagram names and titles

**Body Text**: System default - clean readability for oracle interpretations

**Hexagram Symbols**: Unicode I Ching characters (䷀-䷿) displayed large and centered

---

## Screen List

### 1. Home Screen (Oracle Portal)
The entry point features a centered, symmetrical layout with the app title, a mystical 1-bit illustration, and a prominent "Consult the Oracle" button. A dotted border frames the content area, reminiscent of early Mac dialog boxes.

### 2. Divination Screen (Casting)
An animated coin-toss or yarrow-stalk visualization where the user taps to cast their hexagram. The process should feel ceremonial and deliberate, with each line appearing one at a time.

### 3. Reading Screen (Hexagram Result)
Displays the resulting hexagram with its name, Chinese character, and the Wilhelm translation. Content is organized in elegant card sections with generous whitespace.

### 4. Archive Screen (Past Readings)
A chronological list of previous consultations stored locally, allowing users to revisit their oracle history.

---

## Primary Content and Functionality

### Home Screen
- App title "THE ORACLE" in elegant serif
- Subtitle "Book of Changes" in smaller text
- 1-bit MacPaint-style illustration (mystical eye, trigram pattern, or I Ching wheel)
- Large "CONSULT THE ORACLE" button with dotted border
- Small "Archive" link to view past readings

### Divination Screen
- Instruction text: "Tap to cast your fate"
- Six horizontal lines that build from bottom to top
- Each tap reveals one line (solid ━━━ or broken ━ ━)
- Subtle animation as lines appear
- Progress indicator (1/6, 2/6, etc.)

### Reading Screen
- Large hexagram Unicode symbol (e.g., ䷀)
- Hexagram number and English name
- Chinese name with pinyin
- Tabbed sections for: Judgment, Image, Lines
- Share/Save functionality

### Archive Screen
- List of past readings with date and hexagram name
- Tap to view full reading again
- Delete individual entries

---

## Key User Flows

### Primary Flow: Daily Divination
1. User opens app → Home Screen
2. User taps "Consult the Oracle"
3. User taps 6 times to cast hexagram lines
4. Hexagram builds visually, line by line
5. Final hexagram revealed with animation
6. Reading Screen displays full interpretation
7. Reading auto-saved to Archive

### Secondary Flow: Review Past Reading
1. User taps "Archive" on Home Screen
2. Scrolls through chronological list
3. Taps a past reading
4. Full reading displayed

---

## Visual Style Details

### MacPaint Aesthetic Elements
- 1-bit black and white illustrations (no grayscale)
- Pixel-perfect line work with visible aliasing
- Dotted and dashed borders as decorative elements
- Simple geometric patterns (checkerboard, hatching)

### Wes Anderson Touches
- Perfect symmetry in layouts
- Centered text and elements
- Generous, intentional whitespace
- Quirky but restrained typography choices
- Warm, muted color palette

### Interaction Patterns
- Buttons have dotted/dashed borders
- Press states show subtle scale (0.97) and opacity change
- Transitions are deliberate and measured (300-400ms)
- Haptic feedback on significant actions

---

## Hexagram Display

Each hexagram consists of 6 lines stacked vertically:
- Solid line (Yang): ━━━━━━━━━
- Broken line (Yin): ━━━   ━━━

Lines are displayed from bottom to top (line 1 at bottom, line 6 at top), following traditional I Ching convention.

The hexagram Unicode characters (U+4DC0 to U+4DFF) provide authentic visual representation.
