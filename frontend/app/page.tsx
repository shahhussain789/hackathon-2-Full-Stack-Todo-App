"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { checkAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">TaskFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-white text-indigo-600 font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 text-white font-medium hover:text-indigo-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 bg-white text-indigo-600 font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-indigo-200 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Now with real-time sync
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Organize your life,
            <span className="block bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
              one task at a time
            </span>
          </h1>

          <p className="text-xl text-indigo-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            TaskFlow helps you stay organized, focused, and in control. Manage your tasks effortlessly with our beautiful and intuitive interface.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-2xl hover:shadow-white/25 hover:scale-105 flex items-center"
            >
              Get Started Free
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold text-lg rounded-full hover:bg-white/10 transition-all duration-300"
            >
              I have an account
            </Link>
          </div>
        </div>

        {/* App Preview */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent z-10 rounded-2xl"></div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-white/10 rounded-xl">
                  <div className="w-6 h-6 rounded-full border-2 border-green-400 flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/60 line-through">Design new landing page</span>
                </div>
                <div className="flex items-center p-4 bg-white/10 rounded-xl">
                  <div className="w-6 h-6 rounded-full border-2 border-indigo-300 mr-4"></div>
                  <span className="text-white">Build task management API</span>
                </div>
                <div className="flex items-center p-4 bg-white/10 rounded-xl">
                  <div className="w-6 h-6 rounded-full border-2 border-indigo-300 mr-4"></div>
                  <span className="text-white">Deploy to production</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to stay productive</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features to help you manage tasks, collaborate with teams, and achieve your goals.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Add, edit, and complete tasks in seconds. Our interface is designed for speed and efficiency.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600">Your data is encrypted and secure. Only you can access your tasks and personal information.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Works Everywhere</h3>
              <p className="text-gray-600">Access your tasks from any device. Desktop, tablet, or phone - we've got you covered.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to get organized?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">Join thousands of users who have transformed their productivity with TaskFlow.</p>
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-2xl hover:scale-105"
          >
            Start for Free
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-white">TaskFlow</span>
            </div>
            <p className="text-gray-400 text-sm">© 2026 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
