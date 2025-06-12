"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react"

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1])
  const y = useTransform(scrollYProgress, [0, 0.3, 1], [50, 0, 0])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    subject: "",
    service: "",
    message: "",
    consent: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Thank you for your message! We will get back to you within 24 hours.")
  }

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: "hello@digitalwelfare.org",
      subdDetails: "partnerships@digitalwelfare.org",
      link: "mailto:hello@digitalwelfare.org",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      subdDetails: "Mon-Fri, 9AM-6PM EST",
      link: "tel:+15551234567",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      details: "123 Innovation Hub, Tech District",
      subdDetails: "San Francisco, CA 94105",
      link: "https://maps.google.com",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Response Time",
      details: "Within 24 hours",
      subdDetails: "Emergency: Within 4 hours",
      link: "#",
    },
  ]

  return (
    <motion.section
      id="contact"
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
            Let's Build Something Amazing Together
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-1 w-20 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-300 max-w-3xl mx-auto"
          >
            Ready to transform your welfare programs with cutting-edge technology? Our team of experts is here to help
            you create digital solutions that make a real difference.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@organization.org"
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                  Subject <span className="text-red-500">*</span>
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help you?"
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-300">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please describe your project or inquiry in detail..."
                  rows={5}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white resize-none placeholder:text-gray-500"
                />
              </div>
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-800 border-gray-700 rounded"
                  required
                />
                <label htmlFor="consent" className="text-sm text-gray-400">
                  I consent to Digital Welfare processing my data to respond to my inquiry.{" "}
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <Button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-medium hover:from-orange-700 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-800/30 transition-colors group"
                >
                  <div className="text-orange-400 mt-1 group-hover:text-orange-300 transition-colors">{item.icon}</div>
                  <div>
                    <h4 className="text-lg font-medium text-white group-hover:text-orange-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-gray-400">{item.details}</p>
                    <p className="text-gray-500 text-sm">{item.subdDetails}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
