import { config } from 'dotenv'
import { execSync } from 'child_process'

export default async function setup() {
  // Load .env.test before any DB imports so env.ts picks up the right DATABASE_URL
  process.env.APP_STAGE = 'test'
  config({ path: '.env.test', override: true })

  const { db } = await import('../../src/db/connection.ts')
  const { users, habits, entries, tags, habitTags } = await import('../../src/db/schema.ts')
  const { sql } = await import('drizzle-orm')

  console.log('Running global setup...')

  try {
    await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)

    console.log('Pushing schema using drizzle-kit...')
    execSync('npx drizzle-kit push', { stdio: 'inherit', cwd: process.cwd() })

    console.log('Test DB created')
  } catch (error) {
    console.error('Error during global setup:', error)
    throw error
  }

  return async () => {
    try {
      await db.execute(sql`TRUNCATE TABLE ${habitTags} CASCADE`)
      await db.execute(sql`TRUNCATE TABLE ${entries} CASCADE`)
      await db.execute(sql`TRUNCATE TABLE ${habits} CASCADE`)
      await db.execute(sql`TRUNCATE TABLE ${tags} CASCADE`)
      await db.execute(sql`TRUNCATE TABLE ${users} CASCADE`)
      console.log('Test DB destroyed')
    } catch (error) {
      console.error('Error during global teardown:', error)
      throw error
    }
  }
}
