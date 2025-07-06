'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Languages } from 'lucide-react';
import Link from 'next/link';
import MovieCard from './MovieCard'
import axios from 'axios';

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

const Movies = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);
  const momentumRef = useRef<number | null>(null);
  const lastX = useRef(0);
  const lastMoveTime = useRef(0);
  const [clickPrevented, setClickPrevented] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollOffset(scrollContainerRef.current.scrollLeft);
      updateScrollButtons();
    }
  };

  const scrollToNext = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth * 0.25;
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollToPrev = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth * 0.25;
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setClickPrevented(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    lastX.current = e.pageX;
    lastMoveTime.current = performance.now();
    if (momentumRef.current) cancelAnimationFrame(momentumRef.current);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

const handleMouseMove = (e: React.MouseEvent) => {
  if (!isDragging || !scrollContainerRef.current) return;

  const dx = e.pageX - lastX.current;
  if (Math.abs(dx) > 5) {
    setClickPrevented(true);
  }

  const x = e.pageX;
  const now = performance.now();
  const dt = now - lastMoveTime.current;
  velocityRef.current = dx / dt * 16;

  lastX.current = x;
  lastMoveTime.current = now;

  scrollContainerRef.current.scrollLeft -= dx;
};

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
    applyMomentum();
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
    applyMomentum();
  };

  const applyMomentum = () => {
    if (!scrollContainerRef.current) return;
    const step = () => {
      if (!scrollContainerRef.current) return;

      scrollContainerRef.current.scrollLeft -= velocityRef.current;
      velocityRef.current *= 0.95;

      if (Math.abs(velocityRef.current) > 0.5) {
        momentumRef.current = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(momentumRef.current!);
        momentumRef.current = null;
      }
    };

    momentumRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    updateScrollButtons();
  }, []);

  useEffect(() => {
    return () => {
      if (momentumRef.current) cancelAnimationFrame(momentumRef.current);
    };
  }, []);

  useEffect(() => {
    axios.post("http://localhost:3000/api/movies", {type: "list"})
    .then(result => {
      const data = result.data;
      setMovies(data.movies);
    })
    .catch(error => {
      console.log(error)
    })
  }, [])

  return (
    <div className='relative w-full py-8 px-4 sm:px-8 h-fit min-h-[80vh]'>
      <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 z-0'></div>

      <div className='relative z-10'>
        <div className='flex justify-between items-center mb-6'>
          <div className='absolute h-58 w-58 bg-blue-400/30 top-5 blur-3xl'></div>
          <h1 className='text-white text-3xl sm:text-4xl font-bold'>
            Up and Coming Movies
          </h1>
          <div className='flex gap-10 items-center'>
            <div className='absolute h-58 w-58 bg-red-400/30 top-10 blur-3xl'></div>
            <Link href='/movies'><p className='text-gray-400 hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer'>Show More →</p></Link>
            <div className='flex gap-2'>
              <button
                onClick={scrollToPrev}
                disabled={!canScrollLeft}
                className={`p-3 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 ${
                  canScrollLeft 
                    ? 'bg-white/10 hover:bg-white/20 text-white hover:scale-110' 
                    : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={scrollToNext}
                disabled={!canScrollRight}
                className={`p-3 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 ${
                  canScrollRight 
                    ? 'bg-white/10 hover:bg-white/20 text-white hover:scale-110' 
                    : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className='flex gap-[40px] overflow-x-auto overflow-y-hidden pb-[30px] px-[24px] cursor-grab select-none'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {movies.map((movie, i) => (
            <div key={i} className='shrink-0'>
              <MovieCard
                movie={movie}
                scrollOffset={scrollOffset}
                clickPrevented={clickPrevented}
                length={movies.length}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Movies;