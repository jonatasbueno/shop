// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { stripe } from '../../lib/stripe'

type ResponseSuccess = {
  checkoutUrl: string
}

type ResponseError = { error: string }

type Data = ResponseSuccess | ResponseError

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') return res.status(400).json({
    error: 'Method not allowed'
  })

  const { priceId } = req.body;

  if (!priceId) return res.status(400).json({ error: 'Price not found' })

  const successUrl = `${process.env.NEXT_URL}/success`
  const cancelUrl = `${process.env.NEXT_URL}/`

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: successUrl,
    cancel_url: cancelUrl,
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      }
    ]
  })

  return res.status(201).json({
    checkoutUrl: checkoutSession.url || ''
  })
}
