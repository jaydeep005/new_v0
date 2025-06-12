"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"

export default function CursorFollower() {
  const [isHovering, setIsHovering] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [velocity, setVelocity] = useState(0)

  // Motion values for smooth tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring configurations for different elements
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 }
  const trailConfig = { damping: 30, stiffness: 100, mass: 0.8 }
  const ringConfig = { damping: 20, stiffness: 150, mass: 0.3 }

  // Smooth spring animations
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)
  const trailX = useSpring(mouseX, trailConfig)
  const trailY = useSpring(mouseY, trailConfig)
  const ringX = useSpring(mouseX, ringConfig)
  const ringY = useSpring(mouseY, ringConfig)

  const lastPosition = useRef({ x: 0, y: 0 })
  const moveTimer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX
      const newY = e.clientY

      // Calculate velocity for dynamic effects
      const deltaX = newX - lastPosition.current.x
      const deltaY = newY - lastPosition.current.y
      const newVelocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      setVelocity(newVelocity)

      // Update motion values
      mouseX.set(newX)
      mouseY.set(newY)

      lastPosition.current = { x: newX, y: newY }
      setIsMoving(true)

      // Clear existing timer
      if (moveTimer.current) clearTimeout(moveTimer.current)

      // Set timer to detect when mouse stops moving
      moveTimer.current = setTimeout(() => {
        setIsMoving(false)
        setVelocity(0)
      }, 100)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.style.cursor === "pointer"
      setIsHovering(isInteractive)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseleave", handleMouseLeave)
      if (moveTimer.current) clearTimeout(moveTimer.current)
    }
  }, [mouseX, mouseY])

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-white pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 0.3 : 1,
          opacity: isMoving ? 1 : 0.8,
        }}
        transition={{
          scale: { type: "spring", damping: 20, stiffness: 300 },
          opacity: { duration: 0.2 },
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-40 mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 2 : isMoving ? 1.2 + Math.min(velocity * 0.01, 0.5) : 1,
          opacity: isMoving ? 0.8 : 0.4,
          borderWidth: isHovering ? 2 : 1,
        }}
        transition={{
          scale: { type: "spring", damping: 25, stiffness: 200 },
          opacity: { duration: 0.3 },
          borderWidth: { duration: 0.2 },
        }}
      />

      {/* Trailing blur effect */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-30"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)",
          filter: "blur(8px)",
        }}
        animate={{
          scale: isMoving ? 1 + Math.min(velocity * 0.005, 0.8) : 0.3,
          opacity: isMoving ? 0.6 : 0,
        }}
        transition={{
          scale: { type: "spring", damping: 30, stiffness: 100 },
          opacity: { duration: 0.4 },
        }}
      />

      {/* Velocity-based particles */}
      {isMoving && velocity > 5 && (
        <motion.div
          className="fixed top-0 left-0 w-16 h-16 rounded-full pointer-events-none z-20"
          style={{
            x: trailX,
            y: trailY,
            translateX: "-50%",
            translateY: "-50%",
            background:
              "radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(16, 185, 129, 0.05) 40%, transparent 70%)",
            filter: "blur(12px)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: Math.min(velocity * 0.02, 2),
            opacity: Math.min(velocity * 0.01, 0.4),
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            damping: 35,
            stiffness: 150,
          }}
        />
      )}

      {/* Hover glow effect */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 w-20 h-20 rounded-full pointer-events-none z-10"
          style={{
            x: ringX,
            y: ringY,
            translateX: "-50%",
            translateY: "-50%",
            background:
              "radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.05) 50%, transparent 70%)",
            filter: "blur(15px)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1.5,
            opacity: 0.3,
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 200,
          }}
        />
      )}
    </>
  )
}
