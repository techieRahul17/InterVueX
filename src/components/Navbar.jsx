"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { currentUser, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    // Don't show navbar in interview room
    if (location.pathname.includes("/interview-room")) {
        return null
    }

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled ? "bg-gray-900/80 backdrop-blur-md py-2 shadow-lg" : "bg-transparent py-4"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                InterVueX
              </span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="flex items-center space-x-8">
                            <Link
                                to="/"
                                className={`text-white hover:text-purple-300 transition-colors ${
                                    location.pathname === "/" ? "font-bold" : ""
                                }`}
                            >
                                Home
                            </Link>

                            {currentUser ? (
                                <>
                                    {currentUser.userType === "candidate" ? (
                                        <>
                                            <Link
                                                to="/jobs"
                                                className={`text-white hover:text-purple-300 transition-colors ${
                                                    location.pathname === "/jobs" ? "font-bold" : ""
                                                }`}
                                            >
                                                Jobs
                                            </Link>
                                            <Link
                                                to="/candidate-dashboard"
                                                className={`text-white hover:text-purple-300 transition-colors ${
                                                    location.pathname === "/candidate-dashboard" ? "font-bold" : ""
                                                }`}
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/training"
                                                className={`text-white hover:text-purple-300 transition-colors ${
                                                    location.pathname === "/training" ? "font-bold" : ""
                                                }`}
                                            >
                                                Training
                                            </Link>
                                        </>
                                    ) : (
                                        <Link
                                            to="/interviewer-dashboard"
                                            className={`text-white hover:text-purple-300 transition-colors ${
                                                location.pathname === "/interviewer-dashboard" ? "font-bold" : ""
                                            }`}
                                        >
                                            Dashboard
                                        </Link>
                                    )}

                                    <Link
                                        to="/profile"
                                        className={`text-white hover:text-purple-300 transition-colors ${
                                            location.pathname === "/profile" ? "font-bold" : ""
                                        }`}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium transition-all transform hover:scale-105"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className={`text-white hover:text-purple-300 transition-colors ${
                                            location.pathname === "/login" ? "font-bold" : ""
                                        }`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium transition-all transform hover:scale-105"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                            {isOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-900/90 backdrop-blur-md">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-md text-white hover:bg-purple-800 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>

                        {currentUser ? (
                            <>
                                {currentUser.userType === "candidate" ? (
                                    <>
                                        <Link
                                            to="/jobs"
                                            className="block px-3 py-2 rounded-md text-white hover:bg-purple-800 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Jobs
                                        </Link>
                                        <Link
                                            to="/candidate-dashboard"
                                            className="block px-3 py-2 rounded-md text-white hover:bg-purple-800 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/training"
                                            className="block px-3 py-2 rounded-md text-white hover:bg-purple-800 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Training
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        to="/interviewer-dashboard"
                                        className="block px-3 py-2 rounded-md text-white hover:bg-purple-800 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 rounded-md text-white hover:bg-purple-800 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout()
                                        setIsOpen(false)
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-purple-800 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-white hover:bg-purple-800 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-white hover:bg-purple-800 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar

