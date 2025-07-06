import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Acc(props) {
  const { nodes, materials } = useGLTF('./models/acc.glb')
  return (
    <group {...props} dispose={null}>
      <group scale={[1, 0.09, 1]}>
        <mesh geometry={nodes.Cylinder_1.geometry} material={materials['Material.001']} />
        <mesh geometry={nodes.Cylinder_2.geometry} material={materials['Material.002']} />
      </group>
    </group>
  )
}

useGLTF.preload('./models/acc.glb')
