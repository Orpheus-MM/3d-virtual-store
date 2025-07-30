import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, Grid } from '@react-three/drei'
import * as THREE from 'three'

import { useStore } from '../../store/useStore'
import { ProductDisplay } from './ProductDisplay'
import { InteractionZone } from './InteractionZone'
import { StoreEnvironment } from './StoreEnvironment'

export function Scene3D() {
  const groupRef = useRef<THREE.Group>(null)
  const { 
    products, 
    store3DConfig, 
    selectedObjectId,
    setSelectedObject 
  } = useStore()

  // Animate the scene subtly
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
    }
  })

  // Generate product positions in a grid layout
  const productPositions = useMemo(() => {
    const positions: Array<{ id: string; position: [number, number, number] }> = []
    const cols = 3
    const spacing = 4
    
    products.forEach((product, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols
      const x = (col - cols / 2) * spacing
      const z = row * spacing - 2
      const y = 0
      
      positions.push({
        id: product.id,
        position: [x, y, z]
      })
    })
    
    return positions
  }, [products])

  const handleObjectClick = (objectId: string) => {
    setSelectedObject(selectedObjectId === objectId ? null : objectId)
  }

  return (
    <group ref={groupRef}>
      {/* Environment and Lighting */}
      <Environment preset="city" />
      
      {/* Store Environment (floor, walls, decorations) */}
      <StoreEnvironment config={store3DConfig} />
      
      {/* Ground Grid */}
      <Grid 
        args={[20, 20]} 
        position={[0, -0.01, 0]}
        fadeDistance={15}
        fadeStrength={0.5}
        cellColor="#6b7280"
        sectionColor="#374151"
        cellSize={1}
        sectionSize={5}
      />
      
      {/* Contact Shadows for realism */}
      <ContactShadows 
        position={[0, -0.5, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={1} 
        far={10} 
        resolution={256} 
        color="#000000" 
      />
      
      {/* Product Displays */}
      {products.map((product, index) => {
        const positionData = productPositions.find(p => p.id === product.id)
        if (!positionData) return null
        
        return (
          <ProductDisplay
            key={product.id}
            product={product}
            position={positionData.position}
            isSelected={selectedObjectId === product.id}
            onClick={() => handleObjectClick(product.id)}
          />
        )
      })}
      
      {/* Interaction Zones */}
      {store3DConfig?.interactionZones.map((zone) => (
        <InteractionZone
          key={zone.id}
          zone={zone}
          onClick={() => handleObjectClick(zone.id)}
        />
      ))}
      
      {/* Ambient Particles for atmosphere */}
      <group>
        {Array.from({ length: 50 }, (_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 40,
              Math.random() * 10 + 2,
              (Math.random() - 0.5) * 40
            ]}
          >
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial 
              color="#ffffff" 
              transparent 
              opacity={Math.random() * 0.3 + 0.1} 
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}