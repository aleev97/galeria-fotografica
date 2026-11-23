import { Link } from 'react-router'
import { buttonStyles } from '@/components/buttonStyles'
import { Container } from '@/components/Container'
import { useFavorites } from '@/features/favorites/useFavorites'
import { PhotoGrid } from '@/features/gallery/PhotoGrid'
import { getPhotosByIds } from '@/services/photos'

export default function FavoritesPage() {
  const { ids } = useFavorites()
  const photos = getPhotosByIds(ids)

  return (
    <Container className="py-24">
      <h1 className="text-4xl md:text-5xl">Favoritos</h1>
      <p className="mt-4 max-w-2xl text-moon-300">
        Tus favoritas se guardan solo en este navegador. No hace falta crear una cuenta.
      </p>

      <div className="mt-12">
        {photos.length === 0 ? (
          <div className="flex flex-col items-start gap-6">
            <p className="text-moon-300">Todavía no guardaste ninguna fotografía.</p>
            <Link to="/explorador" className={buttonStyles('primary')}>
              Explorar fotos
            </Link>
          </div>
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </div>
    </Container>
  )
}