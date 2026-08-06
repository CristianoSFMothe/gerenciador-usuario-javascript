import type { Control } from 'react-hook-form'

import { Checkbox } from '@/app/_components/ui/checkbox'
import { FormControl, FormField } from '@/app/_components/ui/form'

import type { CompanyInput } from '../_schema/company-schema'

type FormCheckboxFieldProps = {
  control: Control<CompanyInput>
  name: 'hasNoPostalCode' | 'hasNoStreetNumber'
  label: string
  onCheckedChange?: (checked: boolean) => void
}

const FormCheckboxField = ({
  control,
  name,
  label,
  onCheckedChange,
}: FormCheckboxFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className='flex items-center gap-2'>
          <FormControl>
            <Checkbox
              id={name}
              checked={field.value === true}
              onCheckedChange={(checked) => {
                const isChecked = checked === true
                field.onChange(isChecked)
                onCheckedChange?.(isChecked)
              }}
            />
          </FormControl>
          <label
            htmlFor={name}
            className='cursor-pointer text-xs text-[#434654]'
          >
            {label}
          </label>
        </div>
      )}
    />
  )
}

export default FormCheckboxField
