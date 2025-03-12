"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const CandidateDashboard = () => {
  const navigate = useNavigate()
  const [upcomingInterviews, setUpcomingInterviews] = useState([])
  const [pastInterviews, setPastInterviews] = useState([])
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    topSkill: 0,
    improvementArea: "",
  })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedInterviewId, setSelectedInterviewId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Hardcoded user info since user is already logged in
  const loggedInUser = {
    id: 1,
    name: "Candidate",
  }

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true)
        // Use hardcoded user ID since user is already logged in
        const userId = loggedInUser.id
        const response = await fetch(`http://localhost:8443/applicationsByUser?user_id=${userId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch applications")
        }

        const data = await response.json()

        if (data.status === "S") {
          // Process the applications data
          const allApplications = data.applications || []

          // Filter applications by status
          const upcomingApps = allApplications.filter((app) => app.status !== "past" && app.meeting_id)
          const pastApps = allApplications.filter((app) => app.status === "past")
          const pendingApps = allApplications.filter((app) => app.status !== "past" && !app.meeting_id)

          // Transform data for upcoming interviews
          const upcomingData = upcomingApps.map((app) => ({
            id: app.application_id.toString(),
            company: app.company_id,
            position: `Job ID: ${app.job_id}`,
            date: app.date ? `${app.date} ${app.time || ""}` : new Date().toISOString(),
            interviewer: `Interviewer ID: ${app.interviewer_id || "TBD"}`,
            meeting_id: app.meeting_id,
          }))

          // Transform data for past interviews
          const pastData = pastApps.map((app) => ({
            id: app.application_id.toString(),
            company: app.company_id,
            position: `Job ID: ${app.job_id}`,
            date: app.date ? `${app.date} ${app.time || ""}` : new Date().toISOString(),
            score: app.score || 0,
            feedback: app.feedback || "No feedback provided.",
          }))

          // Transform data for applications
          const applicationsData = pendingApps.map((app) => ({
            id: app.application_id.toString(),
            company: app.company_id,
            position: `Job ID: ${app.job_id}`,
            status: app.status,
            appliedDate: new Date().toISOString(), // Since the API doesn't provide this
            coverletter: app.coverletter,
          }))

          // Calculate stats
          const totalInterviews = pastData.length
          const scores = pastData.map((interview) => interview.score).filter((score) => score > 0)
          const averageScore =
              scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0

          setUpcomingInterviews(upcomingData)
          setPastInterviews(pastData)
          setApplications(applicationsData)
          setStats({
            totalInterviews,
            averageScore,
            topSkill: upcomingData.length, // Number of upcoming interviews
            improvementArea: "System Design", // This could be derived from feedback in a more sophisticated way
          })
        } else {
          throw new Error(data.message || "Failed to retrieve applications")
        }
      } catch (err) {
        console.error("Error fetching applications:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    try {
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (e) {
      return dateString // Return the original string if parsing fails
    }
  }

  const handleJoinInterview = (interviewId) => {
    setSelectedInterviewId(interviewId)
    setShowConfirmModal(true)
  }

  const handleConfirmJoin = () => {
    // Close the modal
    setShowConfirmModal(false)

    // Navigate to the interview room
    if (selectedInterviewId) {
      navigate(`/interview-room/${selectedInterviewId}`)
    }
  }

  // Loading state
  if (isLoading) {
    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading your dashboard...</p>
          </div>
        </div>
    )
  }

  // Error state
  if (error) {
    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              Candidate Dashboard
            </h1>
            <p className="text-gray-300 mt-2">Welcome back, {loggedInUser.name}! Here's your interview status.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-6 rounded-xl shadow-xl border border-purple-500/20 transform transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-200">Total Interviews</h3>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <svg
                      className="w-6 h-6 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalInterviews}</div>
              <p className="text-purple-300 text-sm mt-2">Completed interviews</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-6 rounded-xl shadow-xl border border-purple-500/20 transform transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-200">Average Score</h3>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <svg
                      className="w-6 h-6 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{stats.averageScore}%</div>
              <p className="text-purple-300 text-sm mt-2">Performance rating</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-6 rounded-xl shadow-xl border border-purple-500/20 transform transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-200">Number of upcoming interviews</h3>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <svg
                      className="w-6 h-6 text-purple-400"
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
              </div>
              <div className="text-3xl font-bold text-white">{stats.topSkill}</div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-6 rounded-xl shadow-xl border border-purple-500/20 transform transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-200">Improvement Area</h3>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <svg
                      className="w-6 h-6 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{stats.improvementArea}</div>
              <p className="text-purple-300 text-sm mt-2">Focus on this skill</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Interviews */}
            <div className="bg-gray-900/60 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-purple-500/20">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <svg
                    className="w-5 h-5 mr-2 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                Upcoming Interviews
              </h2>

              {upcomingInterviews.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                        <div
                            key={interview.id}
                            className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-white">{interview.position}</h3>
                              <p className="text-sm text-purple-300">{interview.company}</p>
                              <p className="text-xs text-gray-400 mt-1">with {interview.interviewer}</p>
                              <p className="text-sm text-gray-300 mt-2">{formatDate(interview.date)}</p>
                            </div>
                            <button
                                onClick={() => handleJoinInterview(interview.meeting_id || interview.id)}
                                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
                            >
                              Join
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                    <svg
                        className="w-12 h-12 mx-auto text-gray-600 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p className="text-gray-400">No upcoming interviews</p>
                    <Link
                        to="/jobs"
                        className="inline-block mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
                    >
                      Browse Jobs
                    </Link>
                  </div>
              )}
            </div>

            {/* Applications */}
            <div className="bg-gray-900/60 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-purple-500/20">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <svg
                    className="w-5 h-5 mr-2 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                Recent Applications
              </h2>

              {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application) => (
                        <div
                            key={application.id}
                            className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
                        >
                          <h3 className="font-medium text-white">{application.position}</h3>
                          <p className="text-sm text-purple-300">{application.company}</p>
                          <div className="flex justify-between items-center mt-2">
                      <span
                          className={`text-xs px-2 py-1 rounded-full ${
                              application.status === "Interview Scheduled"
                                  ? "bg-green-900/50 text-green-300"
                                  : application.status === "Under Review"
                                      ? "bg-yellow-900/50 text-yellow-300"
                                      : "bg-blue-900/50 text-blue-300"
                          }`}
                      >
                        {application.status}
                      </span>
                            <span className="text-xs text-gray-400">
                        Applied {new Date(application.appliedDate).toLocaleDateString()}
                      </span>
                          </div>
                          {application.coverletter && (
                              <div className="mt-3 pt-3 border-t border-gray-700">
                                <p className="text-sm text-gray-300 line-clamp-2">
                                  <span className="font-medium text-purple-300">Cover Letter: </span>
                                  {application.coverletter}
                                </p>
                              </div>
                          )}
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                    <svg
                        className="w-12 h-12 mx-auto text-gray-600 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    <p className="text-gray-400">No applications yet</p>
                    <Link
                        to="/jobs"
                        className="inline-block mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
                    >
                      Browse Jobs
                    </Link>
                  </div>
              )}
            </div>

            {/* Past Interviews */}
            <div className="bg-gray-900/60 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-purple-500/20">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <svg
                    className="w-5 h-5 mr-2 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Past Interviews
              </h2>

              {pastInterviews.length > 0 ? (
                  <div className="space-y-4">
                    {pastInterviews.map((interview) => (
                        <div
                            key={interview.id}
                            className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-white">{interview.position}</h3>
                              <p className="text-sm text-purple-300">{interview.company}</p>
                              <p className="text-xs text-gray-400 mt-1">{formatDate(interview.date)}</p>
                            </div>
                            <div className="flex items-center bg-gray-700/50 px-2 py-1 rounded-lg">
                              <span className="text-sm font-medium mr-1">Score:</span>
                              <span
                                  className={`text-sm font-bold ${
                                      interview.score >= 80
                                          ? "text-green-400"
                                          : interview.score >= 70
                                              ? "text-yellow-400"
                                              : "text-red-400"
                                  }`}
                              >
                          {interview.score}%
                        </span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <p className="text-sm text-gray-300">
                              <span className="font-medium text-purple-300">Feedback: </span>
                              {interview.feedback}
                            </p>
                          </div>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                    <svg
                        className="w-12 h-12 mx-auto text-gray-600 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <p className="text-gray-400">No past interviews</p>
                    <Link
                        to="/training"
                        className="inline-block mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
                    >
                      Try Training Mode
                    </Link>
                  </div>
              )}
            </div>
          </div>

          {/* Training Mode CTA */}
          <div className="mt-12 bg-gradient-to-r from-indigo-800 to-purple-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative p-8 md:p-12">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-center opacity-10"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Practice Makes Perfect</h2>
                  <p className="text-gray-200 max-w-xl">
                    Prepare for your upcoming interviews with our AI-powered training mode. Get real-time feedback on your
                    responses and improve your interview skills.
                  </p>
                </div>
                <Link
                    to="/training"
                    className="px-8 py-4 rounded-full bg-white text-purple-800 font-medium transition-all transform hover:scale-105 hover:shadow-lg"
                >
                  Start Training
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 rounded-xl border border-purple-500/30 p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                  Join Interview
                </h2>
                <p className="text-gray-300 mb-6 text-center">
                  You are about to join this interview as a <span className="font-bold text-purple-300">candidate</span>.
                  The interview will be conducted in full-screen mode to ensure a fair process.
                </p>
                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-600 mb-6">
                  <p className="text-sm text-gray-200">
                    <span className="font-bold text-purple-300">Important:</span> During the interview, you will not be able
                    to:
                  </p>
                  <ul className="text-sm text-gray-300 list-disc pl-5 mt-2 space-y-1">
                    <li>Exit full-screen mode</li>
                    <li>Open other applications</li>
                    <li>Copy or paste content</li>
                    <li>Use keyboard shortcuts</li>
                  </ul>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                      onClick={() => setShowConfirmModal(false)}
                      className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleConfirmJoin}
                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition-colors"
                  >
                    I Understand, Join Now
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}

export default CandidateDashboard