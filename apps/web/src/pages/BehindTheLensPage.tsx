import type { ReactNode } from 'react'
import { Container } from '@/components/Container'
import { siteConfig } from '@/config/site'
import { PhotoImage } from '@/features/gallery/PhotoImage'
import { useApi } from '@/hooks/useApi'
import type { PhotoDetailResponse } from '@astrogaia/shared'

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-lg leading-relaxed text-moon-300">{children}</div>
    </section>
  )
}

export default function BehindTheLensPage() {
 const story = useApi<PhotoDetailResponse>(
  siteConfig.storyPhotoId ? `/photos/${encodeURIComponent(siteConfig.storyPhotoId)}` : null,
)
const storyPhoto = story.status === 'success' ? story.data.photo : null

  return (
    <Container className="py-24">
      <title>Detras del objetivo | AstroGaia</title>

      <article className="max-w-3xl space-y-14">
        <header>
          <h1 className="text-4xl md:text-5xl">Behind the Lens</h1>
          <p className="mt-6 text-lg text-moon-300">
            Lo que hay detrás de cada foto: desde que miro el pronóstico hasta que la edito.
          </p>
        </header>

        <Block title="El equipo">
          <p>
            Fotografío con un Redmi Note 14 Pro. No uso una cámara profesional: lo que ves en
            esta galería salió de un celular.
          </p>
        </Block>

        <Block title="Antes de salir">
          <p>
            Todo empieza mirando el pronóstico. Con eso elijo la mejor hora, que cambia según el
            lugar donde esté. También dejo preparada la configuración del teléfono y pienso
            desde dónde y cómo voy a sacar la foto.
          </p>
        </Block>

        <Block title="La edición">
          <p>
            Edito desde el mismo celular, con su editor integrado o con Snapseed.
          </p>
        </Block>

        <Block title="Una noche especial">
          <p>
            Una noche, mientras fotografiaba el cielo, apareció una luz amarilla muy clara que lo
            cruzaba. Quedó registrada en una de las fotos y también en el timelapse.
          </p>
          <p>
            Por su color y por cómo se movía, creo que pudo no ser un meteoro sino basura
            espacial reingresando a la atmósfera. No puedo asegurarlo, pero en el timelapse se
            nota clarísimo.
          </p>
          {storyPhoto && (
            <figure className="pt-4">
              <PhotoImage
                photo={storyPhoto}
                sizes="(min-width: 768px) 768px, 100vw"
                className="h-auto w-full rounded-xl"
              />
              <figcaption className="mt-2 text-sm">{storyPhoto.title}</figcaption>
            </figure>
          )}
        </Block>
      </article>
    </Container>
  )
}