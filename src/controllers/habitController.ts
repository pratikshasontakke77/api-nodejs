import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import db from '../db/connection.ts'

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
       const [newHabit] = await tx.insert['habits']
         .values({
           userId: req.user.id,
           name,
           description,
           frequency,
           targetCount,
           isActive,
         })
         .returning()

       if (tagIds && tagIds.length > 0) {
         const habitTagValues = tagIds.map((tagId) => ({
           habitId: newHabit.id,
           tagId,
         }))
         await tx.insert(habitTags).values(habitTagValues)
         return newHabit
       }
     })
     res.status(201).json({ message: 'Habit created successfully', habit: result })
 } catch (error) {

    console.log("create habit error", error)
    res.status(500).json({ error: 'Internal Server Error' })
    
 }
}
