import { z } from 'zod';

export const envSchema = z.object({
  CACHE_TTL: z.coerce.number().int().positive(),
  ENVIRONMENT: z.string(),
  SENTRY_DSN: z.string(),
});

export type EnvConfig = z.infer<typeof envSchema>;
