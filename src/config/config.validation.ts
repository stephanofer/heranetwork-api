import { envSchema, EnvConfig } from './env.validation';

export function validate(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    throw new Error(
      'Error de validación de variables de entorno. Revise la consola para más detalles.',
    );
  }

  return result.data;
}
