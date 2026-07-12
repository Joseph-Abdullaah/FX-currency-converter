"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import KeyboardShortcutsDialog from "@/components/keyboardShortcutsDialog"
import { useConverterStore } from "@/store/convert-store"
import {
  useHistoryChartStore,
  type ChartRange,
} from "@/store/history-chart-store"

/** Number keys 1–6 map to the chart ranges, in order. */
const RANGE_BY_DIGIT: Record<string, ChartRange> = {
  "1": "1D",
  "2": "1W",
  "3": "1M",
  "4": "3M",
  "5": "1Y",
  "6": "5Y",
}

const TRIGGER_ID = {
  send: "send-currency-trigger",
  receive: "receive-currency-trigger",
} as const

type PickerSide = keyof typeof TRIGGER_ID

/** True when focus is in a field where keystrokes are text, not shortcuts. */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  )
}

/**
 * True when focus sits inside a widget that consumes arrow keys for its own
 * navigation (tabs, toggle groups, listboxes…). We must not hijack the arrows
 * there, or we'd break native keyboard navigation.
 */
function inArrowNavWidget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(
    target.closest(
      '[role="tablist"],[role="tab"],[role="radiogroup"],[role="toolbar"],[role="menu"],[role="menubar"],[role="listbox"],[role="grid"],[role="tree"],[data-slot="toggle-group"]'
    )
  )
}

function focusById(id: string, selectText = false) {
  const el = document.getElementById(id)
  if (!el) return
  el.focus()
  if (selectText && el instanceof HTMLInputElement) el.select()
}

function pickerTrigger(side: PickerSide) {
  return document.getElementById(TRIGGER_ID[side])
}

function isPickerOpen(side: PickerSide) {
  return pickerTrigger(side)?.getAttribute("aria-expanded") === "true"
}

/** Focus the search input inside the popover controlled by `trigger`. */
function focusPickerSearch(trigger: HTMLElement) {
  // Double rAF waits for the popover content to mount into its portal.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const contentId = trigger.getAttribute("aria-controls")
      const scope =
        (contentId && document.getElementById(contentId)) || document
      scope
        .querySelector<HTMLInputElement>('[data-slot="command-input"]')
        ?.focus()
    })
  )
}

/**
 * Opens a currency picker and focuses its search input. Radix closes the other
 * popover automatically because clicking this trigger is an outside interaction.
 */
function openPicker(side: PickerSide) {
  const trigger = pickerTrigger(side)
  if (!trigger) return
  if (trigger.getAttribute("aria-expanded") !== "true") trigger.click()
  focusPickerSearch(trigger)
}

/** Collapses whichever currency picker is currently open. */
function closeOpenPicker() {
  for (const side of ["send", "receive"] as const) {
    const trigger = pickerTrigger(side)
    if (trigger?.getAttribute("aria-expanded") === "true") trigger.click()
  }
}

export default function KeyboardShortcuts() {
  const [open, setOpen] = React.useState(false)

  const { resolvedTheme, setTheme } = useTheme()

  // Keep the latest open/theme values reachable from the listener, which is
  // registered once. Refs are synced after each commit (not during render).
  const openRef = React.useRef(open)
  const themeRef = React.useRef({ resolvedTheme, setTheme })
  React.useEffect(() => {
    openRef.current = open
    themeRef.current = { resolvedTheme, setTheme }
  })

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat) return

      // Ctrl / Cmd + K toggles the shortcuts dialog from anywhere.
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((prev) => !prev)
        return
      }

      // While the dialog is open, let Radix own the keyboard (Esc closes it).
      if (openRef.current) return

      // Currency-picker mode: while a dropdown is open, "/" collapses it and
      // ←/→ switch between the send and receive dropdowns. Every other key
      // (typing to search, ↑/↓ list nav, Esc) passes through to the input.
      const sendOpen = isPickerOpen("send")
      const receiveOpen = isPickerOpen("receive")
      if (sendOpen || receiveOpen) {
        if (event.key === "/") {
          event.preventDefault()
          closeOpenPicker()
        } else if (event.key === "ArrowRight" && sendOpen) {
          event.preventDefault()
          openPicker("receive")
        } else if (event.key === "ArrowLeft" && receiveOpen) {
          event.preventDefault()
          openPicker("send")
        }
        return
      }

      // Never hijack keys while the user is typing.
      if (isTypingTarget(event.target)) return

      // Shift-modified shortcuts.
      if (event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const key = event.key.toLowerCase()
        if (key === "s") {
          event.preventDefault()
          useConverterStore.getState().swapCurrencies()
        } else if (key === "t") {
          event.preventDefault()
          const { resolvedTheme, setTheme } = themeRef.current
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }
        return
      }

      // The rest are single-key shortcuts — bail on any modifier.
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
        return
      }

      // "/" opens the send picker (a second press collapses it via picker mode).
      if (event.key === "/") {
        event.preventDefault()
        openPicker("send")
        return
      }

      if (event.key === "ArrowLeft") {
        if (inArrowNavWidget(event.target)) return
        event.preventDefault()
        focusById("send-amount", true)
        return
      }

      if (event.key === "ArrowRight") {
        if (inArrowNavWidget(event.target)) return
        event.preventDefault()
        focusById(TRIGGER_ID.receive)
        return
      }

      const range = RANGE_BY_DIGIT[event.key]
      if (range) {
        event.preventDefault()
        useHistoryChartStore.getState().setRange(range)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Open keyboard shortcuts"
        className="fixed bottom-4 left-1/2 z-40 h-auto -translate-x-1/2 gap-2 rounded-full border border-border px-3 py-2 shadow-md"
      >
        <span className="text-preset-5-medium text-muted-foreground">
          Shortcuts
        </span>
        <KbdGroup>
          <Kbd>Ctrl/Cmd</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>

      <KeyboardShortcutsDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
