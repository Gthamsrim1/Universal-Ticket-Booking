'use client'
import React, { useEffect, useState } from 'react'
import MovieCardSm from './components/MovieCardSm';
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

const page = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

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
    <div className='min-h-[80vh] relative py-30 pb-60 bg-black px-20'>
      <h1 className='text-white font-semibold text-2xl text-shadow-[0px_0px_16px_rgb(255,255,255)]'>Now Showing</h1>
      <div className='absolute h-58 w-58 bg-sky-400/30 top-[100px] left-0 blur-3xl'></div>
      <div className='absolute h-58 w-58 bg-sky-400/30 top-[500px] right-[10px] blur-3xl'></div>
      <div className='absolute h-58 w-58 bg-sky-400/30 top-[900px] left-[300px] blur-3xl'></div>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {movies.map((movie, i) => (
          <MovieCardSm movie={movie} />
        ))}
      </div>
    </div>
  )
}

export default page