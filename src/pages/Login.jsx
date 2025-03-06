"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userType, setUserType] = useState("candidate")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            // In a real app, you would validate credentials with an API
            // For demo purposes, we'll just simulate a successful login
            await login({ email }, userType)
            navigate(userType === "candidate" ? "/candidate-dashboard" : "/interviewer-dashboard")
        } catch (error) {
            setError("Failed to log in. Please check your credentials.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
            <div className="relative w-full max-w-md">
                {/* Background Effects */}
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

                <div className="relative bg-gray-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-purple-500/20">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                            Welcome Back
                        </h2>
                        <p className="text-gray-300 mt-2">Sign in to continue to InterVueX</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="userType" className="block text-sm font-medium text-gray-300 mb-1">
                                I am a
                            </label>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <button
                                    type="button"
                                    className={`py-3 px-4 rounded-lg border ${
                                        userType === "candidate"
                                            ? "border-purple-500 bg-purple-500/20 text-white"
                                            : "border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                                    } transition-all focus:outline-none`}
                                    onClick={() => setUserType("candidate")}
                                >
                                    Candidate
                                </button>
                                <button
                                    type="button"
                                    className={`py-3 px-4 rounded-lg border ${
                                        userType === "interviewer"
                                            ? "border-purple-500 bg-purple-500/20 text-white"
                                            : "border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                                    } transition-all focus:outline-none`}
                                    onClick={() => setUserType("interviewer")}
                                >
                                    Interviewer
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 bg-gray-800 border-gray-600 rounded text-purple-500 focus:ring-purple-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                      <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                      ></circle>
                      <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

