'use client'
import React, { useEffect, useState } from 'react'

interface Shape {
  id: number;
  size: number;
  top: number;
  left: number;
  opacity: number;
  borderRadius: string;
  rotate: number;
  radius: number;
}

const page = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  useEffect(() => {
      const generatedShapes: Shape[] = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: Math.floor(Math.random() * 30) + 20, 
        top: Math.random() * 70 + 10, 
        left: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.2,
        borderRadius: Math.random() > 0.5 ? '50%' : '0%',
        rotate: Math.random()*360,
        radius: Math.random()*250 + 100
      }));
      setShapes(generatedShapes);
    }, []);
  return (
    <>
      <div className='flex h-screen w-screen justify-center items-center overflow-hidden'>
          <div className='w-full absolute h-full overflow-hidden'>
            {shapes.map((shape, i) => (
              <div className={`bg-radial from-white via-15% to-neutral-300 absolute animate-border-rotate`}
              style={{
                height: shape.size,
                width: shape.size,
                left: `${3 + 5 * i}%`,
                top: `${shape.top}%`,
                opacity: shape.opacity,
                rotate: 'var(--border-angle)',
                transform: `rotate(${shape.rotate + i * 55}deg) translate(0px, ${shape.radius}px)`
              }}></div>
            ))}
          </div>   
      </div>
    </>
  )
}

export default page