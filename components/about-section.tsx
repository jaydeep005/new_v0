"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50])

  const stats = [
    { value: "8+", label: "Years Experience" },
    { value: "150+", label: "Projects Completed" },
    { value: "500K+", label: "Lives Impacted" },
    { value: "25+", label: "Countries Served" },
  ]

  const values = [
    {
      title: "Innovation",
      description: "We leverage cutting-edge technology to solve complex social challenges.",
    },
    {
      title: "Accessibility",
      description: "Our solutions are designed to be inclusive and accessible to all users.",
    },
    {
      title: "Impact",
      description: "We measure success by the positive change we create in communities.",
    },
    {
      title: "Collaboration",
      description: "We work closely with partners to ensure sustainable and effective solutions.",
    },
  ]

  return (
    <motion.section
      id="about"
      ref={containerRef}
      className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 sm:px-6 relative"
      style={{ opacity, y }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl" />
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-800">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Digital Welfare Team"
                  width={600}
                  height={600}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 border border-gray-700 rounded-2xl -z-10" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-gray-800 text-gray-300 mb-2">
              About Digital Welfare
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Transforming Social Services Through Technology
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <p className="text-gray-300">
              Founded in 2015 by a team of social entrepreneurs and technologists, Digital Welfare emerged from a simple
              yet powerful vision: to harness the transformative power of technology to create more equitable and
              efficient social service delivery systems worldwide.
            </p>
            <p className="text-gray-300">
              Our journey began when our founders witnessed firsthand the challenges faced by welfare organizations in
              reaching vulnerable populations. Long queues, paper-based processes, and limited access to information
              were creating barriers rather than bridges to essential services.
            </p>
            <p className="text-gray-300">
              Today, Digital Welfare stands as a leading social impact technology company with a diverse team of 85+
              professionals including software engineers, UX designers, social workers, and policy experts.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="text-center bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
            >
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-12">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-4"
          >
            Our Core Values
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all duration-300"
            >
              <h4 className="text-lg font-bold text-white mb-3">{value.title}</h4>
              <p className="text-gray-400 text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
