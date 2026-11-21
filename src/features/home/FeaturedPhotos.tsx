import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { PhotoImage } from '@/features/gallery/PhotoImage'
import { getFeaturedPhotos } from '@/services/photos'

export function FeaturedPhotos() {
  const photos = getFeaturedPhotos()
  if (photos.length === 0) return null

  return (
    <section className="py-24" aria-labelledby="featured-title">
      <Container>
        <Reveal>
          <h2 id="featured-title" className="text-3xl md:text-4xl">
            Fotografías destacadas
          </h2>
        </Reveal>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <li key={photo.id}>
              <Reveal delay={index * 0.1}>
                <figure>
                  <div className="aspect-[4/5] overflow-hidden rounded-xl bg-space-800">
                    <PhotoImage
                      photo={photo}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <figcaption className="mt-3 text-moon-300">{photo.title}</figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}