import { COLLECTIONS } from '@astrogaia/shared'
import { z } from 'zod'
import { DEFAULT_LIMIT, MAX_IDS, MAX_LIMIT } from '../config/constants'

const idPattern = '[a-z0-9-]{1,100}'
const idsPattern = new RegExp(`^${idPattern}(,${idPattern}){0,${MAX_IDS - 1}}$`)

export const listPhotosQuery = z.object({
  collection: z.enum(COLLECTIONS).optional(),
  q: z.string().trim().max(100).optional(),
  featured: z.enum(['true', 'false']).optional(),
  ids: z
    .string()
    .regex(idsPattern)
    .transform((value) => value.split(','))
    .optional(),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
  offset: z.coerce.number().int().min(0).default(0),
})

export const photoIdParam = z.object({
  id: z.string().regex(/^[a-z0-9-]{1,100}$/),
})