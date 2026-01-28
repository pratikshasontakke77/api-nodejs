import type { Request, Response } from 'express'
import { generateToken } from '.././utils/jwt.ts'
import { comparePassword, hashPassword } from '../utils/password.ts'
import { users, type NewUser } from '../db/schema.ts'
import { db } from '../db/connection.ts'

export const register = async (req: Request<any, any, NewUser>, res: Response) => {
  try {
    const { password } = req.body
    const hashedPassword = await hashPassword(password)
    const [user] = await db.insert(users).values({
      ...req.body,
      password: hashedPassword,
    })
    .returning(
        {
            id:users.id,
            email:users.email,
            username:users.username,
            firstName:users.firstName,
            lastName:users.lastName,
            createdAt:users.createdAt,
        }
    )
    const token = await generateToken({ id: user.id, email: user.email, username: user.username })
    return res.status(201).json({ message: "User created!", user, token })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const login = async (req: Request, res: Response) => {
try {
  const { email, password } = req.body;
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = await generateToken({ id: user.id, email: user.email, username: user.username });
  return res.status(200).json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    },
    token,
  })
}
catch (error) {
    res.status(500).json({ error: "Failed to login" });
}
}
