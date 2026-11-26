import { COLLECTIONS } from '@astrogaia/shared'
import { z } from 'zod'

export const adminListQuery = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(100),
  offset: z.coerce.number().int().min(0).default(0),
})

// strictObject: cualquier campo que no esté en esta lista se rechaza
export const updatePhotoBody = z
  .strictObject({
    title: z.string().trim().min(1).max(120).optional(),
    alt: z.string().trim().max(300).optional(),
    description: z
      .string()
      .trim()
      .max(2000)
      .nullable()
      .optional()
      .transform((value) => (value === '' ? null : value)),
    collection: z.enum(COLLECTIONS).optional(),
    featured: z.boolean().optional(),
    published: z.boolean().optional(),
  })
  .refine((body) => Object.values(body).some((value) => value !== undefined), {
    message: 'empty_update',
  })

  export const moveBody = z.strictObject({
  direction: z.enum(['up', 'down']),
})