const KEY = 'galeria:favorites'

let cache: string[] | null = null
const listeners = new Set<() => void>()

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string')
      : []
  } catch {
    return []
  }
}

function getSnapshot(): string[] {
  if (cache === null) cache = read()
  return cache
}

function notify() {
  listeners.forEach((listener) => listener())
}

function write(next: string[]) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Almacenamiento no disponible (modo privado, cuota llena): seguimos en memoria
  }
  notify()
}

// Sincroniza entre pestañas: el evento "storage" salta cuando OTRA pestaña escribe
window.addEventListener('storage', (event) => {
  if (event.key === KEY) {
    cache = null
    notify()
  }
})

export const favoritesStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot,
  toggle(id: string) {
    const current = getSnapshot()
    write(current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  },
}