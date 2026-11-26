import type { AdminPhoto, AdminPhotoResponse, Collection } from '@astrogaia/shared'
import { ArrowLeft } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Button } from '@/components/Button'
import { ErrorMessage, LoadingMessage } from '@/components/StatusMessage'
import { describeError } from '@/features/admin/errors'
import { collections } from '@/features/gallery/collections'
import { PhotoImage } from '@/features/gallery/PhotoImage'
import { useApi } from '@/hooks/useApi'
import { patchAdminPhoto } from '@/services/adminApi'
import { DeleteSection } from '@/features/admin/DeleteSection'

const fieldClass =
  'mt-2 w-full rounded-lg border border-moon-100/30 bg-space-900 px-4 py-3 text-moon-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-400'

function PhotoForm({ photo }: { photo: AdminPhoto }) {
  const [title, setTitle] = useState(photo.title)
  const [alt, setAlt] = useState(photo.alt)
  const [description, setDescription] = useState(photo.description ?? '')
  const [collection, setCollection] = useState<Collection>(photo.collection)
  const [featured, setFeatured] = useState(photo.featured)
  const [published, setPublished] = useState(photo.published)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      await patchAdminPhoto(photo.id, { title, alt, description, collection, featured, published })
      setMessage({ kind: 'ok', text: 'Cambios guardados.' })
    } catch (error) {
      setMessage({ kind: 'error', text: describeError(error) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-10 md:grid-cols-[18rem_1fr]">
      <div className="overflow-hidden rounded-xl bg-space-800 self-start">
        <PhotoImage photo={photo} sizes="288px" className="h-auto w-full" />
      </div>

    <div className="flex max-w-2xl flex-col gap-12">
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={120}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="alt">Texto alternativo (describe lo que se ve)</label>
          <textarea
            id="alt"
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            maxLength={300}
            rows={3}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="description">Descripción (opcional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={2000}
            rows={5}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="collection">Colección</label>
          <select
            id="collection"
            value={collection}
            onChange={(event) => setCollection(event.target.value as Collection)}
            className={fieldClass}
          >
            {collections.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-8">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
              className="size-5 accent-aurora-400"
            />
            Publicada
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              className="size-5 accent-aurora-400"
            />
            Destacada
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
          {message && (
            <p role={message.kind === 'error' ? 'alert' : 'status'} className="text-sm">
              {message.text}
            </p>
          )}
        </div>
      </form>
        <DeleteSection photoId={photo.id} />
    </div>
    </div>
  )
}

export default function AdminPhotoEditPage() {
  const { id = '' } = useParams()
  const state = useApi<AdminPhotoResponse>(
    id ? `/admin/photos/${encodeURIComponent(id)}` : null,
  )

  return (
    <div>
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-sm text-moon-300 hover:text-moon-100"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Volver a la lista
      </Link>

      <div className="mt-8">
        {state.status === 'loading' && <LoadingMessage />}
        {state.status === 'error' &&
          (state.notFound ? <ErrorMessage>Esa foto no existe.</ErrorMessage> : <ErrorMessage />)}
        {state.status === 'success' && <PhotoForm photo={state.data.photo} />}
      </div>
    </div>
  )
}