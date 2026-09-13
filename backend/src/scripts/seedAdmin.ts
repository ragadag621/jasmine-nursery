import { connectDB, disconnectDB } from '../config/db';
import { User } from '../models';

/**
 * Seeds a single admin user for local development / initial deployment.
 * Safe to run multiple times — it's a no-op if an admin with this
 * username already exists, so it won't ever silently reset a real
 * password already in use.
 *
 * Run with: npm run seed:admin
 * Reads credentials from env vars so the real password is never hardcoded
 * or committed; falls back to clearly-labeled dev defaults otherwise.
 */
async function seedAdmin(): Promise<void> {
  await connectDB();

  const username = process.env.SEED_ADMIN_USERNAME;
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!username || !email || !password) {
    throw new Error(
      '[seed] SEED_ADMIN_USERNAME, SEED_ADMIN_EMAIL, and SEED_ADMIN_PASSWORD are required.'
    );
  }

  const existing = await User.findOne({ username });

  if (existing) {
    console.log(`[seed] Admin user "${username}" already exists — skipping.`);
    await disconnectDB();
    process.exit(0);
  }

  const passwordHash = await User.hashPassword(password);

  await User.create({
    username,
    email,
    passwordHash,
    role: 'admin',
  });

  console.log('[seed] Admin user created successfully:');
  console.log(`        username: ${username}`);
  console.log(`        email:    ${email}`);
  console.log('        password: (from SEED_ADMIN_PASSWORD env var)');

  await disconnectDB();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('[seed] Failed to seed admin user:', err);
  process.exit(1);
});
