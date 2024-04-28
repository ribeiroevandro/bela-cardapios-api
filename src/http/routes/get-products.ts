// import Elysia from 'elysia'
// import { authentication } from '../authentication'
// import { db } from '@/db/connection'
// import { products } from '@/db/schema'
//
// export const getProducts = new Elysia()
//   .use(authentication)
//   .get('/products', async () => {
//     try {
//       const baseQuery = await db
//         .select({
//           name: products.name,
//           description: products.description,
//           priceInCents: products.priceInCents,
//         })
//         .from(products)
//
//       const [productsCount] = await db
//         .select({ count: count() })
//         .from(baseQuery.as('baseQuery'))
//
//       const allProducts = await baseQuery
//       .offset(pageIndex * 10)
//       .limit(10)
//       .orderBy((fields) => {
//         return [
//           sql`CASE ${fields.status}
//             WHEN 'pending' THEN 1
//             WHEN 'processing' THEN 2
//             WHEN 'delivering' THEN 3
//             WHEN 'delivered' THEN 4
//             WHEN 'canceled' THEN 99
//           END`,
//           desc(fields.createdAt),
//         ]
//       })
//
//       // return productsList
//     } catch (err) {
//       console.log(err)
//     }
//   })

import Elysia, { t } from 'elysia'
import { products, restaurants } from '@/db/schema'
import { db } from '@/db/connection'
import { and, count, eq, ilike } from 'drizzle-orm'
import { authentication } from '../authentication'
import { formatMoney } from '@/utils'

export const getProducts = new Elysia().use(authentication).get(
  '/products',
  async ({ query, getCurrentUser, set }) => {
    const { pageIndex, productId, productName } = query
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      set.status = 401

      throw new Error('User is not a restaurant manager.')
    }

    const baseQuery = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price_in_cents: products.priceInCents,
        restaurant_id: products.restaurantId,
        createdAt: products.createdAt,
      })
      .from(products)
      .innerJoin(restaurants, eq(restaurants.id, products.restaurantId))
      .where(
        and(
          eq(products.restaurantId, restaurantId),
          productId ? ilike(products.id, `%${productId}%`) : undefined,
          productName ? ilike(products.name, `%${productName}%`) : undefined,
        ),
      )

    const [productsCount] = await db
      .select({ count: count() })
      .from(baseQuery.as('baseQuery'))

    const allProducts = await baseQuery.offset(pageIndex * 10).limit(10)

    const allProductsFormated = allProducts.map((item) => {
      return {
        ...item,
        formatted_price: formatMoney(item.price_in_cents),
      }
    })

    const result = {
      products: allProductsFormated,
      meta: {
        pageIndex,
        perPage: 10,
        totalCount: productsCount.count,
      },
    }

    return result
  },
  {
    query: t.Object({
      productName: t.Optional(t.String()),
      pageIndex: t.Numeric({ minimum: 0 }),
      productId: t.Optional(t.String()),
    }),
  },
)
