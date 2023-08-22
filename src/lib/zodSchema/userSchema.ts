import { z } from "zod";

export const findUserSchema = z.object({
  params: z.object({
    email: z.string().email({ message: "Invalid Email address" }),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is Required" }).email(),
    user_name: z.string().optional(),
    first_name: z.string().min(2),
    last_name: z.string().optional(),
  }),
}); 

export const updateUserSchema = z.object({
  params: z.object({
    email: z.string({ required_error: "Email is Required in params" }).email(),
  }),
  body: z.object({
    user_name: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  }),
});
