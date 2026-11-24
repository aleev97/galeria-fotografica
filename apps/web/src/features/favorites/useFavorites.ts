import { useSyncExternalStore } from 'react'
import { favoritesStore } from './favoritesStore'

export function useFavorites() {
  const ids = useSyncExternalStore(favoritesStore.subscribe, favoritesStore.getSnapshot)

  return {
    ids,
    isFavorite: (id: string) => ids.includes(id),
    toggle: favoritesStore.toggle,
  }
}