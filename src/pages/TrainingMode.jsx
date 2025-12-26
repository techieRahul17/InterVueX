
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { generateInterviewQuestions, generateInterviewFeedback } from '../services/gemini'
import { transcribeAudio } from '../services/transcription'
import Mascot3D from '../components/Mascot3D'

const TrainingMode = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isAnswering, setIsAnswering] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [transcript, setTranscript] = useState([])
  const [topic, setTopic] = useState('React')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [loading, setLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
      window.speechSynthesis.cancel()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      // alert("Could not access camera/microphone.");
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  const speakText = (text) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const handleStartSession = async () => {
    setLoading(true)
    setFeedback(null)
    setTranscript([])
    setCurrentQuestion('')

    try {
      const generatedQuestions = await generateInterviewQuestions(topic, difficulty, 3)
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions)
        setCurrentQuestionIndex(0)
        setCurrentQuestion(generatedQuestions[0])
        speakText(`Starting ${difficulty} ${topic} interview. First question: ${generatedQuestions[0]}`)
        setTranscript([{ speaker: 'AI', text: generatedQuestions[0] }])
        setIsRecording(true) // Session is "Active"
      }
    } catch (error) {
      console.error(error)
      alert("Failed to generate questions. Please check API Key.")
    } finally {
      setLoading(false)
    }
  }

  const startAnswerRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    try {
      const videoStream = videoRef.current.srcObject;
      const audioTracks = videoStream.getAudioTracks();
      if (audioTracks.length === 0) {
        alert("No microphone detected.");
        return;
      }
      const audioStream = new MediaStream(audioTracks);
      const mediaRecorder = new MediaRecorder(audioStream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsAnswering(true);
    } catch (e) {
      console.error("Recorder Error:", e);
      alert("Failed to start recording.");
    }
  }

  const stopAnswerAndSubmit = async () => {
    if (!mediaRecorderRef.current) return;

    return new Promise((resolve) => {
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsAnswering(false);
        setIsTranscribing(true);

        // Optimistic UI
        const tempId = Date.now();
        setTranscript(prev => [...prev, { speaker: 'You', text: 'Processing...', id: tempId }]);

        try {
          // 1. Transcribe
          const userText = await transcribeAudio(audioBlob);

          // Update Transcript
          setTranscript(prev => prev.map(t => t.id === tempId ? { speaker: 'You', text: userText } : t));

          if (!userText || userText.trim().length === 0) {
            speakText("I didn't catch that. Could you please repeat?");
            setIsTranscribing(false);
            return;
          }

          // 2. Generate Feedback
          const feedbackData = await generateInterviewFeedback(currentQuestion, userText);
          setFeedback(feedbackData);

          // 3. Speak Feedback Summary & Strengths
          const feedbackSpeech = `Good job. ${feedbackData.strengths[0] || ''}. Score is ${feedbackData.score}.`;
          speakText(feedbackSpeech);

        } catch (error) {
          console.error(error);
          setTranscript(prev => prev.map(t => t.id === tempId ? { speaker: 'You', text: 'Error processing audio.' } : t));
        } finally {
          setIsTranscribing(false);
        }
      };
      mediaRecorderRef.current.stop();
    });
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      setCurrentQuestion(questions[nextIndex])
      setFeedback(null)
      setTranscript(prev => [...prev, { speaker: 'AI', text: questions[nextIndex] }])
      speakText(questions[nextIndex])
    } else {
      setIsRecording(false)
      speakText("Interview completed. Great work.")
      setCurrentQuestion("Interview Completed!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      {/* 1. Header (Minimal) */}
      <header className="h-16 border-b border-gray-800 flex items-center px-6 justify-between bg-gray-950">
        <div className="flex items-center space-x-4">
        </div>
      </header>

      {/* 2. Main Content (Scrollable Page) */}
      <div className="flex-1 flex flex-col p-4">

        {/* Top Control Bar */}
        <div className="flex items-center justify-between mb-4 bg-gray-800/50 p-3 rounded-xl border border-gray-700">
          <div className="flex space-x-4">
            <select
              value={topic} onChange={(e) => setTopic(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1.5 rounded-lg border border-gray-600 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option>React</option><option>Node.js</option><option>JavaScript</option><option>Python</option><option>System Design</option><option>Spring Boot</option><option>AI</option><option>Flutter</option><option>Machine Learning</option>
            </select>
            <select
              value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1.5 rounded-lg border border-gray-600 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
            </select>
          </div>

          <div className="flex space-x-3">
            {!isRecording ? (
              <button
                onClick={handleStartSession} disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition font-medium text-sm flex items-center"
              >
                {loading ? 'Starting...' : 'Start Session'}
              </button>
            ) : (
              <div className="flex space-x-2">
                {!isAnswering ? (
                  <button
                    onClick={startAnswerRecording}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition flex items-center"
                  >
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span> Start Answer
                  </button>
                ) : (
                  <button
                    onClick={stopAnswerAndSubmit}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition"
                  >
                    Stop & Submit
                  </button>
                )}
                {feedback && (
                  <button onClick={handleNextQuestion} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition">
                    Next Question →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Middle Stage: Fixed Viewport Height (Fits Screen) */}
        <div className="flex gap-4 min-h-[500px] h-[calc(100vh-9rem)]">
          {/* Left Col: AI Interviewer */}
          <div className="w-1/3 flex flex-col">
            <div className="flex-1 bg-gray-800/80 rounded-2xl border border-gray-700 overflow-hidden relative shadow-2xl">
              {/* Mascot Full Height in this container */}
              <div className="absolute inset-0">
                <Mascot3D isSpeaking={isSpeaking} />
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <div className="inline-block px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs text-purple-300 border border-purple-500/30">
                  {isSpeaking ? 'AI Speaking...' : 'AI Listener'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Video & Transcript */}
          <div className="w-2/3 flex flex-col gap-4">
            {/* Video Feed (Centered, smaller height relative to width) */}
            <div className="flex-[2] bg-black rounded-2xl border border-gray-800 overflow-hidden relative group flex justify-center items-center">
              <video
                ref={videoRef}
                className="h-full object-cover transform scale-x-[-1] opacity-90 group-hover:opacity-100 transition"
                autoPlay muted playsInline
              />
              {isAnswering && (
                <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>RECORDING</span>
                </div>
              )}
            </div>

            {/* Question & Transcript (Visible below video) */}
            <div className="flex-1 bg-gray-800/50 rounded-xl border border-gray-700 p-4 overflow-y-auto custom-scrollbar">
              <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">Current Question</h3>
              <p className="text-lg font-medium text-white mb-4 leading-relaxed">
                {currentQuestion || "Waiting to start..."}
              </p>

              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Live Transcript</h3>
              <div className="space-y-3">
                {transcript.map((t, i) => (
                  <div key={i} className={`flex ${t.speaker === 'AI' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${t.speaker === 'AI' ? 'bg-gray-700 text-gray-200' : 'bg-purple-900/50 text-purple-100 border border-purple-500/20'}`}>
                      <span className="block text-xs opacity-50 mb-1">{t.speaker}</span>
                      {t.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Feedback (Expands page, requires scroll) */}
        {feedback && (
          <div className="mt-4 bg-gray-800 rounded-xl border border-gray-700 p-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white flex items-center">
                Feedback Analysis
              </h3>
              <div className={`px-4 py-1 rounded-full text-sm font-bold ${feedback.score >= 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                Score: {feedback.score}/100
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-green-400 text-sm font-bold mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {feedback.strengths?.map((s, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-300">
                      <span className="text-green-500 mr-2">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-blue-400 text-sm font-bold mb-2">Improvements</h4>
                <ul className="space-y-1">
                  {feedback.improvements?.map((s, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-300">
                      <span className="text-blue-500 mr-2">↗</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 italic">"{feedback.detailedFeedback}"</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default TrainingMode
