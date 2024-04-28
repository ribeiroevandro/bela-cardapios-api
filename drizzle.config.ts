import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString:
      'postgresql://neondb_owner:9pc4XRsxfuDq@ep-quiet-lake-a5xrae0z.us-east-2.aws.neon.tech/neondb?sslmode=require',
  },
} satisfies Config
