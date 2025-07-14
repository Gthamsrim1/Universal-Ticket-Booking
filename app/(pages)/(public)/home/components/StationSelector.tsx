'use client'
import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, ArrowLeftRight, Calendar, Clock, MapPin, Loader2, Route, Users, ChevronUp, CreditCard, Train } from 'lucide-react'
import axios from 'axios'

const animateDropdownOpen = (element: HTMLElement) => {
  element.style.opacity = '0'
  element.style.transform = 'translateY(-10px) scaleY(0.8)'
  element.style.transformOrigin = 'top center'

  element.animate([
    { 
      opacity: '0', 
      transform: 'translateY(-10px) scaleY(0.8)' 
    },
    { 
      opacity: '1', 
      transform: 'translateY(0) scaleY(1)' 
    }
  ], {
    duration: 250,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fill: 'forwards'
  })
}

const animateDropdownClose = (element: HTMLElement, callback: () => void) => {
  element.animate([
    { 
      opacity: '1', 
      transform: 'translateY(0) scaleY(1)' 
    },
    { 
      opacity: '0', 
      transform: 'translateY(-10px) scaleY(0.8)' 
    }
  ], {
    duration: 200,
    easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    fill: 'forwards'
  }).addEventListener('finish', callback)
}

interface Station {
  code: string
  name: string
  city?: string
  state?: string
}

interface TrainInterface {
  number: string;
  name: string;
  src_departure_time: string;
  dest_arrival_time: string;
  travel_time: string;
  train_type: string;
  classes: string;
  from_station: {
    code: string;
    name: string;
  };
  to_station: {
    code: string;
    name: string;
  };
  days: string[];
  distance: string;
}

interface ClassOption {
  name: string;
  price: number;
  available: number;
  features: string[];
}


interface SearchableSelectProps {
  value: string
  onChange: (value: string) => void
  stations: Station[]
  placeholder: string
  className?: string
  icon?: React.ReactNode
  label?: string
}

