import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import db from '../db/connection.ts'
import { habits } from '../db/schema.ts'
import { desc } from 'drizzle-orm'

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      description,
      frequency,
      targetCount,
      isActive,
      tagIds,
      habitTags,
    } = req.body

    const result = await db.transaction(async (tx) => {
      const [newHabit] = await tx
        .insert(habits)
        .values({
          userId: req.user!.id,
          name,
          description,
          frequency,
          targetCount,
          isActive,
        })
        .returning()

      if (tagIds && tagIds.length > 0) {
        const habitTagValues = tagIds.map((tagId: string) => ({
          habitId: newHabit.id,
          tagId,
        }))
        await tx.insert(habitTags).values(habitTagValues)
        return newHabit
      }
    })
    res
      .status(201)
      .json({ message: 'Habit created successfully', habit: result })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getUserHabits = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userHabitsWithTags = await db.query.habits.findMany({
      with: {
        habitTags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy: [desc(habits.createdAt)],
    })

    console.log({ userHabitsWithTags })

    const habitsWithTags = userHabitsWithTags.map((habit) => ({
      ...habit,
      tags: habit.habitTags.map((ht) => ht.tag),
      habitTags: undefined,
    }))

    res.json({ habits: habitsWithTags })
  } catch (error) {
    console.error('Error fetching user habits:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
