import type { Control } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form'
import { Input } from '@/app/_components/ui/input'
import { addressInputClassName } from '@/app/_utils/address-input-class-name'

import type { CompanyInput } from '../_schema/company-schema'

type AutoFillAddressFieldProps = {
  control: Control<CompanyInput>
  name: 'street' | 'neighborhood' | 'city'
  label: string
  placeholder: string
  locked: boolean
}

const AutoFillAddressField = ({
  control,
  name,
  label,
  placeholder,
  locked,
}: AutoFillAddressFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              disabled={locked}
              placeholder={locked ? 'Preenchido automaticamente' : placeholder}
              className={addressInputClassName(locked)}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default AutoFillAddressField
