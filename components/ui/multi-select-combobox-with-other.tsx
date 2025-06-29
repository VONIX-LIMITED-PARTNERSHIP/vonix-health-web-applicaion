"use client"

import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/hooks/use-translation"

interface MultiSelectComboboxWithOtherProps {
  options: { value: string; label: string }[]
  selected?: string[]
  onSelectedChange: (selected: string[]) => void
  placeholder?: string
  otherLabel?: string
  otherPlaceholder?: string
  maxSelected?: number
  disabled?: boolean
}

export function MultiSelectComboboxWithOther({
  options,
  selected = [],
  onSelectedChange,
  placeholder = "เลือก...",
  otherLabel = "อื่นๆ",
  otherPlaceholder = "ระบุ...",
  maxSelected,
  disabled,
}: MultiSelectComboboxWithOtherProps) {
  const [open, setOpen] = React.useState(false)
  const [otherText, setOtherText] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { t } = useTranslation(["common"])

  const safeSelected = selected // guarantees an array
  const isOtherSelected = safeSelected.includes(otherLabel)
  const selectedPredefined = safeSelected.filter(
    (item) => item !== otherLabel && options.some((opt) => opt.value === item),
  )
  const selectedOtherValue = isOtherSelected ? otherText : ""

  const handleSelect = (value: string) => {
    let newSelected: string[]

    if (value === otherLabel) {
      // Toggle 'อื่นๆ' option
      if (isOtherSelected) {
        newSelected = selected.filter((item) => item !== otherLabel)
        setOtherText("") // Clear other text when 'อื่นๆ' is deselected
      } else {
        if (maxSelected && safeSelected.length >= maxSelected) return // Prevent selecting if max reached
        newSelected = [...safeSelected, otherLabel]
      }
    } else {
      // Handle predefined options
      if (safeSelected.includes(value)) {
        newSelected = safeSelected.filter((item) => item !== value)
      } else {
        if (maxSelected && safeSelected.length >= maxSelected) return // Prevent selecting if max reached
        newSelected = [...safeSelected, value]
      }
    }
    onSelectedChange(newSelected)
  }

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value
    setOtherText(newText)
    // If 'อื่นๆ' is selected and text is cleared, deselect 'อื่นๆ'
    if (isOtherSelected && newText.trim() === "") {
      onSelectedChange(safeSelected.filter((item) => item !== otherLabel))
    }
  }

  const handleRemoveSelected = (itemToRemove: string) => {
    let newSelected: string[]
    const trimmedItemToRemove = itemToRemove.trim() // Ensure consistency

    if (trimmedItemToRemove === otherText.trim() && isOtherSelected) {
      // If the item to remove is the 'other' custom text
      newSelected = safeSelected.filter((item) => item !== otherLabel)
      setOtherText("")
    } else {
      // If the item to remove is a predefined option
      newSelected = safeSelected.filter((item) => item !== trimmedItemToRemove)
    }
    onSelectedChange(newSelected)
  }

  // Combine selected predefined and other text for display
  const displayBadges = [
    ...selectedPredefined.map((value) => options.find((opt) => opt.value === value)?.label || value),
    ...(isOtherSelected && otherText.trim() !== "" ? [otherText.trim()] : []),
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-[40px] px-3 py-2 bg-transparent"
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1">
            {displayBadges.length > 0 ? (
              displayBadges.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1 text-sm font-normal bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                  {item}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent closing popover
                      handleRemoveSelected(item)
                    }}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3 text-gray-500 dark:text-gray-300" />
                    <span className="sr-only">
                      {t("remove")} {item}
                    </span>
                  </Button>
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={t("search_options")} />
          <CommandList>
            <CommandEmpty>{t("no_results_found")}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label} // Use label for searchability
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  <Check
                    className={cn("ml-auto h-4 w-4", safeSelected.includes(option.value) ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                value={otherLabel}
                onSelect={() => handleSelect(otherLabel)}
                className="flex items-center justify-between"
              >
                <span>{otherLabel}</span>
                <Check className={cn("ml-auto h-4 w-4", isOtherSelected ? "opacity-100" : "opacity-0")} />
              </CommandItem>
              {isOtherSelected && (
                <CommandItem className="p-0">
                  <Input
                    ref={inputRef}
                    placeholder={otherPlaceholder}
                    value={otherText}
                    onChange={handleOtherTextChange}
                    className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    onKeyDown={(e) => e.stopPropagation()} // Prevent Command from handling key events
                    autoFocus
                  />
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
