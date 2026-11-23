import { Check, Share2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from './Button'

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // El usuario canceló el diálogo de compartir o el navegador no dio permiso
    }
  }

  return (
    <>
      <Button variant="ghost" onClick={handleShare}>
        {copied ? (
          <Check size={18} aria-hidden="true" />
        ) : (
          <Share2 size={18} aria-hidden="true" />
        )}
        {copied ? 'Enlace copiado' : 'Compartir'}
      </Button>
      <span role="status" className="sr-only">
        {copied ? 'Enlace copiado al portapapeles' : ''}
      </span>
    </>
  )
}