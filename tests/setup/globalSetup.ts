import { db } from '../../src/db/connection.ts'
import { users, habits, entries, tags, habitTags } from '../../src/db/schema.ts'
import { sql } from 'drizzle-orm'
import { execSync } from 'child_process'
import { th } from 'zod/locales'

export default async function setup() {
  console.log('Running global setup...')

  try {
    await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)

    console.log('Pushing schema using drizzle-kit...')
    execSync(
      `npx drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="./src/db/schema.ts" --dialect="postgres"`,
      { stdio: 'inherit', cwd: process.cwd() },
    )

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
     console.error('Error during global setup:', error)
     throw error
    
   }
  }
}
