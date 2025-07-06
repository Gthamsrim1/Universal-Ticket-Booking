'use client'
import { Check, Plus, Clock, Calendar, Trash2, Send, DollarSign, IndianRupee } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import axios from "axios"

interface Movie {
  id: number
  title: string
  release_date: string
  poster_path: string
  overview: string
}

interface ShowData {
  movieId: number
  title: string
  poster_path: string
  showtimes: string[]
  dateFrom: string
  dateTo: string
  pricing: {
    regular: number
    premium: number
    vip: number
  }
}

const ClientMoviesList = ({ movies }: {movies: Movie[]}) => {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([])
  const [showData, setShowData] = useState<{[key: number]: ShowData}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addShowsRef = useRef<HTMLDivElement>(null)
  const movieCardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (movieCardsRef.current.length > 0) {
      gsap.fromTo(movieCardsRef.current, 
        { 
          opacity: 0, 
          y: 50, 
          scale: 0.8 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      )
    }
  }, [selectedMovies])

  const handleAddMovie = (movie: Movie) => {
    const isAlreadySelected = selectedMovies.find((m) => m.id === movie.id)
    
    if (!isAlreadySelected) {
      setSelectedMovies((prev) => [...prev, movie])
      setShowData(prev => ({
        ...prev,
        [movie.id]: {
          movieId: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          showtimes: [''],
          dateFrom: '',
          dateTo: '',
          pricing: {
            regular: 0,
            premium: 0,
            vip: 0
          }
        }
      }))
    } else {
      setSelectedMovies((prev) => prev.filter((m) => m.id !== movie.id))
      setShowData(prev => {
        const newData = { ...prev }
        delete newData[movie.id]
        return newData
      })
    }
  }

  const handleShowtimeChange = (movieId: number, index: number, value: string) => {
    setShowData(prev => ({
      ...prev,
      [movieId]: {
        ...prev[movieId],
        showtimes: prev[movieId].showtimes.map((time, i) => i === index ? value : time)
      }
    }))
  }

  const addShowtime = (movieId: number) => {
    setShowData(prev => ({
      ...prev,
      [movieId]: {
        ...prev[movieId],
        showtimes: [...prev[movieId].showtimes, '']
      }
    }))
  }

  const removeShowtime = (movieId: number, index: number) => {
    setShowData(prev => ({
      ...prev,
      [movieId]: {
        ...prev[movieId],
        showtimes: prev[movieId].showtimes.filter((_, i) => i !== index)
      }
    }))
  }

  const handlePriceChange = (movieId: number, tier: 'regular' | 'premium' | 'vip', value: string) => {
    const numValue = parseFloat(value) || 0
    setShowData(prev => ({
      ...prev,
      [movieId]: {
        ...prev[movieId],
        pricing: {
          ...prev[movieId].pricing,
          [tier]: numValue
        }
      }
    }))
  }

  const handleDateChange = (movieId: number, field: 'dateFrom' | 'dateTo', value: string) => {
    setShowData(prev => ({
      ...prev,
      [movieId]: {
        ...prev[movieId],
        [field]: value
      }
    }))
  }

  const validateShowData = (data: ShowData): boolean => {
    return data.showtimes.every(time => time.trim() !== '') && 
           data.dateFrom !== '' && 
           data.dateTo !== '' &&
           new Date(data.dateFrom) <= new Date(data.dateTo) &&
           data.pricing.regular > 0 &&
           data.pricing.premium > 0 &&
           data.pricing.vip > 0
  }

  const submitShows = async () => {
    setIsSubmitting(true)
    gsap.to('.submit-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    })

    try {
      const validShows = Object.values(showData).filter(validateShowData)
      
      if (validShows.length === 0) {
        alert('Please fill in all required fields for at least one movie.')
        setIsSubmitting(false)
        return
      }

      const promises = validShows.map(show => 
        axios.post('/api/movies', {
          movieId: show.movieId,
          title: show.title,
          poster_path: show.poster_path,
          showtimes: show.showtimes.filter(time => time.trim() !== ''),
          dateFrom: show.dateFrom,
          dateTo: show.dateTo,
          pricing: show.pricing,
          type: "add",
        })
      )

      await Promise.all(promises)
      gsap.to(addShowsRef.current, {
        backgroundColor: '#10b981',
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          setSelectedMovies([])
          setShowData({})
        }
      })
      
      alert('Shows added successfully!')
    } catch (error) {
      console.error('Error submitting shows:', error)
      alert('Error submitting shows. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeMovie = (movieId: number) => {
    const movieCard = movieCardsRef.current.find(card => 
      card?.getAttribute('data-movie-id') === movieId.toString()
    )
    
    if (movieCard) {
      gsap.to(movieCard, {
        opacity: 0,
        x: -100,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setSelectedMovies(prev => prev.filter(m => m.id !== movieId))
          setShowData(prev => {
            const newData = { ...prev }
            delete newData[movieId]
            return newData
          })
        }
      })
    }
  }

  return (
    <div className="p-8 text-white bg-black min-h-screen pl-64 pt-16">
      <h1 className="text-2xl font-bold mb-4">Now Playing</h1>
      <div className="overflow-x-auto custom-scroll">
        <div className="flex gap-6 min-w-max p-5">
          {movies.map((movie) => (
            <Link href={`/movies/${movie.id}`} key={movie.id}>
              <div
                className="relative h-64 w-[200px] flex-shrink-0 rounded-lg overflow-hidden bg-cover bg-center shadow-lg hover:scale-105 transition-all cursor-pointer"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
                }}
              >
                <div className="absolute inset-0 bg-black/60 p-4 flex flex-col justify-end hover:bg-black/20 group transition-all duration-300">
                  <div 
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddMovie(movie)
                    }} 
                    className="bg-red-400 rounded-full p-2 w-fit absolute top-0 opacity-0 group-hover:top-4 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer active:scale-95"
                  >
                    {!selectedMovies.find((m) => m.id === movie.id) ? <Plus /> : <Check />}
                  </div>
                  <h2 className="text-lg font-semibold truncate text-shadow-[1px_1px_8px_rgb(255,255,255)] transition-all duration-300">{movie.title}</h2>
                  <p className="text-sm text-gray-300 text-shadow-[1px_1px_4px_rgba(255,255,255,1)] group-hover:mb-1 transition-all duration-300">{movie.release_date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {selectedMovies.length > 0 && (
        <div ref={addShowsRef} className="text-white pt-8 bg-black min-h-screen">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Add Shows</h1>
            <button
              onClick={submitShows}
              disabled={isSubmitting}
              className="submit-btn bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200"
            >
              <Send size={20} />
              {isSubmitting ? 'Submitting...' : 'Submit All Shows'}
            </button>
          </div>

          <div className="space-y-6">
            {selectedMovies.map((movie, index) => (
              <div 
                key={movie.id}
                ref={el => {
                  if (el) movieCardsRef.current[index] = el
                }}
                data-movie-id={movie.id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-gray-700"
              >
                <div className="flex gap-6">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded-lg shadow-md"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">{movie.title}</h2>
                        <p className="text-sm text-gray-400">{movie.release_date}</p>
                      </div>
                      <button
                        onClick={() => removeMovie(movie.id)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-900/20 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-3">
                          <Clock size={16} />
                          Showtimes
                        </label>
                        <div className="space-y-2">
                          {showData[movie.id]?.showtimes.map((time, timeIndex) => (
                            <div key={timeIndex} className="flex gap-2">
                              <input
                                type="time"
                                value={time}
                                onChange={(e) => handleShowtimeChange(movie.id, timeIndex, e.target.value)}
                                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none flex-1"
                              />
                              {showData[movie.id]?.showtimes.length > 1 && (
                                <button
                                  onClick={() => removeShowtime(movie.id, timeIndex)}
                                  className="text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-900/20 transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => addShowtime(movie.id)}
                            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
                          >
                            <Plus size={16} />
                            Add Showtime
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-3">
                          <Calendar size={16} />
                          Show Period
                        </label>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">From Date</label>
                            <input
                              type="date"
                              value={showData[movie.id]?.dateFrom || ''}
                              onChange={(e) => handleDateChange(movie.id, 'dateFrom', e.target.value)}
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">To Date</label>
                            <input
                              type="date"
                              value={showData[movie.id]?.dateTo || ''}
                              onChange={(e) => handleDateChange(movie.id, 'dateTo', e.target.value)}
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-3">
                          <IndianRupee size={16} />
                          Ticket Pricing
                        </label>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Regular</label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="0"
                              value={showData[movie.id]?.pricing.regular || ''}
                              onChange={(e) => handlePriceChange(movie.id, 'regular', e.target.value)}
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Premium</label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="0"
                              value={showData[movie.id]?.pricing.premium || ''}
                              onChange={(e) => handlePriceChange(movie.id, 'premium', e.target.value)}
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">VIP</label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="0"
                              value={showData[movie.id]?.pricing.vip || ''}
                              onChange={(e) => handlePriceChange(movie.id, 'vip', e.target.value)}
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 mt-4 line-clamp-2">{movie.overview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientMoviesList