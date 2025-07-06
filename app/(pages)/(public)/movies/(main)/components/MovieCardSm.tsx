import { Star } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

interface Movie {
  poster_path: string;
  _id: string;
  title: string;
  release: Date;
  genres: string[];
  runtime: string;
  rating: string;
  language: string
}

const MovieCardSm = ({movie}: {movie: Movie}) => {
  return (
    <div 
      className='w-[90vw] sm:w-[45vw] md:w-[30vw] lg:w-[20vw] h-[50vh] shadow-2xl mt-6 rounded-xl overflow-hidden hover:translate-y-[-5px] transition-all duration-500'
    >
      <Link href={`/movies/${movie._id}`}>
        <div
            className='relative h-[90%] bg-cover group bg-center flex justify-center group overflow-hidden transform transition-transform duration-300 hover:scale-105 cursor-pointer'
        >
            <div className='flex flex-col absolute top-2 z-[11] group-hover:scale-95 transition-all duration-300 pointer-events-none'>
                <p className='text-white font-semibold text-2xl truncate text-shadow-[0px_0px_4px_rgb(255,255,255)]'>{movie.title}</p>
                <p className='text-gray-400 text-sm mt-1 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                    {new Date(movie.release).getFullYear()} • {movie.genres.slice(0, 2).join(' | ')} • {movie.runtime}
                </p>
            </div>
            <div
                className='absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out will-change-transform'
                style={{ 
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})`,
                    transform: `scale(1.3)`
                }}
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 z-10 transition-opacity duration-500 group-hover:opacity-10'></div>
        </div>
      </Link>

      <div className='h-[20%] bg-[#33312d] relative top-[-10%] rounded-2xl z-20 px-4 pt-6 pb-4 flex flex-col justify-end'>        
        <div className='flex justify-between items-center'>
          <Link href={`/movies/${movie._id}`}>
            <button className='cursor-pointer font-semibold rounded-full border-2 border-sky-400 px-4 py-2 text-white bg-sky-400 hover:bg-transparent transition-all duration-300 hover:scale-105'>
                Buy Ticket
            </button>
          </Link>
          <div className='flex gap-2 items-center'>
            <Star className='text-yellow-400 fill-sky-400' size={24} />
            <p className='text-white font-semibold text-lg'>{movie.rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCardSm