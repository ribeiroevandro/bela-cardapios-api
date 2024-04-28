import { restaurants, users } from '@/db/schema'
import { db } from '@/db/connection'
import Elysia, { t } from 'elysia'

export const registerRestaurant = new Elysia().post(
  '/restaurants',
  async ({ body, set }) => {
    const { restaurantName, managerName, email, phone } = body

    const [manager] = await db
      .insert(users)
      .values({
        name: managerName,
        email,
        phone,
        role: 'manager',
      })
      .returning()

    const [teste] = await db
      .insert(restaurants)
      .values({
        name: restaurantName,
        managerId: manager.id,
      })
      .returning()

    console.log(teste)

    set.status = 204
  },
  {
    body: t.Object({
      restaurantName: t.String(),
      managerName: t.String(),
      phone: t.String(),
      email: t.String({ format: 'email' }),
    }),
  },
)
