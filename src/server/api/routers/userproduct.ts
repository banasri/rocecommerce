import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const UserProductSchema = z.object({
  userId: z.number().gt(0),       
  productId: z.number().gt(0),    
});

export const userproductRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello From User Products ${input.text}`,
      };
    }),

  insert: publicProcedure
    .input(z.object({ userId: z.number().gt(0), productId : z.number().gt(0) }))
    .mutation(async ({ ctx, input }) => {
      try {
        return ctx.db.userProduct.create({
          data: {
            userId: input.userId,
            productId: input.productId,
          },
        })
      } catch (error) {
        console.error('Error inserting user product:', error);
        throw new Error('Failed to insert user product');
      } 
  }),

  delete: publicProcedure
    .input(z.object({ userId: z.number().gt(0), productId : z.number().gt(0) }))
    .mutation(async ({ ctx, input }) => {

      try {
         const deletedUserProduct =  ctx.db.userProduct.delete({
          where: {
            userId_productId: {
              userId: input.userId,
              productId: input.productId,
            },
          }});
          return deletedUserProduct;
      } catch (error) {
        console.error('Error deleting user product:', error);
        throw new Error('Failed to delete user product');
      }
      
    })
});
