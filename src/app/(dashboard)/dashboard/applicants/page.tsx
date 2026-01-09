'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import Link from 'next/link';

interface JobApplication {
  _id: string;
  careerId: {
    _id: string;
    title: string;
    department: string;
    location: string;
    employmentType: string;
  };
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  currentPosition?: string;
  yearsOfExperience?: number;
  expectedSalary?: number;
  resumeUrl?: string;
  coverLetter?: string;
  applicationStatus: string;
  appliedAt: string;
  reviewedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  reviewedAt?: string;
  notes?: string;
}

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  message: string;
  type: string;
  status: string;
}

export default function ApplicantsPage() {
  const { user, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus) params.append('status', selectedStatus);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/job-applications?${params.toString()}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setApplications(data.data);
      } else {
        setError(data.error || "Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailTemplates = async () => {
    try {
      const response = await fetch("/api/email-templates?status=active", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setEmailTemplates(data.data);
      }
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
      fetchEmailTemplates();
    }
  }, [isAuthenticated, selectedStatus, searchTerm]);

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/job-applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ applicationStatus: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Application status updated successfully!");
        fetchApplications(); // Refresh the list
      } else {
        alert(data.error || "Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to update application status");
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const response = await fetch(`/api/job-applications/${applicationId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        alert("Application deleted successfully!");
        fetchApplications(); // Refresh the list
      } else {
        alert(data.error || "Failed to delete application");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application");
    }
  };

  const openEmailModal = (application: JobApplication) => {
    setSelectedApplication(application);
    setShowEmailModal(true);
    setSelectedTemplate('');
    setCustomSubject('');
    setCustomMessage('');
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setSelectedApplication(null);
    setSelectedTemplate('');
    setCustomSubject('');
    setCustomMessage('');
  };

  const handleSendEmail = async () => {
    if (!selectedApplication) return;

    if (!selectedTemplate && (!customSubject || !customMessage)) {
      alert("Please select a template or provide custom subject and message");
      return;
    }

    try {
      setSendingEmail(true);
      const response = await fetch("/api/job-applications/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          applicationId: selectedApplication._id,
          templateId: selectedTemplate || undefined,
          customSubject: customSubject || undefined,
          customMessage: customMessage || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Email sent successfully!");
        closeEmailModal();
        fetchApplications(); // Refresh to see updated notes
      } else {
        alert(data.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800';
      case 'interviewed':
        return 'bg-indigo-100 text-indigo-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Please log in to access job applications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interviewed">Interviewed</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            type="text"
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchApplications}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No applications found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Applicant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Position</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Experience</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Expected Salary</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Applied Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{application.applicantName}</div>
                        <div className="text-sm text-gray-500">{application.applicantEmail}</div>
                        {application.applicantPhone && (
                          <div className="text-sm text-gray-500">{application.applicantPhone}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{application.careerId.title}</div>
                        <div className="text-sm text-gray-500">
                          {application.careerId.department} • {application.careerId.location}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        {application.yearsOfExperience && (
                          <div className="text-sm">{application.yearsOfExperience} years</div>
                        )}
                        {application.currentPosition && (
                          <div className="text-sm text-gray-500">{application.currentPosition}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {application.expectedSalary 
                        ? `${application.expectedSalary.toLocaleString()} PKR`
                        : 'N/A'
                      }
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={application.applicationStatus}
                        onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize border-0 ${getStatusColor(application.applicationStatus)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm">{formatDate(application.appliedAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEmailModal(application)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Email
                        </button>
                        {application.resumeUrl && (
                          <a
                            href={`/api/job-applications/download-resume?applicationId=${application._id}`}
                            download
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Resume
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(application._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Send Email to {selectedApplication.applicantName}</h3>
              <button
                onClick={closeEmailModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Template (Optional)
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a template...</option>
                  {emailTemplates.map((template) => (
                    <option key={template._id} value={template._id}>
                      {template.name} - {template.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center text-gray-500">OR</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Subject
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Enter email subject"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Message
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Enter email message"
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Available Variables:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                  <div><code>{'{{name}}'}</code> - Applicant name</div>
                  <div><code>{'{{email}}'}</code> - Applicant email</div>
                  <div><code>{'{{position}}'}</code> - Job position</div>
                  <div><code>{'{{department}}'}</code> - Department</div>
                  <div><code>{'{{company}}'}</code> - Company name</div>
                  <div><code>{'{{date}}'}</code> - Current date</div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingEmail ? 'Sending...' : 'Send Email'}
                </button>
                <button
                  onClick={closeEmailModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}