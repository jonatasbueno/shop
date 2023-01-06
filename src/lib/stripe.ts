import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIP_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
  appInfo: {
    name: 'Ignite Shop'
  }
})