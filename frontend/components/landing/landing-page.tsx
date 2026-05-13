'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  DropletsIcon,
  MapPinIcon,
  ShieldCheckIcon,
  TruckIcon,
  PhoneIcon,
  MailIcon,
  Menu,
  MessageCircle,
  Share2,
  X,
} from 'lucide-react';

export function LandingPage() {
  const [services, setServices] = useState<Array<{
    id: number;
    name: string;
    description: string;
    service_type: string;
    price: number;
  }>>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Simulated services data
  useEffect(() => {
    setTimeout(() => {
      setServices([
        {
          id: 1,
          name: '5L Water Bottle',
          description: 'Fresh purified water delivered daily',
          service_type: 'standard',
          price: 50,
        },
        {
          id: 2,
          name: '20L Water Can',
          description: 'Bulk water supply for families & offices',
          service_type: 'bulk',
          price: 150,
        },
        {
          id: 3,
          name: '50L Tank Refill',
          description: 'Large scale water solutions',
          service_type: 'bulk',
          price: 350,
        },
        {
          id: 4,
          name: 'Cooler Rental',
          description: 'Water cooler with monthly service',
          service_type: 'rental',
          price: 500,
        },
        {
          id: 5,
          name: 'Maintenance',
          description: 'Tank cleaning & system maintenance',
          service_type: 'service',
          price: 1200,
        },
        {
          id: 6,
          name: 'Installation',
          description: 'Professional tank installation & setup',
          service_type: 'service',
          price: 2000,
        },
      ]);
      setLoadingServices(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thanks for reaching out! We will contact you soon.');
    e.currentTarget.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-cyan-600/20 mix-blend-multiply" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/40 border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-lg flex items-center justify-center">
              <DropletsIcon className="w-6 h-6 text-slate-900 font-bold" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              WTM
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['Services', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-6 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Get started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/90 backdrop-blur border-t border-blue-500/10">
            <div className="px-4 py-4 space-y-3">
              {['Services', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Link
                href="/login"
                className="block w-full px-4 py-2 text-center text-sm font-medium text-gray-300 hover:text-white border border-blue-500/30 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          {/* 3D Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute w-full h-full"
              style={{
                transform: `translateY(${scrollY * 0.5}px)`,
              }}
            >
              <svg className="w-full h-full opacity-20" viewBox="0 0 1200 600">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.5 }} />
                    <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 0.5 }} />
                  </linearGradient>
                </defs>
                {/* Animated Water Waves */}
                <path
                  d="M 0,300 Q 300,250 600,300 T 1200,300 L 1200,600 L 0,600 Z"
                  fill="url(#grad1)"
                  opacity="0.3"
                  className="animate-wave"
                />
                <path
                  d="M 0,350 Q 300,300 600,350 T 1200,350 L 1200,600 L 0,600 Z"
                  fill="url(#grad1)"
                  opacity="0.2"
                  className="animate-wave animation-delay-2000"
                />
              </svg>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-semibold text-cyan-300 uppercase tracking-widest">
                      Smart Water Management
                    </span>
                  </div>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                    Water Delivered. Tracked. Billed.
                  </h1>
                  <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                    Connect customers, drivers, and administrators on one intelligent platform. From live order tracking to transparent billing—everything your water delivery business needs.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/register"
                    className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group"
                  >
                    Get Started Free
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#services"
                    className="px-8 py-4 text-lg font-semibold text-cyan-300 border-2 border-cyan-400/50 rounded-xl hover:bg-cyan-400/10 hover:border-cyan-300 transition-all duration-300 backdrop-blur-sm text-center"
                  >
                    Watch Demo
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-blue-500/20">
                  {[
                    { number: '500K+', label: 'Deliveries' },
                    { number: '99.9%', label: 'Uptime' },
                    { number: '24/7', label: 'Support' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="text-3xl font-bold text-cyan-300">{stat.number}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 3D Card */}
              <div className="relative animate-float" style={{ transform: `translateY(${scrollY * -0.3}px)` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-3xl" />
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 shadow-2xl">
                  {/* 3D Cube */}
                  <div className="mb-8 h-64 flex items-center justify-center">
                    <div
                      className="relative w-48 h-48"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateX(${scrollY * 0.1}deg) rotateY(${scrollY * 0.15}deg)`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-2xl shadow-blue-500/50 opacity-80" />
                      <div className="absolute inset-2 flex items-center justify-center text-white text-4xl font-bold">
                        <DropletsIcon className="w-24 h-24 opacity-80" />
                      </div>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-cyan-300 font-semibold uppercase tracking-wider">Operations Snapshot</p>
                      <h3 className="text-2xl font-bold text-white">Live Dashboard</h3>
                    </div>

                    <div className="space-y-3">
                      {[
                        { icon: TruckIcon, label: 'Real-time Tracking', value: 'GPS enabled' },
                        { icon: ShieldCheckIcon, label: 'Secure Payments', value: 'COD & Online' },
                        { icon: MapPinIcon, label: 'Smart Routes', value: 'AI optimized' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 hover:border-cyan-400/50 transition-colors">
                          <item.icon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-300">{item.label}</p>
                            <p className="text-xs text-cyan-300">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 space-y-4 animate-fade-in">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Our Services
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Flexible water delivery solutions tailored to your needs
              </p>
            </div>

            {loadingServices ? (
              <div className="grid md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-blue-500/10 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {services.map((service, i) => (
                  <div
                    key={service.id}
                    className="group animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="relative h-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative space-y-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-xl flex items-center justify-center text-slate-900 font-bold">
                          {i + 1}
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-gray-400 text-sm">{service.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-blue-500/20">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-medium text-cyan-300">
                            <div className="w-2 h-2 rounded-full bg-cyan-400" />
                            {service.service_type}
                          </span>
                          <span className="text-2xl font-bold text-cyan-400">PKR {service.price}</span>
                        </div>

                        <Link
                          href="/register"
                          className="block w-full mt-4 px-4 py-2 text-center bg-gradient-to-r from-blue-500/80 to-cyan-400/80 hover:from-blue-400 hover:to-cyan-300 text-white font-semibold rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                        >
                          Book Service
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section id="about" className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                    Built for Real Teams
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Administrators orchestrate, drivers execute with clarity, customers track progress—all in one secure platform.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    'JWT sessions with 9-hour validity for work shifts',
                    'Dedicated panels for bookings & payments',
                    'Real-time notifications & live tracking',
                    'Role-based access control',
                    'Integrated rating system',
                    'Transparent billing',
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 animate-fade-in"
                      style={{ animationDelay: `${i * 75}ms` }}
                    >
                      <CheckCircle2Icon className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Cards */}
              <div className="space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                {[
                  { title: 'For Customers', icon: MapPinIcon, desc: 'Book, pay, track, rate' },
                  { title: 'For Drivers', icon: TruckIcon, desc: 'Tasks, COD, status updates' },
                  { title: 'For Admin', icon: ShieldCheckIcon, desc: 'Full platform control' },
                ].map((role, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-cyan-400/30 rounded-xl flex items-center justify-center group-hover:from-blue-500/50 group-hover:to-cyan-400/50 transition-colors">
                        <role.icon className="w-6 h-6 text-cyan-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{role.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{role.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-4">
                  <h2 className="text-4xl sm:text-5xl font-bold text-white">
                    Get in Touch
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Tell us about your water delivery needs, fleet size, or integration requirements.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: PhoneIcon, label: 'Phone', value: '+92 (300) 1234-567' },
                    { icon: MailIcon, label: 'Email', value: 'hello@wtm.pk' },
                  ].map((contact, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-cyan-400/30 rounded-xl flex items-center justify-center">
                        <contact.icon className="w-6 h-6 text-cyan-300" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{contact.label}</p>
                        <p className="text-white font-semibold">{contact.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8">
                  <form onSubmit={handleContact} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/20 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/20 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Message</label>
                      <textarea
                        required
                        placeholder="How can we help?"
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/20 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-blue-500/10 bg-slate-900/50 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-lg flex items-center justify-center">
                  <DropletsIcon className="w-5 h-5 text-slate-900" />
                </div>
                <span className="font-bold text-white">WTM</span>
              </div>
              <p className="text-sm text-gray-400">Water Tank Management platform for modern delivery businesses.</p>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Contact'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-cyan-300 transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-blue-500/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
            <p>© 2024 WTM — Water Tank Management. All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              {[Share2, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:border-cyan-400/50 hover:bg-cyan-400/10 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5 text-cyan-300" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(20px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgb(15, 23, 42);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #06b6d4);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb, #0891b2);
        }
      `}</style>
    </div>
  );
}

export default LandingPage;