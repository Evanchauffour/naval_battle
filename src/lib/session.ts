import { jwtVerify } from 'jose'
import 'server-only'

const secretKey = process.env.JWT_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function decrypt(session: string | undefined = '') {
  try {
    if (!secretKey) {
      console.error('JWT_SECRET is not defined in environment variables')
      return undefined
    }

    if (!session) {
      console.error('No session token provided')
      return undefined
    }

    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.error('Failed to verify session:', error)
    return undefined
  }
}
