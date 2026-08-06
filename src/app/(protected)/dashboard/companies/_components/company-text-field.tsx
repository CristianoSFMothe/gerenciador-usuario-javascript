import type { Control, FieldPath } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form'
import { Input } from '@/app/_components/ui/input'

import type { CompanyInput } from '../_schema/company-schema'

type CompanyTextFieldName = Exclude<
  FieldPath<CompanyInput>,
  'sectors' | 'hasNoStreetNumber' | 'hasNoPostalCode'
>

type CompanyTextFieldProps = {
  control: Control<CompanyInput>
  name: CompanyTextFieldName
  label: string
  placeholder?: string
  type?: string
  mask?: (value: string) => string
}

const CompanyTextField = ({
  control,
  name,
  label,
  placeholder,
  type,
  mask,
}: CompanyTextFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654]'>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              onChange={(event) =>
                field.onChange(
                  mask ? mask(event.target.value) : event.target.value,
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CompanyTextField
