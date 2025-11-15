import type { Request, Response } from "express";
import Stripe from "stripe";
import { ENV } from "../_core/env";
import * as db from "../db";
import { sendInvoiceEmail } from "../sendInvoiceEmail";
import { notifyOwner } from "../_core/notification";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Stripe Webhook] Missing stripe-signature header");
    return res.status(400).send("Missing stripe-signature header");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] Payment succeeded: ${paymentIntent.id}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] Payment failed: ${paymentIntent.id}`);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing event:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log(`[Stripe Webhook] Processing checkout session: ${session.id}`);

  const orderId = session.metadata?.order_id;
  if (!orderId) {
    console.error("[Stripe Webhook] No order_id in session metadata");
    return;
  }

  try {
    // Update order status to paid
    await db.updateOrderStatus(
      parseInt(orderId),
      "paid",
      session.payment_intent as string
    );

    // Update Stripe IDs
    const dbInstance = await db.getDb();
    if (dbInstance) {
      const { orders } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      
      await dbInstance
        .update(orders)
        .set({
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
        })
        .where(eq(orders.id, parseInt(orderId)));
    }

    // Get order details
    const order = await db.getOrderWithItems(parseInt(orderId));
    if (!order) {
      console.error(`[Stripe Webhook] Order ${orderId} not found`);
      return;
    }

    // Send invoice email
    try {
      await sendInvoiceEmail({
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone || undefined,
        shippingAddress: order.shippingAddress,
        items: order.items,
        totalAmount: order.totalAmount,
        orderDate: order.createdAt,
      });
      console.log(`[Stripe Webhook] Invoice email sent for order ${orderId}`);
    } catch (error) {
      console.error(`[Stripe Webhook] Failed to send invoice email:`, error);
    }

    // Notify owner
    try {
      await notifyOwner({
        title: `Novo Pedido #${order.id} - Stripe`,
        content: `Cliente: ${order.customerName}\nTotal: R$ ${(order.totalAmount / 100).toFixed(2)}\nItens: ${order.items.length}\nPagamento: Stripe`,
      });
      console.log(`[Stripe Webhook] Owner notified for order ${orderId}`);
    } catch (error) {
      console.error(`[Stripe Webhook] Failed to notify owner:`, error);
    }

    console.log(`[Stripe Webhook] Successfully processed order ${orderId}`);
  } catch (error) {
    console.error(`[Stripe Webhook] Error processing order ${orderId}:`, error);
    throw error;
  }
}
