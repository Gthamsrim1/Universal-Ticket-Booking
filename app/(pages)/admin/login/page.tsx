'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'

interface LoginProps {
  curUser: any
  setCurUser: (user: any) => void
  login: boolean
  setLogin: (val: boolean) => void
}

interface Shape {
  id: number
  size: number
  top: number
  left: number
  opacity: number
  borderRadius: string
  rotate: number
  radius: number
}

const LoginPage: React.FC<LoginProps> = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const router = useRouter();

  const [showPass, setShowPass] = useState(false)
  const [shapes, setShapes] = useState<Shape[]>([])
  const [curUser, setCurUser] = useState(null)
  const [login, setLogin] = useState(false)


  const [email, setEmail] = useState("")
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [cnfPass, setCnfPass] = useState("")

  const [curUse, setCurUse] = useState("")
  const [curPass, setCurPass] = useState("")
  const [redirect, setRedirect] = useState(3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (login) {
      axios.post('http://localhost:3000/api/admin', { email: curUse, password: curPass, type: "login" })
        .then(result => {
          const data = result.data
          if (data) {
            if (data.message == "User doesn't exist") {
              alert(data.message)
              return;
            }
            if (data.message == "Incorrect password") {
              alert(data.message);
              return;
            }
            const user = data.user
            const id = data.id
            setCurUser(user)
            localStorage.setItem("curAdminUser", JSON.stringify({ user, id }));
            window.dispatchEvent(new Event("curUserChanged"));
            router.push(`/admin/${id}`)
          }
        })
        .catch(err => console.log(err))
    } else {
      if (password !== cnfPass) {
        alert("Passwords do not match!")
        return
      }

      axios.post('http://localhost:3000/api/admin', { email, user, password, type: "signup" })
        .then(result => {
          const data = result.data;
          if (data.message == "User already exists") {
            alert("User Already exists");
            return;
          }
          console.log(result)
          setLogin(true)
        })
        .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    setShowPass(false)
  }, [login])

  useEffect(() => {
    const generatedShapes: Shape[] = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 30) + 20,
      top: Math.random() * 70 + 10,
      left: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.2,
      borderRadius: Math.random() > 0.5 ? '50%' : '0%',
      rotate: Math.random() * 360,
      radius: Math.random() * 250 + 100
    }))
    setShapes(generatedShapes)
  }, [])

  useEffect(() => {
    if (curUser) {
      const interval = setInterval(() => {
        setRedirect(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            router.push('/')
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [curUser, router])

    useEffect(() => {
      if (mode === 'signup') {
        setLogin(false)
      } else {
        setLogin(true)
      }
    }, [mode])

  return (
    <>
      {!curUser &&
        <div className='flex h-screen w-screen justify-center items-center overflow-hidden'>
          <div className='w-full absolute h-full overflow-hidden'>
            {shapes.map((shape, i) => (
              <div key={shape.id} className={`bg-radial from-white via-15% to-neutral-300 absolute animate-border-rotate`}
                style={{
                  height: shape.size,
                  width: shape.size,
                  left: `${3 + 5 * i}%`,
                  top: `${shape.top}%`,
                  opacity: shape.opacity,
                  rotate: `var(--border-angle)`,
                  transform: `rotate(${shape.rotate + i * 55}deg) translate(0px, ${shape.radius}px)`
                }}></div>
            ))}
          </div>
          <div className='relative flex justify-center items-center mt-10'>
            <div className='Login font-poppins flex justify-center items-center absolute group'>
              <div onClick={() => { setLogin(true) }} className='py-2 px-3 bg-white/20 absolute w-[40vw] h-[80vh] backdrop-blur-[8px] border-[1px] border-white shadow-2xl transition-all flex-col flex gap-5 overflow-hidden'>
                <h2 className={`bg-white text-center font-bold transition-all duration-500 inline-block text-transparent bg-clip-text ${login ? "text-[50px] mt-5" : "text-[40px] group-hover:text-[45px]"}`}>Login</h2>
                <div className={`flex flex-col items-center gap-5 mt-2 transition-all ${login ? "" : "mt-20 opacity-0"}`}>
                  <input className='self-center py-5 px-10 bg-white border w-[80%] rounded-xl' type="text" placeholder='Username or Email ID' onChange={(e) => { setCurUse(e.target.value) }} />
                  <input className='self-center py-5 px-10 bg-white border w-[80%] rounded-xl' type={showPass ? "text" : "password"} placeholder='Password' onChange={(e) => { setCurPass(e.target.value) }} />
                </div>
                <div className='w-[80%] self-center flex justify-between'>
                  <div className='flex gap-2'>
                    <button type="button" onClick={() => setShowPass(!showPass)} className={`w-4 h-4 rounded-sm border-[1px] mt-[5px] border-gray-700 transition-all hover:scale-105 active:scale-95 duration-500 cursor-pointer ${showPass ? "bg-blue-600" : "bg-white hover:bg-blue-300"}`}></button>
                    <p className='bg-white pointer-events-none bg-clip-text text-transparent w-fit text-lg'>Show Password</p>
                  </div>
                  <p className="bg-white bg-clip-text w-fit text-transparent text-lg cursor-pointer">
                    Forgot Password?
                  </p>
                </div>
                <button type="submit" onClick={handleSubmit} className='cursor-pointer rounded-2xl self-center py-3 px-5 w-[80%] transition-all duration-300 bg-white flex items-center justify-center hover:font-semibold hover:scale-105 hover:shadow-lg active:scale-95'>
                  <p className='text-black text-2xl font-semibold'>Login</p>
                </button>
              </div>
            </div>

            <div className={`Signup font-poppins justify-center transition-all items-center h-[80vh] z-[1] flex`}>
              <div onClick={() => { setLogin(false) }} className={`py-2 px-3 bg-[url(/nightsky.jpg)] bg-cover shadow-2xl absolute bottom-0 border-white border-b border-l border-r origin-bottom w-[40vw] transition-all pt-10 pb-10 duration-500 ease-in-out flex-col flex gap-5 group ${login ? "scale-y-[15%] rounded-t-[60%]" : "rounded-t-[30%]"}`}>
                <h2 className={`bg-white text-center font-bold inline-block text-transparent bg-clip-text transition-all ${login ? "text-[40px] group-hover:text-[45px] scale-y-[666%] mt-[250px] duration-500" : "text-[50px] duration-[1]"}`}>Sign up</h2>
                <div className='flex flex-col transition-all gap-5 mt-2'>
                  <input className={`self-center py-3 px-10 bg-white transition-all border w-[80%] rounded-xl ${login ? "scale-y-0" : ""}`} type="email" placeholder='Enter your Email ID' onChange={(e) => { setEmail(e.target.value) }} />
                  <input className={`self-center py-3 px-10 bg-white transition-all border w-[80%] rounded-xl ${login ? "scale-y-0" : ""}`} type="text" placeholder='Username' onChange={(e) => { setUser(e.target.value) }} />
                  <input className={`self-center py-3 px-10 bg-white transition-all border w-[80%] rounded-xl ${login ? "scale-y-0" : ""}`} type="password" placeholder='Password' onChange={(e) => { setPassword(e.target.value) }} />
                  <input className={`self-center py-3 px-10 bg-white transition-all border w-[80%] rounded-xl ${login ? "scale-y-0" : ""}`} type="password" placeholder='Confirm Password' onChange={(e) => { setCnfPass(e.target.value) }} />
                </div>
                <button onClick={handleSubmit} className={`bg-black cursor-pointer rounded-2xl self-center py-3 px-5 w-[80%] transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 ${login ? "scale-y-0" : ""}`}>
                  <p className='text-white text-2xl'>Continue</p>
                </button>
              </div>
            </div>
          </div>
        </div>}

      {curUser &&
        <div className='w-full h-full flex items-center justify-center'>
          <div className='flex-col text-center'>
            <p>You are already logged in!</p>
            <p>You will be redirected to Homepage in {redirect}</p>
          </div>
        </div>
      }
    </>
  )
}

export default LoginPage
