"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react"

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50])

  const projects = [
    {
      title: "SafeNet Community Platform",
      description:
        "A comprehensive digital ecosystem connecting 75,000+ vulnerable families with local support services across 12 major cities.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Community Services",
      location: "United States",
      duration: "2022 - 2024",
      beneficiaries: "75,000+",
      impact: "68% faster service access",
      technologies: ["React Native", "Node.js", "PostgreSQL", "AWS"],
    },
    {
      title: "WelfareTrack Analytics Dashboard",
      description:
        "An advanced data management and analytics system deployed across 8 national welfare programs, tracking outcomes for 250,000+ beneficiaries.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Data Analytics",
      location: "Kenya & Nigeria",
      duration: "2021 - 2023",
      beneficiaries: "250,000+",
      impact: "$4.2M in savings identified",
      technologies: ["Python", "Django", "MongoDB", "Tableau"],
    },
    {
      title: "AccessFirst Mobile App",
      description: "An award-winning accessibility-first mobile application serving 45,000+ people with disabilities.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Accessibility",
      location: "European Union",
      duration: "2020 - 2022",
      beneficiaries: "45,000+",
      impact: "85% reduction in processing time",
      technologies: ["Flutter", "Firebase", "TensorFlow", "Google Cloud"],
    },
  ]

  return (
    <motion.section
      id="projects"
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
            Featured Projects
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-1 w-20 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-300 max-w-3xl mx-auto"
          >
            Explore our portfolio of innovative digital solutions that are making a real difference in communities
            around the world. Each project represents our commitment to creating technology that serves humanity.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm text-xs font-medium text-gray-300 px-3 py-1 rounded-full">
                  {project.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4 text-sm">{project.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-2" />
                    {project.location}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-2" />
                    {project.duration}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="h-3 w-3 mr-2" />
                    {project.beneficiaries} beneficiaries
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-gray-400 mb-1">Key Impact</div>
                  <div className="text-sm font-medium text-green-400">{project.impact}</div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href="#"
                  className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors text-sm"
                >
                  View Case Study <ArrowRight className="ml-2 h-3 w-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
