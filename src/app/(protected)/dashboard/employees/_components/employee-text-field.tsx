import type { Control, FieldPath } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form'
import { Input } from '@/app/_components/ui/input'

import type { EmployeeInput } from '../_schema/employee-schema'

type EmployeeTextFieldName = Exclude<
  FieldPath<EmployeeInput>,
  'hasNoStreetNumber'
>

type EmployeeTextFieldProps = {
  control: Control<EmployeeInput>
  name: EmployeeTextFieldName
  label: string
  placeholder?: string
  type?: string
}

const EmployeeTextField = ({
  control,
  name,
  label,
  placeholder,
  type,
}: EmployeeTextFieldProps) => {
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
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default EmployeeTextField
