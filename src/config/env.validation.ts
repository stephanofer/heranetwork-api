import { z } from 'zod';

export const envSchema = z.object({
  CACHE_TTL: z.coerce.number().int().positive(),
  NODE_ENV: z.string(),
  SENTRY_DSN: z.string(),
});

export type EnvConfig = z.infer<typeof envSchema>;
