import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { CollectionCards } from '@/features/gallery/CollectionCards'

export function CollectionsGrid() {
  return (
    <section className="py-24" aria-labelledby="collections-title">
      <Container>
        <Reveal>
          <h2 id="collections-title" className="text-3xl md:text-4xl">
            Colecciones
          </h2>
        </Reveal>
        <div className="mt-10">
          <CollectionCards />
        </div>
      </Container>
    </section>
  )
}