import { ApiError } from '@/services/api'

export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'unpublish_first') {
      return 'Primero despublicá la foto (desmarcá "Publicada" y guardá los cambios) y después eliminala.'
    }
    if (error.code === 'alt_required') {
      return 'Para publicar una foto hace falta completar su texto alternativo (alt).'
    }
    if (error.status === 401) return 'Tu sesión venció. Volvé a iniciar sesión.'
    if (error.status === 400) return 'Alguno de los datos no es válido. Revisá los campos.'
  }
  return 'No se pudo guardar. Probá de nuevo.'
}