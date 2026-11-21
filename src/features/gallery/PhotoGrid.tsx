import { Link } from 'react-router'
import type { Photo } from '@/types/photo'
import { PhotoImage } from './PhotoImage'

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  return (
    <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {photos.map((photo) => (
        <li key={photo.id} className="mb-4 break-inside-avoid">
          <Link
            to={`/foto/${photo.id}`}
            className="group relative block overflow-hidden rounded-xl bg-space-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-400"
          >
            <PhotoImage
              photo={photo}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-space-950/90 to-transparent p-4 text-sm opacity-0 transition-opacity group-focus-visible:opacity-100 group-hover:opacity-100">
              {photo.title}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}