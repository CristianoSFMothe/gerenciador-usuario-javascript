'use client'

import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import { Button } from '@/app/_components/ui/button'
import { Calendar } from '@/app/_components/ui/calendar'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/_components/ui/popover'
import { cn } from '@/app/_lib/utils'

type DatePickerFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  className?: string
  triggerClassName?: string
}

const DatePickerField = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  className,
  triggerClassName,
}: DatePickerFieldProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = typeof field.value === 'string' ? field.value : ''
        const selectedDate = value
          ? parse(value, 'yyyy-MM-dd', new Date())
          : undefined

        return (
          <FormItem className={cn('flex flex-col', className)}>
            <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
              {label}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    type='button'
                    variant='outline'
                    className={cn(
                      'w-full justify-start gap-2 font-normal',
                      !value && 'text-[#434654]/50',
                      triggerClassName,
                    )}
                  >
                    <CalendarIcon className='size-3.5' />
                    {selectedDate
                      ? format(selectedDate, 'dd/MM/yyyy')
                      : 'Selecione'}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  captionLayout='dropdown'
                  locale={ptBR}
                  selected={selectedDate}
                  defaultMonth={selectedDate}
                  disabled={{ after: new Date() }}
                  onSelect={(date) =>
                    field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                  }
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export default DatePickerField
