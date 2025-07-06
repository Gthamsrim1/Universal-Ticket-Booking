'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('curAdminUser')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        if (user?.id) {
          router.replace(`/admin/${user.id}`)
        } else {
          router.replace('/admin/login')
        }
      } catch {
        router.replace('/admin/login')
      }
    } else {
      router.replace('/admin/login')
    }
  }, [router])

  return null
}

export default page
