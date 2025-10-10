"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const logout = async () => {
  const cookieStore = await cookies()
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookieStore.get('accessToken')?.value}`,
      },
    })
    if (res.ok) {
      cookieStore.delete('accessToken')
      redirect('/signin')
    } else {
      console.error('Failed to logout')
      return { error: 'Failed to logout' }
    }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to logout' }
  }
}
