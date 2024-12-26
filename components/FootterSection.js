"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Globe2, Shield, Zap, MessageSquare,UserCircle2, Box, Truck, BarChart } from 'lucide-react';

const EnhancedHomeSections = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(
      (element) => observer.observe(element)
    );

    return () => observer.disconnect();
  }, []);
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Tech Solutions Inc",
      text: "The tracking system is incredible. We can monitor our shipments in real-time and our customers love the transparency."
    },
    {
      name: "Michael Chang",
      company: "Global Traders Ltd",
      text: "Move On has transformed our logistics operations. Their global coverage and reliable service are unmatched."
    },
    {
      name: "Emma Roberts",
      company: "E-commerce Pro",
      text: "Outstanding customer support and seamless delivery process. Couldn't be happier with the service quality."
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50+', label: 'Countries' },
    { value: '99.9%', label: 'Delivery Rate' },
    { value: '24/7', label: 'Support' }
  ];

  const howItWorks = [
    {
      icon: <Box className="w-8 h-8" />,
      title: "Pack & Request",
      description: "Securely package your items and submit a shipping request"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "We Pick Up",
      description: "Our professional team collects from your location"
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Track Progress",
      description: "Monitor your shipment's journey in real-time"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 via-black to-gray-950">
      {/* Stats Section with Floating Animation */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black-800/30 to-blue-800/30 animate-gradient-xy"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="p-6 backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black  to-black"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-lg bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-sm border border-white/10 transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <UserCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.company}</div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-2 -top-2 text-4xl text-blue-500 opacity-30">"</div>
                  <p className="text-gray-300 relative z-10 pl-4">
                    {testimonial.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      

      {/* Newsletter Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 "></div>
        <div className="max-w-3xl mx-auto px-6 relative">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-black border border-white/10">
            <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Stay Updated
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Subscribe to our newsletter for the latest shipping updates and exclusive offers
            </p>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg bg-black border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
      <footer className="relative py-16 overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-900/20"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Move On
              </div>
              <p className="text-gray-400">
                Revolutionizing global logistics since 2020
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Settings</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Move On. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedHomeSections;