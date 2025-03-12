'use client'

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MonacoEditor from 'react-monaco-editor'
import prettier from 'prettier/standalone'
import parserBabel from 'prettier/parser-babel'
import parserHtml from 'prettier/parser-html'
import parserPostcss from 'prettier/parser-postcss'
import parserTypescript from 'prettier/parser-typescript'

// Language starter code templates
const starterCodeTemplates = {
  javascript: `function twoSum(nums, target) {
  // Your code here
  
}`,
  python: `def twoSum(nums, target):
    # Your code here
    pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{0, 0};
    }
}`,
  cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {0, 0};
    }
};`,
}

// Language execution functions
const executeCode = {
  javascript: (code, testCase, expectedOutput) => {
    try {
      // For JavaScript, we can use Function constructor to evaluate code
      const userFunction = new Function(`
        ${code}
        return twoSum;
      `)()

      // Parse test case
      const [numsStr, targetStr] = testCase.split(',').map((s) => s.trim())
      const nums = JSON.parse(numsStr)
      const target = parseInt(targetStr)

      // Execute user code
      const startTime = performance.now()
      const result = userFunction(nums, target)
      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Check result
      const expectedResult = JSON.parse(expectedOutput)
      const isCorrect =
        JSON.stringify(result) === JSON.stringify(expectedResult)

      return {
        result: JSON.stringify(result),
        passed: isCorrect,
        executionTime,
      }
    } catch (error) {
      return {
        result: `Error: ${error.message}`,
        passed: false,
        executionTime: 0,
      }
    }
  },

  python: (code, testCase, expectedOutput) => {
    // In a real app, this would call a backend API to execute Python code
    // For this demo, we'll simulate Python execution
    try {
      // Simulate execution delay
      const startTime = performance.now()
      const delay = Math.random() * 50 + 10

      // Parse test case for validation
      const [numsStr, targetStr] = testCase.split(',').map((s) => s.trim())
      const nums = JSON.parse(numsStr)
      const target = parseInt(targetStr)

      // Check if code contains key solution patterns
      const hasHashMap = code.includes('dict(') || code.includes('{}')
      const hasLoop = code.includes('for ') || code.includes('while ')
      const hasReturn = code.includes('return [') || code.includes('return[')

      // Simple heuristic to determine if code might be correct
      const mightBeCorrect = hasHashMap && hasLoop && hasReturn

      // Simulate result based on code patterns
      let result
      if (mightBeCorrect) {
        result = JSON.parse(expectedOutput)
      } else {
        // Generate a plausible but incorrect result
        result = nums.length > 1 ? [0, 1] : [0, 0]
      }

      const endTime = performance.now() + delay
      const executionTime = endTime - startTime

      // Check if our simulated result matches expected
      const isCorrect = JSON.stringify(result) === expectedOutput

      return {
        result: JSON.stringify(result),
        passed: isCorrect,
        executionTime,
      }
    } catch (error) {
      return {
        result: `Error: ${error.message}`,
        passed: false,
        executionTime: 0,
      }
    }
  },

  java: (code, testCase, expectedOutput) => {
    // Simulate Java execution
    try {
      // Simulate execution delay
      const startTime = performance.now()
      const delay = Math.random() * 100 + 20 // Java is typically slower

      // Parse test case for validation
      const [numsStr, targetStr] = testCase.split(',').map((s) => s.trim())

      // Check if code contains key solution patterns
      const hasHashMap = code.includes('HashMap') || code.includes('Map<')
      const hasLoop = code.includes('for (') || code.includes('while (')
      const hasReturn =
        code.includes('return new int[]') || code.includes('return result')

      // Simple heuristic to determine if code might be correct
      const mightBeCorrect = hasHashMap && hasLoop && hasReturn

      // Simulate result based on code patterns
      let result
      if (mightBeCorrect) {
        result = JSON.parse(expectedOutput)
      } else {
        // Generate a plausible but incorrect result
        result = [0, 0]
      }

      const endTime = performance.now() + delay
      const executionTime = endTime - startTime

      // Check if our simulated result matches expected
      const isCorrect = JSON.stringify(result) === expectedOutput

      return {
        result: JSON.stringify(result),
        passed: isCorrect,
        executionTime,
      }
    } catch (error) {
      return {
        result: `Error: ${error.message}`,
        passed: false,
        executionTime: 0,
      }
    }
  },

  cpp: (code, testCase, expectedOutput) => {
    // Simulate C++ execution
    try {
      // Simulate execution delay
      const startTime = performance.now()
      const delay = Math.random() * 30 + 5 // C++ is typically faster

      // Parse test case for validation
      const [numsStr, targetStr] = testCase.split(',').map((s) => s.trim())

      // Check if code contains key solution patterns
      const hasHashMap = code.includes('unordered_map') || code.includes('map<')
      const hasLoop = code.includes('for (') || code.includes('while (')
      const hasReturn =
        code.includes('return {') || code.includes('return vector')

      // Simple heuristic to determine if code might be correct
      const mightBeCorrect = hasHashMap && hasLoop && hasReturn

      // Simulate result based on code patterns
      let result
      if (mightBeCorrect) {
        result = JSON.parse(expectedOutput)
      } else {
        // Generate a plausible but incorrect result
        result = [0, 0]
      }

      const endTime = performance.now() + delay
      const executionTime = endTime - startTime

      // Check if our simulated result matches expected
      const isCorrect = JSON.stringify(result) === expectedOutput

      return {
        result: JSON.stringify(result),
        passed: isCorrect,
        executionTime,
      }
    } catch (error) {
      return {
        result: `Error: ${error.message}`,
        passed: false,
        executionTime: 0,
      }
    }
  },
}

const CodeCompiler = ({ challenge, onReturn, onSubmitScore }) => {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState(challenge?.language || 'javascript')
  const [theme, setTheme] = useState('vs-dark')
  const [fontSize, setFontSize] = useState(14)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState([])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [memoryUsed, setMemoryUsed] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [activeTab, setActiveTab] = useState('problem')
  const timerRef = useRef(null)
  const editorRef = useRef(null)
  const monacoRef = useRef(null)

  // Mock challenge if none provided
  const defaultChallenge = {
    title: 'Two Sum',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'Easy',
    starterCode: 'function twoSum(nums, target) {\n  // Your code here\n}',
    testCases: ['[2,7,11,15], 9', '[3,2,4], 6', '[3,3], 6'],
    expectedOutputs: ['[0,1]', '[1,2]', '[0,1]'],
    timeLimit: 5,
    language: 'javascript',
  }

  const currentChallenge = challenge || defaultChallenge

  // Initialize code based on language
  useEffect(() => {
    setCode(starterCodeTemplates[language] || currentChallenge.starterCode)
  }, [language, currentChallenge.starterCode])

  // Initialize timer
  useEffect(() => {
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

  // Apply theme to body
  useEffect(() => {
    document.body.className =
      theme === 'vs-dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'

    return () => {
      document.body.className = ''
    }
  }, [theme])

  // Monaco editor options
  const editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
    fontSize: fontSize,
    minimap: {
      enabled: false,
    },
  }

  // Function to handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
  }

  // Function to run code against test cases
  const runCode = () => {
    setIsRunning(true)
    setOutput('')
    setTestResults([])

    try {
      // Run against test cases
      const results = currentChallenge.testCases.map((testCase, index) => {
        try {
          // Execute code based on language
          const executor = executeCode[language] || executeCode.javascript
          const result = executor(
            code,
            testCase,
            currentChallenge.expectedOutputs[index]
          )

          return {
            testCase,
            result: result.result,
            expected: currentChallenge.expectedOutputs[index],
            passed: result.passed,
            executionTime: result.executionTime,
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
      setOutput(
        allPassed ? 'All test cases passed!' : 'Some test cases failed.'
      )
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
      // Run against test cases
      const results = currentChallenge.testCases.map((testCase, index) => {
        try {
          // Execute code based on language
          const executor = executeCode[language] || executeCode.javascript
          const result = executor(
            code,
            testCase,
            currentChallenge.expectedOutputs[index]
          )

          return {
            testCase,
            result: result.result,
            expected: currentChallenge.expectedOutputs[index],
            passed: result.passed,
            executionTime: result.executionTime,
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

      const score = allPassed
        ? 100
        : Math.floor(
            (results.filter((r) => r.passed).length / results.length) * 100
          )

      const submissionData = {
        passed: allPassed,
        score: score,
        time: avgTime.toFixed(2),
        memory: Math.floor(Math.random() * 10) + 5, // Mock memory usage
      }

      setSubmissionStatus(submissionData)

      // Send score back to interviewer
      if (onSubmitScore) {
        setTimeout(() => {
          onSubmitScore(submissionData)
          // Return to interview after 2 seconds
          setTimeout(() => {
            if (onReturn) onReturn()
          }, 2000)
        }, 1000)
      }
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
    try {
      let formattedCode

      // Format based on language
      switch (language) {
        case 'javascript':
          formattedCode = prettier.format(code, {
            parser: 'babel',
            plugins: [parserBabel],
            semi: true,
            singleQuote: false,
            tabWidth: 2,
          })
          break
        case 'python':
          // Simple Python formatting (in a real app, use a Python formatter)
          formattedCode = code
            .split('\n')
            .map((line) => {
              // Remove extra spaces
              return line.replace(/\s+/g, ' ').replace(/\s*:\s*/g, ': ')
            })
            .join('\n')
          break
        case 'java':
        case 'cpp':
          // Simple formatting for Java/C++ (in a real app, use proper formatters)
          formattedCode = code
            .replace(/\{\s*/g, '{\n  ')
            .replace(/\s*\}/g, '\n}')
            .replace(/;\s*/g, ';\n  ')
          break
        default:
          formattedCode = code
      }

      setCode(formattedCode)
    } catch (error) {
      console.error('Formatting error:', error)
      // Fallback to simple formatting
      setCode(code.replace(/\s{4}/g, '  '))
    }
  }

  // Function to reset code to starter code
  const resetCode = () => {
    if (
      window.confirm(
        'Are you sure you want to reset your code? All changes will be lost.'
      )
    ) {
      setCode(starterCodeTemplates[language] || currentChallenge.starterCode)
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

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark')
  }

  return (
    <div
      className={`min-h-screen ${theme === 'vs-dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} flex flex-col`}
    >
      {/* Main Content */}
      <div className="flex-grow grid grid-cols-12 gap-4 p-4">
        {/* Left Panel - Problem Description */}
        <div
          className={`col-span-12 lg:col-span-4 ${theme === 'vs-dark' ? 'bg-gray-800/50' : 'bg-gray-100'} backdrop-blur-md rounded-xl border ${theme === 'vs-dark' ? 'border-gray-700' : 'border-gray-300'} p-4 flex flex-col h-full`}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold">{currentChallenge.title}</h1>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    currentChallenge.difficulty === 'Easy'
                      ? 'bg-green-600 text-white'
                      : currentChallenge.difficulty === 'Medium'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-red-600 text-white'
                  }`}
                >
                  {currentChallenge.difficulty}
                </span>
                <span
                  className={`text-sm ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Time: {timeElapsed}s
                </span>
              </div>
            </div>
            <button
              onClick={handleReturn}
              className={`px-4 py-2 rounded-lg ${theme === 'vs-dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} transition-colors`}
            >
              Return
            </button>
          </div>

          <div className="flex mb-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-4 py-2 ${activeTab === 'problem' ? `border-b-2 ${theme === 'vs-dark' ? 'border-teal-500 text-teal-400' : 'border-teal-600 text-teal-600'}` : `${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'}`}`}
            >
              Problem
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-4 py-2 ${activeTab === 'examples' ? `border-b-2 ${theme === 'vs-dark' ? 'border-teal-500 text-teal-400' : 'border-teal-600 text-teal-600'}` : `${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'}`}`}
            >
              Examples
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`px-4 py-2 ${activeTab === 'hints' ? `border-b-2 ${theme === 'vs-dark' ? 'border-teal-500 text-teal-400' : 'border-teal-600 text-teal-600'}` : `${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'}`}`}
            >
              Hints
            </button>
          </div>

          <div className="overflow-y-auto flex-grow">
            {activeTab === 'problem' && (
              <div className="space-y-4">
                <p
                  className={
                    theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-700'
                  }
                >
                  {currentChallenge.description}
                </p>
                <div>
                  <h3
                    className={`text-md font-bold ${theme === 'vs-dark' ? 'text-teal-400' : 'text-teal-600'} mb-2`}
                  >
                    Constraints:
                  </h3>
                  <ul
                    className={`list-disc pl-5 text-sm ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-700'} space-y-1`}
                  >
                    <li>2 ≤ nums.length ≤ 10^4</li>
                    <li>-10^9 ≤ nums[i] ≤ 10^9</li>
                    <li>-10^9 ≤ target ≤ 10^9</li>
                    <li>Only one valid answer exists.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'examples' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3
                    className={`text-md font-bold ${theme === 'vs-dark' ? 'text-teal-400' : 'text-teal-600'}`}
                  >
                    Example 1:
                  </h3>
                  <div
                    className={`${theme === 'vs-dark' ? 'bg-gray-700/50' : 'bg-gray-200'} p-3 rounded-lg font-mono text-sm`}
                  >
                    <p>
                      <span
                        className={
                          theme === 'vs-dark'
                            ? 'text-purple-400'
                            : 'text-purple-600'
                        }
                      >
                        Input:
                      </span>{' '}
                      nums = [2,7,11,15], target = 9
                    </p>
                    <p>
                      <span
                        className={
                          theme === 'vs-dark'
                            ? 'text-purple-400'
                            : 'text-purple-600'
                        }
                      >
                        Output:
                      </span>{' '}
                      [0,1]
                    </p>
                    <p>
                      <span
                        className={
                          theme === 'vs-dark'
                            ? 'text-purple-400'
                            : 'text-purple-600'
                        }
                      >
                        Explanation:
                      </span>{' '}
                      Because nums[0] + nums[1] == 9, we return [0, 1].
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3
                    className={`text-md font-bold ${theme === 'vs-dark' ? 'text-teal-400' : 'text-teal-600'}`}
                  >
                    Example 2:
                  </h3>
                  <div
                    className={`${theme === 'vs-dark' ? 'bg-gray-700/50' : 'bg-gray-200'} p-3 rounded-lg font-mono text-sm`}
                  >
                    <p>
                      <span
                        className={
                          theme === 'vs-dark'
                            ? 'text-purple-400'
                            : 'text-purple-600'
                        }
                      >
                        Input:
                      </span>{' '}
                      nums = [3,2,4], target = 6
                    </p>
                    <p>
                      <span
                        className={
                          theme === 'vs-dark'
                            ? 'text-purple-400'
                            : 'text-purple-600'
                        }
                      >
                        Output:
                      </span>{' '}
                      [1,2]
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3
                    className={`text-md font-bold ${theme === 'vs-dark' ? 'text-teal-400' : 'text-teal-600'}`}
                  >
                    Example 3:
                  </h3>
                  <div
                    className={`${theme === 'vs-dark' ? 'bg-gray-700/50' : 'bg-gray-200'} p-3 rounded-lg font-mono text-sm`}
                  >
                    <p>
                      <span
                        className={
                          theme === 'vs-dark'
                            ? 'text-purple-400'
                            : 'text-purple-600'
                        }
                      >
                        Input:
                      </span>{' '}
                      nums = [3,3], target = 6
                    </p>
                    <p>
                      <span
                        className={
                          theme === 'vs-dark'
                            ? 'text-purple-400'
                            : 'text-purple-600'
                        }
                      >
                        Output:
                      </span>{' '}
                      [0,1]
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-4">
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className={`px-4 py-2 rounded-lg ${theme === 'vs-dark' ? 'bg-teal-600/30 border border-teal-600 hover:bg-teal-600/50' : 'bg-teal-100 border border-teal-300 hover:bg-teal-200'} transition-colors w-full`}
                  >
                    Show Hint
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`${theme === 'vs-dark' ? 'bg-teal-900/30 border border-teal-800' : 'bg-teal-50 border border-teal-200'} p-3 rounded-lg`}
                    >
                      <h3
                        className={`text-md font-bold ${theme === 'vs-dark' ? 'text-teal-400' : 'text-teal-600'} mb-2`}
                      >
                        Hint 1:
                      </h3>
                      <p
                        className={
                          theme === 'vs-dark'
                            ? 'text-gray-300'
                            : 'text-gray-700'
                        }
                      >
                        A really brute force way would be to search for all
                        possible pairs of numbers but that would be too slow.
                      </p>
                    </div>
                    <div
                      className={`${theme === 'vs-dark' ? 'bg-teal-900/30 border border-teal-800' : 'bg-teal-50 border border-teal-200'} p-3 rounded-lg`}
                    >
                      <h3
                        className={`text-md font-bold ${theme === 'vs-dark' ? 'text-teal-400' : 'text-teal-600'} mb-2`}
                      >
                        Hint 2:
                      </h3>
                      <p
                        className={
                          theme === 'vs-dark'
                            ? 'text-gray-300'
                            : 'text-gray-700'
                        }
                      >
                        Try to use a hashmap to reduce the looking up time
                        complexity.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center Panel - Code Editor */}
        <div
          className={`col-span-12 lg:col-span-5 ${theme === 'vs-dark' ? 'bg-gray-800/50' : 'bg-gray-100'} backdrop-blur-md rounded-xl border ${theme === 'vs-dark' ? 'border-gray-700' : 'border-gray-300'} p-4 flex flex-col h-full`}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`${theme === 'vs-dark' ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-300'} rounded-md px-2 py-1 text-sm`}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              <button
                onClick={toggleTheme}
                className={`${theme === 'vs-dark' ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-300'} rounded-md px-2 py-1 text-sm flex items-center`}
              >
                {theme === 'vs-dark' ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      ></path>
                    </svg>
                    Light
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      ></path>
                    </svg>
                    Dark
                  </>
                )}
              </button>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className={`${theme === 'vs-dark' ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-300'} rounded-md px-2 py-1 text-sm`}
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
                className={`p-1 rounded ${theme === 'vs-dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} transition-colors`}
                title="Format Code"
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
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
              <button
                onClick={resetCode}
                className={`p-1 rounded ${theme === 'vs-dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} transition-colors`}
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
            {/* Using Monaco Editor */}
            <MonacoEditor
              width="100%"
              height="100%"
              language={language}
              theme={theme}
              value={code}
              options={editorOptions}
              onChange={setCode}
              editorDidMount={handleEditorDidMount}
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`px-4 py-2 rounded-lg ${
                isRunning
                  ? 'bg-gray-600'
                  : theme === 'vs-dark'
                    ? 'bg-teal-600 hover:bg-teal-700'
                    : 'bg-teal-500 hover:bg-teal-600 text-white'
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
                  ? 'bg-gray-600'
                  : theme === 'vs-dark'
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                    : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white'
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
        <div
          className={`col-span-12 lg:col-span-3 ${theme === 'vs-dark' ? 'bg-gray-800/50' : 'bg-gray-100'} backdrop-blur-md rounded-xl border ${theme === 'vs-dark' ? 'border-gray-700' : 'border-gray-300'} p-4 flex flex-col h-full`}
        >
          <h2 className="text-lg font-bold mb-4">Output</h2>

          {/* Submission Status */}
          {submissionStatus && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                submissionStatus.passed
                  ? theme === 'vs-dark'
                    ? 'bg-green-900/30 border border-green-700'
                    : 'bg-green-100 border border-green-300'
                  : theme === 'vs-dark'
                    ? 'bg-red-900/30 border border-red-700'
                    : 'bg-red-100 border border-red-300'
              }`}
            >
              <div className="flex items-center mb-2">
                {submissionStatus.passed ? (
                  <svg
                    className={`w-6 h-6 ${theme === 'vs-dark' ? 'text-green-500' : 'text-green-600'} mr-2`}
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
                    className={`w-6 h-6 ${theme === 'vs-dark' ? 'text-red-500' : 'text-red-600'} mr-2`}
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
                <h3 className="text-lg font-bold">
                  {submissionStatus.passed ? 'Accepted' : 'Failed'}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p
                    className={
                      theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'
                    }
                  >
                    Score:
                  </p>
                  <p className="font-medium">{submissionStatus.score}%</p>
                </div>
                {submissionStatus.time && (
                  <div>
                    <p
                      className={
                        theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'
                      }
                    >
                      Runtime:
                    </p>
                    <p className="font-medium">{submissionStatus.time} ms</p>
                  </div>
                )}
                {submissionStatus.memory && (
                  <div>
                    <p
                      className={
                        theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'
                      }
                    >
                      Memory:
                    </p>
                    <p className="font-medium">{submissionStatus.memory} MB</p>
                  </div>
                )}
              </div>
              {submissionStatus.error && (
                <div
                  className={`mt-2 p-2 ${theme === 'vs-dark' ? 'bg-red-900/50' : 'bg-red-200'} rounded text-sm font-mono`}
                >
                  {submissionStatus.error}
                </div>
              )}
            </div>
          )}

          {/* Console Output */}
          <div
            className={`${theme === 'vs-dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg p-3 font-mono text-sm ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-800'} mb-4 flex-grow overflow-y-auto border ${theme === 'vs-dark' ? 'border-gray-700' : 'border-gray-300'}`}
          >
            {output || 'Run your code to see output...'}
          </div>

          {/* Test Results */}
          <div className="space-y-3 overflow-y-auto">
            <h3 className="text-md font-bold">Test Cases</h3>
            {testResults.length > 0 ? (
              testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.passed
                      ? theme === 'vs-dark'
                        ? 'bg-green-900/20 border-green-700'
                        : 'bg-green-50 border-green-300'
                      : theme === 'vs-dark'
                        ? 'bg-red-900/20 border-red-700'
                        : 'bg-red-50 border-red-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium">
                      Test Case {index + 1}
                    </span>
                    {result.passed ? (
                      <span
                        className={`text-xs ${theme === 'vs-dark' ? 'text-green-500' : 'text-green-600'}`}
                      >
                        Passed
                      </span>
                    ) : (
                      <span
                        className={`text-xs ${theme === 'vs-dark' ? 'text-red-500' : 'text-red-600'}`}
                      >
                        Failed
                      </span>
                    )}
                  </div>
                  <div className="text-xs space-y-1">
                    <p>
                      <span
                        className={
                          theme === 'vs-dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }
                      >
                        Input:
                      </span>{' '}
                      {result.testCase}
                    </p>
                    <p>
                      <span
                        className={
                          theme === 'vs-dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }
                      >
                        Expected:
                      </span>{' '}
                      {result.expected}
                    </p>
                    <p>
                      <span
                        className={
                          theme === 'vs-dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }
                      >
                        Output:
                      </span>{' '}
                      {result.result}
                    </p>
                    <p>
                      <span
                        className={
                          theme === 'vs-dark'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        }
                      >
                        Time:
                      </span>{' '}
                      {result.executionTime.toFixed(2)} ms
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p
                className={`text-sm ${theme === 'vs-dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                No test results yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeCompiler
