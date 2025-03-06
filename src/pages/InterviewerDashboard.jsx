import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InterviewerDashboard = () => {
    const { currentUser } = useAuth();
    const [upcomingInterviews, setUpcomingInterviews] = useState([]);
    const [pastInterviews, setPastInterviews] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [stats, setStats] = useState({
        totalInterviews: 0,
        averageRating: 0,
        pendingFeedback: 0,
        hireRate: 0
    });

    const [showJobModal, setShowJobModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [jobDetails, setJobDetails] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        jobType: '',
        experience: '',
        description: '',
        requirements: '',
        responsibilities: '',
        rubrics: ''
    });
    const [scheduleDetails, setScheduleDetails] = useState({
        candidate: '',
        position: '',
        date: '',
        time: ''
    });

    useEffect(() => {
        // In a real app, this data would be fetched from an API
        setUpcomingInterviews([
            {
                id: '1',
                candidate: 'Alice Johnson',
                position: 'Senior Frontend Developer',
                date: '2025-03-10T14:00:00',
                company: 'TechCorp'
            },
            {
                id: '2',
                candidate: 'Bob Smith',
                position: 'Full Stack Engineer',
                date: '2025-03-15T11:30:00',
                company: 'InnovateTech'
            }
        ]);

        setPastInterviews([
            {
                id: '3',
                candidate: 'Charlie Brown',
                position: 'Software Engineer II',
                date: '2025-02-28T10:00:00',
                rating: 4.5,
                status: 'Hired'
            },
            {
                id: '4',
                candidate: 'Diana Prince',
                position: 'Frontend Developer',
                date: '2025-02-20T15:30:00',
                rating: 3.8,
                status: 'Rejected'
            }
        ]);

        setCandidates([
            {
                id: '5',
                name: 'Ethan Hunt',
                position: 'UI Engineer',
                status: 'Shortlisted',
                appliedDate: '2025-03-01T09:15:00'
            },
            {
                id: '6',
                name: 'Fiona Gallagher',
                position: 'React Developer',
                status: 'In Review',
                appliedDate: '2025-02-25T14:20:00'
            },
            {
                id: '7',
                name: 'George Lucas',
                position: 'Frontend Specialist',
                status: 'New Application',
                appliedDate: '2025-03-05T11:45:00'
            }
        ]);

        setStats({
            totalInterviews: 24,
            averageRating: 4.2,
            pendingFeedback: 3,
            hireRate: 68
        });
    }, []);

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleJobDetailsChange = (e) => {
        const { name, value } = e.target;
        setJobDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleScheduleDetailsChange = (e) => {
        const { name, value } = e.target;
        setScheduleDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleCreateJob = () => {
        // In a real app, this would send the job details to an API
        alert('Job created successfully!');
        setShowJobModal(false);
        setJobDetails({
            title: '',
            company: '',
            location: '',
            salary: '',
            jobType: '',
            experience: '',
            description: '',
            requirements: '',
            responsibilities: '',
            rubrics: ''
        });
    };

    const handleScheduleInterview = () => {
        // In a real app, this would send the schedule details to an API
        alert('Interview scheduled successfully!');
        setShowScheduleModal(false);
        setScheduleDetails({
            candidate: '',
            position: '',
            date: '',
            time: ''
        });
    };

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                        Interviewer Dashboard
                    </h1>
                    <p className="text-gray-300 mt-2">
                        Welcome back, {currentUser?.name || 'Interviewer'}! Here's your interview schedule and candidate pool.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-6 rounded-xl shadow-xl border border-purple-500/20 transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-200">Total Interviews</h3>
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.totalInterviews}</div>
                        <p className="text-purple-300 text-sm mt-2">Conducted this month</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-6 rounded-xl shadow-xl border border-purple-500/20 transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-200">Average Rating</h3>
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.averageRating.toFixed(1)}</div>
                        <p className="text-purple-300 text-sm mt-2">Out of 5 stars</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-6 rounded-xl shadow-xl border border-purple-500/20 transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-200">Pending Feedback</h3>
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.pendingFeedback}</div>
                        <p className="text-purple-300 text-sm mt-2">Awaiting your review</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 p-6 rounded-xl shadow-xl border border-purple-500/20 transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-200">Hire Rate</h3>
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.hireRate}%</div>
                        <p className="text-purple-300 text-sm mt-2">Of interviewed candidates</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upcoming Interviews */}
                    <div className="bg-gray-900/60 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-purple-500/20">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Upcoming Interviews
                        </h2>

                        {upcomingInterviews.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingInterviews.map((interview) => (
                                    <div key={interview.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-white">{interview.candidate}</h3>
                                                <p className="text-sm text-purple-300">{interview.position}</p>
                                                <p className="text-xs text-gray-400 mt-1">{interview.company}</p>
                                                <p className="text-sm text-gray-300 mt-2">{formatDate(interview.date)}</p>
                                            </div>
                                            <Link
                                                to={`/interview-room/${interview.id}`}
                                                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
                                            >
                                                Join
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p className="text-gray-400">No upcoming interviews</p>
                            </div>
                        )}
                    </div>

                    {/* Candidate Pool */}
                    <div className="bg-gray-900/60 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-purple-500/20">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Candidate Pool
                        </h2>

                        {candidates.length > 0 ? (
                            <div className="space-y-4">
                                {candidates.map((candidate) => (
                                    <div key={candidate.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                                        <h3 className="font-medium text-white">{candidate.name}</h3>
                                        <p className="text-sm text-purple-300">{candidate.position}</p>
                                        <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                          candidate.status === 'Shortlisted'
                              ? 'bg-green-900/50 text-green-300'
                              : candidate.status === 'In Review'
                                  ? 'bg-yellow-900/50 text-yellow-300'
                                  : 'bg-blue-900/50 text-blue-300'
                      }`}>
                        {candidate.status}
                      </span>
                                            <span className="text-xs text-gray-400">
                        Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                <p className="text-gray-400">No candidates in the pool</p>
                            </div>
                        )}
                    </div>

                    {/* Past Interviews */}
                    <div className="bg-gray-900/60 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-purple-500/20">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Past Interviews
                        </h2>

                        {pastInterviews.length > 0 ? (
                            <div className="space-y-4">
                                {pastInterviews.map((interview) => (
                                    <div key={interview.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-white">{interview.candidate}</h3>
                                                <p className="text-sm text-purple-300">{interview.position}</p>
                                                <p className="text-xs text-gray-400 mt-1">{formatDate(interview.date)}</p>
                                            </div>
                                            <div className="flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full mr-2 ${
                            interview.status === 'Hired'
                                ? 'bg-green-900/50 text-green-300'
                                : 'bg-red-900/50 text-red-300'
                        }`}>
                          {interview.status}
                        </span>
                                                <div className="flex items-center bg-gray-700/50 px-2 py-1 rounded-lg">
                                                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                    </svg>
                                                    <span className="text-sm font-bold">{interview.rating.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p className="text-gray-400">No past interviews</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Feedback Reminder */}
                {stats.pendingFeedback > 0 && (
                    <div className="mt-12 bg-gradient-to-r from-indigo-800 to-purple-800 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="relative p-8 md:p-12">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-center opacity-10"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-6 md:mb-0 md:mr-8">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                                        Pending Feedback
                                    </h2>
                                    <p className="text-gray-200 max-w-xl">
                                        You have {stats.pendingFeedback} interview{stats.pendingFeedback > 1 ? 's' : ''} waiting for your feedback. Providing timely feedback helps in making better hiring decisions.
                                    </p>
                                </div>
                                <Link
                                    to="/feedback"
                                    className="px-8 py-4 rounded-full bg-white text-purple-800 font-medium transition-all transform hover:scale-105 hover:shadow-lg"
                                >
                                    Review Interviews
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Job and Schedule Interview Buttons */}
                <div className="mt-12 flex justify-end space-x-4">
                    <button
                        onClick={() => setShowJobModal(true)}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium transition-all transform hover:scale-105"
                    >
                        Create Job
                    </button>
                    <button
                        onClick={() => setShowScheduleModal(true)}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all transform hover:scale-105"
                    >
                        Schedule Interview
                    </button>
                </div>
            </div>

            {/* Create Job Modal */}
            {showJobModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl border border-purple-500/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                            Create Job
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={jobDetails.title}
                                    onChange={handleJobDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Enter job title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={jobDetails.company}
                                    onChange={handleJobDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Enter company name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={jobDetails.location}
                                    onChange={handleJobDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Enter job location"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Salary</label>
                                <input
                                    type="text"
                                    name="salary"
                                    value={jobDetails.salary}
                                    onChange={handleJobDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Enter salary range"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
                                <input
                                    type="text"
                                    name="jobType"
                                    value={jobDetails.jobType}
                                    onChange={handleJobDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Enter job type (e.g., Full-time, Part-time)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Experience</label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={jobDetails.experience}
                                    onChange={handleJobDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Enter experience level (e.g., 3+ years)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
                                <textarea
                                    name="description"
                                    value={jobDetails.description}
                                    onChange={handleJobDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none h-32"
                                    placeholder="Enter job description"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Requirements</label>
                                <textarea
                                    name="requirements"
                                    value={jobDetails.requirements}
                                    onChange={handleJobDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none h-32"
                                    placeholder="Enter job requirements"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Responsibilities</label>
                                <textarea
                                    name="responsibilities"
                                    value={jobDetails.responsibilities}
                                    onChange={handleJobDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none h-32"
                                    placeholder="Enter job responsibilities"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Rubrics</label>
                                <textarea
                                    name="rubrics"
                                    value={jobDetails.rubrics}
                                    onChange={handleJobDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none h-32"
                                    placeholder="Enter job rubrics"
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                                <button
                                    onClick={() => setShowJobModal(false)}
                                    className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateJob}
                                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition-colors"
                                >
                                    Create Job
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule Interview Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl border border-purple-500/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                            Schedule Interview
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Candidate Name</label>
                                <input
                                    type="text"
                                    name="candidate"
                                    value={scheduleDetails.candidate}
                                    onChange={handleScheduleDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Enter candidate name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={scheduleDetails.position}
                                    onChange={handleScheduleDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Enter position"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={scheduleDetails.date}
                                    onChange={handleScheduleDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                                <input
                                    type="time"
                                    name="time"
                                    value={scheduleDetails.time}
                                    onChange={handleScheduleDetailsChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                                <button
                                    onClick={() => setShowScheduleModal(false)}
                                    className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleScheduleInterview}
                                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition-colors"
                                >
                                    Schedule Interview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewerDashboard;
