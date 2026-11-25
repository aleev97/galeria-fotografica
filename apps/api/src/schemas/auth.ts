import { z } from 'zod'

export const callbackQuery = z.object({
  code: z.string().min(1).max(200),
  state: z.string().min(1).max(100),
})