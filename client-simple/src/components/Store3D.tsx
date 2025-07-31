import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Text, Box } from '@react-three/drei'
import { useStore } from '../store'
import { Product } from '../types'

function ProductMesh({ product }: { product: Product }) {
  const { selectProduct } = useStore()

  const getProductColor = (category: string) => {
    switch (category) {
      case 'furniture': return '#8B4513'
      case 'electronics': return '#4169E1'
      default: return '#808080'
    }
  }

  return (
    <group position={product.position}>
      {/* Product Box */}
      <Box
        args={product.scale}
        onClick={() => selectProduct(product)}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <meshStandardMaterial 
          color={getProductColor(product.category)}
          roughness={0.5}
          metalness={0.2}
        />
      </Box>
      
      {/* Product Label */}
      <Text
        position={[0, product.scale[1] + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {product.name}
      </Text>
      
      {/* Price Label */}
      <Text
        position={[0, product.scale[1] + 0.2, 0]}
        fontSize={0.2}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
      >
        ${product.price}
      </Text>
    </group>
  )
}

function StoreEnvironment() {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 4, -10]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Welcome Sign */}
      <Text
        position={[0, 3, -9.5]}
        fontSize={1}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
      >
        Welcome to 3D Store
      </Text>
    </>
  )
}

export function Store3D() {
  const { products } = useStore()

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 5, 8], fov: 75 }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, 10, 10]} intensity={0.5} />
          
          {/* Environment */}
          <Environment preset="city" />
          
          {/* Store Environment */}
          <StoreEnvironment />
          
          {/* Products */}
          {products.map((product) => (
            <ProductMesh key={product.id} product={product} />
          ))}
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}