import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Lighting() {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null)
  const spotLightRef = useRef<THREE.SpotLight>(null)

  useFrame((state) => {
    // Subtle light movement for dynamic shadows
    if (directionalLightRef.current) {
      directionalLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 2
      directionalLightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.2) * 2
    }
  })

  return (
    <>
      {/* Ambient Light for overall brightness */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Main Directional Light (sun-like) */}
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Spot Light for dramatic effect */}
      <spotLight
        ref={spotLightRef}
        position={[0, 15, 0]}
        angle={Math.PI / 6}
        penumbra={0.5}
        intensity={0.8}
        color="#3b82f6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Fill Light to reduce harsh shadows */}
      <pointLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#f59e0b"
      />
      
      {/* Rim Light for product definition */}
      <pointLight
        position={[5, 3, 8]}
        intensity={0.4}
        color="#8b5cf6"
      />
      
      {/* Ground reflection light */}
      <hemisphereLight
        args={["#ffffff", "#444444", 0.6]}
        position={[0, -1, 0]}
      />
    </>
  )
}