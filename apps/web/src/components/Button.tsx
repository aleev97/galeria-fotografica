import type { ComponentPropsWithoutRef } from 'react'

import { buttonStyles, type ButtonVariant } from './buttonStyles'

type Props = ComponentPropsWithoutRef<'button'> & { variant?: ButtonVariant }

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: Props) {
  return <button type={type} className={buttonStyles(variant, className)} {...props} />
}