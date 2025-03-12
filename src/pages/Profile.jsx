"use client"

import { useState, useEffect } from "react"

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saveStatus, setSaveStatus] = useState(null)

  const [showJobModal, setShowJobModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
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
  const [scheduleDetails, setScheduleDetails] = useState({
    candidate: "",
    position: "",
    date: "",
    time: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        // Use fixed user ID of 5 as specified in the example
        const userId = 5

        const response = await fetch(`http://localhost:8443/get_profile?user_id=${userId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        console.log("Profile data:", data)

        // Transform the API response to match our component's data structure
        const transformedProfile = {
          name: data.name || "User",
          email: data.email || "user@example.com",
          role: data.role || "Job Seeker",
          location: data.location || "Not specified",
          bio: data.description || "",
          skills: data.skills || [],
          education: (data.education || []).map((edu) => ({
            degree: edu.degree,
            institution: edu.college,
            year: edu.passout_year?.toString() || "",
          })),
          experience: (data.experience || []).map((exp) => ({
            title: exp.role_name,
            company: exp.company_name,
            duration: `${exp.year || ""} - Present`,
            description: exp.description,
          })),
          projects: data.projects || [],
        }

        setProfile(transformedProfile)
        setEditedProfile(transformedProfile)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError(err.message)
        setIsLoading(false)

        // Fallback to mock data for demo purposes
        const mockProfile = {
          name: "Ramcharan",
          email: "ram@gmail.com",
          role: "Machine Learning Engineer",
          location: "Bangalore, India",
          bio: "Passionate ML engineer with expertise in Python and deep learning.",
          skills: ["Python", "TensorFlow", "PyTorch", "Docker", "Kubernetes"],
          education: [
            {
              degree: "M.Tech in Artificial Intelligence",
              institution: "IIT Delhi",
              year: "2022",
            },
          ],
          experience: [
            {
              title: "ML Engineer",
              company: "AI Labs",
              duration: "2022 - Present",
              description: "Developed deep learning models for image classification and NLP applications.",
            },
            {
              title: "Data Scientist",
              company: "BigData Solutions",
              duration: "2020 - 2022",
              description: "Performed data analysis and built predictive models using Python and Pandas.",
            },
          ],
          projects: [
            {
              name: "Autonomous Driving AI",
              role: "Lead Developer",
              description: "Developed a computer vision system for autonomous vehicles using TensorFlow and OpenCV.",
            },
          ],
        }
        setProfile(mockProfile)
        setEditedProfile(mockProfile)
      }
    }

    fetchProfile()
  }, [])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setEditedProfile({ ...profile })
    }
    // Reset save status when toggling edit mode
    setSaveStatus(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSkillChange = (index, value) => {
    const newSkills = [...editedProfile.skills]
    newSkills[index] = value
    setEditedProfile((prev) => ({ ...prev, skills: newSkills }))
  }

  const handleAddSkill = () => {
    setEditedProfile((prev) => ({ ...prev, skills: [...prev.skills, ""] }))
  }

  const handleRemoveSkill = (index) => {
    const newSkills = editedProfile.skills.filter((_, i) => i !== index)
    setEditedProfile((prev) => ({ ...prev, skills: newSkills }))
  }

  // Handle experience changes
  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...editedProfile.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    setEditedProfile((prev) => ({ ...prev, experience: newExperience }))
  }

  // Handle education changes
  const handleEducationChange = (index, field, value) => {
    const newEducation = [...editedProfile.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setEditedProfile((prev) => ({ ...prev, education: newEducation }))
  }

  // Handle project changes
  const handleProjectChange = (index, field, value) => {
    const newProjects = [...editedProfile.projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    setEditedProfile((prev) => ({ ...prev, projects: newProjects }))
  }

  const handleSaveProfile = async () => {
    try {
      setSaveStatus("saving")

      // Prepare the data for the API in the exact format expected
      const profileData = {
        user_id: 5, // Fixed user ID as specified
        name: editedProfile.name,
        role: editedProfile.role,
        description: editedProfile.bio,
        email: editedProfile.email,
        location: editedProfile.location,
        skills: editedProfile.skills,
        experience: editedProfile.experience.map((exp) => ({
          role_name: exp.title,
          company_name: exp.company,
          year: Number.parseInt(exp.duration.split(" - ")[0]) || 0,
          description: exp.description,
        })),
        education: editedProfile.education.map((edu) => ({
          degree: edu.degree,
          college: edu.institution,
          passout_year: Number.parseInt(edu.year) || 0,
        })),
        projects: editedProfile.projects.map((proj) => ({
          name: proj.name,
          role: proj.role,
          description: proj.description,
        })),
      }

      console.log("Sending profile data:", profileData)

      const response = await fetch("http://localhost:8443/edit_profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Update the profile state with the edited profile
      setProfile(editedProfile)
      setIsEditing(false)
      setSaveStatus("success")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(null)
      }, 3000)
    } catch (err) {
      console.error("Error saving profile:", err)
      setSaveStatus("error")

      // Clear error message after 3 seconds
      setTimeout(() => {
        setSaveStatus(null)
      }, 3000)
    }
  }

  const handleJobDetailsChange = (e) => {
    const { name, value } = e.target
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }))
  }

  const handleScheduleDetailsChange = (e) => {
    const { name, value } = e.target
    setScheduleDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }))
  }

  const handleCreateJob = () => {
    // In a real app, this would send the job details to an API
    alert("Job created successfully!")
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

  const handleScheduleInterview = () => {
    // In a real app, this would send the schedule details to an API
    alert("Interview scheduled successfully!")
    setShowScheduleModal(false)
    setScheduleDetails({
      candidate: "",
      position: "",
      date: "",
      time: "",
    })
  }

  if (isLoading) {
    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    )
  }

  if (!profile) {
    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12 flex justify-center items-center">
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg">
            <p>Error loading profile: {error || "Profile not found"}</p>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              {isEditing ? "Edit Profile" : "Your Profile"}
            </h1>
            <div className="flex space-x-4">
              <button
                  onClick={handleEditToggle}
                  className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          {saveStatus === "success" && (
              <div className="mb-4 bg-green-900/30 border border-green-500 text-green-200 p-4 rounded-lg">
                Profile updated successfully!
              </div>
          )}

          {saveStatus === "error" && (
              <div className="mb-4 bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg">
                Failed to update profile. Please try again.
              </div>
          )}

          <div className="card space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  {isEditing ? (
                      <input
                          type="text"
                          name="name"
                          value={editedProfile.name}
                          onChange={handleInputChange}
                          className="input text-2xl font-bold mb-1 bg-gray-800/50 border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                  ) : (
                      <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
                  )}
                  {isEditing ? (
                      <input
                          type="text"
                          name="role"
                          value={editedProfile.role}
                          onChange={handleInputChange}
                          className="input text-purple-300 bg-gray-800/50 border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                  ) : (
                      <p className="text-purple-300">{profile.role}</p>
                  )}
                </div>
              </div>
              {isEditing ? (
                  <textarea
                      name="bio"
                      value={editedProfile.bio}
                      onChange={handleInputChange}
                      className="input h-32 resize-none w-full bg-gray-800/50 border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
              ) : (
                  <p className="text-gray-300">{profile.bio}</p>
              )}
              <div className="flex items-center space-x-4 text-gray-400">
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
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  ></path>
                </svg>
                {isEditing ? (
                    <input
                        type="email"
                        name="email"
                        value={editedProfile.email}
                        onChange={handleInputChange}
                        className="input bg-gray-800/50 border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                ) : (
                    <span>{profile.email}</span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-gray-400">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                {isEditing ? (
                    <input
                        type="text"
                        name="location"
                        value={editedProfile.location}
                        onChange={handleInputChange}
                        className="input bg-gray-800/50 border border-gray-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                ) : (
                    <span>{profile.location}</span>
                )}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-300">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editedProfile.skills : profile.skills).map((skill, index) => (
                    <div key={index} className="bg-gray-700 rounded-full px-3 py-1 text-sm text-white">
                      {isEditing ? (
                          <div className="flex items-center">
                            <input
                                type="text"
                                value={skill}
                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                className="bg-transparent border-none focus:outline-none"
                            />
                            <button onClick={() => handleRemoveSkill(index)} className="ml-2 text-red-400 hover:text-red-300">
                              ×
                            </button>
                          </div>
                      ) : (
                          skill
                      )}
                    </div>
                ))}
                {isEditing && (
                    <button
                        onClick={handleAddSkill}
                        className="bg-purple-600 hover:bg-purple-500 rounded-full px-3 py-1 text-sm text-white transition-colors"
                    >
                      + Add Skill
                    </button>
                )}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-300">Experience</h3>
              <div className="space-y-4">
                {(isEditing ? editedProfile.experience : profile.experience).map((exp, index) => (
                    <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                      {isEditing ? (
                          <>
                            <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                                className="font-bold text-white bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Job Title"
                            />
                            <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                                className="text-purple-300 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Company"
                            />
                            <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) => handleExperienceChange(index, "duration", e.target.value)}
                                className="text-gray-400 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Duration (e.g., 2020 - Present)"
                            />
                            <textarea
                                value={exp.description}
                                onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                                className="text-gray-300 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 w-full h-20 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Description"
                            />
                          </>
                      ) : (
                          <>
                            <h4 className="font-bold text-white">{exp.title}</h4>
                            <p className="text-purple-300">{exp.company}</p>
                            <p className="text-gray-400">{exp.duration}</p>
                            <p className="text-gray-300 mt-2">{exp.description}</p>
                          </>
                      )}
                    </div>
                ))}
                {isEditing && (
                    <button
                        onClick={() =>
                            setEditedProfile((prev) => ({
                              ...prev,
                              experience: [...prev.experience, { title: "", company: "", duration: "", description: "" }],
                            }))
                        }
                        className="bg-purple-600 hover:bg-purple-500 rounded-lg px-4 py-2 text-sm text-white transition-colors w-full"
                    >
                      + Add Experience
                    </button>
                )}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-300">Education</h3>
              <div className="space-y-4">
                {(isEditing ? editedProfile.education : profile.education).map((edu, index) => (
                    <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                      {isEditing ? (
                          <>
                            <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                                className="font-bold text-white bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Degree"
                            />
                            <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                                className="text-purple-300 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Institution"
                            />
                            <input
                                type="text"
                                value={edu.year}
                                onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                                className="text-gray-400 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Year"
                            />
                          </>
                      ) : (
                          <>
                            <h4 className="font-bold text-white">{edu.degree}</h4>
                            <p className="text-purple-300">{edu.institution}</p>
                            <p className="text-gray-400">{edu.year}</p>
                          </>
                      )}
                    </div>
                ))}
                {isEditing && (
                    <button
                        onClick={() =>
                            setEditedProfile((prev) => ({
                              ...prev,
                              education: [...prev.education, { degree: "", institution: "", year: "" }],
                            }))
                        }
                        className="bg-purple-600 hover:bg-purple-500 rounded-lg px-4 py-2 text-sm text-white transition-colors w-full"
                    >
                      + Add Education
                    </button>
                )}
              </div>
            </div>

            {/* Projects */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-300">Projects</h3>
              <div className="space-y-4">
                {(isEditing ? editedProfile.projects : profile.projects).map((project, index) => (
                    <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                      {isEditing ? (
                          <>
                            <input
                                type="text"
                                value={project.name}
                                onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                                className="font-bold text-white bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Project Name"
                            />
                            <input
                                type="text"
                                value={project.role}
                                onChange={(e) => handleProjectChange(index, "role", e.target.value)}
                                className="text-purple-300 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Your Role"
                            />
                            <textarea
                                value={project.description}
                                onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                                className="text-gray-300 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 w-full h-20 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Description"
                            />
                          </>
                      ) : (
                          <>
                            <h4 className="font-bold text-white">{project.name}</h4>
                            <p className="text-purple-300">{project.role}</p>
                            <p className="text-gray-300 mt-2">{project.description}</p>
                          </>
                      )}
                    </div>
                ))}
                {isEditing && (
                    <button
                        onClick={() =>
                            setEditedProfile((prev) => ({
                              ...prev,
                              projects: [...prev.projects, { name: "", role: "", description: "" }],
                            }))
                        }
                        className="bg-purple-600 hover:bg-purple-500 rounded-lg px-4 py-2 text-sm text-white transition-colors w-full"
                    >
                      + Add Project
                    </button>
                )}
              </div>
            </div>

            {isEditing && (
                <div className="flex justify-end">
                  <button
                      onClick={handleSaveProfile}
                      disabled={saveStatus === "saving"}
                      className={`px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium transition-all transform hover:scale-105 ${
                          saveStatus === "saving" ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                  >
                    {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                  </button>
                </div>
            )}
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
  )
}

export default Profile

