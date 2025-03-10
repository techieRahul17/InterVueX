"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

const CodeCompiler = ({ challenge, onReturn }) => {
    const navigate = useNavigate()
    const [code, setCode] = useState(
        challenge?.starterCode || "function twoSum(nums, target) {\n    // Your code here\n}",
    )
    const [language, setLanguage] = useState(challenge?.language || "javascript")
    const [theme, setTheme] = useState("dark")
    const [fontSize, setFontSize] = useState(14)
    const [output, setOutput] = useState("")
    const [isRunning, setIsRunning] = useState(false)
    const [testResults, setTestResults] = useState([])
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [memoryUsed, setMemoryUsed] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submissionStatus, setSubmissionStatus] = useState(null)
    const [showHint, setShowHint] = useState(false)
    const [activeTab, setActiveTab] = useState("problem")
    const timerRef = useRef(null)
    const editorRef = useRef(null)
    const monacoRef = useRef(null)

    // Mock challenge if none provided
    const defaultChallenge = {
        title: "Two Sum",
        description:
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        difficulty: "Easy",
        starterCode: "function twoSum(nums, target) {\n    // Your code here\n}",
        testCases: ["[2,7,11,15], 9", "[3,2,4], 6", "[3,3], 6"],
        expectedOutputs: ["[0,1]", "[1,2]", "[0,1]"],
        timeLimit: 5,
        language: "javascript",
    }

    const currentChallenge = challenge || defaultChallenge

    // Initialize Monaco editor
    useEffect(() => {
        // In a real app, this would load Monaco editor
        // For this example, we'll simulate it with a textarea
        console.log("Monaco editor would be initialized here")

        // Start timer for the challenge
        const startTime = Date.now()
        timerRef.current = setInterval(() => {
            setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
        }, 1000)

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [])

    // Function to run code against test cases
    const runCode = () => {
        setIsRunning(true)
        setOutput("")
        setTestResults([])

        try {
            // For JavaScript, we can actually execute the code
            // In a real app, this would be done in a sandbox
            const userFunction = new Function(`
                ${code}
                return twoSum;
            `)()

            // Run against test cases
            const results = currentChallenge.testCases.map((testCase, index) => {
                try {
                    // Parse test case
                    const [numsStr, targetStr] = testCase.split(",").map((s) => s.trim())
                    const nums = JSON.parse(numsStr)
                    const target = Number.parseInt(targetStr)

                    // Execute user code
                    const startTime = performance.now()
                    const result = userFunction(nums, target)
                    const endTime = performance.now()
                    const executionTime = endTime - startTime

                    // Check result
                    const expectedOutput = JSON.parse(currentChallenge.expectedOutputs[index])
                    const isCorrect = JSON.stringify(result) === JSON.stringify(expectedOutput)

                    return {
                        testCase,
                        result: JSON.stringify(result),
                        expected: currentChallenge.expectedOutputs[index],
                        passed: isCorrect,
                        executionTime,
                    }
                } catch (error) {
                    return {
                        testCase,
                        result: `Error: ${error.message}`,
                        expected: currentChallenge.expectedOutputs[index],
                        passed: false,
                        executionTime: 0,
                    }
                }
            })

            setTestResults(results)
            setMemoryUsed(Math.floor(Math.random() * 10) + 5) // Mock memory usage

            // Calculate overall status
            const allPassed = results.every((r) => r.passed)
            setOutput(allPassed ? "All test cases passed!" : "Some test cases failed.")
        } catch (error) {
            setOutput(`Error: ${error.message}`)
        } finally {
            setIsRunning(false)
        }
    }

    // Function to submit solution
    const submitSolution = () => {
        setIsSubmitting(true)

        // Run the code first to verify
        try {
            const userFunction = new Function(`
                ${code}
                return twoSum;
            `)()

            // Run against test cases
            const results = currentChallenge.testCases.map((testCase, index) => {
                try {
                    // Parse test case
                    const [numsStr, targetStr] = testCase.split(",").map((s) => s.trim())
                    const nums = JSON.parse(numsStr)
                    const target = Number.parseInt(targetStr)

                    // Execute user code
                    const startTime = performance.now()
                    const result = userFunction(nums, target)
                    const endTime = performance.now()
                    const executionTime = endTime - startTime

                    // Check result
                    const expectedOutput = JSON.parse(currentChallenge.expectedOutputs[index])
                    const isCorrect = JSON.stringify(result) === JSON.stringify(expectedOutput)

                    return {
                        testCase,
                        result: JSON.stringify(result),
                        expected: currentChallenge.expectedOutputs[index],
                        passed: isCorrect,
                        executionTime,
                    }
                } catch (error) {
                    return {
                        testCase,
                        result: `Error: ${error.message}`,
                        expected: currentChallenge.expectedOutputs[index],
                        passed: false,
                        executionTime: 0,
                    }
                }
            })

            setTestResults(results)

            // Calculate overall status
            const allPassed = results.every((r) => r.passed)
            const totalTime = results.reduce((sum, r) => sum + r.executionTime, 0)
            const avgTime = totalTime / results.length

            setSubmissionStatus({
                passed: allPassed,
                score: allPassed ? 100 : Math.floor((results.filter((r) => r.passed).length / results.length) * 100),
                time: avgTime.toFixed(2),
                memory: Math.floor(Math.random() * 10) + 5, // Mock memory usage
            })

            // In a real app, this would send the submission to the backend
            console.log("Submission would be sent to backend:", {
                code,
                language,
                results,
                allPassed,
                timeElapsed,
            })
        } catch (error) {
            setSubmissionStatus({
                passed: false,
                score: 0,
                error: error.message,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Function to format code
    const formatCode = () => {
        // In a real app, this would use a code formatter like Prettier
        // For this example, we'll just simulate formatting
        setCode(code.replace(/\s{4}/g, "  "))
    }

    // Function to reset code to starter code
    const resetCode = () => {
        if (confirm("Are you sure you want to reset your code? All changes will be lost.")) {
            setCode(currentChallenge.starterCode)
        }
    }

    // Function to return to interview
    const handleReturn = () => {
        if (onReturn) {
            onReturn()
        } else {
            navigate(-1)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <header className="bg-black/80 backdrop-blur-md p-4 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 p-2 rounded-lg">
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
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            ></path>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{currentChallenge.title}</h1>
                        <div className="flex items-center space-x-2">
              <span
                  className={`text-xs px-2 py-1 rounded-full ${
                      currentChallenge.difficulty === "Easy"
                          ? "bg-green-600"
                          : currentChallenge.difficulty === "Medium"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                  }`}
              >
                {currentChallenge.difficulty}
              </span>
                            <span className="text-gray-400 text-sm">Time: {timeElapsed}s</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleReturn}
                        className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                        Return to Interview
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-grow grid grid-cols-12 gap-4 p-4">
                {/* Left Panel - Problem Description */}
                <div className="col-span-12 lg:col-span-4 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-4 flex flex-col h-full">
                    <div className="flex mb-4 border-b border-gray-700">
                        <button
                            onClick={() => setActiveTab("problem")}
                            className={`px-4 py-2 ${activeTab === "problem" ? "border-b-2 border-teal-500 text-teal-400" : "text-gray-400"}`}
                        >
                            Problem
                        </button>
                        <button
                            onClick={() => setActiveTab("examples")}
                            className={`px-4 py-2 ${activeTab === "examples" ? "border-b-2 border-teal-500 text-teal-400" : "text-gray-400"}`}
                        >
                            Examples
                        </button>
                        <button
                            onClick={() => setActiveTab("hints")}
                            className={`px-4 py-2 ${activeTab === "hints" ? "border-b-2 border-teal-500 text-teal-400" : "text-gray-400"}`}
                        >
                            Hints
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-grow">
                        {activeTab === "problem" && (
                            <div className="space-y-4">
                                <p className="text-gray-300">{currentChallenge.description}</p>
                                <div>
                                    <h3 className="text-md font-bold text-teal-400 mb-2">Constraints:</h3>
                                    <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                                        <li>2 ≤ nums.length ≤ 10^4</li>
                                        <li>-10^9 ≤ nums[i] ≤ 10^9</li>
                                        <li>-10^9 ≤ target ≤ 10^9</li>
                                        <li>Only one valid answer exists.</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === "examples" && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-md font-bold text-teal-400">Example 1:</h3>
                                    <div className="bg-gray-700/50 p-3 rounded-lg font-mono text-sm">
                                        <p>
                                            <span className="text-purple-400">Input:</span> nums = [2,7,11,15], target = 9
                                        </p>
                                        <p>
                                            <span className="text-purple-400">Output:</span> [0,1]
                                        </p>
                                        <p>
                                            <span className="text-purple-400">Explanation:</span> Because nums[0] + nums[1] == 9, we return
                                            [0, 1].
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-md font-bold text-teal-400">Example 2:</h3>
                                    <div className="bg-gray-700/50 p-3 rounded-lg font-mono text-sm">
                                        <p>
                                            <span className="text-purple-400">Input:</span> nums = [3,2,4], target = 6
                                        </p>
                                        <p>
                                            <span className="text-purple-400">Output:</span> [1,2]
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-md font-bold text-teal-400">Example 3:</h3>
                                    <div className="bg-gray-700/50 p-3 rounded-lg font-mono text-sm">
                                        <p>
                                            <span className="text-purple-400">Input:</span> nums = [3,3], target = 6
                                        </p>
                                        <p>
                                            <span className="text-purple-400">Output:</span> [0,1]
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "hints" && (
                            <div className="space-y-4">
                                {!showHint ? (
                                    <button
                                        onClick={() => setShowHint(true)}
                                        className="px-4 py-2 rounded-lg bg-teal-600/30 border border-teal-600 hover:bg-teal-600/50 transition-colors w-full"
                                    >
                                        Show Hint
                                    </button>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-teal-900/30 p-3 rounded-lg border border-teal-800">
                                            <h3 className="text-md font-bold text-teal-400 mb-2">Hint 1:</h3>
                                            <p className="text-gray-300">
                                                A really brute force way would be to search for all possible pairs of numbers but that would be
                                                too slow.
                                            </p>
                                        </div>
                                        <div className="bg-teal-900/30 p-3 rounded-lg border border-teal-800">
                                            <h3 className="text-md font-bold text-teal-400 mb-2">Hint 2:</h3>
                                            <p className="text-gray-300">Try to use a hashmap to reduce the looking up time complexity.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Center Panel - Code Editor */}
                <div className="col-span-12 lg:col-span-5 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                            </select>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm"
                            >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                            <select
                                value={fontSize}
                                onChange={(e) => setFontSize(Number.parseInt(e.target.value))}
                                className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm"
                            >
                                {[12, 14, 16, 18, 20].map((size) => (
                                    <option key={size} value={size}>
                                        {size}px
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={formatCode}
                                className="p-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
                                title="Format Code"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                </svg>
                            </button>
                            <button
                                onClick={resetCode}
                                className="p-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
                                title="Reset Code"
                            >
                                <svg
                                    className="w-5 h-5"
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
                    </div>

                    {/* Code Editor */}
                    <div className="flex-grow relative">
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-gray-900 text-gray-200 font-mono p-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                style={{ fontSize: `${fontSize}px` }}
            />
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={runCode}
                            disabled={isRunning}
                            className={`px-4 py-2 rounded-lg ${
                                isRunning ? "bg-gray-600" : "bg-teal-600 hover:bg-teal-700"
                            } transition-colors flex items-center`}
                        >
                            {isRunning ? (
                                <>
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
                                    Running...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                        ></path>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    Run Code
                                </>
                            )}
                        </button>
                        <button
                            onClick={submitSolution}
                            disabled={isSubmitting}
                            className={`px-4 py-2 rounded-lg ${
                                isSubmitting
                                    ? "bg-gray-600"
                                    : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                            } transition-colors flex items-center`}
                        >
                            {isSubmitting ? (
                                <>
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
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    Submit
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Panel - Output and Test Results */}
                <div className="col-span-12 lg:col-span-3 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-4 flex flex-col h-full">
                    <h2 className="text-lg font-bold mb-4">Output</h2>

                    {/* Submission Status */}
                    {submissionStatus && (
                        <div
                            className={`mb-4 p-4 rounded-lg ${
                                submissionStatus.passed
                                    ? "bg-green-900/30 border border-green-700"
                                    : "bg-red-900/30 border border-red-700"
                            }`}
                        >
                            <div className="flex items-center mb-2">
                                {submissionStatus.passed ? (
                                    <svg
                                        className="w-6 h-6 text-green-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-6 h-6 text-red-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                )}
                                <h3 className="text-lg font-bold">{submissionStatus.passed ? "Accepted" : "Failed"}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-400">Score:</p>
                                    <p className="font-medium">{submissionStatus.score}%</p>
                                </div>
                                {submissionStatus.time && (
                                    <div>
                                        <p className="text-gray-400">Runtime:</p>
                                        <p className="font-medium">{submissionStatus.time} ms</p>
                                    </div>
                                )}
                                {submissionStatus.memory && (
                                    <div>
                                        <p className="text-gray-400">Memory:</p>
                                        <p className="font-medium">{submissionStatus.memory} MB</p>
                                    </div>
                                )}
                            </div>
                            {submissionStatus.error && (
                                <div className="mt-2 p-2 bg-red-900/50 rounded text-sm font-mono">{submissionStatus.error}</div>
                            )}
                        </div>
                    )}

                    {/* Console Output */}
                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-300 mb-4 flex-grow overflow-y-auto">
                        {output || "Run your code to see output..."}
                    </div>

                    {/* Test Results */}
                    <div className="space-y-3 overflow-y-auto">
                        <h3 className="text-md font-bold">Test Cases</h3>
                        {testResults.length > 0 ? (
                            testResults.map((result, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg border ${
                                        result.passed ? "bg-green-900/20 border-green-700" : "bg-red-900/20 border-red-700"
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-medium">Test Case {index + 1}</span>
                                        {result.passed ? (
                                            <span className="text-xs text-green-500">Passed</span>
                                        ) : (
                                            <span className="text-xs text-red-500">Failed</span>
                                        )}
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <p>
                                            <span className="text-gray-400">Input:</span> {result.testCase}
                                        </p>
                                        <p>
                                            <span className="text-gray-400">Expected:</span> {result.expected}
                                        </p>
                                        <p>
                                            <span className="text-gray-400">Output:</span> {result.result}
                                        </p>
                                        <p>
                                            <span className="text-gray-400">Time:</span> {result.executionTime.toFixed(2)} ms
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm">No test results yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CodeCompiler

