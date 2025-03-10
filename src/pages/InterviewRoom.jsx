"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import JitsiIframe from "../components/Jitvideo.jsx"
import CodeCompiler from "./code-compiler.jsx"

const InterviewRoom = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [questions, setQuestions] = useState([])
    const [pinnedQuestions, setPinnedQuestions] = useState([])
    const [transcript, setTranscript] = useState([])
    const [sentimentScore, setSentimentScore] = useState(75)
    const [isRecording, setIsRecording] = useState(false)
    const [resumeData, setResumeData] = useState(null)
    const [selectedSkill, setSelectedSkill] = useState(null)
    const [showRubricModal, setShowRubricModal] = useState(false)
    const [rubricScores, setRubricScores] = useState({})
    const [showScheduleModal, setShowScheduleModal] = useState(false)
    const [scheduleDetails, setScheduleDetails] = useState({
        candidate: "",
        position: "",
        date: "",
        time: "",
    })
    const [userRole, setUserRole] = useState(null)
    const [showRoleConfirmation, setShowRoleConfirmation] = useState(true)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [questionRatings, setQuestionRatings] = useState({})
    const [hoveredQuestion, setHoveredQuestion] = useState(null)
    const videoRef = useRef(null)
    const questionTimerRef = useRef(null)
    const fullScreenRef = useRef(null)
    const transcriptIntervalRef = useRef(null)

    // New states for coding challenge
    const [showCodingModal, setShowCodingModal] = useState(false)
    const [codingChallenge, setCodingChallenge] = useState(null)
    const [showCompiler, setShowCompiler] = useState(false)

    // Mock resume data
    useEffect(() => {
        // In a real app, this would be fetched from an API
        setResumeData({
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "(123) 456-7890",
            education: [
                {
                    institution: "Stanford University",
                    degree: "Master of Science in Computer Science",
                    year: "2018-2020",
                },
                {
                    institution: "MIT",
                    degree: "Bachelor of Science in Computer Science",
                    year: "2014-2018",
                },
            ],
            experience: [
                {
                    company: "Google",
                    position: "Software Engineer",
                    duration: "2020-Present",
                    description:
                        "Developed and maintained cloud infrastructure services. Implemented microservices architecture using Kubernetes and Docker.",
                },
                {
                    company: "Amazon",
                    position: "Software Development Intern",
                    duration: "Summer 2019",
                    description:
                        "Worked on improving recommendation algorithms. Implemented A/B testing framework for new features.",
                },
            ],
            skills: [
                { name: "JavaScript", level: "Expert" },
                { name: "React", level: "Expert" },
                { name: "Node.js", level: "Advanced" },
                { name: "Python", level: "Advanced" },
                { name: "Machine Learning", level: "Intermediate" },
            ],
        })

        // Generate initial questions
        generateQuestions()

        // Set up question refresh timer
        questionTimerRef.current = setInterval(() => {
            generateQuestions()
        }, 20000)

        return () => {
            if (questionTimerRef.current) {
                clearInterval(questionTimerRef.current)
            }
            // Exit full screen when component unmounts
            if (document.fullscreenElement && userRole === "candidate") {
                document.exitFullscreen()
            }
        }
    }, [])

    // Anti-cheating measures for candidates
    useEffect(() => {
        if (userRole === "candidate") {
            // Enter full screen mode
            const enterFullScreen = () => {
                if (fullScreenRef.current && !document.fullscreenElement) {
                    fullScreenRef.current.requestFullscreen().catch((err) => {
                        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
                    })
                    setIsFullScreen(true)
                }
            }

            // Detect exit from full screen
            const handleFullScreenChange = () => {
                if (!document.fullscreenElement && isFullScreen) {
                    setIsFullScreen(false)
                    // Show warning
                    alert("Warning: Exiting full screen is not allowed during the interview. Please return to full screen.")
                    // Try to re-enter full screen after a short delay
                    setTimeout(enterFullScreen, 1000)
                }
            }

            // Prevent tab switching, copying, etc.
            const handleVisibilityChange = () => {
                if (document.visibilityState === "hidden") {
                    // Log attempt to switch tabs
                    console.log("Tab switching detected")
                    // You could also send this to your backend
                }
            }

            // Prevent right-click
            const handleContextMenu = (e) => {
                e.preventDefault()
                return false
            }

            // Prevent keyboard shortcuts
            const handleKeyDown = (e) => {
                // Prevent common shortcuts
                if (
                    (e.ctrlKey || e.metaKey) &&
                    (e.key === "c" ||
                        e.key === "v" ||
                        e.key === "a" ||
                        e.key === "p" ||
                        e.key === "s" ||
                        e.key === "u" ||
                        e.key === "tab")
                ) {
                    e.preventDefault()
                    return false
                }

                // Prevent Alt+Tab
                if (e.altKey && e.key === "Tab") {
                    e.preventDefault()
                    return false
                }

                // Prevent F11 (another way to toggle fullscreen)
                if (e.key === "F11") {
                    e.preventDefault()
                    enterFullScreen()
                    return false
                }
            }

            // Enter full screen initially
            enterFullScreen()

            // Add event listeners
            document.addEventListener("fullscreenchange", handleFullScreenChange)
            document.addEventListener("visibilitychange", handleVisibilityChange)
            document.addEventListener("contextmenu", handleContextMenu)
            document.addEventListener("keydown", handleKeyDown)

            // Clean up
            return () => {
                document.removeEventListener("fullscreenchange", handleFullScreenChange)
                document.removeEventListener("visibilitychange", handleVisibilityChange)
                document.removeEventListener("contextmenu", handleContextMenu)
                document.removeEventListener("keydown", handleKeyDown)
            }
        }
    }, [userRole, isFullScreen])

    const generateQuestions = () => {
        // In a real app, these would be generated by an LLM based on the resume and transcript
        const newQuestions = [
            "Can you describe a challenging project you worked on at Google?",
            "How do you approach debugging complex issues in a microservices architecture?",
            "What's your experience with state management in React applications?",
            "How do you stay updated with the latest technologies in your field?",
            "Can you explain a situation where you had to make a difficult technical decision?",
        ]
        setQuestions(newQuestions)
    }

    const handlePinQuestion = (question) => {
        setPinnedQuestions([...pinnedQuestions, question])
        setQuestions(questions.filter((q) => q !== question))
    }

    const handleDismissQuestion = (question) => {
        setQuestions(questions.filter((q) => q !== question))
    }

    const handleUnpinQuestion = (question) => {
        setPinnedQuestions(pinnedQuestions.filter((q) => q !== question))
    }

    const handleRefreshQuestions = () => {
        generateQuestions()
    }

    const handleSkillClick = (skill) => {
        setSelectedSkill(skill)
        // In a real app, this would generate questions specific to the selected skill using an LLM
    }

    const handleStartRecording = () => {
        setIsRecording(true)
        startListening()
    }

    const handleStopRecording = () => {
        setIsRecording(false)
        stopListening()
    }

    const handleEndInterview = () => {
        if (userRole === "interviewer") {
            setShowRubricModal(true)
        } else {
            // For candidates, just redirect to dashboard
            navigate("/candidate-dashboard")
        }
    }

    const handleRubricScoreChange = (criterion, score) => {
        setRubricScores({
            ...rubricScores,
            [criterion]: score,
        })
    }

    const handleSubmitRubric = () => {
        // Calculate final score based on question ratings and rubric scores
        const questionRatingValues = Object.values(questionRatings)
        const rubricScoreValues = Object.values(rubricScores)

        let finalScore = 0
        let totalItems = 0

        if (questionRatingValues.length > 0) {
            finalScore += questionRatingValues.reduce((sum, rating) => sum + rating, 0)
            totalItems += questionRatingValues.length
        }

        if (rubricScoreValues.length > 0) {
            finalScore += rubricScoreValues.reduce((sum, score) => sum + score, 0)
            totalItems += rubricScoreValues.length
        }

        const averageScore = totalItems > 0 ? Math.round((finalScore / totalItems) * 20) : 0 // Convert to percentage (0-100)

        console.log("Final candidate score:", averageScore)

        // In a real app, this would save the score to the backend
        setShowRubricModal(false)

        // Navigate to interviewer dashboard
        navigate("/interviewer-dashboard")
    }

    const handleRateQuestion = (question, rating) => {
        setQuestionRatings({
            ...questionRatings,
            [question]: rating,
        })
    }

    const handleRoleSelect = (role) => {
        setUserRole(role)
        setShowRoleConfirmation(false)

        // If candidate, immediately go to full screen
        if (role === "candidate" && fullScreenRef.current) {
            fullScreenRef.current.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`)
            })
            setIsFullScreen(true)
            handleStartRecording() // Automatically start recording when the candidate joins the meeting
        }
    }

    const fetchConfidence = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/stream", {
                method: "GET",
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText)
            }
            const result = await response.json()
            setSentimentScore(result.confidence)
            console.log(result.confidence)
        } catch (error) {
            console.error("Error fetching confidence:", error)
        }
    }

    useEffect(() => {
        const intervalId = setInterval(fetchConfidence, 3000) // Fetch every 3 seconds

        return () => clearInterval(intervalId) // Clean up the interval on component unmount
    }, [])

    // New function to open coding challenge modal
    const handleOpenCodingChallenge = () => {
        setShowCodingModal(true)
    }

    // Function to submit coding challenge
    const handleSubmitCodingChallenge = (challenge) => {
        setCodingChallenge(challenge)
        setShowCodingModal(false)

        // If user is interviewer, notify candidate
        if (userRole === "interviewer") {
            // In a real app, this would send a notification to the candidate
            console.log("Coding challenge sent to candidate:", challenge)

            // Add to transcript
            setTranscript([
                ...transcript,
                {
                    speaker: "Interviewer",
                    text: `I've sent you a coding challenge: "${challenge.title}". Please solve it to demonstrate your skills.`,
                },
            ])
        } else {
            // If user is candidate, show compiler immediately
            setShowCompiler(true)
        }
    }

    // Function to handle when interviewer sends challenge to candidate
    const handleSendChallengeToCandidate = () => {
        // In a real app, this would send the challenge to the candidate via websocket or API
        // For now, we'll just simulate this by adding to transcript
        setTranscript([
            ...transcript,
            {
                speaker: "System",
                text: "Coding challenge has been sent to the candidate.",
            },
        ])

        // In a real app, the candidate would receive a notification and be redirected
    }

    // Function to return from compiler to interview
    const handleReturnToInterview = () => {
        setShowCompiler(false)
    }

    // Star rating component for interviewer
    const StarRating = ({ question, currentRating, onRate }) => {
        return (
            <div className="flex items-center space-x-1 mt-2 transition-all duration-300 ease-in-out">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => onRate(question, star)}
                        className="focus:outline-none transform transition-transform duration-200 hover:scale-125"
                    >
                        <svg
                            className={`w-5 h-5 ${star <= currentRating ? "text-yellow-400 fill-current" : "text-gray-400"}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    </button>
                ))}
                <span className="text-xs text-gray-300 ml-1">{currentRating > 0 ? `${currentRating}/5` : ""}</span>
            </div>
        )
    }

    // If showing compiler, render the compiler component
    if (showCompiler) {
        return <CodeCompiler challenge={codingChallenge} onReturn={handleReturnToInterview} />
    }

    const sendTranscript = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/generate_question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chunks: transcript.filter(entry => entry.speaker === "Candidate").map(entry => entry.text),
                    selected_skills: [],
                }),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText)
            }

            const result = await response.json()
            console.log("Transcript sent successfully:", result)
        } catch (error) {
            console.error("Error sending transcript:", error)
        }
    }

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onresult = (event) => {
            let finalTranscript = ""
            for (let i = event.resultIndex; i < event.results.length; i++) {
                finalTranscript += event.results[i][0].transcript
            }
            setTranscript((prevTranscript) => [...prevTranscript, { speaker: "Candidate", text: finalTranscript }])
        }

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error)
        }

        recognition.start()
        transcriptIntervalRef.current = setInterval(sendTranscript, 15000)
    }

    const stopListening = () => {
        if (transcriptIntervalRef.current) {
            clearInterval(transcriptIntervalRef.current)
        }
    }

    return (
        <div ref={fullScreenRef} className="min-h-screen bg-gray-900 text-white">
            {/* Role Confirmation Modal */}
            {showRoleConfirmation && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl border border-purple-500/30 p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                            Confirm Your Role
                        </h2>
                        <p className="text-gray-300 mb-6 text-center">Please select your role for this interview session.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleRoleSelect("candidate")}
                                className="p-4 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium transition-all transform hover:scale-105 flex flex-col items-center"
                            >
                                <svg
                                    className="w-8 h-8 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    ></path>
                                </svg>
                                Candidate
                                <span className="text-xs mt-2 text-purple-200">Full screen mode will be enabled</span>
                            </button>
                            <button
                                onClick={() => handleRoleSelect("interviewer")}
                                className="p-4 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium transition-all transform hover:scale-105 flex flex-col items-center"
                            >
                                <svg
                                    className="w-8 h-8 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    ></path>
                                </svg>
                                Interviewer
                                <span className="text-xs mt-2 text-blue-200">Question rating enabled</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Interview Header */}
            <div className="bg-black/80 backdrop-blur-md p-4 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-2 rounded-lg">
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
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            ></path>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Interview Session #{id}</h1>
                        <p className="text-gray-400 text-sm">Software Engineer Position</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {userRole === "interviewer" && (
                        <>
                            <button
                                onClick={handleOpenCodingChallenge}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-medium transition-all transform hover:scale-105 flex items-center"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                    ></path>
                                </svg>
                                Post Coding Challenge
                            </button>
                            <div className="flex items-center">
                <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${isRecording ? "bg-red-500 animate-pulse" : "bg-gray-500"}`}
                ></span>
                                <span className="text-sm">{isRecording ? "Recording" : "Not Recording"}</span>
                            </div>
                            <button
                                onClick={isRecording ? handleStopRecording : handleStartRecording}
                                className={`px-4 py-2 rounded-lg ${
                                    isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                                } transition-colors`}
                            >
                                {isRecording ? "Stop Recording" : "Start Recording"}
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleEndInterview}
                        className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
                    >
                        {userRole === "interviewer" ? "End Interview" : "Leave Interview"}
                    </button>
                </div>
            </div>

            {/* Main Interview Area */}
            <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-72px)]">
                {/* Left Panel - Questions (only visible to interviewer) */}
                {userRole === "interviewer" && (
                    <div className="col-span-3 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-4 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Suggested Questions</h2>
                            <button
                                onClick={handleRefreshQuestions}
                                className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
                            >
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    ></path>
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-3 mb-6 overflow-y-auto flex-grow">
                            {questions.map((question, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-700/50 p-3 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors group"
                                    onMouseEnter={() => setHoveredQuestion(question)}
                                    onMouseLeave={() => setHoveredQuestion(null)}
                                >
                                    <p className="text-sm text-gray-200 mb-2">{question}</p>

                                    {/* Star rating for interviewer */}
                                    <StarRating
                                        question={question}
                                        currentRating={questionRatings[question] || 0}
                                        onRate={handleRateQuestion}
                                    />

                                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handlePinQuestion(question)}
                                            className="p-1 rounded bg-gray-600 hover:bg-gray-500 transition-colors"
                                            title="Pin Question"
                                        >
                                            <svg
                                                className="w-4 h-4 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                                ></path>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDismissQuestion(question)}
                                            className="p-1 rounded bg-gray-600 hover:bg-gray-500 transition-colors"
                                            title="Dismiss Question"
                                        >
                                            <svg
                                                className="w-4 h-4 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pinnedQuestions.length > 0 && (
                            <div>
                                <h3 className="text-md font-bold mb-2 text-purple-300">Pinned Questions</h3>
                                <div className="space-y-3">
                                    {pinnedQuestions.map((question, index) => (
                                        <div
                                            key={index}
                                            className="bg-purple-900/30 p-3 rounded-lg border border-purple-600 group"
                                            onMouseEnter={() => setHoveredQuestion(question)}
                                            onMouseLeave={() => setHoveredQuestion(null)}
                                        >
                                            <p className="text-sm text-gray-200 mb-2">{question}</p>

                                            {/* Star rating for interviewer */}
                                            <StarRating
                                                question={question}
                                                currentRating={questionRatings[question] || 0}
                                                onRate={handleRateQuestion}
                                            />

                                            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleUnpinQuestion(question)}
                                                    className="p-1 rounded bg-purple-700 hover:bg-purple-600 transition-colors"
                                                    title="Unpin Question"
                                                >
                                                    <svg
                                                        className="w-4 h-4 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        ></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Center Panel - Video and Transcript */}
                <div className={`${userRole === "interviewer" ? "col-span-6" : "col-span-9"} flex flex-col h-full`}>
                    {/* Video Area */}
                    <div className="bg-black rounded-xl overflow-hidden mb-4 relative aspect-video">
                        <JitsiIframe />
                        {userRole === "interviewer" && (
                            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm p-2 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm">Sentiment:</span>
                                    <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${
                                                sentimentScore > 70 ? "bg-green-500" : sentimentScore > 40 ? "bg-yellow-500" : "bg-red-500"
                                            }`}
                                            style={{ width: `${sentimentScore}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium">{sentimentScore}%</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Transcript Area */}
                    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-4 flex-grow overflow-hidden flex flex-col">
                        <h2 className="text-lg font-bold mb-4">Live Transcript</h2>
                        <div className="overflow-y-auto flex-grow space-y-4 pr-2">
                            {transcript.filter(entry => entry.speaker === "Candidate").map((entry, index) => (
                                <div
                                    key={index}
                                    className={`flex ${entry.speaker === "Interviewer" ? "justify-start" : "justify-end"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${
                                            entry.speaker === "Interviewer"
                                                ? "bg-gray-700 text-white rounded-tl-none"
                                                : "bg-purple-700 text-white rounded-tr-none"
                                        }`}
                                    >
                                        <p className="text-xs font-bold mb-1 opacity-70">{entry.speaker}</p>
                                        <p className="text-sm">{entry.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isRecording && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] p-3 rounded-lg bg-gray-700 text-white rounded-tl-none">
                                        <p className="text-xs font-bold mb-1 opacity-70">Interviewer</p>
                                        <div className="flex space-x-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "0.2s" }}
                                            ></span>
                                            <span
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "0.4s" }}
                                            ></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Resume (only visible to interviewer) */}
                {userRole === "interviewer" && (
                    <div className="col-span-3 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-4 overflow-y-auto h-full">
                        <h2 className="text-lg font-bold mb-4">Candidate Resume</h2>

                        {resumeData && (
                            <div className="space-y-6">
                                <div className="border-b border-gray-700 pb-4">
                                    <h3 className="text-xl font-bold text-purple-300">{resumeData.name}</h3>
                                    <p className="text-gray-300 text-sm">{resumeData.email}</p>
                                    <p className="text-gray-300 text-sm">{resumeData.phone}</p>
                                </div>

                                <div>
                                    <h4 className="text-md font-bold mb-2 text-purple-300">Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeData.skills.map((skill, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSkillClick(skill)}
                                                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                                    selectedSkill && selectedSkill.name === skill.name
                                                        ? "bg-purple-600 text-white"
                                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                }`}
                                            >
                                                {skill.name}
                                            </button>
                                        ))}
                                    </div>

                                    {selectedSkill && (
                                        <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-600">
                                            <h5 className="font-medium text-purple-300">
                                                {selectedSkill.name} - {selectedSkill.level}
                                            </h5>
                                            <div className="mt-2 space-y-2">
                                                <p className="text-sm text-gray-300">Suggested questions:</p>
                                                <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                                                    <li>Can you describe a project where you used {selectedSkill.name}?</li>
                                                    <li>What challenges have you faced with {selectedSkill.name}?</li>
                                                    <li>How do you stay updated with the latest developments in {selectedSkill.name}?</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-md font-bold mb-2 text-purple-300">Experience</h4>
                                    <div className="space-y-4">
                                        {resumeData.experience.map((exp, index) => (
                                            <div
                                                key={index}
                                                className="p-3 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors"
                                            >
                                                <h5 className="font-medium">{exp.position}</h5>
                                                <p className="text-sm text-purple-300">
                                                    {exp.company} | {exp.duration}
                                                </p>
                                                <p className="text-sm text-gray-300 mt-1">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-md font-bold mb-2 text-purple-300">Education</h4>
                                    <div className="space-y-4">
                                        {resumeData.education.map((edu, index) => (
                                            <div
                                                key={index}
                                                className="p-3 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors"
                                            >
                                                <h5 className="font-medium">{edu.degree}</h5>
                                                <p className="text-sm text-purple-300">
                                                    {edu.institution} | {edu.year}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Coding Challenge Modal */}
            {showCodingModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl border border-purple-500/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                            Create Coding Challenge
                        </h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.target)
                                const challenge = {
                                    title: formData.get("title"),
                                    description: formData.get("description"),
                                    difficulty: formData.get("difficulty"),
                                    starterCode: formData.get("starterCode"),
                                    testCases: formData
                                        .get("testCases")
                                        .split("\n")
                                        .filter((line) => line.trim() !== ""),
                                    expectedOutputs: formData
                                        .get("expectedOutputs")
                                        .split("\n")
                                        .filter((line) => line.trim() !== ""),
                                    timeLimit: Number.parseInt(formData.get("timeLimit")),
                                    language: formData.get("language"),
                                }
                                handleSubmitCodingChallenge(challenge)
                            }}
                        >
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            defaultValue="Two Sum"
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">Difficulty</label>
                                        <select
                                            name="difficulty"
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Description</label>
                                    <textarea
                                        name="description"
                                        defaultValue="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice."
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none h-32"
                                        required
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">Language</label>
                                        <select
                                            name="language"
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        >
                                            <option value="javascript">JavaScript</option>
                                            <option value="python">Python</option>
                                            <option value="java">Java</option>
                                            <option value="cpp">C++</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">Time Limit (seconds)</label>
                                        <input
                                            type="number"
                                            name="timeLimit"
                                            defaultValue="5"
                                            min="1"
                                            max="30"
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Starter Code</label>
                                    <textarea
                                        name="starterCode"
                                        defaultValue={`function twoSum(nums, target) {\n    // Your code here\n}`}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none h-32 font-mono"
                                        required
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">Test Cases (one per line)</label>
                                        <textarea
                                            name="testCases"
                                            defaultValue={`[2,7,11,15], 9\n[3,2,4], 6\n[3,3], 6`}
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none h-32 font-mono"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">Expected Outputs (one per line)</label>
                                        <textarea
                                            name="expectedOutputs"
                                            defaultValue={`[0,1]\n[1,2]\n[0,1]`}
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none h-32 font-mono"
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setShowCodingModal(false)}
                                        className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white transition-colors"
                                    >
                                        Send to Candidate
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rubric Modal */}
            {showRubricModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl border border-purple-500/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                            Candidate Evaluation
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold mb-3 text-purple-300">Technical Skills</h3>
                                <div className="space-y-4">
                                    {["JavaScript", "React", "Problem Solving", "System Design"].map((skill) => (
                                        <div key={skill} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-gray-300">{skill}</label>
                                                <span className="text-sm text-gray-400">{rubricScores[skill] || 0}/5</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                {[1, 2, 3, 4, 5].map((score) => (
                                                    <button
                                                        key={score}
                                                        onClick={() => handleRubricScoreChange(skill, score)}
                                                        className={`w-full py-2 rounded-md transition-colors ${
                                                            rubricScores[skill] === score
                                                                ? "bg-purple-600 text-white"
                                                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                        }`}
                                                    >
                                                        {score}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-3 text-purple-300">Soft Skills</h3>
                                <div className="space-y-4">
                                    {["Communication", "Teamwork", "Adaptability", "Confidence"].map((skill) => (
                                        <div key={skill} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-gray-300">{skill}</label>
                                                <span className="text-sm text-gray-400">{rubricScores[skill] || 0}/5</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                {[1, 2, 3, 4, 5].map((score) => (
                                                    <button
                                                        key={score}
                                                        onClick={() => handleRubricScoreChange(skill, score)}
                                                        className={`w-full py-2 rounded-md transition-colors ${
                                                            rubricScores[skill] === score
                                                                ? "bg-purple-600 text-white"
                                                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                        }`}
                                                    >
                                                        {score}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-3 text-purple-300">Question Ratings</h3>
                                <div className="space-y-4">
                                    {Object.keys(questionRatings).length > 0 ? (
                                        Object.entries(questionRatings).map(([question, rating]) => (
                                            <div key={question} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                                <p className="text-sm text-gray-200 mb-2">{question}</p>
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg
                                                            key={star}
                                                            className={`w-5 h-5 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-400"}`}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                        </svg>
                                                    ))}
                                                    <span className="text-sm text-gray-300 ml-2">{rating}/5</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center py-4">No questions have been rated yet</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Additional Comments</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none h-32"
                                    placeholder="Add any additional feedback or notes about the candidate..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                                <button
                                    onClick={() => setShowRubricModal(false)}
                                    className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitRubric}
                                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition-colors"
                                >
                                    Submit Evaluation & End Interview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InterviewRoom
