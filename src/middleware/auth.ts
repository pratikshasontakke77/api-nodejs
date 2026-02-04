import type { NextFunction, Request, Response } from 'express'
import type { User } from '../db/schema.ts'
import { verifyToken, type JwtPayload } from '../utils/jwt.ts'

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const payload = await verifyToken(token)
    req.user = payload
    next()
  } catch (error) {
    res.status(403).json({ error: 'Forbidden' })
  }
}
