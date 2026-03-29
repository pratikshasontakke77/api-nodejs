import {
  createTestUser,
  createTestHabit,
  cleanupDatabase,
} from './dbHelpers.ts'

describe('setup', () => {
  it('should create a test user', async () => {
    const { user, token } = await createTestUser()
    expect(user).toBeDefined()
    expect(token).toBeDefined()
    await cleanupDatabase()
  })
})
