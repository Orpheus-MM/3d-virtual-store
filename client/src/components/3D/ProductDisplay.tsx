import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Box, useGLTF, Html } from '@react-three/drei'
import { animated, useSpring } from '@react-spring/three'
import * as THREE from 'three'
import type { Product } from '@shared/types'

interface ProductDisplayProps {
  product: Product
  position: [number, number, number]
  isSelected: boolean
  onClick: () => void
}

export function ProductDisplay({ product, position, isSelected, onClick }: ProductDisplayProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  // Load 3D model if available
  const model = product.model3D ? useGLTF(product.model3D.url) : null
  
  // Animation springs
  const { scale, positionY } = useSpring({
    scale: isSelected ? 1.2 : hovered ? 1.1 : 1,
    positionY: isSelected ? position[1] + 0.5 : position[1],
    config: { mass: 1, tension: 280, friction: 60 }
  })

  // Rotate the product slowly
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const handlePointerOver = () => setHovered(true)
  const handlePointerOut = () => setHovered(false)

  return (
    <group position={position}>
      {/* Product Platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.2, 16]} />
        <meshStandardMaterial 
          color={isSelected ? "#3b82f6" : "#e5e7eb"} 
          transparent 
          opacity={0.8}
        />
      </mesh>

      {/* Product Model or Placeholder */}
      <animated.group
        position-y={positionY}
        scale={scale}
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {model ? (
          <primitive 
            ref={meshRef}
            object={model.scene.clone()} 
            scale={product.model3D?.scale || 1}
            castShadow
            receiveShadow
          />
        ) : (
          <Box 
            ref={meshRef}
            args={[1, 1, 1]} 
            castShadow 
            receiveShadow
          >
            <meshStandardMaterial 
              color="#6b7280" 
              roughness={0.3} 
              metalness={0.1} 
            />
          </Box>
        )}
      </animated.group>

      {/* Product Info Panel */}
      {(hovered || isSelected) && (
        <Html
          position={[0, 2, 0]}
          transform
          sprite
          distanceFactor={10}
          className="pointer-events-none"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 min-w-[200px]">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">
              {product.name}
            </h3>
            <p className="text-gray-600 text-xs mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">
                {product.category}
              </span>
            </div>
            {product.inventory <= 5 && (
              <div className="text-xs text-orange-600 mt-1">
                Only {product.inventory} left!
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Product Label */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.3}
        color={isSelected ? "#3b82f6" : "#374151"}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-medium.woff"
      >
        {product.name}
      </Text>

      {/* Price Label */}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.25}
        color="#059669"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        ${product.price.toFixed(2)}
      </Text>

      {/* Selection Ring */}
      {isSelected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.7, 32]} />
          <meshBasicMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Hover Glow Effect */}
      {hovered && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  )
}

// Preload models
useGLTF.preload('/models/sofa.glb')
useGLTF.preload('/models/headphones.glb')