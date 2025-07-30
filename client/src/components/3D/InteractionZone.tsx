import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import { animated, useSpring } from '@react-spring/three'
import * as THREE from 'three'
import type { InteractionZone as InteractionZoneType } from '@shared/types'

interface InteractionZoneProps {
  zone: InteractionZoneType
  onClick: () => void
}

export function InteractionZone({ zone, onClick }: InteractionZoneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Animation spring
  const { scale, opacity } = useSpring({
    scale: hovered ? 1.1 : 1,
    opacity: hovered ? 0.8 : 0.4,
    config: { mass: 1, tension: 280, friction: 60 }
  })

  // Gentle pulsing animation
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
      const material = meshRef.current.material as any
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = pulse * 0.1
      }
    }
  })

  const getZoneColor = () => {
    switch (zone.type) {
      case 'product_display':
        return '#3b82f6' // Blue
      case 'checkout':
        return '#059669' // Green
      case 'information':
        return '#f59e0b' // Amber
      case 'navigation':
        return '#8b5cf6' // Purple
      default:
        return '#6b7280' // Gray
    }
  }

  const getZoneIcon = () => {
    switch (zone.type) {
      case 'product_display':
        return '🛍️'
      case 'checkout':
        return '💳'
      case 'information':
        return 'ℹ️'
      case 'navigation':
        return '🧭'
      default:
        return '📍'
    }
  }

  return (
    <group position={[zone.position.x, zone.position.y, zone.position.z]}>
      {/* Zone Boundary Visualization */}
      <animated.mesh
        ref={meshRef}
        scale={scale}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[zone.size.x, zone.size.y, zone.size.z]} />
        <meshStandardMaterial
          color={getZoneColor()}
          transparent
          opacity={0.2}
          emissive={getZoneColor()}
          emissiveIntensity={0.05}
          wireframe={false}
        />
      </animated.mesh>

      {/* Zone Outline */}
      <mesh>
        <boxGeometry args={[zone.size.x, zone.size.y, zone.size.z]} />
        <meshBasicMaterial
          color={getZoneColor()}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>

      {/* Zone Label */}
      <Text
        position={[0, zone.size.y / 2 + 0.5, 0]}
        fontSize={0.4}
        color={getZoneColor()}
        anchorX="center"
        anchorY="bottom"
        font="/fonts/inter-bold.woff"
      >
        {zone.type.replace('_', ' ').toUpperCase()}
      </Text>

      {/* Zone Icon */}
      <Html
        position={[0, zone.size.y / 2 + 1.5, 0]}
        transform
        sprite
        distanceFactor={6}
      >
        <div className="text-2xl">{getZoneIcon()}</div>
      </Html>

      {/* Interactive Information Panel */}
      {hovered && zone.content && (
        <Html
          position={[0, zone.size.y / 2 + 2, 0]}
          transform
          sprite
          distanceFactor={8}
          className="pointer-events-none"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 max-w-xs">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">
              {zone.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Zone
            </h3>
            <p className="text-gray-600 text-xs mb-2">
              {zone.content}
            </p>
            {zone.actions && zone.actions.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {zone.actions.map((action, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {action}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Floor Marker */}
      <mesh 
        position={[0, -zone.size.y / 2 - 0.01, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[zone.size.x / 2 - 0.2, zone.size.x / 2, 32]} />
        <meshBasicMaterial
          color={getZoneColor()}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating Particles for Zone Activity */}
      {zone.type === 'product_display' && (
        <group>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * zone.size.x,
                Math.random() * zone.size.y,
                (Math.random() - 0.5) * zone.size.z
              ]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial
                color={getZoneColor()}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}