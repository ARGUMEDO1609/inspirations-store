import React, { useRef, useEffect } from 'react';
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

extend({ THREE });

function Model({ url, rotation = [0, 0, 0], scale = 1 }) {
  const group = useRef();
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.metalness = Math.min(child.material.metalness || 0, 0.3);
          child.material.roughness = Math.max(child.material.roughness || 1, 0.7);
        }
      }
    });
  }, [scene]);

  return (
    <group ref={group} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

function ModelWrapper({ url, rotation, scale }) {
  return (
    <>
      <Environment preset="studio" background={false} />
      <Model url={url} rotation={rotation} scale={scale} />
    </>
  );
}

export default function Product3DViewer({ 
  modelUrl, 
  fallbackImage, 
  className = '', 
  rotation = [0, -0.3, 0], 
  scale = 1 
}) {
  const [mounted, setMounted] = React.useState(false);
  const canvasRef = useRef(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className} glass-panel flex items-center justify-center relative overflow-hidden rounded-[2.1rem]`}>
        {fallbackImage && (
          <img 
            src={fallbackImage} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="flex items-center justify-center z-10 p-8">
          <div className="text-center text-[var(--text-muted)]">
            <div className="h-12 w-12 animate-spin border-4 border-[var(--accent)] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-sm">Cargando modelo 3D...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} glass-panel relative overflow-hidden rounded-[2.1rem]`} ref={canvasRef}>
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 40 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true 
        }}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ModelWrapper 
          url={modelUrl} 
          rotation={rotation} 
          scale={scale} 
        />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 pointer-events-none">
        <div className="glass-panel px-3 py-1 rounded-full text-xs text-[var(--text-muted)] justify-self-center pointer-events-auto">
          Arrastra para rotar • Scroll para zoom
        </div>
      </div>
    </div>
  );
}

