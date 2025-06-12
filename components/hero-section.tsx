"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <motion.section
      id="home"
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6"
      style={{ opacity, y }}
    >
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-4 text-sm sm:text-base text-blue-400 font-medium tracking-wider uppercase"
        >
          Empowering Communities Since 2015
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          <span className="block">Digital Solutions for</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Social Impact
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8"
        >
          We create innovative digital platforms that connect vulnerable communities with essential services, streamline
          welfare distribution, and amplify the impact of social programs worldwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <a
            href="#services"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
          >
            Explore Our Services
          </a>
          <a
            href="#contact"
            className="px-8 py-3 rounded-full bg-transparent border border-gray-700 text-white font-medium hover:bg-white/5 transition-all duration-300"
          >
            Start Your Project
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">500K+</div>
            <div className="text-sm text-gray-400">Lives Impacted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">25+</div>
            <div className="text-sm text-gray-400">Countries Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">98%</div>
            <div className="text-sm text-gray-400">Client Satisfaction</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
