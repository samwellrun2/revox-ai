import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PLANS = {
  pro: {
    name: "Pro",
    price: 1500,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
  },
  business: {
    name: "Business",
    price: 4900,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID!,
  },
  enterprise: {
    name: "Enterprise",
    price: 9900,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
