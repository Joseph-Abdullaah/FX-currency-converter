"use client"

import * as React from "react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import HistoryPanel from "@/components/historyPanel"
import ComparePanel from "@/components/comparePanel"
import FavoritesPanel from "@/components/favoritesPanel"
import LogPanel from "@/components/logPanel"
import { useFavoritesStore } from "@/store/favorites-store"
import { useConversionLogStore } from "@/store/conversion-log-store"

const triggerClassName =
  "h-10 flex-none rounded-none border-0 bg-transparent px-4 text-preset-3 text-foreground dark:text-foreground data-active:bg-transparent data-active:text-foreground dark:data-active:bg-transparent dark:data-active:text-foreground group-data-horizontal/tabs:after:bottom-0 after:h-0.5 after:bg-primary"

const countBadgeClassName =
  "size-5 justify-center rounded-full bg-primary/15 p-0 text-preset-6 text-primary"

export default function DetailsTabs() {
  const favoritesCount = useFavoritesStore((state) => state.favorites.length)
  const logCount = useConversionLogStore((state) => state.logs.length)
  const [value, setValue] = React.useState("history")

  const tabs = [
    { value: "history", label: "HISTORY" },
    { value: "compare", label: "COMPARE" },
    { value: "favorites", label: "FAVORITES", badge: favoritesCount },
    { value: "log", label: "LOG", badge: logCount },
  ]

  return (
    <Tabs value={value} onValueChange={setValue} className="gap-5">
      {/* Mobile: the tab strip collapses into a dropdown. */}
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger
          aria-label="Select details panel"
          className="w-full text-preset-3 text-foreground data-[size=default]:h-10 md:hidden"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {tabs.map((tab) => (
            <SelectItem key={tab.value} value={tab.value} className="text-preset-3">
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.badge !== undefined && (
                  <Badge className={countBadgeClassName}>{tab.badge}</Badge>
                )}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Desktop: full tab strip, no scroll. */}
      <TabsList
        variant="line"
        className="hidden w-full justify-start gap-2 rounded-none border-b border-border bg-transparent p-0 md:flex"
      >
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className={triggerClassName}>
            {tab.label}
            {tab.badge !== undefined && (
              <Badge className={countBadgeClassName}>{tab.badge}</Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="history">
        <HistoryPanel />
      </TabsContent>
      <TabsContent value="compare">
        <ComparePanel />
      </TabsContent>
      <TabsContent value="favorites">
        <FavoritesPanel />
      </TabsContent>
      <TabsContent value="log">
        <LogPanel />
      </TabsContent>
    </Tabs>
  )
}
