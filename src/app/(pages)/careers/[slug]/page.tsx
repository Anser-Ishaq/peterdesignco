'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import CustomButton from "@/app/components/ui/customButton/customButton";
import CustomInput from "@/app/components/ui/customInput/customInput";
import CustomTextarea from "@/app/components/ui/customTextarea/customTextarea";
import Image from "next/image";

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

export default function CareerDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    currentPosition: '',
    yearsOfExperience: '',
    expectedSalary: '',
    coverLetter: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const response = await fetch(`/api/careers/slug/${slug}`);
        const data = await response.json();

        if (data.success) {
          setCareer(data.data);
        }
      } catch (error) {
        console.error("Error fetching career:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCareer();
    }
  }, [slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid resume file (PDF, DOC, or DOCX)');
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!career) return;

    // Basic validation
    if (!formData.applicantName || !formData.applicantEmail) {
      alert('Please fill in your name and email address');
      return;
    }

    try {
      setSubmitting(true);
      
      let resumeUrl = '';
      
      // Upload resume if selected
      if (selectedFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('resume', selectedFile);
        
        const uploadResponse = await fetch('/api/job-applications/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        const uploadData = await uploadResponse.json();
        
        if (uploadData.success) {
          resumeUrl = uploadData.data.url;
        } else {
          alert(uploadData.message || 'Failed to upload resume');
          return;
        }
        setUploading(false);
      }
      
      const applicationData = {
        careerId: career._id,
        applicantName: formData.applicantName,
        applicantEmail: formData.applicantEmail,
        applicantPhone: formData.applicantPhone || undefined,
        currentPosition: formData.currentPosition || undefined,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
        expectedSalary: formData.expectedSalary ? parseInt(formData.expectedSalary) : undefined,
        coverLetter: formData.coverLetter || undefined,
        resumeUrl: resumeUrl || undefined,
      };

      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Application submitted successfully! We will review your application and get back to you soon.');
        // Reset form
        setFormData({
          applicantName: '',
          applicantEmail: '',
          applicantPhone: '',
          currentPosition: '',
          yearsOfExperience: '',
          expectedSalary: '',
          coverLetter: ''
        });
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        alert(data.error || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto pt-[80px] md:pt-[140px] px-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading career details...</p>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="container mx-auto pt-[80px] md:pt-[140px] px-4">
        <div className="flex flex-col gap-6 justify-center items-center mb-10 text-black px-4">
          <p className="font-medium text-base">Career Not Found</p>
          <p className="font-bold text-2xl lg:text-5xl text-center max-w-[800px]">
            This position is no longer available
          </p>
          <a href="/careers" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
            Back to Careers
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto pt-[80px] md:pt-[140px] px-4">
        <div className="flex flex-col gap-6 justify-center items-center mb-10 text-black px-4">
          <p className="font-medium text-base">Join Our Team</p>
          <p className="font-bold text-2xl lg:text-5xl text-center max-w-[800px]">
            {career.title}
          </p>
          <div className="text-center text-gray-600">
            <p>{career.department} • {career.location} • {career.employmentType}</p>
            <p className="mt-2">Apply by: {new Date(career.applyBy).toLocaleDateString()}</p>
          </div>
        </div>
        
        {/* Job Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About this role</h2>
          <p className="text-gray-700 mb-6">{career.description}</p>
          
          {career.requirements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Requirements</h3>
              <ul className="list-disc list-inside space-y-2">
                {career.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">{req}</li>
                ))}
              </ul>
            </div>
          )}
          
          {career.responsibilities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2">
                {career.responsibilities.map((resp, index) => (
                  <li key={index} className="text-gray-700">{resp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CustomInput 
              placeholder="Full Name" 
              type="text" 
              name="applicantName"
              value={formData.applicantName}
              onChange={handleInputChange}
              required
            />
            <CustomInput 
              placeholder="Email Address" 
              type="email" 
              name="applicantEmail"
              value={formData.applicantEmail}
              onChange={handleInputChange}
              required
            />
            <CustomInput 
              placeholder="Phone Number" 
              type="tel" 
              name="applicantPhone"
              value={formData.applicantPhone}
              onChange={handleInputChange}
            />
            <CustomInput 
              placeholder="Current Position" 
              type="text" 
              name="currentPosition"
              value={formData.currentPosition}
              onChange={handleInputChange}
            />
            <CustomInput 
              placeholder="Years of Experience" 
              type="number" 
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
            />
            <CustomInput 
              placeholder="Expected Salary (PKR)" 
              type="number" 
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleInputChange}
            />
          </div>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {selectedFile && (
            <p className="text-sm text-green-600 mt-1">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          <CustomTextarea 
            placeholder="Cover Letter - Tell us why you want to join our company and why you're perfect for this role"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
          />
          <CustomButton 
            text={uploading ? "Uploading Resume..." : submitting ? "Submitting..." : "Submit Application"} 
            disabled={submitting || uploading}
          />
        </form>
      </div>
    </>
  );
}
