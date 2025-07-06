'use client'
import { OrbitControls, Stars } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Globe } from './Globe'
import { Bus } from './Bus'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

const CameraRig = () => {
  const { camera } = useThree()
  const targetRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      targetRotation.current.x = y * 0.1
      targetRotation.current.y = x * 0.1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.03
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.03
  })

  return null
}

const ThreeScene = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  const busRef = useRef<THREE.Mesh>(null)
  const angleRef = useRef(0)

  return (
    <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
      <Stars radius={100} depth={50} count={500} factor={6} saturation={0} fade/>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />

      <EffectComposer>
        <Bloom intensity={1} luminanceThreshold={0.2} luminanceSmoothing={0.0} blendFunction={BlendFunction.ADD} />
      </EffectComposer>

      <CameraRig />

      <Globe ref={globeRef} />
      <Bus ref={busRef} />
    </Canvas>
  )
}

export default ThreeScene
