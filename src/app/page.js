'use client';

import Link from 'next/link'
import Image from 'next/image'
import { Lock, MessageCircle, User, Users, Info, LogIn } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#639acd] to-[#4a7ba8] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.1)_0%,transparent_50%)] pointer-events-none" />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        <div className="max-w-6xl w-full text-center">
          {/* Header Section - Compact */}
          <div className="mb-8 animate-[fadeInDown_0.8s_ease-out]">
            {/* D79 Logo */}
            <div className="mb-6 flex justify-center">
              <div className="bg-white/95 rounded-full p-6 shadow-2xl backdrop-blur-md border border-white/20">
                <Image
                  src="/images/d79logo.png"
                  alt="District 79 Logo"
                  width={120}
                  height={120}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white drop-shadow-lg tracking-tight">
              District 79 Directory
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-1 text-white/90 font-light drop-shadow-md">
              School Plans Management System
            </p>
            <p className="text-sm md:text-base lg:text-lg text-white/80 font-light drop-shadow-md">
              NYC District 79
            </p>
          </div>

          {/* Main Content Cards - Compact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
            {/* Disclaimer Card */}
            <div className="bg-white/95 rounded-xl p-6 shadow-2xl backdrop-blur-md border border-white/20 text-left animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-amber-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-amber-800 m-0">
                  Access Restricted
                </h3>
              </div>
              <p className="text-sm text-amber-800 m-0 leading-relaxed">
                <strong>This system is restricted to Principals and Authorized Staff only.</strong> 
                If you are not authorized to access this system, please contact your District Administrator 
                or the Office of Safety and Youth Development for access credentials.
              </p>
            </div>

            {/* Support Card */}
            <div className="bg-white/95 rounded-xl p-6 shadow-2xl backdrop-blur-md border border-white/20 text-left animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[#639acd] rounded-full w-8 h-8 flex items-center justify-center text-white">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-blue-800 m-0">
                  Need Help?
                </h3>
              </div>
              <p className="text-sm text-blue-800 m-0 mb-3 leading-relaxed">
                For technical support or access issues, please contact:
              </p>
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <div className="bg-[#639acd] rounded-full w-6 h-6 flex items-center justify-center text-white flex-shrink-0">
                      <User className="w-3 h-3" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-blue-800 mb-1 text-sm">
                        Javier Jaramillo
                      </div>
                      <div className="text-xs text-gray-600 italic mb-1">
                        Data Systems Administrator
                      </div>
                      <a 
                        href="mailto:jjaramillo7@schools.nyc.gov" 
                        className="text-[#639acd] no-underline text-xs font-medium hover:underline transition-colors"
                      >
                        jjaramillo7@schools.nyc.gov
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <div className="bg-[#639acd] rounded-full w-6 h-6 flex items-center justify-center text-white flex-shrink-0">
                      <Users className="w-3 h-3" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-blue-800 mb-1 text-sm">
                        Veronica Pichardo
                      </div>
                      <div className="text-xs text-gray-600 italic mb-1">
                        Executive Director of School Support and Operations
                      </div>
                      <a 
                        href="mailto:VPichardo@schools.nyc.gov" 
                        className="text-[#639acd] no-underline text-xs font-medium hover:underline transition-colors"
                      >
                        VPichardo@schools.nyc.gov
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex justify-center gap-4 flex-wrap animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
            <Link 
              href="/login" 
              className="bg-white/95 text-[#639acd] px-7 py-3.5 rounded-xl no-underline font-semibold text-base transition-all duration-300 shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-2 hover:bg-white hover:shadow-3xl hover:scale-105 transform"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
            <Link 
              href="/about" 
              className="bg-white/10 text-white px-7 py-3.5 rounded-xl no-underline font-semibold text-base transition-all duration-300 border-2 border-white/30 flex items-center gap-2 hover:bg-white/20 hover:border-white/50"
            >
              <Info className="w-5 h-5" />
              About
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}