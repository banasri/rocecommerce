import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type { Product } from '@prisma/client';


interface GetAllProductsInput {
  skip?: number;
  take?: number;
}
interface Context {
  db: {
    product: {
      findMany: (query: { skip?: number; take?: number }) => Promise<Product[]>;
    };
  };
}
export const productRouter = createTRPCRouter({

  getAll: publicProcedure
  .input(z.object(
    {
    skip: z.number().optional(),
    take: z.number().optional()
    }
  )).mutation(async ({ ctx, input } : { ctx: Context, input: GetAllProductsInput }) : Promise<Product[]> => {
    // simulate a slow db call
    //await new Promise((resolve) => setTimeout(resolve, 1000));

    return ctx.db.product.findMany({
      skip : input.skip,
      take : input.take
    });
  }),
  
});
