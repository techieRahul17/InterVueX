"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import CandidateDashboard from "./pages/CandidateDashboard"
import InterviewerDashboard from "./pages/InterviewerDashboard"
import InterviewRoom from "./pages/InterviewRoom"
import TrainingMode from "./pages/TrainingMode"
import JobListings from "./pages/JobListings"
import Profile from "./pages/Profile"
import Navbar from "./components/Navbar"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, [])

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">InterVueX</h1>
                    <div className="flex space-x-2 justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/jobs" element={<JobListings />} />
                        <Route
                            path="/candidate-dashboard"
                            element={
                                <ProtectedRoute>
                                    <CandidateDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/interviewer-dashboard"
                            element={
                                <ProtectedRoute>
                                    <InterviewerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/interview-room/:id"
                            element={
                                <ProtectedRoute>
                                    <InterviewRoom />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/training"
                            element={
                                <ProtectedRoute>
                                    <TrainingMode />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App

