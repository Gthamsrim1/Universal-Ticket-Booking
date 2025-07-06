'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, PlusSquare, List, ClipboardList } from 'lucide-react'

const Sidebar = () => {
  const pathname = usePathname()

  const [curUser, setCurUser] = useState<any>("");
      useEffect(() => {
        const updateUser = () => {
          const storedUser = JSON.parse(localStorage.getItem("curAdminUser") || "null");
          if (storedUser?.id) {
            setCurUser(storedUser.id);
          } else {
            setCurUser("");
          }
        };
  
        updateUser();
  
        window.addEventListener("curUserChanged", updateUser);
        return () => window.removeEventListener("curUserChanged", updateUser);
      }, []);

  return (
    <div className='fixed h-screen w-64 bg-black text-white p-4 flex flex-col items-start pt-[15vh] z-[1001]'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-2xl'>
          <span className='text-white'>👤</span>
        </div>
        <div className='text-lg font-semibold'>Admin User</div>
      </div>

      <div className='w-full flex flex-col gap-1'>
        <SidebarItem icon={<LayoutGrid size={18} />} label="Dashboard" href={`/admin/${curUser}/dashboard`} pathname={pathname} />
        <SidebarItem icon={<PlusSquare size={18} />} label="Manage Movies" href={`/admin/${curUser}/movies`} pathname={pathname} />
        <SidebarItem icon={<List size={18} />} label="List Shows" href={`/admin/${curUser}/list-shows`} pathname={pathname} />
        <SidebarItem icon={<ClipboardList size={18} />} label="Events Request" href={`/admin/${curUser}/events`} pathname={pathname} />
      </div>
    </div>
  )
}

const SidebarItem = ({
  icon,
  label,
  href,
  pathname,
}: {
  icon: React.ReactNode
  label: string
  href: string
  pathname: string
}) => {
  const active = pathname === href

  return (
    <Link href={href}>
      <div
        className={`w-full flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-all duration-300
        ${active ? 'bg-red-900 text-red-500' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
      >
        {icon}
        <span className='text-sm'>{label}</span>
      </div>
    </Link>
  )
}

export default Sidebar
