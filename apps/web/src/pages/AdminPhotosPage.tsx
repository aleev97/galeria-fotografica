import { ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router'
import { ErrorMessage, LoadingMessage } from '@/components/StatusMessage'
import { useAdminPhotos } from '@/features/admin/useAdminPhotos'
import { collections } from '@/features/gallery/collections'
import { PhotoImage } from '@/features/gallery/PhotoImage'

const orderButton =
  'rounded-lg border border-moon-100/30 p-2 hover:border-moon-100 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-400'

export default function AdminPhotosPage() {
  const { items, status, saveError, update, move } = useAdminPhotos()

  if (status === 'loading') return <LoadingMessage />
  if (status === 'error') return <ErrorMessage />

  const publishedCount = items.filter((photo) => photo.published).length

  return (
    <div>
      <h1 className="text-3xl md:text-4xl">Fotografías</h1>
      <p className="mt-2 text-moon-300">
        {publishedCount} publicadas de {items.length}
              <details className="mt-6 rounded-lg border border-moon-100/10 p-4 text-sm text-moon-300">
        <summary className="cursor-pointer text-moon-100">¿Cómo agrego fotos nuevas?</summary>
        <ol className="mt-4 list-decimal space-y-2 pl-5">
          <li>Poné las fotos originales en una carpeta de tu computadora, fuera del proyecto.</li>
          <li>
            En la terminal, dentro de <code>apps/web</code>, ejecutá{' '}
            <code>node scripts/process-photos.mjs "ruta\a\la\carpeta"</code>.
          </li>
          <li>
            Ejecutá el comando de importación que muestra el script (desde la raíz del proyecto).
          </li>
          <li>
            Volvé acá: las fotos aparecen al final como borrador. Completá título, texto
            alternativo y colección, y publicalas.
          </li>
          <li>
            Subí los archivos nuevos con <code>git add .</code>, <code>git commit</code> y{' '}
            <code>git push</code>.
          </li>
        </ol>
      </details>
      </p>

      {saveError && (
        <p role="alert" className="mt-6 rounded-lg border border-moon-100/30 p-4 text-moon-100">
          {saveError}
        </p>
      )}

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="text-moon-300">
            <tr className="border-b border-moon-100/10">
              <th scope="col" className="py-3 pr-4 font-normal">Foto</th>
              <th scope="col" className="py-3 pr-4 font-normal">Colección</th>
              <th scope="col" className="py-3 pr-4 font-normal">Publicada</th>
              <th scope="col" className="py-3 pr-4 font-normal">Destacada</th>
              <th scope="col" className="py-3 pr-4 font-normal">Orden</th>
              <th scope="col" className="py-3 font-normal">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((photo, index) => (
              <tr key={photo.id} className="border-b border-moon-100/10">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-4">
                    <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-space-800">
                      <PhotoImage
                        photo={photo}
                        sizes="64px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span>{photo.title}</span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  {collections.find((item) => item.id === photo.collection)?.name}
                </td>
                <td className="py-3 pr-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={photo.published}
                      onChange={(event) => update(photo.id, { published: event.target.checked })}
                      className="size-5 accent-aurora-400"
                    />
                    <span className="sr-only">Publicada: {photo.title}</span>
                  </label>
                </td>
                <td className="py-3 pr-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={photo.featured}
                      onChange={(event) => update(photo.id, { featured: event.target.checked })}
                      className="size-5 accent-aurora-400"
                    />
                    <span className="sr-only">Destacada: {photo.title}</span>
                  </label>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(photo.id, 'up')}
                      disabled={index === 0}
                      aria-label={`Subir ${photo.title}`}
                      className={orderButton}
                    >
                      <ChevronUp size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(photo.id, 'down')}
                      disabled={index === items.length - 1}
                      aria-label={`Bajar ${photo.title}`}
                      className={orderButton}
                    >
                      <ChevronDown size={18} aria-hidden="true" />
                    </button>
                  </div>
                </td>
                <td className="py-3 text-right">
                  <Link
                    to={`/admin/fotos/${photo.id}`}
                    className="text-aurora-400 hover:underline"
                  >
                    Editar
                    <span className="sr-only"> {photo.title}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}