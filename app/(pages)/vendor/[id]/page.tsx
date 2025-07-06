'use client'
import axios from 'axios';
import { Calendar, NotebookPen, User, Save, Music, MapPin, Clock, Tag, Image, Search, IndianRupee, Space, Spade, Book } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'

interface Event {
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
  const [curUser, setCurUser] = useState<any>(null);
  const [event, setEvent] = useState<Event>({
    backdrop_path: '',
    title: '',
    artist: '',
    location: '',
    date: new Date(),
    time: '',
    eventType: '',
    price: 0,
    seats: 0,
    description: '',
  });

  useEffect(() => {
    const updateUser = () => {
      const mockUser = {
        user: "User",
        email: "user@example.com",
        joinDate: "January 2024",
        avatar: null,
        contact: "+91 12312 12312"
      };

      const storedUser = JSON.parse(localStorage.getItem("curVendorUser") || "null"); 
      
      setTimeout(() => {
        setCurUser(storedUser ? storedUser : mockUser);
      }, 500);
    };

    updateUser();
  }, []);


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updatedUser = { ...curUser, avatar: base64 };
        setCurUser(updatedUser);
        localStorage.setItem("curUser", JSON.stringify(updatedUser));
        axios.post("http://localhost:3000/api/vendors", {...updatedUser, type: "update"})
        window.dispatchEvent(new Event("curUserChanged"));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventChange = (field: keyof Event, value: any) => {
    setEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBackdropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        handleEventChange('backdrop_path', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEvent = () => {
    axios.post("http://localhost:3000/api/events", {...event, type: 'add', active: false})
    .then(res => {
      const data = res.data;
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    })
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto pt-[50px]">
        <div className='absolute h-58 w-58 bg-emerald-400/30 top-[80vh] left-0 blur-3xl'></div>
        <div className='absolute h-58 w-58 bg-emerald-400/30 top-[40vh] left-[30vw] blur-3xl'></div>
        <div className='absolute h-58 w-58 bg-emerald-400/30 top-[60vh] left-[80vw] blur-3xl'></div>
        <div className='absolute h-58 w-58 bg-emerald-400/30 top-[0vh] left-0 blur-3xl'></div>
        <div className='absolute h-58 w-58 bg-emerald-400/30 top-[0vh] right-[10vw] blur-3xl'></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <label htmlFor="avatarUpload" className="cursor-pointer relative">
                    {curUser?.avatar ? (
                      <img
                        src={curUser.avatar}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 via-amber-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <User size={48} className="text-white" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id="avatarUpload"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center transition-all">
                      <NotebookPen size={14} className="text-white" />
                    </div>
                  </label>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">
                  {curUser?.user || "User"}
                </h2>
                <p className="text-slate-400 mb-4">{curUser?.email || "user@example.com"}</p>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Calendar size={16} />
                  <span>Joined {curUser?.joinDate || "Recently"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="text-green-400" />
                Create Event
              </h3>
              
              <div className="space-y-4 w-full">
                <div className='flex justify-between gap-3'>
                  <div className='w-full'>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => handleEventChange('title', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter event name"
                    />
                  </div>

                  <div className='w-full'>
                    <label className="text-sm font-medium w-full text-slate-300 mb-2 flex items-center gap-2">
                      <Music size={16} />
                      Artist
                    </label>
                    <input
                      type="text"
                      value={event.artist}
                      onChange={(e) => handleEventChange('artist', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter artist name"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <MapPin size={16} />
                    Location
                  </label>
                  <div className="flex ">
                    <input
                      type="text"
                      value={event.location}
                      onChange={(e) => handleEventChange('location', e.target.value)}
                      className="w-full px-4 py-2 text-white bg-slate-700 border rounded-lg border-slate-600 placeholder-slate-400 focus:outline-none focus:border-transparent"
                      placeholder="Enter event location"
                    />
                  </div>
                </div>
                <div className='flex gap-3'>
                    <div className='w-full'>
                    <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Date
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(event.date)}
                      onChange={(e) => handleEventChange('date', new Date(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className='w-full'>
                    <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <Clock size={16} />
                      Time
                    </label>
                    <input
                      type="time"
                      value={event.time}
                      onChange={(e) => handleEventChange('time', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Tag size={16} />
                    Event Type
                  </label>
                  <select
                    value={event.eventType}
                    onChange={(e) => handleEventChange('eventType', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select event type</option>
                    <option value="concert">Concert</option>
                    <option value="festival">Festival</option>
                    <option value="club">Club Event</option>
                    <option value="private">Private Event</option>
                    <option value="corporate">Corporate Event</option>
                  </select>
                </div>

                <div className='flex gap-3'>
                    <div className='w-full'>
                    <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <IndianRupee size={16} />
                      Price
                    </label>
                    <input
                      type="number"
                      placeholder='0.00'
                      onChange={(e) => handleEventChange('price', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className='w-full'>
                    <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <Spade size={16} />
                      Available Seats
                    </label>
                    <input
                      type="number"
                      value={event.seats}
                      max={300}
                      onChange={(e) => handleEventChange('seats', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className='w-full'>
                    <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                      <Book size={16} />
                      Description
                    </label>
                    <textarea
                      value={event.description}
                      onChange={(e) => handleEventChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Image size={16} />
                    Backdrop Image
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackdropChange}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-600 file:text-white hover:file:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 file:transition-all file:hover:scale-105 file:duration-300 file:cursor-pointer focus:border-transparent"
                    />
                    {event.backdrop_path && (
                      <div className="mt-2">
                        <img
                          src={event.backdrop_path}
                          alt="Backdrop preview"
                          className="w-full h-32 object-cover rounded-lg border border-slate-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSaveEvent}
                  className="w-full bg-green-400 hover:bg-green-500 hover:scale-105 cursor-pointer text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                >
                  <Save size={20} />
                  Save Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {(event.artist || event.location || event.eventType) && (
          <div className="mt-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Event Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
                <div><strong>Title:</strong> {event.title || 'Not set'}</div>
                <div><strong>Artist:</strong> {event.artist || 'Not set'}</div>
                <div><strong>Location:</strong> {event.location || 'Not set'}</div>
                <div><strong>Date:</strong> {event.date.toLocaleDateString()}</div>
                <div><strong>Time:</strong> {event.time || 'Not set'}</div>
                <div><strong>Type:</strong> {event.eventType || 'Not set'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default page