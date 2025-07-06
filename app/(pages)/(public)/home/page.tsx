import Link from 'next/link'
import React from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Movies from './components/Movies'
import Events from './components/Events'
import Trailers from './components/Trailers'
import Trains from './components/Trains'

const page = () => {
  return (
    <div className='overflow-x-hidden overflow-y-hidden'>
      <Home />
      <div className='bg-cover bg-center' style={{backgroundImage: `url(/back.jpg)`}}>
        <Movies />
        <Trailers />
        <Events />
      </div>
      <Trains />
    </div>
  )
}

export default page