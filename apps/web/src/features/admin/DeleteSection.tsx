import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/Button'
import { buttonStyles } from '@/components/buttonStyles'
import { deleteAdminPhoto } from '@/services/adminApi'
import { describeError } from './errors'

type Phase = 'idle' | 'confirm' | 'working' | 'done'

export function DeleteSection({ photoId }: { photoId: string }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const command = `Remove-Item "apps/web/public/photos/${photoId}-*"`

  const confirmDelete = async () => {
    setPhase('working')
    setError(null)
    try {
      await deleteAdminPhoto(photoId)
      setPhase('done')
    } catch (deleteError) {
      setError(describeError(deleteError))
      setPhase('confirm')
    }
  }

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
    } catch {
      // Sin permiso para el portapapeles: el comando se puede copiar a mano
    }
  }

  if (phase === 'done') {
    return (
      <section className="border-t border-moon-100/10 pt-8" aria-labelledby="deleted-title">
        <h2 id="deleted-title" className="text-xl">
          Foto eliminada de la base de datos
        </h2>
        <p className="mt-3 text-moon-300">
          Falta un paso: borrar sus archivos del proyecto. Si no, las imágenes siguen siendo
          públicas aunque la foto ya no figure. Ejecutá esto en la terminal, parado en la raíz
          del proyecto:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-space-900 p-4 text-sm">
          <code>{command}</code>
        </pre>
        <p className="mt-3 text-moon-300">
          Después hacé <code>git add .</code>, <code>git commit</code> y <code>git push</code>.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="ghost" onClick={copyCommand}>
            {copied ? 'Comando copiado' : 'Copiar comando'}
          </Button>
          <Link to="/admin" className={buttonStyles('primary')}>
            Volver a la lista
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="border-t border-moon-100/10 pt-8" aria-labelledby="delete-title">
      <h2 id="delete-title" className="text-xl">
        Eliminar foto
      </h2>
      <p className="mt-3 text-moon-300">
        Borra el título, el texto alternativo y la descripción. No se puede deshacer. La foto tiene
        que estar despublicada.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-moon-100/30 p-4">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {phase === 'idle' && (
          <Button variant="ghost" onClick={() => setPhase('confirm')}>
            Eliminar foto
          </Button>
        )}
        {(phase === 'confirm' || phase === 'working') && (
          <>
            <Button onClick={confirmDelete} disabled={phase === 'working'}>
              {phase === 'working' ? 'Eliminando…' : 'Sí, eliminar definitivamente'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPhase('idle')}
              disabled={phase === 'working'}
            >
              Cancelar
            </Button>
          </>
        )}
      </div>
    </section>
  )
}