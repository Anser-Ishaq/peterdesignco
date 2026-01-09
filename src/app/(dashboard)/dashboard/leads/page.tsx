"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";

interface Lead {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  productId: {
    _id: string;
    name: string;
    slug: string;
    thumbnail: {
      url: string;
      alt: string;
    };
    pricing: {
      original: number;
      sale: number | null;
      discountPercent: number | null;
    };
    stock: {
      quantity: number;
      status: 'in_stock' | 'low_stock' | 'out_of_stock';
    };
    quality: 'Basic' | 'Standard' | 'Premium' | 'Luxury';
    category: string;
    sku: string;
  };
  quantity: number;
  addedAt: string;
  status: 'active' | 'ordered' | 'removed';
  createdAt: string;
  updatedAt: string;
}

export default function LeadsPage() {
  const { user, isAuthenticated } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "active",
    search: "",
  });

  // Email template modal state
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filters.status,
      });

      if (filters.search) params.append("search", filters.search);

      const response = await fetch(`/api/leads/admin?${params}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setLeads(data.data);
      } else {
        setError(data.error || "Failed to fetch leads");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      setError("Failed to fetch leads");
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

  const openTemplateModal = (lead: Lead) => {
    setSelectedLead(lead);
    setShowTemplateModal(true);
    fetchEmailTemplates();
  };

  const closeTemplateModal = () => {
    setShowTemplateModal(false);
    setSelectedLead(null);
    setSelectedTemplate("");
  };

  const sendTemplateEmail = async () => {
    if (!selectedTemplate || !selectedLead) return;

    try {
      setSendingEmail(true);
      const response = await fetch("/api/email-templates/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          templateId: selectedTemplate,
          recipientEmail: selectedLead.userId.email,
          recipientName: selectedLead.userId.name,
          variables: {
            product: selectedLead.productId.name,
            quantity: selectedLead.quantity,
            price: selectedLead.productId.pricing.sale || selectedLead.productId.pricing.original,
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.isSimulated) {
          alert(`Email simulated successfully!\n\nFrom: ${data.data.fromEmail}\nTo: ${selectedLead.userId.email}\nSubject: ${data.data.subject}\n\nNote: Configure EMAIL_USER and EMAIL_PASS environment variables to send real emails.`);
        } else {
          alert(`Email sent successfully!\n\nFrom: ${data.data.fromEmail}\nTo: ${selectedLead.userId.email}\nSubject: ${data.data.subject}`);
        }
        closeTemplateModal();
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

  useEffect(() => {
    if (isAuthenticated && user?.role === "Admin") {
      fetchLeads();
    }
  }, [isAuthenticated, user, filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "ordered":
        return "bg-green-100 text-green-800";
      case "removed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateTotal = (lead: Lead) => {
    const price = lead.productId.pricing.sale || lead.productId.pricing.original;
    return price * lead.quantity;
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
        <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
        <div className="text-sm text-gray-600">
          Cart items from users that can be converted to orders
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by user name or email..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active Carts</option>
              <option value="ordered">Converted to Orders</option>
              <option value="removed">Removed Items</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: "active", search: "" })}
              className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchLeads}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No leads found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Added</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{lead.userId.name}</div>
                        <div className="text-sm text-gray-600">{lead.userId.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 bg-gray-200 rounded">
                          {lead.productId.thumbnail?.url ? (
                            <Image
                              src={lead.productId.thumbnail.url}
                              alt={lead.productId.thumbnail.alt}
                              fill
                              className="object-cover rounded"
                              sizes="48px"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{lead.productId.name}</div>
                          <div className="text-sm text-gray-600">
                            {lead.productId.quality} • {lead.productId.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{lead.quantity}</td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium">
                          Rs.{lead.productId.pricing.sale || lead.productId.pricing.original}
                        </span>
                        {lead.productId.pricing.sale && (
                          <div className="text-sm text-gray-500 line-through">
                            Rs.{lead.productId.pricing.original}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-green-600">
                      Rs.{calculateTotal(lead).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(lead.addedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <div className="relative group">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            Contact User
                          </button>
                          {/* Contact Options Dropdown */}
                          <div className="absolute left-0 top-6 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
                            <div className="p-2">
                              <button
                                onClick={() => {
                                  const subject = `Regarding your interest in ${lead.productId.name}`;
                                  const body = `Hello ${lead.userId.name},\n\nI hope this email finds you well. I noticed you've added ${lead.productId.name} to your cart and wanted to reach out to see if you have any questions or if there's anything I can help you with.\n\nBest regards,\nYour Team`;
                                  window.location.href = `mailto:${lead.userId.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                }}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                              >
                                📧 Open Email Client
                              </button>
                              <button
                                onClick={() => openTemplateModal(lead)}
                                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                              >
                                📝 Use Email Template
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* <button className="text-green-600 hover:text-green-800 text-sm">
                          Convert to Order
                        </button> */}
                        <Link 
                          href={`/shop/${lead.productId.slug}`}
                          className="text-purple-600 hover:text-purple-800 text-sm"
                        >
                          View Product
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Email Template Modal */}
      {showTemplateModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Send Email to {selectedLead.userId.name}</h3>
              <button
                onClick={closeTemplateModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Email: {selectedLead.userId.email}
              </p>
              <p className="text-sm text-gray-600">
                Product: {selectedLead.productId.name}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Email Template
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

            <div className="flex gap-3">
              <button
                onClick={closeTemplateModal}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={sendTemplateEmail}
                disabled={!selectedTemplate || sendingEmail}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingEmail ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}