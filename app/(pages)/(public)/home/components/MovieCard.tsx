'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

interface Movie {
  poster_path: string;
  _id: string;
  title: string;
  release: Date;
  genres: string[];
  runtime: string;
  rating: string;
  language: string;
}

const MovieCard = ({ movie, scrollOffset, clickPrevented, length }: { movie: Movie; scrollOffset: number, clickPrevented: boolean, length: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [scale, setScale] = useState(0);
  const router = useRouter();

    useEffect(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const cardCenterX = rect.left + rect.width / 2;
        const distance = (cardCenterX - centerX) / window.innerWidth;
        
        const newOffset = distance * 100;
        const maxScale = 1.1;
        const minScale = 0.8;
        const normalizedDistance = Math.min(Math.abs(distance), 1);
        const newScale = maxScale - (maxScale - minScale) * normalizedDistance;

        setScale(newScale);
        if (Math.abs(parallaxOffset - newOffset) > 0.1) {
          setParallaxOffset(newOffset);
        }
      }
    }, [scrollOffset]);

  const handleClick = () => {
    if (!clickPrevented) {
      router.push(`/movies/${movie._id}`);
    }
  };

  return (
    <div 
      ref={cardRef}
      className='w-[90vw] sm:w-[45vw] md:w-[30vw] lg:w-[20vw] h-[70vh] shadow-2xl mt-6 rounded-xl overflow-hidden'
      style={{
        transform: `scale(${length > 5 ? scale : 1})`
      }}
    >
      <div
        onClick={handleClick}
        className='relative h-[70%] bg-cover group overflow-hidden transform transition-transform duration-300 scale-[0.98] hover:scale-[1] cursor-pointer'
      >
        <div
          className='absolute inset-0 bg-cover bg-top-left transition-transform duration-700 ease-out will-change-transform'
          style={{ 
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})`,
            transform: `translateX(${parallaxOffset}px) scale(1.3)`
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 z-10 transition-opacity duration-500 group-hover:opacity-10'></div>
      </div>

      <div className='h-[30%] bg-[#33312d] relative z-20 px-4 pt-6 pb-4 flex flex-col justify-end'>
        <img className='absolute top-[-95%] left-0 w-full pointer-events-none' src="/wave-haikei.svg" alt="wave" />
        <div className='relative top-[-40%]'>
          <p className='text-white font-semibold text-2xl truncate z-10'>{movie.title}</p>
          <p className='text-gray-400 text-sm mt-1 z-10'>
            {new Date(movie.release).getFullYear()} • {movie.genres.slice(0, 2).join(' | ')} • {movie.runtime}
          </p>
        </div>
        
        <div className='flex justify-between items-center'>
          <button onClick={handleClick} className='cursor-pointer font-semibold rounded-full border-2 border-sky-400 px-4 py-2 text-white bg-sky-400 hover:bg-transparent transition-all duration-300 hover:scale-105'>
            Buy Ticket
          </button>
          <div className='flex gap-2 items-center'>
            <Star className='text-yellow-400 fill-sky-400' size={24} />
            <p className='text-white font-semibold text-lg'>{movie.rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
