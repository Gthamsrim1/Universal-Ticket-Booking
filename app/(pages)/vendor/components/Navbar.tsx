'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
    const router = useRouter();
    const [curUser, setCurUser] = useState<any>("");
    useEffect(() => {
      const updateUser = () => {
        const storedUser = JSON.parse(localStorage.getItem("curVendorUser") || "null");
        if (storedUser?.user) {
          setCurUser(storedUser.user);
        } else {
          setCurUser("");
        }
      };

      updateUser();

      window.addEventListener("curUserChanged", updateUser);
      return () => window.removeEventListener("curUserChanged", updateUser);
    }, []);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 flex justify-between items-center px-10 bg-black/40 backdrop-blur-sm text-white z-[1002]">
        <h1 className="text-2xl font-bold tracking-wide"><span className="text-green-400">Vendor</span> Suite</h1>
        <div className="flex gap-6 items-center text-lg">
            <button onClick={() => router.push('/vendor')} className="hover:underline cursor-pointer transition-all hover:scale-105">Home</button>
            
            {!curUser && <div className='flex gap-3'>
                <button onClick={() => router.push("/vendor/login?mode=login")} className='rounded-2xl bg-white border-white border-2 px-6 py-2 text-black font-semibold cursor-pointer hover:bg-black hover:text-white transition-all duration-300'>Login</button>
                <button onClick={() => router.push("/vendor/login?mode=signup")} className='rounded-2xl border-white border-2 px-4 py-2 text-white font-semibold hover:bg-white hover:text-black transition-all duration-300 cursor-pointer'>Sign up</button>
            </div>}
            {curUser && (
              <div className="flex gap-3 items-center">
                <span className="text-lg font-semibold text-gray-400 hover:text-white hover:underline transition-all duration-300 cursor-pointer hover:scale-105">Welcome, {curUser}</span>
              </div>
            )}
        </div>
      </nav>
  )
}

export default Navbar