const SearchableSelect = ({ value, onChange, stations, placeholder, className = '', icon, label }: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownContentRef = useRef<HTMLDivElement>(null)

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.state?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedStation = stations.find(station => station.code === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpen = () => {
    if (isAnimating) return
    setIsOpen(true)
    setIsAnimating(true)

    setTimeout(() => {
      if (dropdownContentRef.current) {
        animateDropdownOpen(dropdownContentRef.current)
        setTimeout(() => setIsAnimating(false), 250)
      }
    }, 0)
  }

  const handleClose = () => {
    if (isAnimating || !isOpen) return
    setIsAnimating(true)
    
    if (dropdownContentRef.current) {
      animateDropdownClose(dropdownContentRef.current, () => {
        setIsOpen(false)
        setSearchTerm('')
        setIsAnimating(false)
      })
    }
  }

  const handleToggle = () => {
    if (isOpen) {
      handleClose()
    } else {
      handleOpen()
    }
  }

  const handleSelect = (stationCode: string) => {
    onChange(stationCode)
    handleClose()
  }

  return (
    <div className={`relative flex-1`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isAnimating}
        className={`bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 text-white cursor-pointer font-medium truncate text-base ${className} focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-700/80 hover:border-gray-500/50 transition-all duration-200 disabled:cursor-not-allowed group`}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-blue-400 group-hover:text-blue-300 transition-colors">{icon}</span>}
          <span className={selectedStation ? 'text-white' : 'text-gray-400'}>
            {selectedStation ? selectedStation.name : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          ref={dropdownContentRef}
          className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-md border border-gray-600/50 rounded-xl shadow-xl z-50 max-h-80 overflow-hidden"
          style={{ opacity: 0, transform: 'translateY(-10px) scaleY(0.8)' }}
        >
          <div className="p-4 border-b border-gray-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search stations..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent">
            {filteredStations.length === 0 ? (
              <div className="px-6 py-4 text-gray-400 text-center">
                No stations found
              </div>
            ) : (
              filteredStations.map((station) => (
                <button
                  key={station.code}
                  onClick={() => handleSelect(station.code)}
                  className="w-full px-6 py-3.5 text-left cursor-pointer hover:bg-gray-700/50 focus:bg-gray-700/50 focus:outline-none transition-colors text-white group"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="group-hover:text-blue-300 transition-colors">{station.name}</span>
                      {station.city && (
                        <span className="text-xs text-gray-400 mt-0.5">
                          {station.city}{station.state && `, ${station.state}`}
                        </span>
                      )}
                    </div>
                    <span className="text-cyan-400 text-sm font-mono">{station.code}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const TrainCard = ({ train }: { train: TrainInterface }) => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [showClasses, setShowClasses] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const classOptions: ClassOption[] = [
    { name: 'First Class AC', price: 2500, available: 12, features: ['AC', 'Meals', 'Bedding'] },
    { name: 'Second Class AC', price: 1800, available: 25, features: ['AC', 'Meals'] },
    { name: 'Third Class AC', price: 1200, available: 45, features: ['AC'] },
    { name: 'Sleeper', price: 600, available: 60, features: ['Fan', 'Basic seating'] },
    { name: 'General', price: 200, available: 100, features: ['Basic seating'] }
  ];

  const handleBooking = () => {
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }
    const selectedOption = classOptions.find(c => c.name === selectedClass);
    alert(`Booking ${quantity} ticket(s) for ${selectedClass} - Total: ₹${selectedOption?.price! * quantity}`);
  };

  const formatTime = (time: string) => {
    return time.length === 4 ? `${time.slice(0, 2)}:${time.slice(2)}` : time;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Train className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{train.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-400">#{train.number}</span>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                {train.train_type}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Route className="w-4 h-4" />
            <span className="text-sm">{train.distance}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">{train.days.slice(0, 3).join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Departure</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatTime(train.src_departure_time)}</div>
          <div className="text-sm text-gray-400">{train.from_station.name}</div>
          <div className="text-xs text-gray-500">({train.from_station.code})</div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-center">
          <div className="text-center">
            <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-lg font-semibold text-blue-400">{train.travel_time}</div>
            <div className="text-xs text-gray-500">Duration</div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Arrival</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatTime(train.dest_arrival_time)}</div>
          <div className="text-sm text-gray-400">{train.to_station.name}</div>
          <div className="text-xs text-gray-500">({train.to_station.code})</div>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowClasses(!showClasses)}
          className="w-full flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-white">
              {selectedClass || 'Select Class'}
            </span>
            {selectedClass && (
              <span className="text-blue-400 ml-2">
                ₹{classOptions.find(c => c.name === selectedClass)?.price}
              </span>
            )}
          </div>
          {showClasses ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {showClasses && (
          <div className="mt-3 space-y-2">
            {classOptions.map((classOption) => (
              <div
                key={classOption.name}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedClass === classOption.name
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                }`}
                onClick={() => setSelectedClass(classOption.name)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{classOption.name}</span>
                  <span className="text-xl font-bold text-blue-400">₹{classOption.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {classOption.features.map((feature) => (
                      <span key={feature} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <span className={`text-sm ${
                    classOption.available > 20 ? 'text-green-400' : 
                    classOption.available > 5 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {classOption.available} available
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedClass && (
        <div className="border-t border-gray-700/50 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Passengers:</span>
                <select 
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-400">Total: </span>
                <span className="text-lg font-bold text-white">
                  ₹{(classOptions.find(c => c.name === selectedClass)?.price || 0) * quantity}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleBooking}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Book Now
          </button>
        </div>
      )}
    </div>
  );
};

const StationSelector = ({ stations } : {stations : Station[]}) => {
  const [date, setDate] = useState('')
  const [trains, setTrains] = useState<TrainInterface[]>([])
  const [loading, setLoading] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const handleSwapStations = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  useEffect(() => {
    if (from && to && date) {
      setLoading(true)
      axios.post("/api/trains", {from, to, date})
      .then(res => {
        const data = res.data;
        console.log(data.trains);
        setTrains(data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err);
        setLoading(false)
      })
    } else {
      setTrains([])
      setLoading(false)
    }
  }, [from, to, date])

  const selectedFromStation = stations.find(s => s.code === from)
  const selectedToStation = stations.find(s => s.code === to)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="">
        <div className="text-left mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Train Booking</h1>
          <p className="text-gray-400">Find and book your perfect train journey</p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <SearchableSelect
              value={from}
              onChange={setFrom}
              stations={stations}
              placeholder="Select departure station"
              className="rounded-xl"
              icon={<MapPin className="w-4 h-4" />}
              label="From"
            />
            
            <button
              onClick={handleSwapStations}
              className="flex-shrink-0 p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl transition-all duration-200 group"
              disabled={!from && !to}
            >
              <ArrowLeftRight className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </button>
            
            <SearchableSelect
              value={to}
              onChange={setTo}
              stations={stations}
              placeholder="Select arrival station"
              className="rounded-xl"
              icon={<MapPin className="w-4 h-4" />}
              label="To"
            />

            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={getTodayDate()}
                  className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 text-white font-medium rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 pl-10 pr-4 py-3.5 hover:bg-gray-700/80 hover:border-gray-500/50 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {selectedFromStation && selectedToStation && (
          <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 mb-8 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{selectedFromStation.name}</span>
                </div>
                <ArrowLeftRight className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">{selectedToStation.name}</span>
                </div>
              </div>
              {date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{new Date(date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Searching for trains...</p>
          </div>
        )}

        {trains.length > 0 && !loading && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Available Trains</h2>
            {trains.map((train) => (
              <TrainCard key={train.number} train={train} />
            ))}
          </div>
        )}

        {from && to && date && trains.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl">
            <Train className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No trains available for this route and date</p>
            <p className="text-gray-500 text-sm mt-2">Try selecting a different date or route</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default StationSelector
