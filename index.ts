import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import { registerCustomer } from './src/http/routes/register-customer'
import { registerProduct } from './src/http/routes/register-product'
import { sendAuthenticationLink } from './src/http/routes/send-authentication-link'
import { createOrder } from './src/http/routes/create-order'
import { approveOrder } from './src/http/routes/approve-order'
import { cancelOrder } from './src/http/routes/cancel-order'
import { getOrders } from './src/http/routes/get-orders'
import { createEvaluation } from './src/http/routes/create-evaluation'
import { getEvaluations } from './src/http/routes/get-evaluations'
import { updateMenu } from './src/http/routes/update-menu'
import { updateProfile } from './src/http/routes/update-profile'
import { getProfile } from './src/http/routes/get-profile'
import { authenticateFromLink } from './src/http/routes/authenticate-from-link'
import { getManagedRestaurant } from './src/http/routes/get-managed-restaurant'
import { signOut } from './src/http/routes/sign-out'
import { getOrderDetails } from './src/http/routes/get-order-details'
import { getMonthReceipt } from './src/http/routes/get-month-receipt'
import { getMonthOrdersAmount } from './src/http/routes/get-month-orders-amount'
import { getDayOrdersAmount } from './src/http/routes/get-day-orders-amount'
import { getMonthCanceledOrdersAmount } from './src/http/routes/get-month-canceled-orders-amount'
import { getDailyReceiptInPeriod } from './src/http/routes/get-daily-receipt-in-period'
import { getPopularProducts } from './src/http/routes/get-popular-products'
import { dispatchOrder } from './src/http/routes/dispatch-order'
import { deliverOrder } from './src/http/routes/deliver-order'
import { getProducts } from './src/http/routes/get-products'
import { registerRestaurant } from './src/http/routes/register-restaurant'
import { authentication } from './src/http/authentication'

const app = new Elysia()
  .use(
    cors({
      credentials: true,
      allowedHeaders: ['content-type'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
      origin: (request): boolean => {
        const origin = request.headers.get('origin')

        if (!origin) {
          return false
        }

        return true
      },
    }),
  )
  .get('/', () => 'server running 🚀')
  .use(authentication)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)
  .use(registerRestaurant)
  .use(registerCustomer)
  .use(registerProduct)
  .use(sendAuthenticationLink)
  .use(authenticateFromLink)
  .use(createOrder)
  .use(approveOrder)
  .use(cancelOrder)
  .use(dispatchOrder)
  .use(deliverOrder)
  .use(getOrders)
  .use(getOrderDetails)
  .use(createEvaluation)
  .use(getEvaluations)
  .use(updateMenu)
  .use(updateProfile)
  .use(getMonthReceipt)
  .use(getMonthOrdersAmount)
  .use(getDayOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .use(getDailyReceiptInPeriod)
  .use(getPopularProducts)
  .use(getProducts)

const port = process.env.PORT || 3333

app.listen(port)

console.log(
  `🔥 src/http server running at ${app.server?.hostname}:${app.server?.port}`,
)
