import type { Collection } from '@/types/photo'
import { collections } from './collections'

type Props = {
  query: string
  collection: Collection | undefined
  onQueryChange: (value: string) => void
  onCollectionChange: (value: Collection | undefined) => void
}

const chip = 'rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-400'
const chipOff = 'border-moon-100/30 text-moon-100 hover:border-moon-100'
const chipOn = 'border-moon-100 bg-moon-100 text-space-950'

export function GalleryFilters({ query, collection, onQueryChange, onCollectionChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="search" className="sr-only">
          Buscar fotografías
        </label>
        <input
          id="search"
          maxLength={100}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por título o descripción"
          className="w-full max-w-md rounded-full border border-moon-100/30 bg-space-900 px-5 py-3 text-moon-100 placeholder:text-moon-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-400"
        />
      </div>

      <div className="flex flex-wrap gap-3" role="group" aria-label="Filtrar por colección">
        <button
          type="button"
          aria-pressed={collection === undefined}
          onClick={() => onCollectionChange(undefined)}
          className={`${chip} ${collection === undefined ? chipOn : chipOff}`}
        >
          Todas
        </button>
        {collections.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={collection === item.id}
            onClick={() => onCollectionChange(item.id)}
            className={`${chip} ${collection === item.id ? chipOn : chipOff}`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  )
}