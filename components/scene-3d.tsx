"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, MeshTransmissionMaterial } from "@react-three/drei"
import { MathUtils } from "three"
import * as THREE from "three"

interface Scene3DProps {
  cursorPosition: { x: number; y: number }
}

export default function Scene3D({ cursorPosition }: Scene3DProps) {
  const [scrollY, setScrollY] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [smoothCursor, setSmoothCursor] = useState({ x: 0, y: 0 })
  const [cursorVelocity, setCursorVelocity] = useState({ x: 0, y: 0 })

  // Main crystal 3D object refs
  const crystalGroupRef = useRef<THREE.Group>(null)
  const crystalCoreRef = useRef<THREE.Mesh>(null)
  const crystalRingsRef = useRef<THREE.Group>(null)
  const energyFieldRef = useRef<THREE.Points>(null)
  const orbitingShardsRef = useRef<THREE.Group>(null)

  // Previous cursor position for velocity calculation
  const prevCursorRef = useRef({ x: 0, y: 0 })

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Initialize after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Create energy field particles
  const particleCount = 150
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const radius = 2 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      // Energy colors
      const energy = Math.random()
      colors[i3] = MathUtils.lerp(0.1, 1, energy)
      colors[i3 + 1] = MathUtils.lerp(0.5, 1, energy)
      colors[i3 + 2] = 1

      sizes[i] = Math.random() * 0.05 + 0.02
    }
    return { positions, colors, sizes }
  }, [particleCount])

  useFrame((state, delta) => {
    if (!isInitialized) return

    const time = state.clock.getElapsedTime()
    const scrollProgress = Math.max(0, Math.min(1, scrollY / (window.innerHeight * 4)))

    // Calculate cursor velocity for dynamic effects
    const velocityX = cursorPosition.x - prevCursorRef.current.x
    const velocityY = cursorPosition.y - prevCursorRef.current.y
    setCursorVelocity({ x: velocityX, y: velocityY })
    prevCursorRef.current = { x: cursorPosition.x, y: cursorPosition.y }

    // Smooth cursor interpolation with adaptive easing
    const adaptiveEasing = Math.min(0.12 + Math.abs(velocityX + velocityY) * 0.02, 0.2)
    setSmoothCursor((prev) => ({
      x: MathUtils.lerp(prev.x, cursorPosition.x, adaptiveEasing),
      y: MathUtils.lerp(prev.y, cursorPosition.y, adaptiveEasing),
    }))

    // Enhanced cursor influence with smooth falloff
    const distance = Math.sqrt(smoothCursor.x * smoothCursor.x + smoothCursor.y * smoothCursor.y)
    const influence = Math.max(0.3, 1 - distance * 0.5) // Smooth falloff based on distance

    const cursorInfluence = {
      x: smoothCursor.x * 0.8 * influence,
      y: smoothCursor.y * 0.6 * influence,
      rotation: {
        x: smoothCursor.y * 0.2 * influence,
        y: smoothCursor.x * 0.25 * influence,
        z: (smoothCursor.x + smoothCursor.y) * 0.15 * influence,
      },
      velocity: Math.sqrt(velocityX * velocityX + velocityY * velocityY),
    }

    // Main crystal group positioning with buttery smooth movement
    if (crystalGroupRef.current) {
      const targetY = -scrollProgress * 3
      const targetX = cursorInfluence.x
      const targetZ = cursorInfluence.y

      // Ultra-smooth position interpolation
      crystalGroupRef.current.position.y = MathUtils.lerp(crystalGroupRef.current.position.y, targetY, 0.06)
      crystalGroupRef.current.position.x = MathUtils.lerp(crystalGroupRef.current.position.x, targetX, 0.08)
      crystalGroupRef.current.position.z = MathUtils.lerp(crystalGroupRef.current.position.z, targetZ, 0.08)

      // Smooth rotation with cursor influence and velocity response
      const baseRotationY = time * 0.2 + scrollProgress * Math.PI * 4
      const velocityBoost = cursorInfluence.velocity * 0.1
      const cursorRotationY = cursorInfluence.rotation.y + velocityBoost

      crystalGroupRef.current.rotation.y = MathUtils.lerp(
        crystalGroupRef.current.rotation.y,
        baseRotationY + cursorRotationY,
        0.08,
      )

      // Buttery smooth tilt based on cursor with momentum
      crystalGroupRef.current.rotation.x = MathUtils.lerp(
        crystalGroupRef.current.rotation.x,
        cursorInfluence.rotation.x,
        0.06,
      )
      crystalGroupRef.current.rotation.z = MathUtils.lerp(
        crystalGroupRef.current.rotation.z,
        cursorInfluence.rotation.z,
        0.06,
      )
    }

    // Crystal core transformations with enhanced smoothness
    if (crystalCoreRef.current) {
      const section = Math.floor(scrollProgress * 5)
      const sectionProgress = (scrollProgress * 5) % 1

      // Smooth cursor influence on core with velocity response
      const velocityScale = 1 + cursorInfluence.velocity * 0.02
      const coreRotationX = time * 0.3 + cursorInfluence.rotation.x * 0.7
      const coreRotationZ = time * 0.2 + cursorInfluence.rotation.z * 0.5

      switch (section) {
        case 0: // Hero - Enhanced pulsing with cursor response
          const heroScale = (1 + Math.sin(time * 2) * 0.1 + Math.abs(smoothCursor.x) * 0.08) * velocityScale
          crystalCoreRef.current.scale.setScalar(MathUtils.lerp(crystalCoreRef.current.scale.x, heroScale, 0.08))
          crystalCoreRef.current.rotation.x = MathUtils.lerp(crystalCoreRef.current.rotation.x, coreRotationX, 0.08)
          crystalCoreRef.current.rotation.z = MathUtils.lerp(crystalCoreRef.current.rotation.z, coreRotationZ, 0.08)
          break

        case 1: // Services - Smooth diamond with enhanced cursor influence
          const scale1 = (0.8 + sectionProgress * 0.4 + Math.abs(smoothCursor.y) * 0.12) * velocityScale
          const targetScaleX = MathUtils.lerp(crystalCoreRef.current.scale.x, scale1, 0.1)
          const targetScaleY = MathUtils.lerp(crystalCoreRef.current.scale.y, 1.2 * velocityScale, 0.1)
          const targetScaleZ = MathUtils.lerp(crystalCoreRef.current.scale.z, scale1, 0.1)
          crystalCoreRef.current.scale.set(targetScaleX, targetScaleY, targetScaleZ)

          crystalCoreRef.current.rotation.x = MathUtils.lerp(
            crystalCoreRef.current.rotation.x,
            time * 0.5 + cursorInfluence.rotation.x * 0.8,
            0.1,
          )
          crystalCoreRef.current.rotation.y = MathUtils.lerp(
            crystalCoreRef.current.rotation.y,
            time * 0.8 + cursorInfluence.rotation.y * 0.9,
            0.1,
          )
          break

        case 2: // About - Fluid morphing with cursor distortion
          const morph = Math.sin(time * 1.5) * 0.3 + smoothCursor.x * 0.25
          const morphScaleX = MathUtils.lerp(crystalCoreRef.current.scale.x, 1 + morph, 0.09)
          const morphScaleY = MathUtils.lerp(crystalCoreRef.current.scale.y, 1.5 - morph * 0.5, 0.09)
          const morphScaleZ = MathUtils.lerp(crystalCoreRef.current.scale.z, 1 + morph, 0.09)
          crystalCoreRef.current.scale.set(morphScaleX, morphScaleY, morphScaleZ)

          crystalCoreRef.current.rotation.z = MathUtils.lerp(
            crystalCoreRef.current.rotation.z,
            time * 0.4 + cursorInfluence.rotation.z * 1.2,
            0.09,
          )
          break

        case 3: // Projects - Complex smooth interactions
          const projectScale =
            (1.2 + Math.cos(time * 1.2) * 0.2 + (Math.abs(smoothCursor.x) + Math.abs(smoothCursor.y)) * 0.15) *
            velocityScale
          crystalCoreRef.current.scale.setScalar(MathUtils.lerp(crystalCoreRef.current.scale.x, projectScale, 0.1))

          crystalCoreRef.current.rotation.x = MathUtils.lerp(
            crystalCoreRef.current.rotation.x,
            time * 0.6 + cursorInfluence.rotation.x * 0.9,
            0.11,
          )
          crystalCoreRef.current.rotation.y = MathUtils.lerp(
            crystalCoreRef.current.rotation.y,
            time * 0.3 + cursorInfluence.rotation.y * 0.8,
            0.11,
          )
          crystalCoreRef.current.rotation.z = MathUtils.lerp(
            crystalCoreRef.current.rotation.z,
            time * 0.1 + cursorInfluence.rotation.z * 0.6,
            0.11,
          )
          break

        case 4: // Contact - Intense smooth glow with maximum responsiveness
          const glow =
            (1.3 + Math.sin(time * 3) * 0.2 + (Math.abs(smoothCursor.x) + Math.abs(smoothCursor.y)) * 0.2) *
            velocityScale
          crystalCoreRef.current.scale.setScalar(MathUtils.lerp(crystalCoreRef.current.scale.x, glow, 0.12))

          crystalCoreRef.current.rotation.y = MathUtils.lerp(
            crystalCoreRef.current.rotation.y,
            time * 0.4 + cursorInfluence.rotation.y * 1.5,
            0.12,
          )
          break

        default:
          crystalCoreRef.current.scale.setScalar(MathUtils.lerp(crystalCoreRef.current.scale.x, 1, 0.08))
          break
      }
    }

    // Animate crystal rings with ultra-smooth cursor influence
    if (crystalRingsRef.current) {
      const ringRotationX = time * 0.2 + cursorInfluence.rotation.x * 0.4
      const ringRotationY = -time * 0.3 + cursorInfluence.rotation.y * 0.5
      const ringRotationZ = time * 0.1 + cursorInfluence.rotation.z * 0.3

      crystalRingsRef.current.rotation.x = MathUtils.lerp(crystalRingsRef.current.rotation.x, ringRotationX, 0.08)
      crystalRingsRef.current.rotation.y = MathUtils.lerp(crystalRingsRef.current.rotation.y, ringRotationY, 0.08)
      crystalRingsRef.current.rotation.z = MathUtils.lerp(crystalRingsRef.current.rotation.z, ringRotationZ, 0.08)

      // Smooth scale with cursor and velocity influence
      const ringScale = 0.5 + scrollProgress * 0.8 + Math.abs(smoothCursor.x) * 0.15 + cursorInfluence.velocity * 0.05
      crystalRingsRef.current.scale.setScalar(MathUtils.lerp(crystalRingsRef.current.scale.x, ringScale, 0.07))
    }

    // Animate orbiting shards with buttery smooth cursor influence
    if (orbitingShardsRef.current) {
      const shardRotationY = time * 0.5 + cursorInfluence.rotation.y * 0.6
      const shardRotationX = Math.sin(time * 0.3) * 0.2 + cursorInfluence.rotation.x * 0.4

      orbitingShardsRef.current.rotation.y = MathUtils.lerp(orbitingShardsRef.current.rotation.y, shardRotationY, 0.09)
      orbitingShardsRef.current.rotation.x = MathUtils.lerp(orbitingShardsRef.current.rotation.x, shardRotationX, 0.09)

      // Individual shard animations with enhanced smoothness
      orbitingShardsRef.current.children.forEach((shard, index) => {
        if (shard instanceof THREE.Mesh) {
          const shardSpeedX = 0.5 + index * 0.1 + Math.abs(smoothCursor.x) * 0.3
          const shardSpeedZ = 0.3 + index * 0.05 + Math.abs(smoothCursor.y) * 0.25

          shard.rotation.x = MathUtils.lerp(shard.rotation.x, time * shardSpeedX, 0.1)
          shard.rotation.z = MathUtils.lerp(shard.rotation.z, time * shardSpeedZ, 0.1)

          // Ultra-smooth orbit motion with cursor influence
          const orbitRadius = 3 + Math.sin(time * 0.5 + index) * 0.5 + Math.abs(smoothCursor.x) * 0.4
          const angle = time * 0.4 + index * ((Math.PI * 2) / 6) + smoothCursor.y * 0.3
          const targetX = Math.cos(angle) * orbitRadius
          const targetZ = Math.sin(angle) * orbitRadius
          const targetY = Math.sin(time * 0.6 + index) * 0.5 + smoothCursor.y * 0.3

          shard.position.x = MathUtils.lerp(shard.position.x, targetX, 0.08)
          shard.position.z = MathUtils.lerp(shard.position.z, targetZ, 0.08)
          shard.position.y = MathUtils.lerp(shard.position.y, targetY, 0.08)
        }
      })
    }

    // Enhanced particle system with ultra-smooth cursor response
    if (energyFieldRef.current?.geometry?.attributes?.position) {
      const positions = energyFieldRef.current.geometry.attributes.position.array as Float32Array
      const colors = energyFieldRef.current.geometry.attributes.color.array as Float32Array

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        // Smooth orbital motion with enhanced cursor influence
        const orbitSpeed = 0.1 + (i % 20) * 0.01 + Math.abs(smoothCursor.x) * 0.03
        const verticalSpeed = 0.05 + (i % 15) * 0.005 + Math.abs(smoothCursor.y) * 0.02
        const radius = Math.sqrt(positions[i3] * positions[i3] + positions[i3 + 2] * positions[i3 + 2])

        const angle = Math.atan2(positions[i3 + 2], positions[i3]) + orbitSpeed + smoothCursor.x * 0.02
        const targetX = radius * Math.cos(angle)
        const targetZ = radius * Math.sin(angle)
        const targetY = positions[i3 + 1] + Math.sin(time * verticalSpeed + i * 0.1) * 0.02 + smoothCursor.y * 0.01

        // Ultra-smooth particle movement
        positions[i3] = MathUtils.lerp(positions[i3], targetX, 0.12)
        positions[i3 + 2] = MathUtils.lerp(positions[i3 + 2], targetZ, 0.12)
        positions[i3 + 1] = MathUtils.lerp(positions[i3 + 1], targetY, 0.1)

        // Smooth color transitions based on section
        const section = Math.floor(scrollProgress * 5)
        let targetR = 0.2,
          targetG = 0.5,
          targetB = 1

        switch (section) {
          case 0:
            targetR = 0.2
            targetG = 0.5
            targetB = 1
            break
          case 1:
            targetR = 0.5
            targetG = 0.2
            targetB = 1
            break
          case 2:
            targetR = 0.2
            targetG = 1
            targetB = 1
            break
          case 3:
            targetR = 0.2
            targetG = 1
            targetB = 0.4
            break
          case 4:
            targetR = 1
            targetG = 0.8
            targetB = 0.2
            break
        }

        // Buttery smooth color transitions
        colors[i3] = MathUtils.lerp(colors[i3], targetR, 0.06)
        colors[i3 + 1] = MathUtils.lerp(colors[i3 + 1], targetG, 0.06)
        colors[i3 + 2] = MathUtils.lerp(colors[i3 + 2], targetB, 0.06)
      }

      energyFieldRef.current.geometry.attributes.position.needsUpdate = true
      energyFieldRef.current.geometry.attributes.color.needsUpdate = true
    }
  })

  if (!isInitialized) {
    return null
  }

  return (
    <>
      {/* Energy Field Particles */}
      <points ref={energyFieldRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Main Crystal Group */}
      <Float speed={0.2} rotationIntensity={0.03} floatIntensity={0.08}>
        <group ref={crystalGroupRef} position={[0, 0, 0]}>
          {/* Crystal Core */}
          <mesh ref={crystalCoreRef} position={[0, 0, 0]}>
            <octahedronGeometry args={[1.2, 2]} />
            <MeshTransmissionMaterial
              color="#3b82f6"
              thickness={0.5}
              roughness={0.1}
              transmission={0.9}
              ior={1.5}
              chromaticAberration={0.1}
              backside
            />
          </mesh>

          {/* Crystal Rings */}
          <group ref={crystalRingsRef}>
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[2.5, 0.05, 8, 32]} />
              <meshStandardMaterial
                color="#8b5cf6"
                emissive="#7c3aed"
                emissiveIntensity={0.3}
                transparent
                opacity={0.6}
              />
            </mesh>

            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 3]}>
              <torusGeometry args={[2, 0.03, 6, 24]} />
              <meshStandardMaterial
                color="#06b6d4"
                emissive="#0891b2"
                emissiveIntensity={0.4}
                transparent
                opacity={0.7}
              />
            </mesh>

            <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
              <torusGeometry args={[1.5, 0.02, 4, 16]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#059669"
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
              />
            </mesh>
          </group>

          {/* Orbiting Crystal Shards */}
          <group ref={orbitingShardsRef}>
            {Array.from({ length: 6 }, (_, i) => (
              <mesh key={i} position={[3, 0, 0]}>
                <tetrahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial
                  color={`hsl(${i * 60 + 200}, 70%, 60%)`}
                  emissive={`hsl(${i * 60 + 200}, 70%, 30%)`}
                  emissiveIntensity={0.3}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            ))}
          </group>
        </group>
      </Float>

      {/* Enhanced Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[3, 3, 3]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[-3, -3, -3]} intensity={0.4} color="#8b5cf6" />
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#06b6d4" />
      <spotLight
        position={[0, 8, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        color="#ffffff"
        target-position={[0, 0, 0]}
      />
    </>
  )
}
