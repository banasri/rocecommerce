// src/server/routers/userRouter.ts

import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { sendVerificationEmail } from "../../utils/emailService";
import crypto from 'crypto';

export const userRouter = createTRPCRouter({
  create : publicProcedure
  .input(z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  }))
  .mutation(async ({ ctx, input }) => {
const passwordHash = crypto.createHash('sha256').update(input.password).digest('hex');

    // Generate an 8-digit verification code
    const verificationCode = Math.floor(10000000 + Math.random() * 90000000).toString();

    // Calculate expiration time (24 hours from now)
    const verificationCodeExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    console.log("before user create");
    await ctx.db.user.create({
      
      data: {
        username: input.username,
        email: input.email,
        passwordHash : passwordHash,
        verificationCode : verificationCode,
        verificationCodeExpiresAt : verificationCodeExpiresAt
      },
    });
    
      console.log("After signin");
      await sendVerificationEmail(input.email, verificationCode).then(() =>{
      console.log("verification code sent!");
      return { message: 'User registered. Verification email sent.' };
    })
  }),
  verifyEmail: publicProcedure
  .input(z.object({
    email: z.string().email(),
    verificationCode: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findFirst({
      where : {
        email: input.email,
        verificationCode : input.verificationCode,
        verificationCodeExpiresAt: {
          gt: new Date(),
        },
      },
    });
    if (!user) {
      throw new Error('Invalid or expired verification code');
    }

    // Mark user as verified and clear the verification code
    await ctx.db.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationCode: null,
        verificationCodeExpiresAt: null,
      },
    });
    return { message: 'Email verified successfully' };
  }),

  login: publicProcedure
  .input(z.object({
    email: z.string().email(),
    password: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findFirst({
      where : {
        email: input.email,
      },
    });
    if (!user) {
      throw new Error('User not registered');
    } else if (!user.verified){
      throw new Error('User not verified');
    }
    const passwordHash = crypto.createHash('sha256').update(input.password).digest('hex');
    if(passwordHash != user.passwordHash){
      throw new Error('Incorrect Password');
    }
  
    return { message: 'Login successful' };
  }),
  me : publicProcedure
  .input(z.object({
    email: z.string().email(),
  }))
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where : {
        email: input.email,
      },
      include: { products: true },
    });
    if (!user) {
      throw new Error('User does not exist');
    }
    
    return user;
  }),
  // .query(async ({ctx}) =>{
  //   const token = localStorage.getItem("token");
  //     if (!token) {
  //       return null;
  //     }
  //     try {
  //       const decoded = verifyToken(token) as { id: number };
  //       const user = await ctx.db.user.findUnique({ where: { id: decoded.id } });

  //       return user;
  //     } catch {
  //       return null;
  //     }
  // })
})
 
  
      