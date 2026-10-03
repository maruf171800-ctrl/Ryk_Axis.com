import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { GOOGLE_SESSION_COOKIE } from "./_core/google-oauth";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const storefrontCatalog = [
  { id: "orbit-buds", slug: "orbit-buds", name: "Orbit Buds / 02", kind: "physical" as const, category: "Audio", price: 5831, stock: 18, rating: 4.8 },
  { id: "air-pulse", slug: "air-pulse", name: "Air Pulse Mini", kind: "physical" as const, category: "Everyday tech", price: 1666, stock: 42, rating: 4.6 },
  { id: "halo-loop", slug: "halo-light", name: "Halo Loop Light", kind: "physical" as const, category: "Home tech", price: 4641, stock: 9, rating: 4.9 },
  { id: "stronger-every-day", slug: "stronger-every-day-gym-benefits", name: "Stronger Every Day", kind: "digital" as const, category: "Digital", price: 952, stock: 999, rating: 4.7 },
];

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie(GOOGLE_SESSION_COOKIE, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  catalog: router({
    list: publicProcedure.input(z.object({ query: z.string().max(80).optional(), category: z.string().max(80).optional(), kind: z.enum(["physical", "digital"]).optional() }).optional()).query(({ input }) => {
      const query = input?.query?.trim().toLowerCase();
      return storefrontCatalog.filter(product => (!query || `${product.name} ${product.category}`.toLowerCase().includes(query)) && (!input?.category || product.category === input.category) && (!input?.kind || product.kind === input.kind));
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(128) })).query(({ input }) => storefrontCatalog.find(product => product.slug === input.slug) ?? null),
    checkoutPreview: publicProcedure.input(z.object({ lines: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(99) })).min(1).max(50), coupon: z.string().max(64).optional() })).query(({ input }) => {
      const lines = input.lines.map(line => {
        const product = storefrontCatalog.find(item => item.id === line.productId);
        if (!product) throw new Error(`Unknown product: ${line.productId}`);
        if (product.kind === "physical" && product.stock < line.quantity) throw new Error(`Insufficient stock for ${product.name}`);
        return { ...line, product };
      });
      const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
      const discount = input.coupon?.toUpperCase() === "SIGNAL20" ? Math.round(subtotal * 0.2) : 0;
      const delivery = lines.every(line => line.product.kind === "digital") || subtotal - discount >= 9520 ? 0 : 180;
      return { subtotal, discount, delivery, total: subtotal - discount + delivery };
    }),
  }),
  account: router({
    me: protectedProcedure.query(({ ctx }) => ({ id: ctx.user.id, name: ctx.user.name, email: ctx.user.email, role: ctx.user.role })),
    orderStatus: protectedProcedure.input(z.object({ orderCode: z.string().regex(/^AXP-[0-9]{6}$/) })).query(({ input }) => ({ orderCode: input.orderCode, status: "review" as const, message: "Manual payment review is in progress." })),
  }),
  seller: router({
    overview: adminProcedure.query(() => ({ grossSignal: 48290, ordersToReview: 18, liveProducts: 7, digitalDelivery: 94 })),
    updateInventory: adminProcedure.input(z.object({ productId: z.string().min(1), available: z.number().int().min(0).max(100000) })).mutation(({ input }) => ({ ...input, saved: true })),
    updateOrderStatus: adminProcedure.input(z.object({ orderCode: z.string().regex(/^AXP-[0-9]{6}$/), status: z.enum(["review", "approved", "dispatch", "delivered", "returned", "refunded"]) })).mutation(({ input }) => ({ ...input, saved: true })),
  }),
});

export type AppRouter = typeof appRouter;
