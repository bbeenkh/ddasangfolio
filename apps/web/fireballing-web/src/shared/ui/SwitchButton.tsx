import React from 'react'
import { SwitchButton as BaseSwitchButton } from '@fblg/core-ui'
import { twMerge } from 'tailwind-merge'

interface StyleClass {
  root?: string
  thumb?: string
}

interface Props extends React.ComponentPropsWithoutRef<
  typeof BaseSwitchButton
> {
  styleClass?: StyleClass
}

/**
 * # SwitchButton
 * ---
 * - 간단설명: Luminous Fintech 스타일이 적용된 스위치 버튼 래퍼
 * - 체크 시 #06b6d4 배경, 포커스 링 색상 매칭
 * ---
 * @example
 * <SwitchButton checked={isOn} onCheckedChange={setIsOn} />
 */
const SwitchButton = React.forwardRef<HTMLButtonElement, Props>(
  function SwitchButton({ styleClass, ...props }, ref) {
    return (
      <BaseSwitchButton
        ref={ref}
        styleClass={{
          root: twMerge(
            'bg-lf-outline-check data-[state=checked]:bg-lf-primary-container',
            'focus-visible:ring-lf-primary-container',
            styleClass?.root,
          ),
          thumb: styleClass?.thumb,
        }}
        {...props}
      />
    )
  },
)

export default SwitchButton
