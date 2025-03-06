import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(null);

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
                    <button
                        onClick={handleEditToggle}
                        className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all"
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
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
        </div>
    );
};

export default Profile;
