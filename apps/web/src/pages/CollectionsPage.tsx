import { Container } from '@/components/Container'
import { CollectionCards } from '@/features/gallery/CollectionCards'

export default function CollectionsPage() {
  return (
    <Container className="py-24">
      <h1 className="text-4xl md:text-5xl">Colecciones</h1>
      <p className="mt-4 max-w-2xl text-moon-300">
        Cuatro formas de mirar lo que me rodea: el cielo, la Tierra, los animales y los detalles.
      </p>
      <div className="mt-12">
        <CollectionCards />
      </div>
    </Container>
  )
}