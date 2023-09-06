import { z } from "zod";

export const Login = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is Required" }).email(),
    user_name: z.string().optional(),
    first_name: z.string().min(2),
    last_name: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    user_name: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    profile: z.string().url()
  }),
});
