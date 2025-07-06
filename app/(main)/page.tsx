import React from 'react'
import Navbar from './components/Navbar'
import ThreeScene from './components/ThreeScene'
import Intro from './components/Intro'

const page = () => {
  return (
    <div className='h-screen w-screen font-poppins' style={{backgroundImage: 'radial-gradient(ellipse 95% 160% at bottom right, #0ea5e9, #052f4a, #000000)'}}>
      <Navbar />
      <ThreeScene />
      <Intro />
    </div>
  )
}

export default page