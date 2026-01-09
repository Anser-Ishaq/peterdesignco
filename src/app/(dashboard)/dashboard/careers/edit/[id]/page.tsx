'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CustomInput from "@/app/components/ui/customInput/customInput";
import CustomTextarea from "@/app/components/ui/customTextarea/customTextarea";

interface Career {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  workMode: string;
  employmentType: string;
  experienceLevel: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: string;
  postedAt: string;
  applyBy: string;
}

export default function EditCareerPage() {
  const params = useParams();
  const router = useRouter();
  const careerId = params.id as string;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    department: '',
    location: '',
    workMode: 'onsite',
    employmentType: 'full time',
    experienceLevel: 'mid',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'PKR',
    description: '',
    applyBy: '',
    status: 'active'
  });

  const [requirements, setRequirements] = useState<string[]>(['']);
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch career data
  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const response = await fetch(`/api/careers/${careerId}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
          const career = data.data;
          setFormData({
            title: career.title,
            slug: career.slug,
            department: career.department,
            location: career.location,
            workMode: career.workMode,
            employmentType: career.employmentType,
            experienceLevel: career.experienceLevel,
            salaryMin: career.salaryRange.min.toString(),
            salaryMax: career.salaryRange.max.toString(),
            salaryCurrency: career.salaryRange.currency,
            description: career.description,
            applyBy: career.applyBy.split('T')[0], // Format date for input
            status: career.status
          });
          setRequirements(career.requirements.length > 0 ? career.requirements : ['']);
          setResponsibilities(career.responsibilities.length > 0 ? career.responsibilities : ['']);
        } else {
          setError(data.error || "Failed to fetch career");
        }
      } catch (error) {
        console.error("Error fetching career:", error);
        setError("Failed to fetch career");
      } finally {
        setLoading(false);
      }
    };

    if (careerId) {
      fetchCareer();
    }
  }, [careerId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData({
        ...formData,
        [name]: value,
        slug: slug
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Requirements management
  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  // Responsibilities management
  const addResponsibility = () => {
    setResponsibilities([...responsibilities, '']);
  };

  const removeResponsibility = (index: number) => {
    if (responsibilities.length > 1) {
      setResponsibilities(responsibilities.filter((_, i) => i !== index));
    }
  };

  const updateResponsibility = (index: number, value: string) => {
    const newResponsibilities = [...responsibilities];
    newResponsibilities[index] = value;
    setResponsibilities(newResponsibilities);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const careerData = {
        title: formData.title,
        slug: formData.slug,
        department: formData.department,
        location: formData.location,
        workMode: formData.workMode,
        employmentType: formData.employmentType,
        experienceLevel: formData.experienceLevel,
        salaryRange: {
          min: parseInt(formData.salaryMin),
          max: parseInt(formData.salaryMax),
          currency: formData.salaryCurrency,
        },
        description: formData.description,
        requirements: requirements.filter(req => req.trim() !== ''),
        responsibilities: responsibilities.filter(resp => resp.trim() !== ''),
        status: formData.status,
        applyBy: formData.applyBy,
      };

      const response = await fetch(`/api/careers/${careerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(careerData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Career updated successfully!");
        router.push("/dashboard/careers");
      } else {
        alert(data.error || "Failed to update career");
      }
    } catch (error) {
      console.error("Error updating career:", error);
      alert("Failed to update career");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/careers");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Career</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Career</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Back to Careers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Edit Career</h1>
        <button
          onClick={handleCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Back to Careers
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">Update the career opportunity details.</p>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic Job Information */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Basic Job Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Title */}
              <div>
                <CustomInput
                  id="title"
                  name="title"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="Enter job title"
                  label="Job Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              {/* Auto-generated Slug */}
              <div>
                <CustomInput
                  id="slug"
                  name="slug"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="auto-generated-from-title"
                  label="URL Slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select 
                  name="department"
                  value={formData.department}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select department</option>
                  <option value="Design">Design</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Operations">Operations</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">Human Resources</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <CustomInput
                  id="location"
                  name="location"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="e.g., Lahore, Pakistan"
                  label="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>
            </div>

            {/* Job Description */}
            <div className="mt-4">
              <CustomTextarea
                id="description"
                name="description"
                label="Job Description"
                placeholder="Enter detailed job description"
                value={formData.description}
                onChange={handleTextareaChange}
                required
                border="border border-gray-300 rounded-lg"
                backgroundColor="bg-white"
                padding="py-3 px-4"
                rows={4}
              />
            </div>
          </div>

          {/* Work Details */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Work Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Work Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Mode <span className="text-red-500">*</span>
                </label>
                <select 
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="onsite">Onsite</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select 
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full time">Full Time</option>
                  <option value="part time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <select 
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive Level</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Salary Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Minimum Salary */}
              <div>
                <CustomInput
                  id="salaryMin"
                  name="salaryMin"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="80000"
                  label="Minimum Salary"
                  type="number"
                  min="0"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              {/* Maximum Salary */}
              <div>
                <CustomInput
                  id="salaryMax"
                  name="salaryMax"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="120000"
                  label="Maximum Salary"
                  type="number"
                  min="0"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select 
                  name="salaryCurrency"
                  value={formData.salaryCurrency}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-4">Job Requirements</h3>
            
            <div className="space-y-3">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <CustomTextarea
                      id={`requirement-${index}`}
                      name={`requirement-${index}`}
                      placeholder={`Requirement ${index + 1}...`}
                      value={requirement}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      border="border border-gray-300 rounded-lg"
                      backgroundColor="bg-white"
                      padding="py-3 px-4"
                      rows={2}
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                      title="Add requirement"
                    >
                      +
                    </button>
                    {requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        title="Remove requirement"
                      >
                        -
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">Job Responsibilities</h3>
            
            <div className="space-y-3">
              {responsibilities.map((responsibility, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <CustomTextarea
                      id={`responsibility-${index}`}
                      name={`responsibility-${index}`}
                      placeholder={`Responsibility ${index + 1}...`}
                      value={responsibility}
                      onChange={(e) => updateResponsibility(index, e.target.value)}
                      border="border border-gray-300 rounded-lg"
                      backgroundColor="bg-white"
                      padding="py-3 px-4"
                      rows={2}
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <button
                      type="button"
                      onClick={addResponsibility}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                      title="Add responsibility"
                    >
                      +
                    </button>
                    {responsibilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResponsibility(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        title="Remove responsibility"
                      >
                        -
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status and Apply By Date */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status and Deadline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Apply By Date */}
              <div>
                <CustomInput
                  id="applyBy"
                  name="applyBy"
                  width="w-full"
                  height="h-[50px]"
                  label="Apply By Date"
                  type="date"
                  value={formData.applyBy}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Career'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}