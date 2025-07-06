'use client'
import React, { forwardRef, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export const Bus = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF('./models/Bus.glb')
  const angleRef = useRef(0);

  useFrame((_, delta) => {
    if (ref.current) {
      angleRef.current += delta * 0.5
      const radius = 1.65

      const x = radius * Math.cos(angleRef.current)/ 2 + 1.3
      const z = radius * Math.sin(angleRef.current) / 1.5 - 0.5

      ref.current.position.set(x, -0.7, z)

      ref.current.lookAt(
        radius * Math.cos(angleRef.current + 0.01),
        -0.7,
        radius * Math.sin(angleRef.current + 0.01)
      )
    }
  })

  return (
    <group ref={ref} {...props} scale={0.05} dispose={null}>
      <mesh geometry={nodes.Cube072.geometry} material={materials.RED} />
      <mesh geometry={nodes.Cube072_1.geometry} material={materials.GLASS} />
      <mesh geometry={nodes.Cube072_2.geometry} material={materials.CROM} />
      <mesh geometry={nodes.Cube072_3.geometry} material={materials['YELLOW LIGHT']} />
      <mesh geometry={nodes.Cube072_4.geometry} material={materials.PLATE} />
      <mesh geometry={nodes.Cube072_5.geometry} material={materials.BLACK} />
      <mesh geometry={nodes.Cube072_6.geometry} material={materials['WHITE LIGHT']} />
      <mesh geometry={nodes.Cube072_7.geometry} material={materials['RED LIGHT']} />
      <mesh geometry={nodes.Cube072_8.geometry} material={materials.TIRES} />
    </group>
  )
})

useGLTF.preload('./models/Bus.glb')
