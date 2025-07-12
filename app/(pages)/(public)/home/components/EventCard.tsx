'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';

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

const EventCard = ({ event, scrollOffset, clickPrevented }: { event: Event; scrollOffset: number, clickPrevented: boolean }) => {
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
      router.push(`/events/${event._id}`);
    }
  };

  const convDay = (num: Number) => {
    if (num == 1) {
        return "Mon";
    } else if (num == 2) {
        return "Tue";
    } else if (num == 3) {
        return "Wed";
    } else if (num == 4) {
        return "Thu";
    } else if (num == 5) {
        return "Fri";
    } else if (num == 6) {
        return "Sat";
    } else if (num == 7) {
        return "Sun";
    }
  } 

  const convMonth = (num: number) => {
    if (num == 1) {
        return "Jan";
    } else if (num == 2) {
        return "Feb";
    } else if (num == 3) {
        return "Mar";
    } else if (num == 4) {
        return "Apr";
    } else if (num == 5) {
        return "May";
    } else if (num == 6) {
        return "Jun";
    } else if (num == 7) {
        return "Jul";
    } else if (num == 8) {
        return "Aug";
    } else if (num == 9) {
        return "Sep";
    } else if (num == 10) {
        return "Oct";
    } else if (num == 11) {
        return "Nov";
    } else if (num == 12) {
        return "Dec";
    }
  }


  return (
    <div 
      ref={cardRef}
      className='w-[90vw] sm:w-[45vw] md:w-[30vw] lg:w-[20vw] h-[70vh] shadow-2xl mt-6 rounded-xl overflow-hidden'
      style={{
        transform: `scale(${scale})`
      }}
    >
      <div
        onClick={handleClick}
        className='relative h-[65%] scale-[0.98] group overflow-hidden transform transition-transform duration-300 hover:scale-[1] cursor-pointer'
      >
        <div
          className='absolute inset-0 bg-cover bg-left transition-transform duration-700 ease-out will-change-transform'
          style={{ 
            backgroundImage: `url(${event.backdrop_path})`,
            transform: `translateX(${parallaxOffset}px) scale(1.3)`
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 z-10 transition-opacity duration-500 group-hover:opacity-10'></div>
      </div>

      <div className='h-[35%] bg-[#33312d] relative z-20 px-4 pt-6 pb-4 flex flex-col justify-end'>
        <img className='absolute top-[-75%] left-0 w-full pointer-events-none' src="/wave-haikei.svg" alt="wave" />
        <div className='relative top-[-10%]'>
          <p className='text-white font-semibold text-2xl truncate z-10'>{event.title}</p>
          <p className='text-gray-200 font-semibold text-lg truncate z-10'>{event.artist}</p>
          <p className='text-gray-400 text-sm z-10 flex mt-[2px] truncate'>
            {event.location}
          </p>
          <p className='text-gray-400 font-semibold text-sm z-10 flex items-center gap-1'>
            <Calendar className='text-blue-400' size={15}/> {convDay(new Date(event.date).getDay())}, {new Date(event.date).getDate()}th {convMonth(new Date(event.date).getMonth())} at {event.time}
          </p>
          <p className='text-gray-400 text-sm z-10'>
            {event.eventType}
          </p>
        </div>
        
        <div className='flex justify-between items-center'>
          <button onClick={handleClick} className='cursor-pointer font-semibold rounded-full border-2 border-sky-400 px-4 py-2 text-white bg-sky-400 hover:bg-transparent transition-all duration-300 hover:scale-105'>
            Buy Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
