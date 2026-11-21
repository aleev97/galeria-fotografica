export type Collection = 'cosmos' | 'earth' | 'wildlife' | 'details'

export type Photo = {
    id: string
    title: string
    alt: string
    collection: Collection
    width: number
    height: number
    featured: boolean
}