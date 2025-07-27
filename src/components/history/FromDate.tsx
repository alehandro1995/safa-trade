"use client"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
 
export default function FromDate({value, onChange} : {value?: Date, onChange?: (date: Date) => void}) {
 
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className="data-[empty=true]:text-muted-foreground w-48 justify-start text-left font-normal"
        >
          <CalendarIcon />
          {value ? format(value, "PPP") : <span>С даты</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} required/>
      </PopoverContent>
    </Popover>
  )
}