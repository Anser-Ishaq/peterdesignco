"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  message: string;
  type: string;
  status: 'active' | 'draft' | 'inactive';
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
  createdAt: string;
  updatedAt: string;
}

export default function EmailTemplatesPage() {
  const { user, isAuthenticated } = useAuth();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/email-templates", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setTemplates(data.data);
      } else {
        setError(data.error || "Failed to fetch email templates");
      }
    } catch (error) {
      console.error("Error fetching email templates:", error);
      setError("Failed to fetch email templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "Admin") {
      fetchTemplates();
    }
  }, [isAuthenticated, user]);

  const handleDelete = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this email template?")) return;

    try {
      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        fetchTemplates(); // Refresh the list
      } else {
        alert(data.error || "Failed to delete template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access the dashboard.</p>
          <Link href="/login" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role !== "Admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only admins can access this page.</p>
          <Link href="/dashboard" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Email Message Templates</h1>
        <Link
          href="/dashboard/email-templates/add"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Create New Template
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchTemplates}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">No email templates found.</p>
            <Link
              href="/dashboard/email-templates/add"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Create First Template
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
                    {template.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Subject:</strong> {template.subject}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded">{template.type}</span>
                  <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/email-templates/edit/${template._id}`}
                    className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm hover:bg-blue-200 text-center"
                  >
                    Edit
                  </Link>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200">
                    Preview
                  </button>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}