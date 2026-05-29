import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@root/prisma/generated/prisma/client';

// Build the pg.Pool ourselves so we can force `rejectUnauthorized: false`.
// Supabase's pooler presents a chain node-postgres won't validate (self-signed
// root); the connection is still TLS-encrypted, we just skip chain validation
// -- same effect as libpq's `sslmode=require`. Passing this via PoolConfig
// directly avoids node-postgres' URL-string SSL parsing path, which doesn't
// reliably honor the option.
const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };
