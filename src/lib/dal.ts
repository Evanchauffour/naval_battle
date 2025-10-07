import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { decrypt } from './session'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('accessToken')?.value
  const session = await decrypt(cookie)

  console.log(session)

  if (!session?.id) {
    redirect('/signin')
  }

  return { isAuth: true, userId: session.id }
})
