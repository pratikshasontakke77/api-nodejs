import { Router } from 'express'
import {z} from 'zod';
import { validateBody } from '../middleware/validation.ts';
import { authenticateToken } from '../middleware/auth.ts'
import { createHabit } from '../controllers/habitController.ts'
import { desc } from 'drizzle-orm'
import { trace } from 'console'

const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.string(),
  tagIds: z.array(z.string()).optional(),
})
const router = Router()
router.use(authenticateToken)

router.get('/', (req, res) => {
  res.send({ message: 'Fetched all habits' })
})

router.get('/:id', (req, res) => {
  res.send({ message: `Fetched habit with id ${req.params.id}` })
})

router.post('/', validateBody(createHabitSchema), createHabit)
router.delete('/:id', (req, res) => {
  res.send({ message: `Deleted habit with id ${req.params.id}` })
})

router.post('/:id/complete', (req, res) => {    
  res.send({ message: `Completed habit with id ${req.params.id}` })
})

export default router