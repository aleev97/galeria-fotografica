import type { PhotoListResponse } from '@astrogaia/shared'
import { Link } from 'react-router'
import { buttonStyles } from '@/components/buttonStyles'
import { Container } from '@/components/Container'
import { ErrorMessage, LoadingMessage } from '@/components/StatusMessage'
import { useFavorites } from '@/features/favorites/useFavorites'
import { PhotoGrid } from '@/features/gallery/PhotoGrid'
import { useApi } from '@/hooks/useApi'

const ID_PATTERN = /^[a-z0-9-]{1,100}$/
const MAX_IDS = 50

function EmptyState() {
  return (
    <div className="flex flex-col items-start gap-6">
      <p className="text-moon-300">Todavía no guardaste ninguna fotografía.</p>
      <Link to="/explorador" className={buttonStyles('primary')}>
        Explorar fotos
      </Link>
    </div>
  )
}

export default function FavoritesPage() {
  const { ids } = useFavorites()

  // Lo guardado en el navegador no es de confianza: se filtra antes de pedirlo a la API
  const validIds = ids.filter((id) => ID_PATTERN.test(id)).slice(0, MAX_IDS)
  const state = useApi<PhotoListResponse>(
    validIds.length > 0 ? `/photos?ids=${validIds.join(',')}&limit=${MAX_IDS}` : null,
  )

  return (
    <Container className="py-24">
      <h1 className="text-4xl md:text-5xl">Favoritos</h1>
      <p className="mt-4 max-w-2xl text-moon-300">
        Tus favoritas se guardan solo en este navegador. No hace falta crear una cuenta.
      </p>

      <div className="mt-12">
        {validIds.length === 0 ? (
          <EmptyState />
        ) : state.status === 'loading' ? (
          <LoadingMessage />
        ) : state.status === 'error' ? (
          <ErrorMessage />
        ) : state.data.items.length === 0 ? (
          <EmptyState />
        ) : (
          <PhotoGrid photos={state.data.items} />
        )}
      </div>
    </Container>
  )
}