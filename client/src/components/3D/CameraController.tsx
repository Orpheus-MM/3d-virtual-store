import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

import { useStore } from '../../store/useStore'

export function CameraController() {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const { 
    cameraPosition, 
    setCameraPosition, 
    selectedObjectId, 
    products,
    store3DConfig 
  } = useStore()

  // Update camera position when it changes
  useEffect(() => {
    if (camera && cameraPosition) {
      camera.position.set(...cameraPosition)
    }
  }, [camera, cameraPosition])

  // Focus on selected object
  useEffect(() => {
    if (selectedObjectId && controlsRef.current) {
      const selectedProduct = products.find(p => p.id === selectedObjectId)
      if (selectedProduct) {
        // Calculate position for the selected product
        const index = products.findIndex(p => p.id === selectedObjectId)
        const cols = 3
        const spacing = 4
        const row = Math.floor(index / cols)
        const col = index % cols
        const targetX = (col - cols / 2) * spacing
        const targetZ = row * spacing - 2

        // Smoothly move camera to focus on the product
        const targetPosition = new THREE.Vector3(targetX + 3, 4, targetZ + 3)
        const targetLook = new THREE.Vector3(targetX, 1, targetZ)
        
        // Animate camera movement
        controlsRef.current.target.copy(targetLook)
        controlsRef.current.update()
      }
    }
  }, [selectedObjectId, products])

  // Track camera changes
  useFrame(() => {
    if (controlsRef.current && camera) {
      const currentPos = camera.position
      const newPos: [number, number, number] = [currentPos.x, currentPos.y, currentPos.z]
      
      // Only update if position has changed significantly
      const threshold = 0.1
      if (
        Math.abs(newPos[0] - cameraPosition[0]) > threshold ||
        Math.abs(newPos[1] - cameraPosition[1]) > threshold ||
        Math.abs(newPos[2] - cameraPosition[2]) > threshold
      ) {
        setCameraPosition(newPos)
      }
    }
  })

  // Camera limits and settings
  const minDistance = 2
  const maxDistance = 50
  const maxPolarAngle = Math.PI / 2.2 // Prevent camera from going below ground
  const minPolarAngle = Math.PI / 6 // Prevent camera from going too high

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={minDistance}
      maxDistance={maxDistance}
      maxPolarAngle={maxPolarAngle}
      minPolarAngle={minPolarAngle}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      panSpeed={0.8}
      target={[0, 0, 0]}
      autoRotate={false}
      autoRotateSpeed={0.5}
    />
  )
}