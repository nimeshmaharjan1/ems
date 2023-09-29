import { z } from 'zod';

export const settingsSchema = z.object({
  id: z.union([z.null(), z.string()]).optional(),
  deliveryCharge: z.union([z.number(), z.null()]).optional(),
  storeAddress: z.union([z.null(), z.string()]).optional(),
  contactNumber: z.union([z.null(), z.string()]).optional(),
  tiktok: z.union([z.null(), z.string()]).optional(),
  facebook: z.union([z.null(), z.string()]).optional(),
  email: z.union([z.null(), z.string().email()]).optional(),
});
export type SettingsSchema = z.infer<typeof settingsSchema>;
