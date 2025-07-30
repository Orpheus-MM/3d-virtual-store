import { useMemo } from 'react'
import { Plane, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import type { Store3DConfig } from '@shared/types'

interface StoreEnvironmentProps {
  config: Store3DConfig | null
}

export function StoreEnvironment({ config }: StoreEnvironmentProps) {
  // Load textures
  const floorTexture = useTexture('/textures/floor.jpg')
  const wallTexture = useTexture('/textures/wall.jpg')
  
  // Configure texture properties
  useMemo(() => {
    if (floorTexture) {
      floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
      floorTexture.repeat.set(10, 10)
    }
    if (wallTexture) {
      wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
      wallTexture.repeat.set(5, 2)
    }
  }, [floorTexture, wallTexture])

  if (!config) return null

  const { theme } = config

  return (
    <group>
      {/* Floor */}
      <Plane
        args={[40, 40]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          map={floorTexture}
          color="#f3f4f6"
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>

      {/* Back Wall */}
      <Plane
        args={[40, 15]}
        position={[0, 7, -20]}
        receiveShadow
      >
        <meshStandardMaterial
          map={wallTexture}
          color={theme.secondaryColor}
          roughness={0.9}
          metalness={0.05}
        />
      </Plane>

      {/* Left Wall */}
      <Plane
        args={[40, 15]}
        rotation={[0, Math.PI / 2, 0]}
        position={[-20, 7, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          map={wallTexture}
          color={theme.secondaryColor}
          roughness={0.9}
          metalness={0.05}
        />
      </Plane>

      {/* Right Wall */}
      <Plane
        args={[40, 15]}
        rotation={[0, -Math.PI / 2, 0]}
        position={[20, 7, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          map={wallTexture}
          color={theme.secondaryColor}
          roughness={0.9}
          metalness={0.05}
        />
      </Plane>

      {/* Ceiling (optional, for enclosed feeling) */}
      <Plane
        args={[40, 40]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 15, 0]}
        visible={config.layout === 'mall'}
      >
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </Plane>

      {/* Decorative Elements */}
      {config.layout === 'showroom' && (
        <group>
          {/* Pillars */}
          {[-15, -5, 5, 15].map((x, index) => (
            <mesh
              key={index}
              position={[x, 4, -18]}
              castShadow
              receiveShadow
            >
              <cylinderGeometry args={[0.3, 0.3, 8, 8]} />
              <meshStandardMaterial
                color={theme.primaryColor}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
          ))}

          {/* Ceiling Lights */}
          {Array.from({ length: 12 }, (_, i) => {
            const x = (i % 4 - 1.5) * 8
            const z = Math.floor(i / 4) * 8 - 8
            return (
              <group key={i} position={[x, 12, z]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
                  <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={0.2}
                  />
                </mesh>
                <pointLight
                  position={[0, -1, 0]}
                  intensity={0.3}
                  distance={8}
                  decay={2}
                  color="#ffffff"
                />
              </group>
            )
          })}
        </group>
      )}

      {/* Gallery Layout Elements */}
      {config.layout === 'gallery' && (
        <group>
          {/* Picture Frames on Walls */}
          {[-15, -5, 5, 15].map((x, index) => (
            <mesh
              key={index}
              position={[x, 6, -19.8]}
              castShadow
            >
              <boxGeometry args={[2, 3, 0.1]} />
              <meshStandardMaterial
                color="#8b4513"
                roughness={0.6}
                metalness={0.1}
              />
            </mesh>
          ))}
          
          {/* Spotlights for artwork */}
          {[-15, -5, 5, 15].map((x, index) => (
            <spotLight
              key={index}
              position={[x, 12, -15]}
              target-position={[x, 6, -19.8]}
              angle={Math.PI / 8}
              penumbra={0.3}
              intensity={0.5}
              color="#ffffff"
              castShadow
            />
          ))}
        </group>
      )}

      {/* Modern Layout Elements */}
      {config.layout === 'custom' && config.theme.ambiance === 'futuristic' && (
        <group>
          {/* Neon Strip Lights */}
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[8, 8.2, 64]} />
            <meshBasicMaterial
              color={theme.primaryColor}
              transparent
              opacity={0.6}
            />
          </mesh>
          
          {/* Holographic Displays */}
          {[[-10, 2, -10], [10, 2, -10], [0, 2, 10]].map((pos, index) => (
            <mesh
              key={index}
              position={[pos[0], pos[1], pos[2]]}
            >
              <planeGeometry args={[2, 2]} />
              <meshBasicMaterial
                color={theme.primaryColor}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}