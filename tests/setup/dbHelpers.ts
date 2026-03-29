import { db } from '../../src/db/connection.ts'
import {
  users,
  habits,
  entries,
  tags,
  habitTags,
  type NewUser,
  type NewHabit,
} from '../../src/db/schema.ts'
import { hashPassword } from '../../src/utils/password.ts'
import { generateToken } from '../../src/utils/jwt.ts'
import { email } from 'zod'
import { raw } from 'express'

export const createTestUser = async (userData: Partial<NewUser> = {}) => {
  const defaultData = {
    email: `testuser${Date.now()}@example.com`,
    username: `testuser${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    password: 'adminpassword123',
    firstname: 'Test',
    lastname: 'User',
    ...userData,
  }

  const hashedPassword = await hashPassword(defaultData.password)

  const [user] = await db
    .insert(users)
    .values({
      ...defaultData,
      password: hashedPassword,
    })
    .returning()

  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  })

  return {
    user,
    token,
    rawPassword: defaultData.password,
  }
}

export const createTestHabit = async (
  userId: string,
  habitData: Partial<NewHabit> = {},
) => {
  const defaultData = {
    name: `Test Habit ${Date.now()}`,
    description: 'This is a test habit',
    frequency: 'daily',
    targetCount: 5,
    isActive: true,
    ...habitData,
  }

  const [habit] = await db
    .insert(habits)
    .values({
      userId,
      ...defaultData,
    })
    .returning()

  return habit
}

export const cleanupDatabase = async () => {
  await db.delete(entries)
  await db.delete(habits)
  await db.delete(habitTags)
  await db.delete(users)
}
