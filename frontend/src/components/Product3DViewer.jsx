import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import { FaTimes, FaExpand, FaCompress } from 'react-icons/fa';

// 3D Product Model Component
function ProductModel({ url, color = '#ffffff' }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Fallback to a simple box if no model URL
  if (!url) {
    return (
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }

  return (
    <primitive 
      ref={meshRef}
      object={url}
      position={[0, 0, 0]}
      scale={[1, 1, 1]}
    />
  );
}

const Product3DViewer = ({ product, isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '#ffffff');

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center ${
        isFullscreen ? 'p-0' : 'p-8'
      }`}
    >
      <div className={`relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden ${
        isFullscreen ? 'w-full h-full' : 'max-w-4xl max-h-[80vh]'
      }`}>
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-xl font-semibold">
              {product.name} - 3D View
            </h3>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg"
              >
                {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg"
              >
                <FaTimes size={16} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className={`h-full ${isFullscreen ? 'h-screen' : 'h-[600px]'}`}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            className="w-full h-full"
          >
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            
            <Suspense fallback={null}>
              <ProductModel 
                url={product.model3D} 
                color={selectedColor}
              />
              <Environment preset="sunset" />
              <ContactShadows
                position={[0, -1.5, 0]}
                opacity={0.4}
                scale={10}
                blur={2}
                far={4}
              />
            </Suspense>
            
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={10}
              autoRotate={true}
              autoRotateSpeed={1}
            />
          </Canvas>
        </div>

        {/* Controls Panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
          <div className="max-w-2xl mx-auto">
            {/* Product Info */}
            <div className="text-center mb-4">
              <h4 className="text-white text-lg font-medium">{product.name}</h4>
              <p className="text-white/80 text-sm">{product.description}</p>
              <p className="text-white text-2xl font-bold mt-2">${product.price}</p>
            </div>

            {/* Color Options */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex justify-center space-x-2 mb-4">
                <p className="text-white/80 text-sm mr-2 self-center">Color:</p>
                {product.colors.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-medium"
              >
                View Details
              </motion.button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute top-20 left-4 bg-white/10 backdrop-blur-sm text-white p-3 rounded-lg text-sm">
          <p className="font-medium mb-1">Controls:</p>
          <p>• Click & drag to rotate</p>
          <p>• Scroll to zoom</p>
          <p>• Right-click & drag to pan</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Product3DViewer;
