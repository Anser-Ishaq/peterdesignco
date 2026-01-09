'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CustomInput from "@/app/components/ui/customInput/customInput";
import CustomTextarea from "@/app/components/ui/customTextarea/customTextarea";

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  message: string;
  type: string;
  status: string;
}

export default function EditEmailTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: '',
    type: '',
    status: 'active'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch template data
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/email-templates/${templateId}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
          const template = data.data;
          setFormData({
            name: template.name,
            subject: template.subject,
            message: template.message,
            type: template.type,
            status: template.status
          });
        } else {
          setError(data.error || "Failed to fetch template");
        }
      } catch (error) {
        console.error("Error fetching template:", error);
        setError("Failed to fetch template");
      } finally {
        setLoading(false);
      }
    };

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Email template updated successfully!");
        router.push("/dashboard/email-templates");
      } else {
        alert(data.error || "Failed to update email template");
      }
    } catch (error) {
      console.error("Error updating email template:", error);
      alert("Failed to update email template");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/email-templates");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Email Template</h1>
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Email Template</h1>
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
              Back to Templates
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Edit Email Template</h1>
        <button
          onClick={handleCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Back to Templates
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">Update your email template for automated messaging.</p>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic Template Information */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Template Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Template Name */}
              <div>
                <CustomInput
                  id="name"
                  name="name"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="Enter template name"
                  label="Template Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              {/* Template Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Type <span className="text-red-500">*</span>
                </label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select template type</option>
                  <option value="Lead Follow-up">Lead Follow-up</option>
                  <option value="Welcome">Welcome</option>
                  <option value="Thank You">Thank You</option>
                  <option value="Appointment Confirmation">Appointment Confirmation</option>
                  <option value="Project Update">Project Update</option>
                  <option value="Quote Request">Quote Request</option>
                  <option value="Newsletter">Newsletter</option>
                  <option value="Promotional">Promotional</option>
                </select>
              </div>
            </div>

            {/* Email Subject */}
            <div className="mt-4">
              <CustomInput
                id="subject"
                name="subject"
                width="w-full"
                height="h-[50px]"
                placeholder="Enter email subject line"
                label="Email Subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                border="border border-gray-300 rounded-lg"
                backgroundColor="bg-white"
                padding="py-3 px-4"
              />
            </div>
          </div>

          {/* Email Content */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Email Content</h3>
            
            <div>
              <CustomTextarea
                id="message"
                name="message"
                label="Email Message"
                placeholder="Enter your email message content here..."
                value={formData.message}
                onChange={handleTextareaChange}
                required
                border="border border-gray-300 rounded-lg"
                backgroundColor="bg-white"
                padding="py-3 px-4"
                rows={12}
              />
            </div>

            {/* Template Variables Helper */}
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Available Template Variables:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-green-700">
                <div><code>{'{{name}}'}</code> - Customer name</div>
                {/* <div><code>{'{{email}}'}</code> - Customer email</div>
                <div><code>{'{{phone}}'}</code> - Customer phone</div>
                <div><code>{'{{company}}'}</code> - Company name</div>
                <div><code>{'{{project}}'}</code> - Project name</div>
                <div><code>{'{{date}}'}</code> - Current date</div> */}
              </div>
              <p className="text-xs text-green-600 mt-2">
                Use these variables in your message and they will be automatically replaced with actual values when sending emails.
              </p>
            </div>
          </div>

          {/* Template Status */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Template Status</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleSelectChange}
                required
                className="w-full md:w-1/3 border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Preview Section */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Email Preview</h3>
            
            <div className="bg-white border rounded-lg p-4">
              <div className="border-b pb-2 mb-4">
                <div className="text-sm text-gray-600">Subject:</div>
                <div className="font-medium">{formData.subject || 'Email subject will appear here'}</div>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">Message:</div>
              <div className="whitespace-pre-wrap text-gray-800 min-h-[100px] p-3 bg-gray-50 rounded">
                {formData.message || 'Email message content will appear here as you type...'}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Template'}
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