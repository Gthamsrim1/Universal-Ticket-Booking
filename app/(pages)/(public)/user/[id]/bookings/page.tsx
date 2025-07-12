'use client'
import axios from "axios";
import { BookOpen, Calendar, Clock, MapPin, Users, IndianRupee, Star, Trash } from "lucide-react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

interface Booking {
    user: String;
    email: String;
    seats: [String];
    bookingTime: String;
    bookingDate: Date;
    experience: String;
    experienceName?: String;
    experienceType: String;
    date: Date;
    time: String;
    price: Number;
    backdrop_path?: string;
}

const page = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancellingBookingIndex, setCancellingBookingIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookingsWithBackdrops = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("curUser") || 'null')
        const email = stored.email

        const res = await axios.post("http://localhost:3000/api/bookings", {
          type: 'list',
          email
        })

        const bookingsData: Booking[] = res.data.bookings

        const bookingsWithBackdrops = await Promise.all(
          bookingsData.map(async (booking) => {
            if (booking.experienceType == 'movie') {
                try {
              const eventRes = await axios.post("http://localhost:3000/api/movies", {
                type: 'get',
                movieId: booking.experience,
              })

              return {
                ...booking,
                backdrop_path: eventRes.data?.movie?.backdrop_path || "",
                experienceName: eventRes.data?.movie?.title || "",
              }
            } catch {
              return { ...booking, backdrop_path: "" }
            }
            } else {
                try {
              const eventRes = await axios.post("http://localhost:3000/api/events", {
                type: 'get',
                id: booking.experience,
              })

              return {
                ...booking,
                backdrop_path: eventRes.data?.event?.backdrop_path || "",
                experienceName: eventRes.data?.event?.title || "",
              }
            } catch {
              return { ...booking, backdrop_path: "" }
            }
            }
          })
        )

        setBookings(bookingsWithBackdrops)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookingsWithBackdrops()
  }, [])

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleCancel = (bookingIndex: number) => {
    setCancellingBookingIndex(bookingIndex);
    setConfirmCancel(true);
  }


  const handleConfirmCancel = () => {
    if (cancellingBookingIndex != null) {
      axios.post('http://localhost:3000/api/bookings', { user: bookings[cancellingBookingIndex].user, experience: bookings[cancellingBookingIndex].experience, experienceType: bookings[cancellingBookingIndex].experienceType, type: 'cancel' })
      .then(res => {
        const data = res.data;
        setBookings(prev => prev.filter((_, i) => i != cancellingBookingIndex));
      })
      .catch(err => {
        console.log(err);
      })
      setConfirmCancel(false);
      setCancellingBookingIndex(null);
    }
  }

  if (loading) {
    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-x-hidden flex justify-center items-center'>
          <div className="flex flex-row gap-2 scale-200">
              <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
              <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
          </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-32">
      <div className="">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white flex items-center gap-4 mb-2">
            <BookOpen size={40} className="text-blue-400" />
            Your Bookings
          </h1>
          <p className="text-slate-300 text-lg">Manage and view your upcoming experiences</p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={64} className="mx-auto text-slate-500 mb-4" />
            <h2 className="text-2xl font-semibold text-slate-300 mb-2">No bookings yet</h2>
            <p className="text-slate-500">Start exploring movies and events to make your first booking!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking, i) => (
              <div key={i} className="group relative bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02]">
                {booking.backdrop_path && (
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <img
                      src={booking.backdrop_path}
                      alt="Backdrop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="relative p-6 flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    {booking.backdrop_path ? (
                      <div className="relative">
                        <img
                          src={booking.backdrop_path}
                          alt={`movieImg`}
                          className="w-48 h-28 object-cover rounded-xl shadow-lg border border-slate-600/50"
                        />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-xs font-medium text-white capitalize">
                            {booking.experienceType}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-48 h-28 bg-slate-700/50 rounded-xl flex items-center justify-center border border-slate-600/50">
                        <Star className="text-slate-400" size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div onClick={() => router.push(`/events/${booking.experience}`)} className="text-2xl font-bold text-white mb-1 group-hover:text-blue-300 cursor-pointer transition-colors hover:text-blue-400">
                          {booking.experienceName}
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                          <span className="capitalize">{booking.experienceType}</span>
                          <span>•</span>
                          <span>Booked on {new Date(booking.bookingDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div className="flex items-center gap-1 text-2xl font-bold text-green-400">
                          <IndianRupee size={20} />
                          {Number(booking.price).toLocaleString()}
                        </div>
                        <button onClick={() => handleCancel(i)} className="group/cancel bg-red-600 px-3 py-1 rounded-lg cursor-pointer text-white font-semibold text-md flex items-center hover:bg-red-700 hover:scale-105 transition-transform duration-300">
                          <div className="w-0 group-hover/cancel:w-5 transition-all duration-300 flex-shrink-0">
                            <Trash size={20} className="opacity-0 group-hover/cancel:opacity-100 transition-opacity duration-300" />
                          </div>
                          <span className="ml-1">Cancel Booking</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                        <Calendar className="text-blue-400 flex-shrink-0" size={20} />
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide">Date</p>
                          <p className="text-white font-medium">{formatDate(booking.date)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                        <Clock className="text-purple-400 flex-shrink-0" size={20} />
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide">Time</p>
                          <p className="text-white font-medium">{booking.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                        <Users className="text-orange-400 flex-shrink-0" size={20} />
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide">Seats</p>
                          <p className="text-white font-medium">{booking.seats.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </div>
      {confirmCancel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
          <div className={`bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 ${
            confirmCancel ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center">
                <Trash size={20} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Cancel Booking</h3>
            </div>
            
            <p className="text-slate-300 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmCancel(false);
                  setCancellingBookingIndex(null);
                }}
                className="flex-1 cursor-pointer bg-green-700 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Keep Booking
              </button>
              <button onClick={handleConfirmCancel} className="flex-1 cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default page