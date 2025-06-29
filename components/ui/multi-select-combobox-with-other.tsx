"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/hooks/use-translation"

interface MultiSelectComboboxWithOtherProps {
  options: string[]
  value?: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  otherInputPlaceholder?: string
  className?: string
}

export function MultiSelectComboboxWithOther({
  options = [],
  value = [],
  onChange,
  placeholder = "เลือกหรือพิมพ์เพื่อค้นหา",
  otherInputPlaceholder = "ระบุข้อมูลอื่นๆ ที่นี่",
  className,
}: MultiSelectComboboxWithOtherProps) {
  const [open, setOpen] = React.useState(false)
  const [otherText, setOtherText] = React.useState("")
  const [showOtherInput, setShowOtherInput] = React.useState(false)
  const { t } = useTranslation(["common"])

  // Ensure value is always an array
  const safeSelected = value || []

  const otherLabel = "อื่นๆ"
  const isOtherSelected = safeSelected.includes(otherLabel)
  const selectedPredefined = safeSelected.filter((item) => item !== otherLabel && options.some((opt) => opt === item))
  const selectedOtherValue = isOtherSelected ? otherText : ""

  const handleSelect = (currentValue: string) => {
    if (currentValue === otherLabel) {
      if (isOtherSelected) {
        // Remove "อื่นๆ" and any custom text
        const newSelected = safeSelected.filter((item) => item !== otherLabel)
        onChange(newSelected)
        setShowOtherInput(false)
        setOtherText("")
      } else {
        // Add "อื่นๆ" and show input
        const newSelected = [...safeSelected, otherLabel]
        onChange(newSelected)
        setShowOtherInput(true)
      }
    } else {
      const newSelected = safeSelected.includes(currentValue)
        ? safeSelected.filter((item) => item !== currentValue)
        : [...safeSelected, currentValue]
      onChange(newSelected)
    }
  }

  const handleRemove = (valueToRemove: string) => {
    if (valueToRemove === otherLabel) {
      setShowOtherInput(false)
      setOtherText("")
    }
    const newSelected = safeSelected.filter((item) => item !== valueToRemove)
    onChange(newSelected)
  }

  const handleOtherTextChange = (text: string) => {
    setOtherText(text)
    // Update the selected values to include the custom text
    const newSelected = safeSelected.filter((item) => item !== otherLabel)
    if (text.trim()) {
      newSelected.push(text.trim())
    }
    onChange(newSelected)
  }

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-[2.5rem] h-auto bg-transparent"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {safeSelected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <>
                  {selectedPredefined.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(item)
                      }}
                    >
                      {item}
                      <X className="ml-1 h-3 w-3 cursor-pointer" />
                    </Badge>
                  ))}
                  {selectedOtherValue && (
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(otherLabel)
                      }}
                    >
                      {selectedOtherValue}
                      <X className="ml-1 h-3 w-3 cursor-pointer" />
                    </Badge>
                  )}
                </>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="ค้นหา..." />
            <CommandList>
              <CommandEmpty>ไม่พบข้อมูล</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option} value={option} onSelect={() => handleSelect(option)}>
                    <Check
                      className={cn("mr-2 h-4 w-4", safeSelected.includes(option) ? "opacity-100" : "opacity-0")}
                    />
                    {option}
                  </CommandItem>
                ))}
                <CommandItem value={otherLabel} onSelect={() => handleSelect(otherLabel)}>
                  <Check className={cn("mr-2 h-4 w-4", isOtherSelected ? "opacity-100" : "opacity-0")} />
                  {otherLabel}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {showOtherInput && (
        <div className="mt-2">
          <Input
            placeholder={otherInputPlaceholder}
            value={otherText}
            onChange={(e) => handleOtherTextChange(e.target.value)}
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}
