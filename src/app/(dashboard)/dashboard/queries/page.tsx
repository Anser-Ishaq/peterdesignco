'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import Link from 'next/link';

interface Query {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  adminNotes?: string;
  repliedAt?: string;
  repliedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  message: string;
  type: string;
  status: string;
}

export default function QueriesPage() {
  const { user, isAuthenticated } = useAuth();
  const [queries, setQueries] = useState<Query[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [statusCounts, setStatusCounts] = useState<any>({});

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // View modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingQuery, setViewingQuery] = useState<Query | null>(null);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/queries?${params.toString()}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setQueries(data.data);
        setStatusCounts(data.statusCounts || {});
      } else {
        setError(data.error || "Failed to fetch queries");
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      setError("Failed to fetch queries");
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
      fetchQueries();
      fetchEmailTemplates();
    }
  }, [isAuthenticated, searchTerm, statusFilter]);

  const handleStatusUpdate = async (queryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/queries/${queryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Query status updated successfully!");
        fetchQueries(); // Refresh the list
      } else {
        alert(data.error || "Failed to update query status");
      }
    } catch (error) {
      console.error("Error updating query status:", error);
      alert("Failed to update query status");
    }
  };

  const handleDelete = async (queryId: string) => {
    if (!confirm("Are you sure you want to delete this query?")) return;

    try {
      const response = await fetch(`/api/queries/${queryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        alert("Query deleted successfully!");
        fetchQueries(); // Refresh the list
      } else {
        alert(data.error || "Failed to delete query");
      }
    } catch (error) {
      console.error("Error deleting query:", error);
      alert("Failed to delete query");
    }
  };

  const openEmailModal = (query: Query) => {
    setSelectedQuery(query);
    setShowEmailModal(true);
    setSelectedTemplate('');
    setCustomSubject('');
    setCustomMessage('');
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setSelectedQuery(null);
    setSelectedTemplate('');
    setCustomSubject('');
    setCustomMessage('');
  };

  const openViewModal = async (query: Query) => {
    setViewingQuery(query);
    setShowViewModal(true);
    
    // Mark as read if it's new
    if (query.status === 'new') {
      await handleStatusUpdate(query._id, 'read');
    }
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingQuery(null);
  };

  const handleSendEmail = async () => {
    if (!selectedQuery) return;

    if (!selectedTemplate && (!customSubject || !customMessage)) {
      alert("Please select a template or provide custom subject and message");
      return;
    }

    try {
      setSendingEmail(true);
      const response = await fetch("/api/queries/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          queryId: selectedQuery._id,
          templateId: selectedTemplate || undefined,
          customSubject: customSubject || undefined,
          customMessage: customMessage || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.isSimulated) {
          alert(`Email simulated successfully!\n\nFrom: ${data.data.fromEmail}\nTo: ${selectedQuery.email}\nSubject: ${data.data.subject}\n\nNote: Configure EMAIL_USER and EMAIL_PASS environment variables to send real emails.`);
        } else {
          alert(`Email sent successfully!\n\nFrom: ${data.data.fromEmail}\nTo: ${selectedQuery.email}\nSubject: ${data.data.subject}`);
        }
        closeEmailModal();
        fetchQueries(); // Refresh to see updated status
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
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Contact Queries</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Please log in to access contact queries.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Contact Queries</h1>
        <div className="flex gap-4 text-sm">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            New: {statusCounts.new || 0}
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            Read: {statusCounts.read || 0}
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Replied: {statusCounts.replied || 0}
          </div>
          <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
            Closed: {statusCounts.closed || 0}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search queries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading queries...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchQueries}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No queries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Contact Info</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Message</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query) => (
                  <tr key={query._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{query.name}</div>
                        <div className="text-sm text-gray-500">{query.email}</div>
                        {query.phone && (
                          <div className="text-sm text-gray-500">{query.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {query.message}
                        </p>
                        <button
                          onClick={() => openViewModal(query)}
                          className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                        >
                          View Full Message
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={query.status}
                        onChange={(e) => handleStatusUpdate(query._id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(query.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm">{formatDate(query.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openViewModal(query)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEmailModal(query)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => handleDelete(query._id)}
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

      {/* View Query Modal */}
      {showViewModal && viewingQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Query Details</h3>
              <button
                onClick={closeViewModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{viewingQuery.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{viewingQuery.email}</p>
                </div>
              </div>
              
              {viewingQuery.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{viewingQuery.phone}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{viewingQuery.message}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewingQuery.status)}`}>
                    {viewingQuery.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted</label>
                  <p className="text-gray-900">{formatDate(viewingQuery.createdAt)}</p>
                </div>
              </div>

              {viewingQuery.repliedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Replied</label>
                  <p className="text-gray-900">
                    {formatDate(viewingQuery.repliedAt)}
                    {viewingQuery.repliedBy && ` by ${viewingQuery.repliedBy.name}`}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={() => {
                  closeViewModal();
                  openEmailModal(viewingQuery);
                }}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Reply to Query
              </button>
              <button
                onClick={closeViewModal}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Send Email to {selectedQuery.name}</h3>
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
                  <div><code>{'{{name}}'}</code> - Contact name</div>
                  <div><code>{'{{email}}'}</code> - Contact email</div>
                  <div><code>{'{{phone}}'}</code> - Contact phone</div>
                  <div><code>{'{{message}}'}</code> - Original message</div>
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