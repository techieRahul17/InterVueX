'use client'

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { currentUser } = useAuth()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const teamRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    const sections = document.querySelectorAll('.animate-on-scroll')
    sections.forEach((section) => {
      observer.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section)
      })
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-20"></div>
        </div>

        {/* Animated Circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              InterVueX
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 text-gray-200 animate-fade-in animation-delay-300">
            Revolutionizing the interview experience with AI-powered insights
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in animation-delay-600">
            {currentUser ? (
              <Link
                to={
                  currentUser.userType === 'candidate'
                    ? '/candidate-dashboard'
                    : '/interviewer-dashboard'
                }
                className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium transition-all transform hover:scale-105 hover:shadow-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium transition-all transform hover:scale-105 hover:shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 rounded-full bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium transition-all transform hover:scale-105"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="py-20 px-4 sm:px-6 lg:px-8 animate-on-scroll opacity-0"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              Transforming Interviews with AI
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with human expertise to
              create a fair, efficient, and insightful interview experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-8 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl border border-purple-500/20">
              <div className="w-14 h-14 mb-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Smart Question Generation
              </h3>
              <p className="text-gray-300">
                AI-powered system generates personalized questions based on
                candidate's resume and real-time responses.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-8 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl border border-purple-500/20">
              <div className="w-14 h-14 mb-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Sentiment Analysis
              </h3>
              <p className="text-gray-300">
                Real-time analysis of facial expressions and speech patterns to
                gauge candidate confidence and engagement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-8 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl border border-purple-500/20">
              <div className="w-14 h-14 mb-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Rubric-Based Evaluation
              </h3>
              <p className="text-gray-300">
                Objective assessment against predefined criteria ensures fair
                and consistent candidate evaluation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-8 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl border border-purple-500/20">
              <div className="w-14 h-14 mb-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Comprehensive Summaries
              </h3>
              <p className="text-gray-300">
                Detailed interview reports with actionable insights for both
                interviewers and candidates.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-8 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl border border-purple-500/20">
              <div className="w-14 h-14 mb-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Resume Analysis
              </h3>
              <p className="text-gray-300">
                AI-powered parsing extracts key skills and experiences to
                generate targeted interview questions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-8 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl border border-purple-500/20">
              <div className="w-14 h-14 mb-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Training Mode
              </h3>
              <p className="text-gray-300">
                Practice interviews with AI feedback help candidates build
                confidence and improve their skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        ref={teamRef}
        className="py-20 px-4 sm:px-6 lg:px-8 animate-on-scroll opacity-0"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The brilliant minds behind InterVueX
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-8 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl border border-purple-500/20 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center overflow-hidden">
                <img
                  src="/src/imgs/images.jpg?height=96&width=96"
                  alt="Saipranav M"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-white">Saipranav M</h3>
              <p className="text-purple-300 mb-3">Team Leader</p>
              <p className="text-gray-300 text-sm">
                II Year CSE, SSN College of Engineering
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-8 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl border border-purple-500/20 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center overflow-hidden">
                <img
                  src="/src/imgs/catpuccin_w.jpg?height=96&width=96"
                  alt="Ramcharan S"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-white">Ramcharan S</h3>
              <p className="text-purple-300 mb-3">Member</p>
              <p className="text-gray-300 text-sm">
                II Year CSE, SSN College of Engineering
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-8 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl border border-purple-500/20 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center overflow-hidden">
                <img
                  src="/src/imgs/HD-wallpaper-ghibli-a·-github-topics-a·-github-cute-ghibli.jpg?height=96&width=96"
                  alt="Rahul V S"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-white">Rahul V S</h3>
              <p className="text-purple-300 mb-3">Member</p>
              <p className="text-gray-300 text-sm">
                II Year CSE, SSN College of Engineering
              </p>
            </div>

            {/* Team Member 4 */}
            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-8 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl border border-purple-500/20 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center overflow-hidden">
                <img
                  src="/src/imgs/octocat_iphone_blue.jpg?height=96&width=96"
                  alt="Sakthivel T"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-white">Sakthivel T</h3>
              <p className="text-purple-300 mb-3">Member</p>
              <p className="text-gray-300 text-sm">
                II Year CSE, SSN College of Engineering
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 animate-on-scroll opacity-0">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-800 to-purple-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative p-12 md:p-16">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-center opacity-10"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to transform your interview experience?
              </h2>
              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                Join InterVueX today and discover the power of AI-enhanced
                interviews for better hiring decisions.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {currentUser ? (
                  <Link
                    to={
                      currentUser.userType === 'candidate'
                        ? '/candidate-dashboard'
                        : '/interviewer-dashboard'
                    }
                    className="px-8 py-4 rounded-full bg-white text-purple-800 font-medium transition-all transform hover:scale-105 hover:shadow-lg"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="px-8 py-4 rounded-full bg-white text-purple-800 font-medium transition-all transform hover:scale-105 hover:shadow-lg"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="px-8 py-4 rounded-full bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium transition-all transform hover:scale-105"
                    >
                      Learn More
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                InterVueX
              </span>
              <p className="text-gray-400 mt-2">Intelligent talent insights.</p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 InterVueX. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
