'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import EventCardSm from './components/EventCardSm';

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

  useEffect(() => {
    axios.post("http://localhost:3000/api/events", {type: "list-active"})
    .then(result => {
      const data = result.data;
      setEvents(data.events);
    })
    .catch(error => {
      console.log(error)
    })
  }, [])

  return (
    <div className='h-full relative py-30 pb-60 bg-black px-20 overflow-hidden'>
      <h1 className='text-white font-semibold text-2xl text-shadow-[0px_0px_16px_rgb(255,255,255)]'>Now Showing</h1>
      <div className='absolute h-58 w-58 bg-sky-400/30 top-[100px] left-0 blur-3xl'></div>
      <div className='absolute h-58 w-58 bg-sky-400/30 top-[500px] right-[10px] blur-3xl'></div>
      <div className='absolute h-58 w-58 bg-sky-400/30 top-[900px] left-[300px] blur-3xl'></div>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {events.map((event, i) => (
          <EventCardSm event={event} />
        ))}
      </div>
    </div>
  )
}

export default page