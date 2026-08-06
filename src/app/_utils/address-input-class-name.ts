import { cn } from '@/app/_lib/utils'

/**
 * Class name for an address input that may be auto-filled and locked.
 *
 * Applies the light-blue "locked" background used across address forms
 * when a field is disabled because its value is expected to come from an
 * external source (e.g. a CEP lookup) rather than direct user input.
 *
 * @param locked - Whether the field is currently locked/disabled.
 * @returns Class names to merge onto the input's className.
 *
 * @example
 * <Input disabled={locked} className={addressInputClassName(locked)} />
 */
export const addressInputClassName = (locked: boolean) =>
  cn(locked && 'bg-[#deeaf1]', 'disabled:opacity-100')
