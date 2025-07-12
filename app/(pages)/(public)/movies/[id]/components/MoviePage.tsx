'use client'
import { GetServerSideProps } from 'next';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import ReactPlayer from 'react-player/youtube';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../../../events/components/PaymentForm';
import { loadStripe } from '@stripe/stripe-js';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("Stripe public key is not set.");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Movie {
  backdrop_path: string;
  _id: string;
  title: string;
  release: Date;
  genres: string[];
  runtime: string;
  rating: string;
  language: string;
  cast: CastMember[];
  trailerUrl: string;
  showPeriod: {
    from: string,
    to: string,
  },
  pricingTiers: {
    regular: number;
    premium: number;
    vip: number;
  };
  showtimes: {
    theater: string;
    times: string[];
  }[];
}

interface CastMember {
  name: string;
  photo: string;
}

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'booked';
  price: number;
  type: 'regular' | 'premium' | 'vip';
}

interface ShowTime {
  id: string;
  time: string;
  date: string;
  price: number;
}

export default function MoviePage({ movie }: { movie: Movie }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<ShowTime | null>(null);
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seatMap, setSeatMap] = useState<Record<string, Seat[]>>({});

  const [bookingStep, setBookingStep] = useState<'showtime' | 'seats' | 'payment' | 'confirmation'>('showtime');
  
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const trailerRef = useRef<HTMLDivElement>(null);
  const castRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const seatMapRef = useRef<HTMLDivElement>(null);

  const showtimes: ShowTime[] = movie.showtimes?.flatMap((entry, index) =>
    entry.times.map((time, timeIndex) => ({
      id: `${index}-${timeIndex}`,
      time,
      date: 'Today',
      price: movie.pricingTiers.regular
    }))
  ) ?? [];
  const generateSeats = (base: number): Seat[] => {
      const seatData: Seat[] = [];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      
      rows.forEach((row, rowIndex) => {
        const seatsPerRow = row <= 'B' ? 12 : row <= 'E' ? 14 : 16;
        const seatType = row <= 'B' ? 'vip' : row <= 'E' ? 'premium' : 'regular';
        const basePrice = seatType === 'vip' ? 499 : seatType === 'premium' ? 399 : base;
        
        for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
          const isBooked = false;
          
          seatData.push({
            id: `${row}${seatNum}`,
            row,
            number: seatNum,
            status: isBooked ? 'booked' as const : 'available' as const,
            price: basePrice,
            type: seatType
          });
        }
      });
      
      return seatData;
    };

  useEffect(() => {
    const initialMap: Record<string, Seat[]> = {};
    showtimes.forEach((show) => {
      initialMap[show.id] = generateSeats(show.price);
    });
    setSeatMap(initialMap);
  }, []);


  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, detailsRef.current], { opacity: 0, y: 50 });
      gsap.set(backdropRef.current, { scale: 1.1, opacity: 0 });

      const tl = gsap.timeline();
      
      tl.to(backdropRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out"
      })
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=1")
      .to(detailsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5");

      gsap.fromTo(trailerRef.current, 
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: trailerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      const castCards = castRef.current?.querySelectorAll('.cast-card');
      if (castCards) {
        gsap.fromTo(castCards,
          { opacity: 0, y: 50, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.1,
            scrollTrigger: {
              trigger: castRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      gsap.fromTo(sidebarRef.current,
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sidebarRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      const genreTags = document.querySelectorAll('.genre-tag');
      genreTags.forEach((tag, index) => {
        gsap.to(tag, {
          y: -5,
          duration: 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.2
        });
      });

      if (showSeatMap && seatMapRef.current) {
        gsap.fromTo(seatMapRef.current,
          { opacity: 0, scale: 0.8, y: 50 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
          }
        );
      }

    });

    return () => ctx.revert();
  }, [showSeatMap]);

  const handleShowtimeSelect = (showtime: ShowTime) => {
    setSelectedShowtime(showtime);
    setBookingStep('seats');
    setShowSeatMap(true);

    setSeatMap((prevMap) => {
      if (!prevMap[showtime.id]) {
        return {
          ...prevMap,
          [showtime.id]: generateSeats(showtime.price)
        };
      }
      return prevMap;
    });

    gsap.to('.showtime-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  };



  const handleSeatClick = (seat: Seat) => {
    if (!selectedShowtime) return;

    setSeatMap(prev => {
      const currentSeats = prev[selectedShowtime.id] || [];
      const updatedSeats = currentSeats.map(s => {
        if (s.id === seat.id) {
          const newStatus = s.status === 'selected' ? 'available' as const : 'selected' as const;
          setTicketQuantity(q => newStatus === 'selected' ? q + 1 : q - 1);
          return { ...s, status: newStatus };
        }
        return s;
      });

      setSelectedSeats(updatedSeats.filter(s => s.status === 'selected'));

      return {
        ...prev,
        [selectedShowtime.id]: updatedSeats
      };
    });

    gsap.to(`#seat-${seat.id}`, {
      scale: 1.1,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  };



  const handleProceedToPayment = async () => {
    try {
      const res = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              amount: Number(getTotalPrice().toFixed(2)) * 100,
              movieId: movie._id,
              ticketCount: ticketQuantity, 
            }),
          });

      const data = await res.json();
      setClientSecret(data.clientSecret);
      setShowSeatMap(false)
      setBookingStep('payment');
    } catch (error) {
      console.log(error);
    }
  };



  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSeatColor = (seat: Seat) => {
    switch (seat.status) {
      case 'booked':
        return 'bg-red-500 cursor-not-allowed';
      case 'selected':
        return 'bg-green-500 border-green-300';
      case 'available':
        switch (seat.type) {
          case 'vip':
            return 'bg-purple-600 hover:bg-purple-500 border-purple-400';
          case 'premium':
            return 'bg-blue-600 hover:bg-blue-500 border-blue-400';
          default:
            return 'bg-gray-600 hover:bg-gray-500 border-gray-400';
        }
    }
  };

  const handlePaymentSuccess = async () => {
    if (movie) {
      try {
        const stored = localStorage.getItem('curUser');
        const curUser = stored ? JSON.parse(stored) : null;
        const d = new Date();

        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: curUser.user,
            email: curUser.email,
            seats: selectedSeats.map(s => s.id),
            bookingTime: `${d.getHours()}:${d.getMinutes()}`,
            bookingDate: d,
            experience: movie._id,
            experienceType: 'movie',
            date: '2024-07-15',
            time: movie.showtimes[0],
            price: Number(getTotalPrice().toFixed(2)),
            type: 'booking',
          }),
        });        
        setBookingStep('confirmation');
        if (!selectedShowtime) return;

        const updatedSeats = (seatMap[selectedShowtime.id] || []).map(seat =>
          selectedSeats.some(s => s.id === seat.id)
            ? { ...seat, status: 'booked' as const}
            : seat
        );
        setSeatMap(prev => ({
          ...prev,
          [selectedShowtime.id]: updatedSeats
        }));

        setSelectedSeats([]);
        setTicketQuantity(0);
        setShowSeatMap(false);
      } catch (error) {
        console.error('Error saving booking:', error);
      }
    }
  };

  if (!movie) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-x-hidden flex justify-center items-center'>
      <div className="flex flex-row gap-2 scale-200">
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
    );
  }

  return (
    <>
      <Head>
        <title>{movie.title} - Movie Details</title>
        <meta
          name="description"
          content={`Watch ${movie.title} - ${Array.isArray(movie.genres) ? movie.genres.join(', ') : ''}`}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-900 text-white overflow-x-hidden">
        <div ref={heroRef} className="relative w-full h-[700px]">
          <div ref={backdropRef} className="absolute inset-0">
            <Image
              src={movie.backdrop_path}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-center px-12 z-10">
            <h1 ref={titleRef} className="text-7xl font-black mb-8 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              {movie.title}
            </h1>
            <div ref={detailsRef} className="flex items-center gap-8 text-xl">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-4 py-2 rounded-full font-bold shadow-lg">
                {movie.rating}
              </span>
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                {formatDate(movie.release)}
              </span>
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                {movie.runtime}
              </span>
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 capitalize">
                {movie.language}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid lg:grid-cols-3 gap-16">
          <div className='absolute h-58 w-58 bg-sky-400/30 top-[120vh] left-0 blur-3xl'></div>
          <div className='absolute h-58 w-58 bg-sky-400/30 top-[150vh] right-[10px] blur-3xl'></div>
          <div className='absolute h-58 w-58 bg-sky-400/30 top-[200vh] left-[300px] blur-3xl z-0'></div>
          
          <div className="lg:col-span-2 space-y-16">
            <div ref={trailerRef}>
              <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Watch Trailer
              </h2>
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-sm">
                <ReactPlayer 
                  url={movie.trailerUrl} 
                  width="100%" 
                  height="100%" 
                  controls={true} 
                  playing={true} 
                  muted={true}
                />
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Movie Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 text-lg">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <h3 className="font-bold text-purple-300 mb-4 text-xl">Genres</h3>
                  <div className="flex flex-wrap gap-3">
                    {Array.isArray(movie.genres) &&
                      movie.genres.map((genre, index) => (
                        <span key={index}>{genre}</span>
                      ))
                    }
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <h3 className="font-bold text-purple-300 mb-4 text-xl">Release Date</h3>
                  <p className="text-gray-200">{formatDate(movie.release)}</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <h3 className="font-bold text-purple-300 mb-4 text-xl">Runtime</h3>
                  <p className="text-gray-200">{movie.runtime}</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <h3 className="font-bold text-purple-300 mb-4 text-xl">Language</h3>
                  <p className="text-gray-200 capitalize">{movie.language}</p>
                </div>
              </div>
            </div>

            <div ref={castRef}>
              <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Star Cast
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {Array.isArray(movie.cast) && movie.cast.map((actor, index) => (
                  <div key={index} className="cast-card flex flex-col items-center group cursor-pointer">
                    <div className="w-32 h-32 relative rounded-full overflow-hidden mb-4 border-3 border-gradient-to-r from-purple-400 to-cyan-400 shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-105">
                      <Image
                        src={actor.photo}
                        alt={actor.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <p className="text-center font-medium text-gray-200 group-hover:text-white transition-colors duration-300">
                      {actor.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {showSeatMap && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div
                  ref={seatMapRef}
                  className="hide-scrollbar bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto w-[90%] md:w-[70%] lg:w-[60%] scale-90 opacity-0"
                >
                  <div className="mt-6 cursor-pointer flex justify-end">
                    <button
                      onClick={() => {
                        setShowSeatMap(false);
                        if (ticketQuantity) setBookingStep('confirmation');
                        else setBookingStep('seats');
                      }}
                      className="text-sm text-gray-300 hover:text-white bg-black/30 px-4 py-2 rounded-lg border border-white/20 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent text-center">
                  Select Your Seats
                </h2>
                
                <div className="mb-8">
                  <div className="w-full h-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-t-full mb-2 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/50 to-cyan-400/50 rounded-t-full blur-sm"></div>
                  </div>
                  <p className="text-center text-gray-300 text-sm">SCREEN</p>
                </div>

                <div className="flex justify-center gap-8 mb-8 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-600 rounded border border-gray-400"></div>
                    <span className="text-sm">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded border border-green-300"></div>
                    <span className="text-sm">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-600 rounded border border-purple-400"></div>
                    <span className="text-sm">VIP (499 rs.)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded border border-blue-400"></div>
                    <span className="text-sm">Premium (399 rs.)</span>
                  </div>
                </div>

                {selectedShowtime && (
                  <div className="space-y-2 overflow-x-auto">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(row => (
                      <div key={row} className="flex items-center justify-center gap-1 min-w-max px-4">
                        <span className="w-6 text-center font-bold text-purple-300 mr-4">{row}</span>
                        <div className="flex gap-1">
                          {(seatMap[selectedShowtime.id] || [])
                            .filter(seat => seat.row === row)
                            .map(seat => (
                              <button
                                key={seat.id}
                                id={`seat-${seat.id}`}
                                onClick={() => handleSeatClick(seat)}
                                disabled={seat.status === 'booked'}
                                className={`w-8 h-8 rounded-md border-2 text-xs font-bold transition-all duration-200 transform hover:scale-110 ${getSeatColor(seat)}`}
                                title={`${seat.id} - ${seat.price} Rs. (${seat.type})`}
                              >
                                {seat.number}
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}


                {selectedSeats.length > 0 && (
                  <div className="mt-8 p-6 bg-white/10 rounded-2xl border border-white/20">
                    <h4 className="text-xl font-bold mb-4 text-green-400">Selected Seats</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedSeats.map(seat => (
                        <span key={seat.id} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-500/30">
                          {seat.id} ({seat.price} Rs.)
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total: {getTotalPrice().toFixed(2)} Rs.</span>
                      <button
                        onClick={handleProceedToPayment}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gradient-to-r disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl transition-all duration-300 cursor-pointer"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
            )}
          </div>

          <div ref={sidebarRef} className="space-y-8">
            {bookingStep === 'showtime' && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl">
                <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Book Tickets
                </h3>

                <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Select Showtime
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {showtimes.map((showtime) => (
                    <button
                      key={showtime.id}
                      onClick={() => handleShowtimeSelect(showtime)}
                      className="showtime-btn bg-white/10 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-cyan-500/20 backdrop-blur-sm py-4 px-4 rounded-xl text-lg font-medium transition-all duration-300 border border-white/10 hover:border-purple-300/50 hover:shadow-lg flex justify-between items-center"
                    >
                      <span>{showtime.time}</span>
                      <div className='flex items-end gap-2'>
                        <span className='text-[10px] text-gray-400 mb-[3px]'>Starting from</span>
                        <span className="text-green-400 font-bold">{showtime.price} Rs.</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
  
            )}

            {bookingStep === 'seats' && selectedShowtime && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Booking Details
                </h3>
                <div className="space-y-3 text-gray-200">
                  <p><span className="font-bold text-purple-300">Movie:</span> {movie.title}</p>
                  <p><span className="font-bold text-purple-300">Time:</span> {selectedShowtime.time}</p>
                  <p><span className="font-bold text-purple-300">Date:</span> {selectedShowtime.date}</p>
                  <p><span className="font-bold text-purple-300">Tickets:</span> {ticketQuantity}</p>
                </div>
                
                <button
                  onClick={() => {
                    setBookingStep('showtime');
                    setTicketQuantity(0);
                    setShowSeatMap(false);
                    setSelectedSeats([]);
                    if (!selectedShowtime) return;

                    setSeatMap(prev => {
                      const updatedSeats = (prev[selectedShowtime.id] || []).map(s =>
                        s.status === 'selected' ? { ...s, status: 'available' as const } : s
                      );

                      return {
                        ...prev,
                        [selectedShowtime.id]: updatedSeats
                      };
                    });
                  }}
                  className="w-full cursor-pointer mt-6 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Change Showtime
                </button>
                <button onClick={() => {
                  setShowSeatMap(true);
                }} className='w-full cursor-pointer mt-6 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300'>
                  Show Available Seats
                </button>
              </div>
            )}

            {clientSecret && stripePromise && bookingStep === 'payment' && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  clientSecret={clientSecret}
                  onPaymentSuccess={handlePaymentSuccess}
                  onCancel={() => setBookingStep('seats')}
                  ticketCount={ticketQuantity}
                  totalAmount={Number(getTotalPrice().toFixed(2))}
                  eventTitle={movie.title}
                />
              </Elements>
            )}

            {bookingStep === 'confirmation' && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Booking Confirmed
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Movie:</span>
                    <span className="font-bold">{movie.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Showtime:</span>
                    <span className="font-bold">{selectedShowtime?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Seats:</span>
                    <span className="font-bold">{selectedSeats.map(s => s.id).join(', ')}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-4">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-xl font-bold text-green-400">{getTotalPrice().toFixed(2)} Rs.</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setBookingStep('seats')}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Back to Seats
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}