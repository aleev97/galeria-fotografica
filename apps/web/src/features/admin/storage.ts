export const HINT_KEY = 'astrogaia:admin-hint'
export const VISITOR_KEY = 'astrogaia:visitor-view'

export function readFlag(storage: Storage, key: string): boolean {
  try {
    return storage.getItem(key) === '1'
  } catch {
    return false
  }
}

export function writeFlag(storage: Storage, key: string, value: boolean): void {
  try {
    if (value) storage.setItem(key, '1')
    else storage.removeItem(key)
  } catch {
    // Sin almacenamiento disponible (modo privado, bloqueado): seguimos sin guardar
  }
}