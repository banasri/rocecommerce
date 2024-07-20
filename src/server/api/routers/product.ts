import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello From Products ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1), short_name: z.string().min(1), description : z.string().min(1), price : z.number().gt(0) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      //await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),

  getAll: publicProcedure
  .input(z.object(
    {
    skip: z.number().optional(),
    take: z.number().optional()
    }
  )).mutation(async ({ ctx, input }) => {
    // simulate a slow db call
    //await new Promise((resolve) => setTimeout(resolve, 1000));

    return ctx.db.product.findMany({
      skip : input.skip,
      take : input.take
    });
  }),
  
});
