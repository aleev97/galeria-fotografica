import type { Photo } from '@/types/photo'

type Props = {
  photo: Photo
  sizes: string
  className?: string
}

const WIDTHS = [640, 1280]

const srcSet = (id: string, format: 'avif' | 'webp') =>
  WIDTHS.map((w) => `/photos/${id}-${w}.${format} ${w}w`).join(', ')

export function PhotoImage({ photo, sizes, className }: Props) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(photo.id, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(photo.id, 'webp')} sizes={sizes} />
      <img
        src={`/photos/${photo.id}-1280.webp`}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  )
}