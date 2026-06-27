import React from 'react'
import { Checkbox as BaseCheckbox } from '@fblg/core-ui'

interface ICheckboxProps {
  id: string
  label?: string
  className?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  onCheckedChange?: (checked: boolean) => void
  checkedIcon?: React.ReactNode
  uncheckedIcon?: React.ReactNode
  disabledIcon?: React.ReactNode
}

const UncheckedIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.25" y="0.5" width="23" height="23" rx="3.5" stroke="#bcc9cd" />
  </svg>
)

const CheckedIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.75" width="24" height="24" rx="4" fill="#06b6d4" />
    <path
      d="M10.6134 14.5836L7.83339 11.8036L6.88672 12.7436L10.6134 16.4703L18.6134 8.47027L17.6734 7.53027L10.6134 14.5836Z"
      fill="white"
    />
  </svg>
)

const DisabledIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.75" width="24" height="24" rx="4" fill="#bcc9cd" />
  </svg>
)

/**
 * # Checkbox
 * ---
 * - 간단설명: Luminous Fintech 스타일이 적용된 체크박스 래퍼
 * - 체크 시 #06b6d4 배경, 미체크/비활성 보더 #bcc9cd
 * ---
 * @example
 * <Checkbox id="agree" label="동의합니다" checked={checked} onCheckedChange={setChecked} />
 */
const Checkbox = React.forwardRef<HTMLButtonElement, ICheckboxProps>(function Checkbox(props, ref) {
  return (
    <BaseCheckbox
      ref={ref}
      uncheckedIcon={<UncheckedIcon />}
      checkedIcon={<CheckedIcon />}
      disabledIcon={<DisabledIcon />}
      {...props}
    />
  )
})

export default Checkbox
