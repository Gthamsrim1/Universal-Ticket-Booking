import fs from 'fs'
import path from 'path'
import React from 'react'
import StationSelector from './StationSelector'

const Trains = async () => {
  const filePath = path.join(process.cwd(), 'public/stations.json')
  const jsonData = fs.readFileSync(filePath, 'utf-8')
  const parsed = JSON.parse(jsonData)

  const stations = parsed.features.map((f: any) => f.properties)

  return (
    <div className="relative w-full min-h-[80vh] bg-gray-900 px-16 py-8">
      <div className='absolute top-0 left-0 right-0 z-10 h-32 bg-gradient-to-b from-blue-900/70 to-transparent pointer-events-none ' />
      <StationSelector stations={stations} />
    </div>
  )
}

export default Trains
