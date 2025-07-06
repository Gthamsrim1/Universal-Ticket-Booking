'use client'
import React, { forwardRef, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export const Globe = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF('./models/Globe.glb')

  const hasMoved = useRef(false)

  useFrame((_, delta) => {
    if (ref.current && !hasMoved.current) {
      ref.current.position.x = 1.5;
      ref.current.position.y = -0.7;
      ref.current.position.z = -0.5;
      hasMoved.current = true;
    }

    if (ref.current) {
      ref.current.rotation.y += 0.03 * delta;
      ref.current.rotation.x -= 0.01 * delta;
    }
  })

  return (
    <group {...props} dispose={null}>
      <mesh ref={ref} geometry={nodes.Mesh_0.geometry} material={materials.Material_0} />
    </group>
  )
})

useGLTF.preload('./models/Globe.glb')
