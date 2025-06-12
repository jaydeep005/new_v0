"use client"

import { useState, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { useTheme } from "next-themes"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import AboutSection from "@/components/about-section"
import ProjectsSection from "@/components/projects-section"
import ContactSection from "@/components/contact-section"
import CursorFollower from "@/components/cursor-follower"
import Scene3D from "@/components/scene-3d"
import LoadingScreen from "@/components/loading-screen"

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme("dark")

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timer)
    }
  }, [setTheme])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="relative w-full bg-black">
      <CursorFollower />

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>

      {/* Crystal 3D Model Canvas Background */}
      <div className="fixed inset-0 w-full h-full">
        <Canvas
          className="w-full h-full"
          camera={{ position: [0, 0, 8], fov: 75 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000000", 8, 25]} />

          <Suspense fallback={null}>
            <Scene3D cursorPosition={cursorPosition} />
          </Suspense>
        </Canvas>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </div>
    </div>
  )
}
