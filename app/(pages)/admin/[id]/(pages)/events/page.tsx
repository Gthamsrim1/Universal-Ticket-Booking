'use client'
import axios from 'axios'
import { Calendar, Check, Clock, IndianRupee, Send, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface Event {
  _id: Number;
  backdrop_path: string;
  title: string;
  artist: string;
  location: string;
  date: Date;
  time: string;
  eventType: string;
  price: number;
  seats: number;
  description: string;
}

const page = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => {
    axios.post("http://localhost:3000/api/events", {type: 'list'})
    .then(res => {
      const data = res.data;
      setEvents(data.events);
    })
    .catch(err => {
      console.log(err);
    })
  }, [])

  const handleAccept = (event: Event) => {
    const isAlreadySelected = selectedEvents.find((e) => e._id === event._id)

    if(!isAlreadySelected) {
      setSelectedEvents(prev => [...prev, event])
    }
  }

  const handleReject = (event: Event) => {
    removeEvent(event);

    setEvents(prev => prev.filter(e => e._id != event._id))
    axios.post('http://localhost:3000/api/events', {...event, type: 'remove'})
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
    })
  }

  const removeEvent = (event: Event) => {
    const isAlreadySelected = selectedEvents.find((e) => e._id === event._id)

    if (isAlreadySelected) {
      setSelectedEvents(prev => prev.filter(e => e._id != event._id))
    }
  }

  const submitEvents = async () => {
    setIsSubmitting(true)
    try {
      const promises = selectedEvents.map(event => 
        axios.post('/api/events', {
          ...event,
          active: true,
          type: "add",
        })
    )

    await Promise.all(promises)
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedEvents([]);
      setIsSubmitting(false)
    }
  }
  return (
    <div className="p-8 text-white bg-black min-h-screen pl-64 pt-16">
      <h1 className="text-2xl font-bold mb-4">Now Playing</h1>
      <div className="overflow-x-auto custom-scroll">
        <div className="flex gap-6 min-w-max p-5">
          {events.map((event) => (
            <Link href={`/events/${event._id}`} key={event._id.valueOf()}>
              <div
                className="relative h-64 w-[200px] flex-shrink-0 rounded-lg overflow-hidden bg-cover bg-center shadow-lg hover:scale-105 transition-all cursor-pointer"
                style={{
                  backgroundImage: `url(${event.backdrop_path})`,
                }}
              >
                <div className="absolute inset-0 bg-black/60 p-4 flex flex-col justify-end hover:bg-black/20 group transition-all duration-300">
                  <div 
                    onClick={(e) => {
                      e.preventDefault()
                      handleAccept(event)
                    }} 
                    className="bg-green-400 rounded-full p-2 w-fit absolute top-0 opacity-0 group-hover:top-4 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer active:scale-95"
                  >
                    {<Check />}
                  </div>
                  <div 
                    onClick={(e) => {
                      e.preventDefault()
                      handleReject(event)
                    }} 
                    className="bg-red-400 rounded-full p-2 w-fit absolute top-0 opacity-0 right-3 group-hover:top-4 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer active:scale-95"
                  >
                    {<Trash2 />}
                  </div>
                  <h2 className="text-lg font-semibold truncate text-shadow-[1px_1px_8px_rgb(255,255,255)] transition-all duration-300">{event.title}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {selectedEvents.length > 0 && (
        <div className="text-white pt-8 bg-black min-h-screen">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Add Shows</h1>
            <button
              onClick={submitEvents}
              disabled={isSubmitting}
              className="submit-btn bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200"
            >
              <Send size={20} />
              {isSubmitting ? 'Submitting...' : 'Submit All Shows'}
            </button>
          </div>

          <div className="space-y-6">
            {selectedEvents.map((event, index) => (
              <div 
                key={event._id.valueOf()}
                data-event-id={event._id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-gray-700"
              >
                <div className="flex gap-6">
                  <img
                    src={`${event.backdrop_path}`}
                    alt={event.title}
                    className="w-24 h-36 object-cover rounded-lg shadow-md"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                        <p className="text-sm text-gray-400">{event.date.toLocaleString().slice(0, 10)}</p>
                      </div>
                      <button
                        onClick={() => removeEvent(event)}
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
                          <label className="block text-xs text-gray-400 mb-1">Time</label>
                          <p className='w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white'>{event.time}</p>
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-3">
                          <Calendar size={16} />
                          Show Period
                        </label>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Date</label>
                            <p className='w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white'>{event.date.toLocaleString().slice(0, 10)}</p>
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
                            <label className="block text-xs text-gray-400 mb-1">Price</label>
                            <p className='w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white'>{event.price}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className='text-md font-semibold text-white mt-4 line-clamp-2'>Description</h3>
                    <p className="text-sm text-gray-400 mt-4 line-clamp-2">{event.description}</p>
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

export default page