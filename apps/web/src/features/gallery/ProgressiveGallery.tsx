import { useState } from 'react'
import { Button } from '@/components/Button'
import type { Photo } from '@/types/photo'
import { PhotoGrid } from './PhotoGrid'

const PAGE_SIZE = 6

export function ProgressiveGallery({ photos }: { photos: Photo[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE)

  if (photos.length === 0) {
    return (
      <p role="status" className="py-16 text-center text-moon-300">
        No encontré fotografías con esos filtros.
      </p>
    )
  }

  const shown = Math.min(visible, photos.length)

  return (
    <>
      <PhotoGrid photos={photos.slice(0, shown)} />
      <div className="mt-10 flex flex-col items-center gap-4">
        {shown < photos.length && (
          <Button variant="ghost" onClick={() => setVisible((current) => current + PAGE_SIZE)}>
            Cargar más
          </Button>
        )}
        <p aria-live="polite" className="text-sm text-moon-300">
          Mostrando {shown} de {photos.length}
        </p>
      </div>
    </>
  )
}