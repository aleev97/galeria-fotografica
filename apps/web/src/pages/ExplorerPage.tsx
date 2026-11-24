import { useSearchParams } from 'react-router'
import { Container } from '@/components/Container'
import { isCollection } from '@/features/gallery/collections'
import { GalleryFilters } from '@/features/gallery/GalleryFilters'
import { ProgressiveGallery } from '@/features/gallery/ProgressiveGallery'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

export default function ExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const rawCollection = searchParams.get('coleccion')
  const collection = isCollection(rawCollection) ? rawCollection : undefined
  const query = searchParams.get('q') ?? ''
  const debouncedQuery = useDebouncedValue(query)

  const setParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  return (
    <Container className="py-24">
      <title>Explorador | Astrogaia</title>

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
        <ProgressiveGallery
          key={`${collection ?? 'todas'}|${debouncedQuery}`}
          collection={collection}
          query={debouncedQuery}
        />
      </div>
    </Container>
  )
}