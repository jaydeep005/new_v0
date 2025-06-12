"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useScroll, Float, Text3D } from "@react-three/drei"
import { MathUtils } from "three"
import type * as THREE from "three"

interface SceneProps {
  cursorPosition: { x: number; y: number }
}

export default function Scene({ cursorPosition }: SceneProps) {
  const { viewport } = useThree()
  const scroll = useScroll()
  const particlesRef = useRef<THREE.Points>(null)
  const gridRef = useRef<THREE.GridHelper>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const torusRef = useRef<THREE.Mesh>(null)
  const cubeRef = useRef<THREE.Mesh>(null)

  // Create particles
  const particleCount = 2000
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 15
      positions[i3 + 1] = (Math.random() - 0.5) * 15
      positions[i3 + 2] = (Math.random() - 0.5) * 15
    }
    return positions
  }, [particleCount])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    const scrollOffset = scroll.offset

    // Update particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const x = positions[i3]
        const y = positions[i3 + 1]
        const z = positions[i3 + 2]

        // Oscillate particles
        positions[i3] = x + Math.sin(time * 0.1 + i * 0.01) * 0.01
        positions[i3 + 1] = y + Math.cos(time * 0.1 + i * 0.01) * 0.01
        positions[i3 + 2] = z + Math.sin(time * 0.1 + i * 0.01) * 0.01
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true

      // Rotate particles based on cursor
      particlesRef.current.rotation.x = cursorPosition.y * 0.1
      particlesRef.current.rotation.y = cursorPosition.x * 0.1
    }

    // Update grid
    if (gridRef.current) {
      gridRef.current.position.y = -2 - scrollOffset * 20
      gridRef.current.material.opacity = 0.15 - scrollOffset * 0.1
    }

    // Update sphere
    if (sphereRef.current) {
      sphereRef.current.position.y = 1 - scrollOffset * 10
      sphereRef.current.rotation.y = time * 0.2
      sphereRef.current.rotation.z = time * 0.1

      // Respond to cursor
      sphereRef.current.position.x = MathUtils.lerp(sphereRef.current.position.x, cursorPosition.x * 2, 0.05)
    }

    // Update torus
    if (torusRef.current) {
      torusRef.current.position.y = -5 - scrollOffset * 10
      torusRef.current.rotation.x = time * 0.3
      torusRef.current.rotation.y = time * 0.2

      // Respond to cursor
      torusRef.current.rotation.z = MathUtils.lerp(torusRef.current.rotation.z, cursorPosition.x * 0.5, 0.1)
    }

    // Update cube
    if (cubeRef.current) {
      cubeRef.current.position.y = -15 - scrollOffset * 10
      cubeRef.current.rotation.x = time * 0.2
      cubeRef.current.rotation.y = time * 0.3

      // Respond to cursor
      cubeRef.current.position.x = MathUtils.lerp(cubeRef.current.position.x, -cursorPosition.x * 3, 0.05)
    }
  })

  return (
    <>
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
      </points>

      {/* Grid */}
      <gridHelper ref={gridRef} args={[30, 30, "#222222", "#111111"]} position={[0, -2, 0]} />

      {/* 3D Objects */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={sphereRef} position={[0, 1, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#2a6dd9" emissive="#1a4d99" roughness={0.2} metalness={0.8} wireframe />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
        <mesh ref={torusRef} position={[2, -5, 0]}>
          <torusGeometry args={[1.5, 0.5, 16, 32]} />
          <meshStandardMaterial color="#d92a6d" emissive="#991a4d" roughness={0.3} metalness={0.7} wireframe />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh ref={cubeRef} position={[-2, -15, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#2ad96d" emissive="#1a994d" roughness={0.4} metalness={0.6} wireframe />
        </mesh>
      </Float>

      {/* 3D Text */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        <Text3D
          font="/fonts/Geist_Bold.json"
          position={[-4, -25, 0]}
          rotation={[0, Math.PI * 0.1, 0]}
          size={1.5}
          height={0.2}
          curveSegments={12}
        >
          Digital
          <meshStandardMaterial color="#ffffff" emissive="#333333" roughness={0.1} metalness={0.9} />
        </Text3D>
      </Float>

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.2}>
        <Text3D
          font="/fonts/Geist_Bold.json"
          position={[0, -28, 0]}
          rotation={[0, -Math.PI * 0.1, 0]}
          size={1.5}
          height={0.2}
          curveSegments={12}
        >
          Welfare
          <meshStandardMaterial color="#ffffff" emissive="#333333" roughness={0.1} metalness={0.9} />
        </Text3D>
      </Float>
    </>
  )
}
