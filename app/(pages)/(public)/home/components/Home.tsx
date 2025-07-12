'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

const Home = () => {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    gsap.set(overlay, {
      transform: 'translate(-100%, -150%) rotate(225deg)',
      transformOrigin: 'bottom right',
      opacity: 1,
      left: 0,
    })

    gsap.to(overlay, {
      duration: 3,
      ease: 'linear',
      transform: 'translate(-150%, -200%) rotate(225deg)',
      opacity: 1,
      left: 0,
    })
  }, [])

  return (
    <div className='h-screen w-screen overflow-x-hidden'>
      <div
        ref={overlayRef}
        className='fixed w-[200vw] h-[200vw] bg-gradient-to-br left-[-10vw] from-orange-500 to-orange-600 z-[1011] pointer-events-none shadow-2xl'
      >
        <div className='fixed w-[5vw] h-[200vw] bg-orange-800 z-50 pointer-events-none shadow-2xl'></div>
        <div className='fixed w-[5vw] h-[200vw] bg-orange-900 z-50 pointer-events-none shadow-2xl ml-[5vw]'></div>
      </div>

      <div className='bg-radial from-black/30 to-black/95 h-screen w-screen absolute z-40 pointer-events-none'></div>

      <div className='flex gap-[0.5%] h-screen w-screen'>
        <div className='absolute z-[41] text-transparent bg-white top-[40vh] left-[7vw] bg-clip-text text-5xl font-semibold font-poppins text-shadow-[1px_1px_64px_rgb(255,255,255)] flex flex-col items-center'>
          <h1 className='flex'>
            From movies to trains to events —
            <p className='pl-3 text-[rgb(0,255,255)] text-shadow-[1px_1px_32px_rgb(0,255,255)]'>
              book it all in one place
            </p>
            .
          </h1>
          <h1>Watch anywhere, Watch everywhere.</h1>
        </div>

        <div className='bg-[url(/GOTG.jpg)] bg-center bg-cover h-screen w-[33%]'>
          <div className='h-full w-full flex justify-center items-end pb-20'>
            <button className='text-white absolute z-[41] cursor-pointer rounded-full border-4 border-white px-5 py-2 w-fit text-xl hover:bg-white hover:text-black transition-all duration-500'>
              Explore Movies →
            </button>
          </div>
        </div>

        <div className='bg-[url(/concert.jpg)] bg-left bg-cover h-screen w-[33%]'>
          <div className='h-full w-full flex justify-center items-end pb-20'>
            <button className='text-white absolute z-[41] cursor-pointer rounded-full border-4 border-white px-5 py-2 w-fit text-xl hover:bg-white hover:text-black transition-all duration-500'>
              Explore Events →
            </button>
          </div>
        </div>

        <div className='bg-[url(/train.jpg)] bg-left bg-cover h-screen w-[33%]'>
          <div className='h-full w-full flex justify-center items-end pb-20'>
            <button className='text-white absolute z-[41] cursor-pointer rounded-full border-4 border-white px-5 py-2 w-fit text-xl hover:bg-white hover:text-black transition-all duration-500'>
              Explore Destinations →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
