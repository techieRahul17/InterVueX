import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(null);

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
        // In a real app, this would fetch the user's profile from an API
        const mockProfile = {
            name: currentUser?.name || 'John Doe',
            email: currentUser?.email || 'john.doe@example.com',
            role: 'Software Engineer',
            location: 'San Francisco, CA',
            bio: 'Passionate developer with 5+ years of experience in building scalable web applications.',
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
            education: [
                {
                    degree: 'Master of Science in Computer Science',
                    institution: 'Stanford University',
                    year: '2020'
                },
                {
                    degree: 'Bachelor of Science in Computer Engineering',
                    institution: 'MIT',
                    year: '2018'
                }
            ],
            experience: [
                {
                    title: 'Senior Software Engineer',
                    company: 'TechCorp',
                    duration: '2021 - Present',
                    description: 'Led a team of 5 developers in building a cloud-based analytics platform.'
                },
                {
                    title: 'Software Engineer',
                    company: 'StartupX',
                    duration: '2018 - 2021',
                    description: 'Developed and maintained multiple full-stack web applications using React and Node.js.'
                }
            ]
        };
        setProfile(mockProfile);
        setEditedProfile(mockProfile);
    }, [currentUser]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setEditedProfile({...profile});
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({...prev, [name]: value}));
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...editedProfile.skills];
        newSkills[index] = value;
        setEditedProfile(prev => ({...prev, skills: newSkills}));
    };

    const handleAddSkill = () => {
        setEditedProfile(prev => ({...prev, skills: [...prev.skills, '']}));
    };

    const handleRemoveSkill = (index) => {
        const newSkills = editedProfile.skills.filter((_, i) => i !== index);
        setEditedProfile(prev => ({...prev, skills: newSkills}));
    };

    const handleSaveProfile = () => {
        // In a real app, this would send the updated profile to an API
        setProfile(editedProfile);
        setIsEditing(false);
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

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                        {isEditing ? 'Edit Profile' : 'Your Profile'}
                    </h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleEditToggle}
                            className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                        <button
                            onClick={() => setShowJobModal(true)}
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium transition-all"
                        >
                            Create Job
                        </button>
                        <button
                            onClick={() => setShowScheduleModal(true)}
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all"
                        >
                            Schedule Interview
                        </button>
                    </div>
                </div>

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
                                        className="input text-2xl font-bold mb-1"
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
                                        className="input text-purple-300"
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
                                className="input h-32 resize-none"
                            />
                        ) : (
                            <p className="text-gray-300">{profile.bio}</p>
                        )}
                        <div className="flex items-center space-x-4 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                            </svg>
                            <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="location"
                                    value={editedProfile.location}
                                    onChange={handleInputChange}
                                    className="input"
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
                                            <button
                                                onClick={() => handleRemoveSkill(index)}
                                                className="ml-2 text-red-400 hover:text-red-300"
                                            >
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
                            {profile.experience.map((exp, index) => (
                                <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                                    <h4 className="font-bold text-white">{exp.title}</h4>
                                    <p className="text-purple-300">{exp.company}</p>
                                    <p className="text-gray-400">{exp.duration}</p>
                                    <p className="text-gray-300 mt-2">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-purple-300">Education</h3>
                        <div className="space-y-4">
                            {profile.education.map((edu, index) => (
                                <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                                    <h4 className="font-bold text-white">{edu.degree}</h4>
                                    <p className="text-purple-300">{edu.institution}</p>
                                    <p className="text-gray-400">{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveProfile}
                                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium transition-all transform hover:scale-105"
                            >
                                Save Changes
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
    );
};

export default Profile;
