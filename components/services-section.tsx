"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Database, Users, Shield, BarChart, Smartphone, Cloud } from "lucide-react"

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50])

  const services = [
    {
      icon: <Database className="h-8 w-8" />,
      title: "Welfare Management Systems",
      description:
        "Comprehensive digital platforms for managing beneficiary data, eligibility verification, and benefit distribution with real-time tracking and automated workflows.",
      features: ["Real-time eligibility verification", "Automated benefit calculations", "Multi-channel distribution"],
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile-First Applications",
      description:
        "User-friendly mobile applications designed for low-literacy users, featuring voice navigation, offline capabilities, and multi-language support.",
      features: ["Voice-guided navigation", "Offline functionality", "Multi-language support"],
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Engagement Platforms",
      description:
        "Digital spaces that connect community members, facilitate peer support, and enable collaborative problem-solving for local challenges.",
      features: ["Peer support networks", "Local resource sharing", "Community forums"],
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Data Security & Privacy",
      description:
        "Enterprise-grade security solutions with end-to-end encryption, GDPR compliance, and privacy-by-design principles to protect sensitive information.",
      features: ["End-to-end encryption", "GDPR compliance", "Privacy-by-design"],
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Impact Analytics & Reporting",
      description:
        "Advanced analytics dashboards that track program outcomes, measure social impact, and provide actionable insights for continuous improvement.",
      features: ["Real-time dashboards", "Impact measurement", "Predictive analytics"],
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cloud Infrastructure Solutions",
      description:
        "Scalable cloud-based infrastructure that ensures 99.9% uptime, automatic scaling, and seamless integration with existing government systems.",
      features: ["99.9% uptime guarantee", "Auto-scaling", "System integration"],
    },
  ]

  return (
    <motion.section
      id="services"
      ref={containerRef}
      className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 sm:px-6 relative"
      style={{ opacity, y }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Our Digital Welfare Services
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-300 max-w-3xl mx-auto"
          >
            We provide end-to-end digital solutions that transform how welfare organizations operate, deliver services,
            and measure impact. Our technology stack is designed for scalability, accessibility, and social good.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 group"
            >
              <div className="mb-5 text-purple-500 group-hover:text-purple-400 transition-colors">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-500 flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
