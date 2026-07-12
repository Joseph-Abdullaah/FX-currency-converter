"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { SHORTCUT_GROUPS } from "@/lib/shortcuts"

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] gap-5 overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-preset-3-bold text-foreground">
            Keyboard shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {SHORTCUT_GROUPS.map((group) => (
            <section key={group.heading} className="flex flex-col gap-1.5">
              <h3 className="text-preset-6 text-muted-foreground uppercase">
                {group.heading}
              </h3>
              <ul className="flex flex-col">
                {group.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-1.5"
                  >
                    <span className="text-preset-4 text-foreground">
                      {item.label}
                    </span>
                    <KbdGroup>
                      {item.keys.map((key, index) => (
                        <Kbd key={index}>{key}</Kbd>
                      ))}
                    </KbdGroup>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
