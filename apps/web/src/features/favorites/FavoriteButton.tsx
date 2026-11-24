import { Heart } from 'lucide-react'
import { useFavorites } from './useFavorites'

type Props = {
  photoId: string
  title: string
  className?: string
}

export function FavoriteButton({ photoId, title, className = '' }: Props) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(photoId)

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`Favorito: ${title}`}
      onClick={() => toggle(photoId)}
      className={`flex size-10 items-center justify-center rounded-full bg-space-950/60 text-moon-100 backdrop-blur transition-colors hover:bg-space-950/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-400 ${className}`}
    >
      <Heart
        size={20}
        className={active ? 'fill-nebula-400 text-nebula-400' : ''}
        aria-hidden="true"
      />
    </button>
  )
}