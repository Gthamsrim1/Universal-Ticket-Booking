'use client'

import { Play } from 'lucide-react'
import React, { useRef, useState } from 'react'
import ReactPlayer from 'react-player/youtube'

const Trailers = () => {
  const playerRef = useRef(null)

  const trailers = [
    {
      title: 'Guardians of the Galaxy Vol. 3',
      url: 'https://www.youtube.com/watch?v=u3V5KDHRQvk',
      thumb: 'https://i.ytimg.com/vi/u3V5KDHRQvk/maxresdefault.jpg',
    },
    {
      title: 'Avengers: Endgame',
      url: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
      thumb: 'https://i.ytimg.com/vi/TcMBFSGVi1c/maxresdefault.jpg',
    },
    {
      title: 'Spider-Man: No Way Home',
      url: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
      thumb: 'https://i.ytimg.com/vi/JfVOs4VSpmA/maxresdefault.jpg',
    },
    {
      title: 'Doctor Strange: Multiverse of Madness',
      url: 'https://www.youtube.com/watch?v=aWzlQ2N6qqg',
      thumb: 'https://i.ytimg.com/vi/aWzlQ2N6qqg/maxresdefault.jpg',
    },
    {
      title: 'Black Panther: Wakanda Forever',
      url: 'https://www.youtube.com/watch?v=_Z3QKkl1WyM',
      thumb: 'https://i.ytimg.com/vi/_Z3QKkl1WyM/maxresdefault.jpg',
    },
  ]

  const [currentTrailer, setCurrentTrailer] = useState(trailers[0])

  return (
    <div className='relative w-full py-16 px-4 sm:px-8 min-h-screen overflow-hidden bg-gradient-to-b from-black/70 via-black/40 to-black/70'>
      <div className='absolute inset-0'>
        <div className='absolute top-[10%] left-[5%] w-96 h-96 bg-gradient-to-r from-cyan-400/30 to-blue-600/30 rounded-full blur-3xl animate-pulse opacity-70' />
        <div className='absolute top-[60%] right-[5%] w-80 h-80 bg-gradient-to-r from-purple-500/40 to-pink-600/40 rounded-full blur-3xl animate-pulse opacity-80' 
             style={{animationDelay: '1s'}} />
        <div className='absolute bottom-[20%] left-[30%] w-64 h-64 bg-gradient-to-r from-emerald-400/35 to-teal-600/35 rounded-full blur-2xl animate-pulse opacity-75'
             style={{animationDelay: '2s'}} />
        
        <div className='absolute top-[0%] left-[0%] w-[60px] h-[60px] blur-2xl bg-white/60 rounded-full ball-bounce'
             style={{animationDelay: '0.5s', animationDuration: '3s'}} />
        <div className='absolute top-[0%] right-[0%] w-[60px] h-[60px] blur-2xl bg-cyan-300/70 rounded-full ball-bounce'
             style={{animationDelay: '1.5s', animationDuration: '4s'}} />
        <div className='absolute bottom-[10%] right-[40%] w-[60px] h-[60px] blur-2xl bg-purple-300/60 rounded-full ball-bounce'
             style={{animationDelay: '2.5s', animationDuration: '2.5s'}} />
        
        <div className='absolute inset-0 opacity-10'>
          <div className='w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent'
               style={{
                 backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                 backgroundSize: '50px 50px'
               }} />
        </div>
      </div>

      <div className='relative z-10 text-center mb-12'>
        <div className='inline-block backdrop-blur-lg bg-white/10 rounded-2xl px-4 py-2 border border-white/20 shadow-2xl'>
          <h1 className='text-2xl md:text-3xl font-semibold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl'>
            Featured Trailers
          </h1>
          <div className='w-24 h-1 bg-gradient-to-r from-cyan-400/80 to-purple-500/80 mx-auto mt-3 rounded-full' />
        </div>
      </div>

      <div className='relative z-10 flex justify-center mb-12'>
        <div className='relative group'>
          <div className='absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300' />
          <div className='relative backdrop-blur-sm bg-black/20 rounded-2xl p-2 border border-white/20'>
            <ReactPlayer
              ref={playerRef}
              url={currentTrailer.url}
              controls
              width='70vw'
              height='40vw'
              className='rounded-xl overflow-hidden'
              playing
              muted
            />
          </div>
        </div>
      </div>

      <div className='relative z-10 max-w-6xl mx-auto'>
        <div className='backdrop-blur-lg bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
            {trailers.map((trailer, index) => (
              <div
                key={index}
                onClick={() => setCurrentTrailer(trailer)}
                className={`group cursor-pointer relative transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 ${
                  currentTrailer.url === trailer.url
                    ? 'scale-105 -translate-y-1'
                    : ''
                }`}
              >
                <div className={`absolute -inset-0.5 rounded-xl transition-all duration-300 ${
                  currentTrailer.url === trailer.url
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-500 opacity-100 blur-sm'
                    : 'bg-gradient-to-r from-gray-400 to-gray-600 opacity-0 group-hover:opacity-60 blur-sm'
                }`} />
                
                <div className='relative backdrop-blur-sm bg-black/40 rounded-xl overflow-hidden border border-white/20 shadow-xl'>
                  <div className='relative overflow-hidden'>
                    <img
                      src={trailer.thumb}
                      alt={trailer.title}
                      className='w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300' />

                    <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300'>
                      <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:scale-110 transition-all duration-300'>
                        <Play className='fill-white' />
                      </div>
                    </div>
                  </div>
                  
                  <div className='p-3'>
                    <p className={`text-sm font-medium transition-colors truncate duration-300 ${
                      currentTrailer.url === trailer.url
                        ? 'text-cyan-300'
                        : 'text-white group-hover:text-cyan-200'
                    }`}>
                      {trailer.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/50 to-transparent pointer-events-none' />
    </div>
  )
}

export default Trailers