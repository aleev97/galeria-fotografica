export type ButtonVariant = 'primary' | 'ghost'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-400 disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-moon-100 text-space-950 hover:bg-white',
  ghost:
    'border border-moon-100/30 text-moon-100 hover:border-moon-100 hover:bg-moon-100/10',
}

export function buttonStyles(variant: ButtonVariant = 'primary', className = '') {
  return `${base} ${variants[variant]} ${className}`.trim()
}