'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('curVendorUser')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        if (user?.id) {
          router.replace(`/vendor/${user.id}`)
        } else {
          router.replace('/vendor/login')
        }
      } catch {
        router.replace('/vendor/login')
      }
    } else {
      router.replace('/vendor/login')
    }
  }, [router])

  return null
}

export default page
