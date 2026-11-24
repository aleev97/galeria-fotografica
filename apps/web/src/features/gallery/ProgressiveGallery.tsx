import type { Collection } from '@astrogaia/shared'
import { Button } from '@/components/Button'
import { ErrorMessage, LoadingMessage } from '@/components/StatusMessage'
import { PhotoGrid } from './PhotoGrid'
import { useGallery } from './useGallery'

type Props = {
  collection: Collection | undefined
  query: string
}

export function ProgressiveGallery({ collection, query }: Props) {
  const { items, total, status, hasMore, loadMore } = useGallery(collection, query)

  if (items.length === 0) {
    if (status === 'error') return <ErrorMessage />
    if (status === 'loading') return <LoadingMessage />
    return (
      <p role="status" className="py-16 text-center text-moon-300">
        No encontré fotografías con esos filtros.
      </p>
    )
  }

  return (
    <>
      <PhotoGrid photos={items} />
      <div className="mt-10 flex flex-col items-center gap-4">
        {hasMore && (
          <Button variant="ghost" onClick={loadMore} disabled={status === 'loading'}>
            {status === 'loading' ? 'Cargando…' : 'Cargar más'}
          </Button>
        )}
        {status === 'error' && (
          <p role="alert" className="text-sm text-moon-300">
            No pudimos cargar más fotografías. Probá de nuevo.
          </p>
        )}
        <p aria-live="polite" className="text-sm text-moon-300">
          Mostrando {items.length} de {total}
        </p>
      </div>
    </>
  )
}