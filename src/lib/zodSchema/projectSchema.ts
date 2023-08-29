import { z } from "zod";

export const getProjectByIdSchema = z.object({
  params: z.object({
    id: z.string().min(10),
  }),
});

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    logo_url: z.string().optional(), //Change to url
    banner_url: z.string().optional(), //Change to url
    website_url: z.string().optional(), //Change to url
    crypto_category: z.string().optional(),
    description: z.string().min(2),
    reason: z.string().min(2),
    category: z.string().min(2),
    contact: z.string().min(2),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().min(10),
  }),
  body: z.object({
    name: z.string().optional(),
    logo_url: z.string().optional(), //Change to url
    banner_url: z.string().optional(), //Change to url
    website_url: z.string().optional(), //Change to url
    crypto_category: z.string().optional(),
    description: z.string().optional(),
    reason: z.string().optional(),
    category: z.string().optional(),
    contact: z.string().optional(),
  }),
});
