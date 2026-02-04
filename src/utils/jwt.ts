import { createSecretKey } from 'crypto'
import env from '../../env.ts'
import { jwtVerify, SignJWT } from 'jose'
export interface JwtPayload {
  id: string
  email: string
  username: string
}

export const generateToken = async (payload: JwtPayload) => {
  const secret = env.JWT_SECRET
  const secretKey = createSecretKey(secret, 'utf-8')

  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN || '7d')
    .sign(secretKey)
}

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const secretKey = createSecretKey(env.JWT_SECRET, 'utf-8')
  const { payload } = await jwtVerify(token, secretKey)
  return payload as unknown as JwtPayload
}
  