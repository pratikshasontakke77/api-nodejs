import request from 'supertest'
import { app } from '../src/server.ts'
import env from '../env.ts'
import {
  createTestHabit,
  cleanupDatabase,
  createTestUser,
} from './setup/dbHelpers.ts'
import { desc } from 'drizzle-orm'

describe('Authentication endpoints ', () => {
  afterEach(async () => {
    await cleanupDatabase()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'adminpassword123',
        firstname: 'Test',
        lastname: 'User',
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
      expect(response.status).toBe(201)

      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('token')
      expect(response.body.user).not.toHaveProperty('password')
    })
  })

  describe('POST /api/auth/login', () => {
   it('should login with valid credentials', async () => {
      const { user, rawPassword } = await createTestUser()
      const userData = {
        email: user.email,
        password: rawPassword,
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(userData)
      expect(response.status).toBe(200)

      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('token')
      expect(response.body.user).not.toHaveProperty('password')
      expect(response.body).toHaveProperty('message')
    })
  })
})
