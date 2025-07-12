'use client';

import { Calendar, Clock, IndianRupee, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("Stripe public key is not set.");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

interface Event {
  _id: number;
  backdrop_path: string;
  title: string;
  artist: string;
  venue: string;
  date: string;
  time: string;
  eventType: string;
  price: number;
  availableSeats: number;
  maxSeats: number;
  description: string;
}

const getEvent = async (id: string): Promise<Event | null> => {
  try {
    const res = await fetch("http://localhost:3000/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, type: "get" }),
      cache: 'no-store',
    });

    const data = await res.json();
    return data?.event ?? null;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

const Page = ({ params }: { params: { id: string } }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [parameters, setParameters] = useState<{id: string}>({id: '0'});
  const [bookingStep, setBookingStep] = useState<'seats' | 'payment' | 'confirmation'>('seats');
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      const evt = await getEvent(params.id);
      setEvent(evt);
      setLoading(false);
      setParameters(params);
    };
    fetchEvent();
  }, [parameters]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBuyTickets1 = async () => {
    setPaymentLoading(true);
    if (event) {
      try {
        const totalAmount = event ? event.price * ticketCount * 100 : 0;

        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: totalAmount,
            eventId: event._id,
            ticketCount 
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await res.json();
        setClientSecret(data.clientSecret);
        setBookingStep('payment');
      } catch (error) {
        console.error('Error creating payment intent:', error);
      } finally {
        setPaymentLoading(false);
      }
    }
  };

  const handleAddToFavorites = () => {
    
  };

  const handlePaymentSuccess = async () => {
    if (event) {
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
            seats: Array.from({ length: ticketCount }, (_, i) => event.maxSeats - event.availableSeats + i + 1),
            bookingTime: `${d.getHours()}:${d.getMinutes()}`,
            bookingDate: d,
            experience: event._id,
            experienceType: event.eventType,
            date: event.date,
            time: event.time,
            price: event.price * ticketCount,
            type: 'booking',
          }),
        });
        setEvent(prev => prev ? {
          ...prev,
          availableSeats: prev.availableSeats - ticketCount
        } : null);
        
        setBookingStep('confirmation');
      } catch (error) {
        console.error('Error saving booking:', error);
      }
    }
  };

  if (loading) return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-x-hidden flex justify-center items-center'>
      <div className="flex flex-row gap-2 scale-200">
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
  );
  
  if (!event) return <div className="text-black p-10">Event not found</div>;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-x-hidden'>
      <div className='h-[80vh] w-screen bg-cover bg-center absolute inset-0' style={{ backgroundImage: `url(${event.backdrop_path})` }} />
      <div className='absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent h-[80vh] z-10'></div>

      <div className='relative z-20 pt-20 px-6 max-w-7xl mx-auto'>
        <div className='h-[60vh] flex items-end pb-12'>
          <div className='max-w-4xl'>
            <div className='inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4'>
              {event.eventType}
            </div>
            <h1 className='text-6xl font-bold mb-4 drop-shadow-lg'>{event.title}</h1>
            <p className='text-2xl text-gray-200 mb-6 drop-shadow-md'>by {event.artist}</p>

            <div className='flex flex-wrap gap-6 text-lg'>
              <div className='flex items-center gap-2'>
                <MapPin /><span>{event.venue}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar /><span>{formatDate(event.date)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Clock /><span>{event.time}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-slate-900/90 backdrop-blur-sm rounded-xl p-8 mt-[66.5px]'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2'>
              <h2 className='text-3xl font-bold mb-6'>About This Event</h2>
              <p className='text-gray-300 text-lg leading-relaxed mb-8'>
                {event.description}
              </p>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-slate-800/50 rounded-lg p-6 border border-blue-400'>
                  <h3 className='text-xl font-semibold mb-4'>Event Details</h3>
                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Artist:</span>
                      <span className='font-medium'>{event.artist}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Date:</span>
                      <span className='font-medium'>{formatDate(event.date)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Time:</span>
                      <span className='font-medium'>{event.time}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Location:</span>
                      <span className='font-medium'>{event.venue}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Event Type:</span>
                      <span className='font-medium'>{event.eventType}</span>
                    </div>
                  </div>
                </div>

                <div className='bg-slate-800/50 rounded-lg p-6 border border-blue-400'>
                  <h3 className='text-xl font-semibold mb-4'>Venue Information</h3>
                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Venue:</span>
                      <span className='font-medium'>{event.venue}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Available Seats:</span>
                      <span className='font-medium'>{event.availableSeats}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Ticket Price:</span>
                      <span className='font-medium text-green-400 flex items-center'><IndianRupee size={13} />{event.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {bookingStep == 'seats' && <div className='lg:col-span-1'>
              <div className='bg-radial from-blue-600/20 rounded-xl p-6 sticky top-8'>
                <h3 className='text-2xl font-bold mb-6'>Book Your Tickets</h3>

                <div className='space-y-4 mb-6 border-b'>
                  <div className='flex justify-between items-center'>
                    <span className='text-lg'>Price per ticket:</span>
                    <span className='text-2xl font-bold flex items-center'><IndianRupee size={20} />{event.price}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Available seats:</span>
                    <span className='font-semibold'>{event.availableSeats}</span>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>Number of tickets</label>
                    <input
                      type="number"
                      value={ticketCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setTicketCount(isNaN(val) ? 1 : Math.max(1, Math.min(val, 5)));
                      }}
                      min={1}
                      max={5}
                      placeholder='Tickets (1 - 5)'
                      className='text-gray-400 bg-transparent w-full px-4 py-2 border-b border-white focus:ring-0'
                    />
                  </div>

                  <button onClick={handleBuyTickets1} className='w-full bg-white cursor-pointer text-purple-600 font-bold rounded-lg hover:bg-gray-200 hover:text-black transition-all duration-200 group'>
                    <div className='px-6 py-3 rounded-lg w-full scale-x-0 bg-black absolute text-black group-hover:scale-x-[0.88] origin-left transition-all duration-500'>Buy Tickets Now</div>
                    <p className='px-6 py-3 group-hover:text-white relative transition-all duration-500'>Buy Tickets Now</p>
                  </button>

                  <button onClick={handleAddToFavorites} className='w-full bg-transparent cursor-pointer border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-purple-600 transition-colors duration-200'>
                    Add to Favorites
                  </button>
                </div>
              </div>
            </div>}

            {clientSecret && stripePromise && bookingStep === 'payment' && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm 
                  clientSecret={clientSecret}
                  onPaymentSuccess={handlePaymentSuccess}
                  onCancel={() => setBookingStep('seats')}
                  ticketCount={ticketCount}
                  totalAmount={event.price * ticketCount}
                  eventTitle={event.title}
                />
              </Elements>
            )}

            {bookingStep == 'confirmation' && (
              <div className='lg:col-span-1'>
                <div className='bg-radial from-blue-600/20 rounded-xl p-6 sticky top-8'>
                  <h3 className='text-2xl font-bold mb-6 text-green-400'>Booking Confirmed!</h3>

                  <div className='space-y-4 mb-6 border-b'>
                    <div className='flex justify-between items-center'>
                      <span className='text-lg'>Tickets Booked:</span>
                      <span className='font-semibold'>{ticketCount}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Total Price:</span>
                      <span className='text-2xl font-bold flex items-center'>
                        <IndianRupee size={20} />
                        {event.price * ticketCount}
                      </span>
                    </div>
                  </div>

                  <div className='space-y-4 text-white'>
                    <p className='text-sm'> Thank you for booking! Your seats are reserved.</p>
                    <p className='text-sm flex items-center gap-1'><MapPin size={15}/> <strong>Venue:</strong> {event.venue}</p>
                    <p className='text-sm flex items-center gap-1'><Calendar size={15}/> <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p className='text-sm flex items-center gap-1'><Clock size={15}/> <strong>Time:</strong> {event.time}</p>
                    <div className=''>
                      <button
                        onClick={() => setBookingStep('seats')}
                        className='w-full mt-4 bg-white text-purple-600 font-bold cursor-pointer rounded-lg hover:bg-gray-200 hover:text-black transition-colors duration-200 group'
                      >
                        <div className='px-6 py-3 rounded-lg w-full scale-x-0 bg-black absolute text-black group-hover:scale-x-[0.88] origin-left transition-all duration-500'>Go Back Now</div>
                        <p className='px-6 py-3 group-hover:text-white relative transition-all duration-500'>Go Back Now</p>
                      </button>
                      <button className='w-full mt-4 px-6 py-3 border-purple-600 border-2 text-purple-600 bg-white/5 font-bold cursor-pointer rounded-lg hover:bg-white/20 hover:text-purple-400 transition-colors duration-200 group'>Check Your Ticket</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Page;
