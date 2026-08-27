import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const plan = session.metadata?.plan;
      if (userId && plan) {
        await supabase
          .from("subscriptions")
          .update({
            stripe_subscription_id: session.subscription as string,
            tier: plan,
            status: "active",
          })
          .eq("user_id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const periodStart = (sub as unknown as Record<string, number>).current_period_start;
      const periodEnd = (sub as unknown as Record<string, number>).current_period_end;
      await supabase
        .from("subscriptions")
        .update({
          status: sub.status === "active" ? "active" : "past_due",
          ...(periodStart && { current_period_start: new Date(periodStart * 1000).toISOString() }),
          ...(periodEnd && { current_period_end: new Date(periodEnd * 1000).toISOString() }),
        })
        .eq("stripe_subscription_id", sub.id);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await supabase
        .from("subscriptions")
        .update({ tier: "free", status: "canceled", stripe_subscription_id: null })
        .eq("stripe_subscription_id", sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
