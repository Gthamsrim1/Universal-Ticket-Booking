import React from 'react'
import { navLinks } from "../constants"

const Navbar = () => {
  return (
    <div className='flex justify-center p-5 absolute w-full'>
      <ul className='flex justify-around w-[60%]'>
        {navLinks.map((nav, i) => (
          <li className='text-white text-shadow-[2px_2px_20px_rgb(255,255,255)] font-semibold' key={i}>{nav}</li>
        ))}
      </ul>
    </div>
  )
}

export default Navbar