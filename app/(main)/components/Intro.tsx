'use client'

import React, { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

interface IntroProps {
  className?: string
}

const Intro: React.FC<IntroProps> = ({ className = '' }) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    gsap.set(overlay, {
      transformOrigin: 'bottom right',
      transform: 'translate(10%, 80%) rotate(45deg)',
      opacity: 1
    })
  }, [])

  const handleExploreClick = (): void => {
    const overlay = overlayRef.current
    if (!overlay) return

    gsap.to(overlay, {
      duration: 3,
      ease: 'linear',
      transform: 'translate(-70%, 0%) rotate(45deg)',
      opacity: 1,
      onComplete: () => {
        router.push('/home')
      },
    })
  }

  const handleEventsClick = (): void => {
    router.push('/events')
  }

  return (
    <div className={`absolute top-0 left-0 h-full w-full pl-10 flex items-center overflow-hidden ${className}`}>
      <div
        ref={overlayRef}
        className='fixed w-[200vw] h-[200vw] bg-gradient-to-br opacity-0 from-orange-500 to-orange-600 z-50 pointer-events-none shadow-2xl'
      >
        <div className='fixed w-[5vw] h-[200vw] bg-orange-800 z-50 pointer-events-none shadow-2xl'></div>
        <div className='fixed w-[5vw] h-[200vw] bg-orange-900 z-50 pointer-events-none shadow-2xl ml-[5vw]'></div>
      </div>

      <div className='flex flex-col gap-10 z-10 max-w-4xl'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-white text-5xl font-bold flex flex-wrap items-center gap-2 text-shadow-[1px_1px_16px_rgb(255,255,255)]'>
            <span className='text-yellow-300 hover:text-yellow-200 transition-colors duration-300 text-shadow-[0px_0px_16px_rgb(255,255,0)]'>Manage</span>,
            <span className='text-yellow-300 hover:text-yellow-200 transition-colors duration-300 text-shadow-[0px_0px_16px_rgb(255,255,0)]'>Book</span>, and
            <span className='text-yellow-300 hover:text-yellow-200 transition-colors duration-300 text-shadow-[0px_0px_16px_rgb(255,255,0)]'>Travel</span>
            <span>— All from One App</span>
          </h1>

          <div className='text-neutral-400 text-lg font-medium leading-relaxed'>
            <p>
              Real-time booking for cinema, concerts, and trains — with smart seat maps, instant payments,
            </p>
            <p>and PDF ticket downloads.</p>
          </div>
        </div>

        <div className='flex gap-4 flex-wrap'>
          <button
            onClick={handleExploreClick}
            className='group cursor-pointer rounded-full border-2 border-white px-6 py-3 w-fit text-white text-xl font-semibold hover:bg-white hover:text-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/25'
            aria-label='Explore the app'
          >
            <span className='flex items-center gap-2'>
              Explore
              <span className='group-hover:translate-x-1 transition-transform duration-300' aria-hidden='true'>
                →
              </span>
            </span>
          </button>

          <button
            onClick={handleEventsClick}
            className='group cursor-pointer rounded-full border-2 border-sky-400 px-6 py-3 w-fit text-sky-400 text-xl font-semibold bg-sky-400/10 hover:bg-sky-400 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-400/25 backdrop-blur-sm'
            aria-label='View events'
          >
            <span className='flex items-center gap-2'>
              Events
              <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse' aria-hidden='true' />
            </span>
          </button>
        </div>

        <div className='flex gap-8 text-neutral-500 text-sm font-medium mt-4' role='list'>
          <div className='flex items-center gap-2' role='listitem'>
            <div className='w-2 h-2 bg-yellow-300 rounded-full' aria-hidden='true' />
            <span>Real-time Updates</span>
          </div>
          <div className='flex items-center gap-2' role='listitem'>
            <div className='w-2 h-2 bg-green-400 rounded-full' aria-hidden='true' />
            <span>Instant Booking</span>
          </div>
          <div className='flex items-center gap-2' role='listitem'>
            <div className='w-2 h-2 bg-blue-400 rounded-full' aria-hidden='true' />
            <span>Digital Tickets</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Intro
