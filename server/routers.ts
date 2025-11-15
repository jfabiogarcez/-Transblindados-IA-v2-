import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { sendInvoiceEmail } from "./sendInvoiceEmail";
import { notifyOwner } from "./_core/notification";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      return await db.getAllProducts();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await db.getProductById(input.id);
        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        }
        return product;
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        imageUrl: z.string().optional(),
        category: z.string().optional(),
        stock: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return await db.createProduct(input);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        imageUrl: z.string().optional(),
        category: z.string().optional(),
        stock: z.number().optional(),
        isActive: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateProduct(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProduct(input.id);
        return { success: true };
      }),
  }),

  orders: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        shippingAddress: z.string(),
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
        })),
      }))
      .mutation(async ({ input }) => {
        // Calculate total and validate products
        let totalAmount = 0;
        const orderItemsData = [];
        
        for (const item of input.items) {
          const product = await db.getProductById(item.productId);
          if (!product) {
            throw new TRPCError({ 
              code: 'NOT_FOUND', 
              message: `Product ${item.productId} not found` 
            });
          }
          
          if (product.stock < item.quantity) {
            throw new TRPCError({ 
              code: 'BAD_REQUEST', 
              message: `Insufficient stock for ${product.name}` 
            });
          }
          
          const itemTotal = product.price * item.quantity;
          totalAmount += itemTotal;
          
          orderItemsData.push({
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            priceAtPurchase: product.price,
          });
        }
        
        // Create order
        const orderId = await db.createOrder({
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          shippingAddress: input.shippingAddress,
          totalAmount,
          status: 'pending',
        });
        
        // Create order items
        for (const itemData of orderItemsData) {
          await db.createOrderItem({
            orderId,
            ...itemData,
          });
        }
        
        // Update stock
        for (const item of input.items) {
          const product = await db.getProductById(item.productId);
          if (product) {
            await db.updateProduct(item.productId, {
              stock: product.stock - item.quantity,
            });
          }
        }
        
        return { orderId, totalAmount };
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const order = await db.getOrderWithItems(input.id);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }
        return order;
      }),
    
    list: adminProcedure.query(async () => {
      return await db.getAllOrders();
    }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']),
        paymentId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateOrderStatus(input.id, input.status, input.paymentId);
        return { success: true };
      }),
    
    confirmPayment: publicProcedure
      .input(z.object({
        orderId: z.number(),
        paymentMethod: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const order = await db.getOrderWithItems(input.orderId);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }
        
        // Update order status to paid
        await db.updateOrderStatus(input.orderId, 'paid', input.paymentMethod);
        
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
        } catch (error) {
          console.error('[Order] Failed to send invoice email:', error);
        }
        
        // Notify owner about new order
        try {
          await notifyOwner({
            title: `Novo Pedido #${order.id}`,
            content: `Cliente: ${order.customerName}\nTotal: R$ ${(order.totalAmount / 100).toFixed(2)}\nItens: ${order.items.length}`,
          });
        } catch (error) {
          console.error('[Order] Failed to notify owner:', error);
        }
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
