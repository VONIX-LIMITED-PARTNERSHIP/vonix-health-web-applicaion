"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MultiSelectComboboxWithOtherProps {
  options: string[] // Predefined options
  value: string[] // Current selected values (can include custom "other" text)
  onChange: (selected: string[]) => void
  placeholder?: string
  otherOptionLabel?: string
  otherInputPlaceholder?: string
}

export function MultiSelectComboboxWithOther({
  options,
  value,
  onChange,
  placeholder = "เลือก...",
  otherOptionLabel = "อื่นๆ (โปรดระบุ)",
  otherInputPlaceholder = "ระบุข้อมูลอื่นๆ...",
}: MultiSelectComboboxWithOtherProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedPredefined, setSelectedPredefined] = React.useState<Set<string>>(new Set())
  const [otherText, setOtherText] = React.useState("")
  const [isOtherSelected, setIsOtherSelected] = React.useState(false)

  // Sync internal state with external value prop
  React.useEffect(() => {
    const newSelectedPredefined = new Set<string>()
    let newOtherText = ""
    let newIsOtherSelected = false

    value.forEach((item) => {
      if (options.includes(item)) {
        newSelectedPredefined.add(item)
      } else if (item === otherOptionLabel) {
        newIsOtherSelected = true
      } else {
        // This is a custom "other" value
        newOtherText = item
        newIsOtherSelected = true // If there's custom text, "อื่นๆ" must be considered selected
      }
    })

    setSelectedPredefined(newSelectedPredefined)
    setOtherText(newOtherText)
    setIsOtherSelected(newIsOtherSelected)
  }, [value, options, otherOptionLabel])

  // Function to emit changes
  const emitChange = (currentPredefined: Set<string>, currentOtherText: string, currentIsOtherSelected: boolean) => {
    const result: string[] = Array.from(currentPredefined)
    if (currentIsOtherSelected) {
      if (currentOtherText.trim() !== "") {
        result.push(currentOtherText.trim())
      } else {
        result.push(otherOptionLabel) // If "อื่นๆ" is selected but no custom text, add the label
      }
    }
    onChange(result)
  }

  const handleSelect = (option: string) => {
    const newSelectedPredefined = new Set(selectedPredefined)
    let newIsOtherSelected = isOtherSelected
    let newOtherText = otherText

    if (option === otherOptionLabel) {
      newIsOtherSelected = !isOtherSelected
      if (!newIsOtherSelected) {
        // If unselecting "อื่นๆ"
        newOtherText = "" // Clear custom text
      }
    } else {
      if (newSelectedPredefined.has(option)) {
        newSelectedPredefined.delete(option)
      } else {
        newSelectedPredefined.add(option)
      }
    }

    setSelectedPredefined(newSelectedPredefined)
    setIsOtherSelected(newIsOtherSelected)
    setOtherText(newOtherText) // Update otherText state
    emitChange(newSelectedPredefined, newOtherText, newIsOtherSelected)
  }

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setOtherText(text)
    // Ensure "อื่นๆ" is selected if text is entered
    const newIsOtherSelected = text.trim() !== "" ? true : isOtherSelected
    setIsOtherSelected(newIsOtherSelected)
    emitChange(selectedPredefined, text, newIsOtherSelected)
  }

  const handleRemoveSelected = (itemToRemove: string) => {
    const newSelectedPredefined = new Set(selectedPredefined)
    let newOtherText = otherText
    let newIsOtherSelected = isOtherSelected

    if (options.includes(itemToRemove)) {
      newSelectedPredefined.delete(itemToRemove)
    } else if (itemToRemove === otherOptionLabel || itemToRemove === otherText) {
      // If removing the "อื่นๆ" label or the custom text
      newIsOtherSelected = false
      newOtherText = ""
      newSelectedPredefined.delete(otherOptionLabel) // Ensure the label is also removed if present
    }

    setSelectedPredefined(newSelectedPredefined)
    setOtherText(newOtherText)
    setIsOtherSelected(newIsOtherSelected)
    emitChange(newSelectedPredefined, newOtherText, newIsOtherSelected)
  }

  const displayBadges = Array.from(selectedPredefined)
  if (isOtherSelected) {
    if (otherText.trim() !== "") {
      displayBadges.push(otherText.trim())
    } else {
      displayBadges.push(otherOptionLabel)
    }
  }

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[40px] flex-wrap"
          >
            {displayBadges.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {displayBadges.map((item) => (
                  <Badge key={item} variant="secondary" className="flex items-center gap-1">
                    {item}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveSelected(item)
                      }}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="ค้นหา..." />
            <CommandEmpty>ไม่พบข้อมูล</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option} value={option} onSelect={() => handleSelect(option)}>
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedPredefined.has(option) ? "opacity-100" : "opacity-0")}
                    />
                    {option}
                  </CommandItem>
                ))}
                <CommandItem
                  key={otherOptionLabel}
                  value={otherOptionLabel}
                  onSelect={() => handleSelect(otherOptionLabel)}
                >
                  <Check className={cn("mr-2 h-4 w-4", isOtherSelected ? "opacity-100" : "opacity-0")} />
                  {otherOptionLabel}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {isOtherSelected && (
        <div className="mt-2">
          <Label htmlFor="other-input" className="sr-only">
            {otherInputPlaceholder}
          </Label>
          <Input
            id="other-input"
            placeholder={otherInputPlaceholder}
            value={otherText}
            onChange={handleOtherInputChange}
            className="dark:text-gray-900 dark:placeholder:text-gray-500"
          />
        </div>
      )}
    </div>
  )
}
