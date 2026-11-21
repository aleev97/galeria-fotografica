import { useSearchParams } from 'react-router'
import { Container } from '@/components/Container'
import { isCollection } from '@/features/gallery/collections'
import { GalleryFilters } from '@/features/gallery/GalleryFilters'
import { ProgressiveGallery } from '@/features/gallery/ProgressiveGallery'
import { getPhotos } from '@/services/photos'

export default function ExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const rawCollection = searchParams.get('coleccion')
  const collection = isCollection(rawCollection) ? rawCollection : undefined
  const query = searchParams.get('q') ?? ''

  const setParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const photos = getPhotos({ collection, query })

  return (
    <Container className="py-24">
      <h1 className="text-4xl md:text-5xl">Explorador</h1>
      <div className="mt-10">
        <GalleryFilters
          query={query}
          collection={collection}
          onQueryChange={(value) => setParam('q', value)}
          onCollectionChange={(value) => setParam('coleccion', value)}
        />
      </div>
      <div className="mt-12">
        <ProgressiveGallery key={`${collection ?? 'todas'}|${query}`} photos={photos} />
      </div>
    </Container>
  )
}