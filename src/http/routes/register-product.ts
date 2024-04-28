import { products } from '@/db/schema'
import { db } from '@/db/connection'
import Elysia from 'elysia'
import { z } from 'zod'

const registerProductBodySchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  priceInCents: z.number(),
  restaurantId: z.string(),
})

export const registerProduct = new Elysia().post(
  '/products',
  async ({ body, set }) => {
    const { name, description, priceInCents, restaurantId } =
      registerProductBodySchema.parse(body)

    await db.insert(products).values({
      name,
      description,
      priceInCents,
      restaurantId,
    })

    set.status = 201
  },
)
