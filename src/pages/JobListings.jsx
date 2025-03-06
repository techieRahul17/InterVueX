import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const JobListings = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        location: 'all',
        jobType: 'all',
        experience: 'all',
        remote: false
    });
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [skills, setSkills] = useState(['']);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call to fetch jobs
        setTimeout(() => {
            const mockJobs = [
                {
                    id: 1,
                    title: 'Senior Frontend Developer',
                    company: 'Google',
                    logo: '/placeholder.svg?height=60&width=60',
                    location: 'Mountain View, CA',
                    salary: '$120,000 - $160,000',
                    jobType: 'Full-time',
                    experience: '5+ years',
                    remote: true,
                    posted: '2 days ago',
                    description: 'We are looking for a Senior Frontend Developer to join our team. You will be responsible for building user interfaces for our products using React and modern JavaScript.',
                    requirements: [
                        'Strong experience with React, Redux, and modern JavaScript',
                        'Experience with responsive design and CSS frameworks',
                        'Knowledge of web performance optimization techniques',
                        'Experience with testing frameworks like Jest and React Testing Library',
                        'Bachelor\'s degree in Computer Science or related field'
                    ],
                    responsibilities: [
                        'Develop and maintain user interfaces for our products',
                        'Collaborate with designers and backend developers',
                        'Write clean, maintainable, and efficient code',
                        'Optimize applications for maximum speed and scalability',
                        'Stay up-to-date with emerging trends and technologies'
                    ]
                },
                {
                    id: 2,
                    title: 'Full Stack Engineer',
                    company: 'Microsoft',
                    logo: '/placeholder.svg?height=60&width=60',
                    location: 'Redmond, WA',
                    salary: '$130,000 - $170,000',
                    jobType: 'Full-time',
                    experience: '3-5 years',
                    remote: true,
                    posted: '1 week ago',
                    description: 'We are seeking a Full Stack Engineer to join our team. You will be working on both frontend and backend development for our cloud services.',
                    requirements: [
                        'Experience with JavaScript/TypeScript, React, and Node.js',
                        'Knowledge of cloud services (Azure, AWS, or GCP)',
                        'Experience with databases (SQL and NoSQL)',
                        'Understanding of CI/CD pipelines',
                        'Bachelor\'s degree in Computer Science or related field'
                    ],
                    responsibilities: [
                        'Develop and maintain web applications using React and Node.js',
                        'Design and implement RESTful APIs',
                        'Work with databases and cloud services',
                        'Collaborate with cross-functional teams',
                        'Participate in code reviews and technical discussions'
                    ]
                },
                {
                    id: 3,
                    title: 'Machine Learning Engineer',
                    company: 'Amazon',
                    logo: '/placeholder.svg?height=60&width=60',
                    location: 'Seattle, WA',
                    salary: '$140,000 - $180,000',
                    jobType: 'Full-time',
                    experience: '3+ years',
                    remote: false,
                    posted: '3 days ago',
                    description: 'We are looking for a Machine Learning Engineer to join our team. You will be responsible for developing and deploying machine learning models for our products.',
                    requirements: [
                        'Experience with machine learning frameworks (TensorFlow, PyTorch)',
                        'Strong programming skills in Python',
                        'Knowledge of data processing and analysis',
                        'Experience with cloud-based ML services',
                        'Master\'s or PhD in Computer Science, Machine Learning, or related field'
                    ],
                    responsibilities: [
                        'Develop and deploy machine learning models',
                        'Process and analyze large datasets',
                        'Collaborate with data scientists and engineers',
                        'Optimize models for performance and scalability',
                        'Stay up-to-date with the latest research and technologies'
                    ]
                },
                {
                    id: 4,
                    title: 'DevOps Engineer',
                    company: 'Netflix',
                    logo: '/placeholder.svg?height=60&width=60',
                    location: 'Los Gatos, CA',
                    salary: '$125,000 - $165,000',
                    jobType: 'Full-time',
                    experience: '2-4 years',
                    remote: true,
                    posted: '5 days ago',
                    description: 'We are seeking a DevOps Engineer to join our team. You will be responsible for building and maintaining our infrastructure and deployment pipelines.',
                    requirements: [
                        'Experience with cloud platforms (AWS, GCP)',
                        'Knowledge of containerization (Docker, Kubernetes)',
                        'Experience with infrastructure as code (Terraform, CloudFormation)',
                        'Understanding of CI/CD pipelines',
                        'Bachelor\'s degree in Computer Science or related field'
                    ],
                    responsibilities: [
                        'Build and maintain cloud infrastructure',
                        'Implement and manage CI/CD pipelines',
                        'Monitor system performance and reliability',
                        'Automate deployment processes',
                        'Collaborate with development teams'
                    ]
                },
                {
                    id: 5,
                    title: 'UI/UX Designer',
                    company: 'Apple',
                    logo: '/placeholder.svg?height=60&width=60',
                    location: 'Cupertino, CA',
                    salary: '$110,000 - $150,000',
                    jobType: 'Full-time',
                    experience: '3+ years',
                    remote: false,
                    posted: '1 day ago',
                    description: 'We are looking for a UI/UX Designer to join our team. You will be responsible for creating user interfaces and experiences for our products.',
                    requirements: [
                        'Experience with design tools (Figma, Sketch, Adobe XD)',
                        'Knowledge of user-centered design principles',
                        'Experience with prototyping and wireframing',
                        'Understanding of accessibility standards',
                        'Bachelor\'s degree in Design, HCI, or related field'
                    ],
                    responsibilities: [
                        'Create user interfaces and experiences for our products',
                        'Conduct user research and usability testing',
                        'Collaborate with product managers and engineers',
                        'Create prototypes and wireframes',
                        'Stay up-to-date with design trends and best practices'
                    ]
                },
                {
                    id: 6,
                    title: 'Data Scientist',
                    company: 'Meta',
                    logo: '/placeholder.svg?height=60&width=60',
                    location: 'Menlo Park, CA',
                    salary: '$135,000 - $175,000',
                    jobType: 'Full-time',
                    experience: '4+ years',
                    remote: true,
                    posted: '2 weeks ago',
                    description: 'We are seeking a Data Scientist to join our team. You will be responsible for analyzing data and developing models to drive business decisions.',
                    requirements: [
                        'Strong programming skills in Python or R',
                        'Experience with data analysis and visualization',
                        'Knowledge of statistical methods and machine learning',
                        'Experience with big data technologies',
                        'Master\'s or PhD in Statistics, Computer Science, or related field'
                    ],
                    responsibilities: [
                        'Analyze data to identify trends and patterns',
                        'Develop models to predict user behavior',
                        'Collaborate with product and engineering teams',
                        'Present findings to stakeholders',
                        'Stay up-to-date with the latest research and technologies'
                    ]
                },
                {
                    id: 7,
                    title: 'Backend Developer',
                    company: 'Spotify',
                    logo: '/placeholder.svg?height=60&width=60',
                    location: 'New York, NY',
                    salary: '$115,000 - $155,000',
                    jobType: 'Contract',
                    experience: '2-4 years',
                    remote: true,
                    posted: '3 days ago',
                    description: 'We are looking for a Backend Developer to join our team. You will be responsible for developing and maintaining our server-side applications.',
                    requirements: [
                        'Experience with Node.js, Python, or Java',
                        'Knowledge of databases (SQL and NoSQL)',
                        'Experience with RESTful APIs',
                        'Understanding of microservices architecture',
                        'Bachelor\'s degree in Computer Science or related field'
                    ],
                    responsibilities: [
                        'Develop and maintain server-side applications',
                        'Design and implement RESTful APIs',
                        'Work with databases and cloud services',
                        'Collaborate with frontend developers',
                        'Participate in code reviews and technical discussions'
                    ]
                },
                {
                    id: 8,
                    title: 'Product Manager',
                    company: 'Airbnb',
                    logo: '/placeholder.svg?height=60&width=60',
                    location: 'San Francisco, CA',
                    salary: '$130,000 - $170,000',
                    jobType: 'Full-time',
                    experience: '5+ years',
                    remote: false,
                    posted: '1 week ago',
                    description: 'We are seeking a Product Manager to join our team. You will be responsible for defining product strategy and roadmap for our platform.',
                    requirements: [
                        'Experience in product management for consumer or enterprise products',
                        'Strong analytical and problem-solving skills',
                        'Excellent communication and leadership abilities',
                        'Technical background or understanding of software development',
                        'Bachelor\'s degree in Business, Computer Science, or related field'
                    ],
                    responsibilities: [
                        'Define product strategy and roadmap',
                        'Gather and prioritize product requirements',
                        'Work closely with engineering, design, and marketing teams',
                        'Analyze market trends and competition',
                        'Measure and optimize product performance'
                    ]
                }
            ];

            setJobs(mockJobs);
            setFilteredJobs(mockJobs);
            setLoading(false);
        }, 1500);
    }, []);

    useEffect(() => {
        // Filter jobs based on search term and filters
        const filtered = jobs.filter(job => {
            const matchesSearch =
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesLocation = filters.location === 'all' || job.location.includes(filters.location);
            const matchesJobType = filters.jobType === 'all' || job.jobType === filters.jobType;
            const matchesExperience = filters.experience === 'all' || job.experience.includes(filters.experience);
            const matchesRemote = !filters.remote || job.remote;

            return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesRemote;
        });

        setFilteredJobs(filtered);
    }, [searchTerm, filters, jobs]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters({
            ...filters,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleJobClick = (job) => {
        setSelectedJob(job);
    };

    const handleApplyClick = () => {
        setShowApplyModal(true);
    };

    const handleCloseModal = () => {
        setShowApplyModal(false);
    };

    const handleResumeChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...skills];
        newSkills[index] = value;
        setSkills(newSkills);
    };

    const handleAddSkill = () => {
        if (skills.length < 5) {
            setSkills([...skills, '']);
        }
    };

    const handleRemoveSkill = (index) => {
        const newSkills = [...skills];
        newSkills.splice(index, 1);
        setSkills(newSkills);
    };

    const handleSubmitApplication = (e) => {
        e.preventDefault();
        // In a real app, this would submit the application to an API
        alert('Application submitted successfully!');
        setShowApplyModal(false);
        setResumeFile(null);
        setSkills(['']);
    };

    const locations = ['Mountain View, CA', 'Redmond, WA', 'Seattle, WA', 'San Francisco, CA', 'New York, NY', 'Los Gatos, CA', 'Cupertino, CA', 'Menlo Park, CA'];
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
    const experienceLevels = ['0-1 years', '1-3 years', '3-5 years', '5+ years'];

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                        Job Listings
                    </h1>
                    <p className="text-gray-300 mt-2">
                        Find your next opportunity and prepare for interviews with InterVueX.
                    </p>
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
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
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
                                    <option key={index} value={location}>{location}</option>
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
                                    <option key={index} value={type}>{type}</option>
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
                                    <option key={index} value={level}>{level}</option>
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
                                <h2 className="text-xl font-bold text-white">
                                    {filteredJobs.length} Jobs Found
                                </h2>
                                <div className="text-sm text-gray-400">
                                    Sort by:
                                    <select className="ml-2 bg-transparent border-none text-purple-400 focus:outline-none">
                                        <option>Relevance</option>
                                        <option>Date</option>
                                        <option>Salary</option>
                                    </select>
                                </div>
                            </div>

                            {loading ? (
                                <div className="p-8 flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-400">Loading jobs...</p>
                                </div>
                            ) : filteredJobs.length === 0 ? (
                                <div className="p-8 text-center">
                                    <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <p className="text-gray-400">No jobs match your search criteria</p>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilters({
                                                location: 'all',
                                                jobType: 'all',
                                                experience: 'all',
                                                remote: false
                                            });
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
                                            className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer ${selectedJob && selectedJob.id === job.id ? 'bg-purple-900/20 border-l-4 border-l-purple-500' : ''}`}
                                        >
                                            <div className="flex items-start">
                                                <img src={job.logo || "/placeholder.svg"} alt={job.company} className="w-12 h-12 rounded-lg mr-4" />
                                                <div>
                                                    <h3 className="font-medium text-white">{job.title}</h3>
                                                    <p className="text-sm text-purple-300">{job.company}</p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                                {job.location}
                            </span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
                                        <img src={selectedJob.logo || "/placeholder.svg"} alt={selectedJob.company} className="w-16 h-16 rounded-lg mr-4" />
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">{selectedJob.title}</h2>
                                            <p className="text-lg text-purple-300">{selectedJob.company}</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                            {selectedJob.location}
                        </span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                                                    {selectedJob.jobType}
                        </span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
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
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                            </svg>
                                        </button>
                                        <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
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
                                            Use InterVueX's AI-powered training mode to practice for your interview and get real-time feedback.
                                        </p>
                                        <Link
                                            to="/training"
                                            className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                            </svg>
                                            Start Training
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl shadow-xl border border-purple-500/20 p-8 flex flex-col items-center justify-center h-full">
                                <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
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
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmitApplication} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Upload Resume
                                </label>
                                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                                    {resumeFile ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="w-8 h-8 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <span className="text-gray-300">{resumeFile.name}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <svg className="w-12 h-12 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                            </svg>
                                            <p className="text-gray-400 mb-2">Drag and drop your resume here, or</p>
                                            <label className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors cursor-pointer">
                                                Browse Files
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleResumeChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Top Skills (Maximum 5)
                                </label>
                                <div className="space-y-3">
                                    {skills.map((skill, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={skill}
                                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                                placeholder={`Skill ${index + 1}`}
                                                className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(index)}
                                                    className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    {skills.length < 5 && (
                                        <button
                                            type="button"
                                            onClick={handleAddSkill}
                                            className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm transition-colors"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                            </svg>
                                            Add Skill
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Cover Letter (Optional)
                                </label>
                                <textarea
                                    rows="4"
                                    placeholder="Tell us why you're a good fit for this position..."
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
                                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition-colors"
                                >
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobListings;
