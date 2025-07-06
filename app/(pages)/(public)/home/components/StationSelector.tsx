'use client'
import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
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
    duration: 200,
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
    duration: 150,
    easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    fill: 'forwards'
  }).addEventListener('finish', callback)
}

interface Station {
  code: string
  name: string
}

interface SearchableSelectProps {
  value: string
  onChange: (value: string) => void
  stations: Station[]
  placeholder: string
  className?: string
}

const SearchableSelect = ({ value, onChange, stations, placeholder, className = '' }: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownContentRef = useRef<HTMLDivElement>(null)

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.code.toLowerCase().includes(searchTerm.toLowerCase())
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
        setTimeout(() => setIsAnimating(false), 200)
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
    <div className={`relative`} ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isAnimating}
        className={`bg-gray-800 border border-yellow-700 text-white cursor-pointer font-semibold truncate text-lg ${className} focus:ring-yellow-500 focus:border-yellow-500 w-56 px-6 py-3 flex items-center justify-between hover:bg-gray-700 transition-colors disabled:cursor-not-allowed`}
      >
        <span className={selectedStation ? 'text-white' : 'text-gray-400'}>
          {selectedStation ? selectedStation.name : placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          ref={dropdownContentRef}
          className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-yellow-700 rounded-xl shadow-lg z-50 max-h-80 overflow-hidden"
          style={{ opacity: 0, transform: 'translateY(-10px) scaleY(0.8)' }}
        >
          <div className="p-3 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search stations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredStations.length === 0 ? (
              <div className="px-6 py-4 text-gray-400 text-center">
                No stations found
              </div>
            ) : (
              filteredStations.map((station) => (
                <button
                  key={station.code}
                  onClick={() => handleSelect(station.code)}
                  className="w-full px-6 py-3 text-left hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-colors text-white"
                >
                  <div className="flex justify-between items-center">
                    <span>{station.name}</span>
                    <span className="text-yellow-400 text-sm">{station.code}</span>
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

const StationSelector = ({ stations }: { stations: Station[] }) => {
  const [search, setSearch] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(search.toLowerCase()) ||
    station.code.toLowerCase().includes(search.toLowerCase())
  )

  const sampleStations = stations.length > 0 ? stations : [
    { code: 'NYC', name: 'New York Central' },
    { code: 'BOS', name: 'Boston South Station' },
    { code: 'PHI', name: 'Philadelphia 30th Street' },
    { code: 'WAS', name: 'Washington Union Station' },
    { code: 'BAL', name: 'Baltimore Penn Station' },
    { code: 'ATL', name: 'Atlanta Peachtree' },
    { code: 'CHI', name: 'Chicago Union Station' },
    { code: 'LAX', name: 'Los Angeles Union Station' },
    { code: 'SEA', name: 'Seattle King Street' },
    { code: 'POR', name: 'Portland Union Station' }
  ]

  useEffect(() => {
    if (to && from) {
      axios.post('http://localhost:3000/api/trains', {from, to})
      .then(result => {
        const data = result.data;

      })
    }
  }, [to, from])

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-6">     
          <div className="flex items-center">
            <SearchableSelect
              value={from}
              onChange={setFrom}
              stations={filteredStations.length > 0 ? filteredStations : sampleStations}
              placeholder="From Station"
              className='rounded-l-xl'
            />
            
            <p className="bg-gray-800 border border-yellow-700 text-yellow-300 font-semibold truncate text-lg focus:ring-yellow-500 focus:border-yellow-500 px-6 py-3 pointer-events-none flex items-center justify-between disabled:cursor-not-allowed">to</p>
            
            <SearchableSelect
              value={to}
              onChange={setTo}
              stations={filteredStations.length > 0 ? filteredStations : sampleStations}
              placeholder="To Station"
              className=''
            />

            <div className="bg-gray-800 gap-1 flex-col border border-yellow-700 text-yellow-300 font-semibold truncate text-lg pt-[3px] pb-[2px] rounded-r-xl focus:ring-yellow-500 focus:border-yellow-500 px-6 flex items-center hover:bg-gray-700 cursor-pointer justify-between disabled:cursor-not-allowed transition-all duration-200">
              <p className='text-gray-300 text-[10px] self-start relative'>Date of Journey</p>
              <p className='text-white'>dd-mm-yyyy</p>
            </div>
          </div>

          {from && to && (
            <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-yellow-700 animate-[fadeIn_0.3s_ease-in-out]">
              <p className="text-white text-lg">
                <span className="text-yellow-300">From:</span> {sampleStations.find(s => s.code === from)?.name} ({from})
              </p>
              <p className="text-white text-lg">
                <span className="text-yellow-300">To:</span> {sampleStations.find(s => s.code === to)?.name} ({to})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StationSelector