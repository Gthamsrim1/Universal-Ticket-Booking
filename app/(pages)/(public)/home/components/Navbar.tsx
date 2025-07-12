'use client' 
import { useRouter } from 'next/navigation'; 
import { navLinks } from '../constants' 
import React, { useEffect, useState } from 'react' 
import { User, Settings, Calendar, Heart, LogOut, X } from 'lucide-react'; 
 
const Navbar = () => { 
  const router = useRouter();  
  const [curUser, setCurUser] = useState<any>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { 
    const updateUser = () => { 
      const storedUser = JSON.parse(localStorage.getItem("curUser") || "null"); 
      if (storedUser) { 
        setCurUser(storedUser); 
      } else { 
        setCurUser(""); 
      }
    }; 

    updateUser(); 

    window.addEventListener("curUserChanged", updateUser); 
    return () => window.removeEventListener("curUserChanged", updateUser); 
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem("curUser");
    setCurUser("");
    setSidebarOpen(false);
    window.dispatchEvent(new Event("curUserChanged"));
    router.push('/user/login');
  };

  const sidebarItems = [
    { icon: User, label: 'Profile', path: `/user/${curUser?.id}` },
    { icon: Calendar, label: 'My Bookings', path: `/user/${curUser?.id}/bookings` },
    { icon: Heart, label: 'Favorites', path: '/user/favorites' },
    { icon: Settings, label: 'Settings', path: '/user/settings' },
  ];

  return ( 
    <>
      <div className='flex items-center text-white w-full px-8 py-6 relative z-50'>
        <div className='absolute h-[70px] w-[70px] left-[5vw] top-1 blur-2xl bg-blue-400/30'></div> 
        <img src="/Logo.png" alt="Logo" width={150} className='translate-x-10'/>
        <div className='flex justify-center flex-1 absolute left-[37.5%]'> 
          <div className='flex items-center pointer-events-auto'> 
            {navLinks.map((nav, i) => ( 
              <div
                onClick={() => router.push(nav.link)}
                className='group cursor-pointer bg-white/5 hover:bg-white/15 transition-all duration-500' 
                style={{ 
                  borderRadius: 
                    i === 0 
                      ? 'calc(1px * infinity) 0px 0px calc(1px * infinity)' 
                      : i === 3 
                      ? '0px calc(1px * infinity) calc(1px * infinity) 0px' 
                      : '0px', 
                  padding: 
                    i === 0 
                      ? '16px 20px 16px 40px' 
                      : i === 3 
                      ? '16px 40px 16px 20px' 
                      : '16px 20px 16px 20px', 
                }} 
                key={i} 
              > 
                <p className='text-white transition-all duration-300 text-sm font-semibold backdrop:blur-lg group-hover:backdrop-blur-2xl group-hover:text-shadow-[1px_-1px_16px_rgb(0,0,255)]'> 
                  {nav.title} 
                </p> 
              </div> 
            ))} 
          </div> 
        </div> 
 
        <div className='flex items-center gap-4 pointer-events-auto absolute right-[60px]'> 
          <div className='group cursor-pointer'> 
            <div className='absolute blur-xl bg-white/40 h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200'></div> 
            <img src='/search.svg' alt='search' height={30} width={30} /> 
          </div> 
          {curUser && 
          <div className='cursor-pointer group'> 
            <div onClick={() => setSidebarOpen(true)} className='absolute blur-xl bg-white/40 h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200'></div> 
            <img src='/acc.svg' alt='account' height={30} width={30} onClick={() => setSidebarOpen(true)} /> 
          </div> 
          } 
          {!curUser && 
          <div className='flex gap-3 font-semibold'> 
            <button onClick={() => router.push('/user/login?mode=login')} className='rounded-full px-6 py-2 bg-white text-black transition-all cursor-pointer hover:bg-transparent hover:text-white border-2 border-white'>Login</button> 
            <button onClick={() => router.push('/user/login?mode=signup')}className='rounded-full px-4 py-2 border-white border-2 transition-all cursor-pointer hover:bg-black'>Sign Up</button> 
          </div> 
          } 
        </div> 
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[45] bg-black/50 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div 
        className={`fixed top-0 right-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out pointer-events-auto ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(to left, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.8) 70%, transparent 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setSidebarOpen(false)}
              className="text-white cursor-pointer hover:scale-105 hover:text-gray-300 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/20">
            {curUser?.avatar ?
              <img src={curUser.avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white" />
              :
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
            }
            <div>
              <h3 className="text-white font-semibold text-lg">
                {curUser?.user || 'User'}
              </h3>
              <p className="text-gray-300 text-sm">
                {curUser?.email || 'user@example.com'}
              </p>
            </div>
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      router.push(item.path);
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 cursor-pointer text-white hover:bg-white/10 rounded-lg transition-all duration-200 group"
                  >
                    <item.icon size={20} className="group-hover:text-blue-400 transition-colors duration-200" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 group"
            >
              <LogOut size={20} className="group-hover:text-red-300 transition-colors duration-200" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  ) 
} 
 
export default Navbar