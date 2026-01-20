import { Router } from 'express'
import {z} from 'zod';
import { validateBody } from '../middleware/validation.ts';

const createHabitSchema = z.object({
  name: z.string(),
})
const router = Router()

router.get('/', (req, res) => {
  res.send({ message: 'Fetched all habits' })
})

router.get('/:id', (req, res) => {
  res.send({ message: `Fetched habit with id ${req.params.id}` })
})

router.post('/', validateBody(createHabitSchema), (req, res) => {
  res.send({ message: 'Created a new habit' })
})

router.delete('/:id', (req, res) => {
  res.send({ message: `Deleted habit with id ${req.params.id}` })
})

router.post('/:id/complete', (req, res) => {    
  res.send({ message: `Completed habit with id ${req.params.id}` })
})

export default router