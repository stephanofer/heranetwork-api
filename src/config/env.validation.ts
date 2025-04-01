import { z } from 'zod';

export const envSchema = z.object({
  CACHE_TTL: z.coerce.number().int().positive(),
});

export type EnvConfig = z.infer<typeof envSchema>;
