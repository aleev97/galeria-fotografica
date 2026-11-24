import type { PhotoDetailResponse } from '@astrogaia/shared'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { buttonStyles } from '@/components/buttonStyles'
import { Container } from '@/components/Container'
import { ShareButton } from '@/components/ShareButton'
import { ErrorMessage, LoadingMessage } from '@/components/StatusMessage'
import { FavoriteButton } from '@/features/favorites/FavoriteButton'
import { collections } from '@/features/gallery/collections'
import { PhotoImage } from '@/features/gallery/PhotoImage'
import { useApi } from '@/hooks/useApi'

export default function PhotoPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const state = useApi<PhotoDetailResponse>(id ? `/photos/${encodeURIComponent(id)}` : null)

  const previous = state.status === 'success' ? state.data.previous : null
  const next = state.status === 'success' ? state.data.next : null

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && previous) navigate(`/foto/${previous.id}`)
      if (event.key === 'ArrowRight' && next) navigate(`/foto/${next.id}`)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate, previous, next])

  if (state.status === 'loading') {
    return (
      <Container className="py-24">
        <LoadingMessage />
      </Container>
    )
  }

  if (state.status === 'error') {
    return (
      <Container className="py-24">
        {state.notFound ? (
          <>
            <h1 className="text-4xl">Fotografía no encontrada</h1>
            <p className="mt-4 text-moon-300">
              Puede que el enlace sea incorrecto o que ya no exista.
            </p>
          </>
        ) : (
          <ErrorMessage />
        )}
        <Link to="/explorador" className={`${buttonStyles('primary')} mt-8`}>
          Ir al explorador
        </Link>
      </Container>
    )
  }

  const { photo } = state.data
  const collectionName = collections.find((item) => item.id === photo.collection)?.name

  return (
    <Container className="py-12">
      <title>{`${photo.title} | Astrogaia`}</title>

      <Link
        to="/explorador"
        className="inline-flex items-center gap-2 text-sm text-moon-300 hover:text-moon-100"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Volver al explorador
      </Link>

      <figure className="mt-6 flex justify-center">
        <PhotoImage
          photo={photo}
          sizes="100vw"
          className="max-h-[75svh] w-auto max-w-full rounded-xl object-contain"
        />
      </figure>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl">{photo.title}</h1>
          {photo.description && <p className="mt-4 text-moon-300">{photo.description}</p>}
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-moon-300">Colección</dt>
            <dd>{collectionName}</dd>
            <dt className="text-moon-300">Dimensiones</dt>
            <dd>
              {photo.width} × {photo.height} px
            </dd>
          </dl>
        </div>
        <div className="flex items-center gap-3">
          <FavoriteButton photoId={photo.id} title={photo.title} />
          <ShareButton title={photo.title} />
        </div>
      </div>

      <nav aria-label="Navegación entre fotografías" className="mt-12 flex justify-between gap-4">
        {previous ? (
          <Link to={`/foto/${previous.id}`} className={buttonStyles('ghost')}>
            <ChevronLeft size={18} aria-hidden="true" />
            Anterior
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/foto/${next.id}`} className={buttonStyles('ghost')}>
            Siguiente
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </Container>
  )
}