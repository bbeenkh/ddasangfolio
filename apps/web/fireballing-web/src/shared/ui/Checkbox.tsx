'use client'

import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface CheckboxProps {
  id: string
  label?: string
  className?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  onCheckedChange?: (checked: boolean) => void
}

/**
 * # Checkbox
 * ---
 * - 간단설명: Luminous Fintech 스타일 체크박스
 * - 체크 시 #06b6d4 배경, 미체크 보더 #bcc9cd, 비활성 #bcc9cd 배경
 * ---
 * @example
 * <Checkbox id="agree" label="동의합니다" checked={checked} onCheckedChange={setChecked} />
 */
const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox(
    {
      id,
      label,
      className,
      checked: controlledChecked,
      defaultChecked = false,
      disabled,
      onCheckedChange,
    },
    ref,
  ) {
    const isControlled = controlledChecked !== undefined
    const [internalChecked, setInternalChecked] = useState(defaultChecked)
    const isChecked = isControlled ? controlledChecked : internalChecked

    const handleToggle = () => {
      if (disabled) return
      const next = !isChecked
      if (!isControlled) setInternalChecked(next)
      onCheckedChange?.(next)
    }

    return (
      <div
        className={twMerge(
          'inline-flex items-center gap-2',
          disabled ? 'cursor-default' : 'cursor-pointer',
          className,
        )}
      >
        <button
          ref={ref}
          id={id}
          type="button"
          role="checkbox"
          aria-checked={isChecked}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={handleToggle}
          className="relative w-5 h-5 shrink-0 focus-visible:outline-none"
        >
          {disabled ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.75"
                width="24"
                height="24"
                rx="4"
                fill="var(--color-lf-outline-check)"
              />
            </svg>
          ) : isChecked ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.75"
                width="24"
                height="24"
                rx="4"
                fill="var(--color-lf-primary-container)"
              />
              <path
                d="M10.6134 14.5836L7.83339 11.8036L6.88672 12.7436L10.6134 16.4703L18.6134 8.47027L17.6734 7.53027L10.6134 14.5836Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1.25"
                y="0.5"
                width="23"
                height="23"
                rx="3.5"
                stroke="var(--color-lf-outline-check)"
              />
            </svg>
          )}
        </button>
        {label && (
          <label
            htmlFor={id}
            className={twMerge(
              'text-sm',
              disabled
                ? 'cursor-default text-lf-on-surface-muted'
                : 'cursor-pointer text-lf-on-surface',
            )}
          >
            {label}
          </label>
        )}
      </div>
    )
  },
)

export default Checkbox
