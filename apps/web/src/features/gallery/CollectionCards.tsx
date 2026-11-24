import type { CollectionListResponse } from '@astrogaia/shared'
import { Link } from 'react-router'
import { ErrorMessage, LoadingMessage } from '@/components/StatusMessage'
import { Reveal } from '@/components/Reveal'
import { useApi } from '@/hooks/useApi'
import { collections } from './collections'
import { PhotoImage } from './PhotoImage'

export function CollectionCards() {
  const state = useApi<CollectionListResponse>('/collections')

  if (state.status === 'loading') return <LoadingMessage />
  if (state.status === 'error') return <ErrorMessage />

  const summaries = new Map(state.data.items.map((item) => [item.id, item]))

  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {collections.map((collection, index) => {
        const summary = summaries.get(collection.id)
        const cover = summary?.cover
        const count = summary?.count ?? 0

        return (
          <li key={collection.id}>
            <Reveal delay={index * 0.1}>
              <Link
                to={`/explorador?coleccion=${collection.id}`}
                className="group relative block aspect-video overflow-hidden rounded-xl bg-space-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-400"
              >
                {cover && (
                  <PhotoImage
                    photo={cover}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                  />
                )}
                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-space-950/90 to-transparent p-6">
                  <h3 className="text-2xl tracking-widest">{collection.name}</h3>
                  <p className="mt-1 text-sm text-moon-300">{collection.description}</p>
                  <p className="mt-2 text-xs text-moon-300">
                    {count} {count === 1 ? 'fotografía' : 'fotografías'}
                  </p>
                </div>
              </Link>
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}