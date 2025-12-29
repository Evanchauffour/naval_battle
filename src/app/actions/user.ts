"use server"

import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  name?: string
  username?: string
  firstName?: string
  lastName?: string
  isVerified?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  if (!accessToken) {
    return null
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) {
      console.error('Failed to fetch user')
      return null
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}
