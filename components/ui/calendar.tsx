"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 rounded-xl border bg-card/70 shadow-sm backdrop-blur-sm",
        "transition-colors duration-200",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-3",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold tracking-wide",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 rounded-md p-0 border-purple-500/40 text-purple-700 hover:bg-purple-600 hover:text-white dark:text-purple-300 dark:border-purple-400/50 dark:hover:bg-purple-500"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-xs uppercase tracking-wider text-muted-foreground/80 w-9 font-medium",
        row: "flex w-full mt-1",
        cell:
          "h-9 w-9 text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal rounded-md aria-selected:opacity-100 hover:bg-purple-100 dark:hover:bg-purple-900/30"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-purple-600 text-white hover:bg-purple-600 focus:bg-purple-600 focus-visible:ring-2 focus-visible:ring-purple-500/50 dark:bg-purple-500",
        day_today:
          "relative outline-none after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-purple-500",
        day_outside:
          "day-outside text-muted-foreground/60 aria-selected:bg-purple-600/20 aria-selected:text-white",
        day_disabled: "text-muted-foreground opacity-40",
        day_range_middle:
          "aria-selected:bg-purple-600/20 aria-selected:text-foreground dark:aria-selected:bg-purple-500/25",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
