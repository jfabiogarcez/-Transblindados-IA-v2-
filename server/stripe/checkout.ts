import Stripe from "stripe";
import { ENV } from "../_core/env";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

export interface CreateCheckoutSessionParams {
  orderId: number;
  customerEmail: string;
  customerName: string;
  items: Array<{
    productName: string;
    quantity: number;
    priceAtPurchase: number;
  }>;
  totalAmount: number;
  origin: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<{ url: string; sessionId: string }> {
  const { orderId, customerEmail, customerName, items, totalAmount, origin } = params;

  // Create line items for Stripe
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
    price_data: {
      currency: "brl",
      product_data: {
        name: item.productName,
      },
      unit_amount: item.priceAtPurchase,
    },
    quantity: item.quantity,
  }));

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: customerEmail,
    client_reference_id: orderId.toString(),
    metadata: {
      order_id: orderId.toString(),
      customer_name: customerName,
      customer_email: customerEmail,
    },
    success_url: `${origin}/pagamento/${orderId}?success=true`,
    cancel_url: `${origin}/pagamento/${orderId}?canceled=true`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session URL");
  }

  return {
    url: session.url,
    sessionId: session.id,
  };
}
