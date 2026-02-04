import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'

const router = Router()
router.use(authenticateToken)

router.get('/', (req, res) => {
  res.json({ message: 'users' })
})

router.get('/:id', (req, res) => {
  res.json({ message: `users with id ${req.params.id}` })
})

router.put('/:id', (req, res) => {
  res.json({ message: 'updated user' })
})

router.delete('/:id', (req, res) => {
  res.json({ message: `deleted user with id ${req.params.id}` })
})

export default router