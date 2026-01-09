'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import Link from 'next/link';

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
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function CareersListPage() {
  const { user, isAuthenticated } = useAuth();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/careers", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setCareers(data.data);
      } else {
        setError(data.error || "Failed to fetch careers");
      }
    } catch (error) {
      console.error("Error fetching careers:", error);
      setError("Failed to fetch careers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCareers();
    }
  }, [isAuthenticated]);

  const handleDelete = async (careerId: string) => {
    if (!confirm("Are you sure you want to delete this career?")) return;

    try {
      const response = await fetch(`/api/careers/${careerId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        alert("Career deleted successfully!");
        fetchCareers(); // Refresh the list
      } else {
        alert(data.error || "Failed to delete career");
      }
    } catch (error) {
      console.error("Error deleting career:", error);
      alert("Failed to delete career");
    }
  };

  const formatSalaryRange = (salaryRange: Career['salaryRange']) => {
    return `${salaryRange.min.toLocaleString()} - ${salaryRange.max.toLocaleString()} ${salaryRange.currency}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Careers Management</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Please log in to access careers management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Careers Management</h1>
        <Link
          href="/dashboard/careers/add"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Career
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading careers...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchCareers}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : careers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">No careers found.</p>
            <Link
              href="/dashboard/careers/add"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Create First Career
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Job Title
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Department
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Experience
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Salary Range
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Apply By
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {careers.map((career) => (
                  <tr key={career._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{career.title}</div>
                        <div className="text-sm text-gray-500">
                          {career.workMode}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{career.department}</td>
                    <td className="py-3 px-4 text-sm">{career.location}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {career.employmentType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm capitalize">{career.experienceLevel}</td>
                    <td className="py-3 px-4 text-sm font-medium">
                      {formatSalaryRange(career.salaryRange)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(career.status)}`}
                      >
                        {career.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{formatDate(career.applyBy)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/careers/${career.slug}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/careers/edit/${career._id}`}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(career._id)}
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
    </div>
  );
}
