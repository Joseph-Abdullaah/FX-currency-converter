/**
 * Single source of truth for the app's keyboard shortcuts.
 *
 * `keys` holds the display tokens shown in the shortcuts dialog. The matching
 * logic lives in `components/keyboardShortcuts.tsx` — this file is metadata
 * only, so the dialog and the handler never drift apart.
 */
export interface ShortcutItem {
  id: string
  label: string
  keys: string[]
}

export interface ShortcutGroup {
  heading: string
  items: ShortcutItem[]
}

export const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    heading: "General",
    items: [
      { id: "help", label: "Open keyboard shortcuts", keys: ["Ctrl", "K"] },
      { id: "theme", label: "Toggle light / dark theme", keys: ["Shift", "T"] },
    ],
  },
  {
    heading: "Converter",
    items: [
      { id: "search", label: "Toggle currency dropdown", keys: ["/"] },
      { id: "amount", label: "Focus send amount", keys: ["←"] },
      { id: "receive", label: "Focus receive currency", keys: ["→"] },
      { id: "swap", label: "Swap currencies", keys: ["Shift", "S"] },
    ],
  },
  {
    heading: "Chart range",
    items: [
      { id: "range-1d", label: "1D · 1 day", keys: ["1"] },
      { id: "range-1w", label: "1W · 1 week", keys: ["2"] },
      { id: "range-1m", label: "1M · 1 month", keys: ["3"] },
      { id: "range-3m", label: "3M · 3 months", keys: ["4"] },
      { id: "range-1y", label: "1Y · 1 year", keys: ["5"] },
      { id: "range-5y", label: "5Y · 5 years", keys: ["6"] },
    ],
  },
]
