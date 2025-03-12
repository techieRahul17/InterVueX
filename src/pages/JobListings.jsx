"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const JobListings = () => {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    location: "all",
    jobType: "all",
    experience: "all",
    remote: false,
  })
  const [selectedJob, setSelectedJob] = useState(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [loading, setLoading] = useState(true)
  const [applyLoading, setApplyLoading] = useState(false)
  const [applySuccess, setApplySuccess] = useState(false)
  const [applyError, setApplyError] = useState(null)

  const [showJobModal, setShowJobModal] = useState(false)
  const [jobDetails, setJobDetails] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "",
    experience: "",
    description: "",
    requirements: "",
    responsibilities: "",
    rubrics: "",
  })

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const response = await fetch("http://localhost:8443/jobs", {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch jobs")
        }

        const data = await response.json()

        if (data.status === "S" && data.data) {
          // Transform API data to match our component's expected format
          const formattedJobs = data.data.map((job) => ({
            id: job.job_id,
            title: job.role,
            company: job.company,
            logo: `/src/imgs/images.jpg?height=60&width=60`,
            location: job.location,
            salary: job.salary,
            jobType: job.job_type,
            experience: job.experience,
            remote: job.remote,
            posted: job.posted_date,
            description: job.job_description,
            requirements: Array.isArray(job.requirements) ? job.requirements : [job.requirements],
            responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [job.responsibilities],
            company_id: job.company_id,
          }))

          setJobs(formattedJobs)
          setFilteredJobs(formattedJobs)
        } else {
          throw new Error(data.message || "Failed to fetch jobs")
        }
      } catch (error) {
        console.error("Error fetching jobs:", error)
        // Fallback to empty array if API fails
        setJobs([])
        setFilteredJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  useEffect(() => {
    // Filter jobs based on search term and filters
    const filtered = jobs.filter((job) => {
      const matchesSearch =
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesLocation = filters.location === "all" || job.location.includes(filters.location)
      const matchesJobType = filters.jobType === "all" || job.jobType === filters.jobType
      const matchesExperience = filters.experience === "all" || job.experience.includes(filters.experience)
      const matchesRemote = !filters.remote || job.remote

      return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesRemote
    })

    setFilteredJobs(filtered)
  }, [searchTerm, filters, jobs])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleJobClick = (job) => {
    setSelectedJob(job)
  }

  const handleApplyClick = () => {
    setShowApplyModal(true)
    setCoverLetter("")
    setApplySuccess(false)
    setApplyError(null)
  }

  const handleCloseModal = () => {
    setShowApplyModal(false)
  }

  const handleCoverLetterChange = (e) => {
    setCoverLetter(e.target.value)
  }

  const handleSubmitApplication = async (e) => {
    e.preventDefault()

    if (!selectedJob) return

    setApplyLoading(true)
    setApplyError(null)

    try {
      // In a real app, you would get the user_id from authentication
      const user_id = 1 // Mock user ID

      const response = await fetch("http://localhost:8443/apply_job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: selectedJob.id,
          user_id: user_id,
          coverletter: coverLetter,
          company_id: selectedJob.company_id,
        }),
      })

      const data = await response.json()

      if (response.ok && data.status === "S") {
        setApplySuccess(true)
        // Reset form after successful submission
        setCoverLetter("")

        // Close modal after a delay
        setTimeout(() => {
          setShowApplyModal(false)
          setApplySuccess(false)
        }, 2000)
      } else {
        throw new Error(data.message || "Failed to apply for job")
      }
    } catch (error) {
      console.error("Error applying for job:", error)
      setApplyError(error.message || "Failed to apply for job. Please try again.")
    } finally {
      setApplyLoading(false)
    }
  }

  const handleJobDetailsChange = (e) => {
    const { name, value } = e.target
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }))
  }

  const handleCreateJob = () => {
    // In a real app, this would send the job details to an API
    alert("Job creation API not implemented in this demo")
    setShowJobModal(false)
    setJobDetails({
      title: "",
      company: "",
      location: "",
      salary: "",
      jobType: "",
      experience: "",
      description: "",
      requirements: "",
      responsibilities: "",
      rubrics: "",
    })
  }

  // Extract unique locations, job types, and experience levels from jobs
  const locations = [...new Set(jobs.map((job) => job.location))]
  const jobTypes = [...new Set(jobs.map((job) => job.jobType))]
  const experienceLevels = [...new Set(jobs.map((job) => job.experience))]

  return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              Job Listings
            </h1>
            <p className="text-gray-300 mt-2">Find your next opportunity and prepare for interviews with InterVueX.</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-900/60 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-purple-500/20 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                      type="text"
                      placeholder="Search jobs, companies, or keywords..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full px-4 py-3 pl-10 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <svg
                      className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors">
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <select
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Locations</option>
                  {locations.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-300 mb-1">
                  Job Type
                </label>
                <select
                    id="jobType"
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {jobTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-1">
                  Experience
                </label>
                <select
                    id="experience"
                    name="experience"
                    value={filters.experience}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  {experienceLevels.map((level, index) => (
                      <option key={index} value={level}>
                        {level}
                      </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center cursor-pointer">
                  <input
                      type="checkbox"
                      name="remote"
                      checked={filters.remote}
                      onChange={handleFilterChange}
                      className="h-4 w-4 bg-gray-800 border-gray-600 rounded text-purple-500 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Remote Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job List */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl shadow-xl border border-purple-500/20 overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">{filteredJobs.length} Jobs Found</h2>
                </div>

                {loading ? (
                    <div className="p-8 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-400">Loading jobs...</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="p-8 text-center">
                      <svg
                          className="w-16 h-16 mx-auto text-gray-600 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <p className="text-gray-400">No jobs match your search criteria</p>
                      <button
                          onClick={() => {
                            setSearchTerm("")
                            setFilters({
                              location: "all",
                              jobType: "all",
                              experience: "all",
                              remote: false,
                            })
                          }}
                          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                ) : (
                    <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                      {filteredJobs.map((job) => (
                          <div
                              key={job.id}
                              onClick={() => handleJobClick(job)}
                              className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer ${selectedJob && selectedJob.id === job.id ? "bg-purple-900/20 border-l-4 border-l-purple-500" : ""}`}
                          >
                            <div className="flex items-start">
                              <img
                                  src={job.logo || "/placeholder.svg?height=60&width=60"}
                                  alt={job.company}
                                  className="w-12 h-12 rounded-lg mr-4"
                              />
                              <div>
                                <h3 className="font-medium text-white">{job.title}</h3>
                                <p className="text-sm text-purple-300">{job.company}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                              <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                ></path>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                ></path>
                              </svg>
                              {job.location}
                            </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                              <svg
                                  className="w-3 h-3 mr-1"
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
                                    {job.jobType}
                            </span>
                                  {job.remote && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-900/50 text-purple-300">
                                Remote
                              </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
              </div>
            </div>

            {/* Job Details */}
            <div className="lg:col-span-2">
              {selectedJob ? (
                  <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl shadow-xl border border-purple-500/20 p-6 animate-fade-in">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-start">
                        <img
                            src={selectedJob.logo || "/placeholder.svg?height=60&width=60"}
                            alt={selectedJob.company}
                            className="w-16 h-16 rounded-lg mr-4"
                        />
                        <div>
                          <h2 className="text-2xl font-bold text-white">{selectedJob.title}</h2>
                          <p className="text-lg text-purple-300">{selectedJob.company}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                          <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                          </svg>
                          {selectedJob.location}
                        </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                          <svg
                              className="w-3 h-3 mr-1"
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
                              {selectedJob.jobType}
                        </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                          <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                          </svg>
                              {selectedJob.experience}
                        </span>
                            {selectedJob.remote && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-900/50 text-purple-300">
                            Remote
                          </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{selectedJob.salary}</div>
                        <div className="text-sm text-gray-400">Posted {selectedJob.posted}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <button
                          onClick={handleApplyClick}
                          className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium transition-all transform hover:scale-105"
                      >
                        Apply Now
                      </button>

                      <div className="flex space-x-2">
                        <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors">
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
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            ></path>
                          </svg>
                        </button>
                        <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors">
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
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3 text-purple-300">Job Description</h3>
                        <p className="text-gray-300">{selectedJob.description}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3 text-purple-300">Requirements</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-300">
                          {selectedJob.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3 text-purple-300">Responsibilities</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-300">
                          {selectedJob.responsibilities.map((resp, index) => (
                              <li key={index}>{resp}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-6 border-t border-gray-700">
                        <h3 className="text-lg font-medium mb-3 text-purple-300">Prepare for Your Interview</h3>
                        <p className="text-gray-300 mb-4">
                          Use InterVueX's AI-powered training mode to practice for your interview and get real-time
                          feedback.
                        </p>
                        <Link
                            to="/training"
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
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
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            ></path>
                          </svg>
                          Start Training
                        </Link>
                      </div>
                    </div>
                  </div>
              ) : (
                  <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl shadow-xl border border-purple-500/20 p-8 flex flex-col items-center justify-center h-full">
                    <svg
                        className="w-16 h-16 text-gray-600 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <h3 className="text-xl font-medium text-white mb-2">Select a Job</h3>
                    <p className="text-gray-400 text-center max-w-md">
                      Click on a job from the list to view details and apply. Use InterVueX to prepare for your interviews.
                    </p>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && selectedJob && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 rounded-xl border border-purple-500/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Apply for {selectedJob.title}</h2>
                    <p className="text-purple-300">{selectedJob.company}</p>
                  </div>
                  <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                {applySuccess ? (
                    <div className="p-6 text-center">
                      <svg
                          className="w-16 h-16 text-green-500 mx-auto mb-4"
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
                      <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
                      <p className="text-gray-300">Your application has been successfully submitted.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitApplication} className="space-y-6">
                      {applyError && (
                          <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">{applyError}</div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Cover Letter</label>
                        <textarea
                            rows="4"
                            placeholder="Tell us why you're a good fit for this position... Resume and other data is extracted from your profile"
                            value={coverLetter}
                            onChange={handleCoverLetterChange}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            required
                        ></textarea>
                      </div>

                      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={applyLoading}
                            className={`px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition-colors ${applyLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                          {applyLoading ? (
                              <div className="flex items-center">
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
                              </div>
                          ) : (
                              "Submit Application"
                          )}
                        </button>
                      </div>
                    </form>
                )}
              </div>
            </div>
        )}

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
      </div>
  )
}

export default JobListings

