'use client';

import { useState } from 'react';
import CustomInput from "@/app/components/ui/customInput/customInput";
import CustomTextarea from "@/app/components/ui/customTextarea/customTextarea";

export default function AddEmailTemplatePage() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: '',
    type: '',
    status: 'active'
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const templateData = {
      id: Date.now(),
      name: formData.name,
      subject: formData.subject,
      message: formData.message,
      type: formData.type,
      status: formData.status,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    
    console.log('Email Template Data:', templateData);
    // Here you would send this data to your API
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Create Email Template</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">Create a new email template for automated messaging.</p>
        
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
                <div><code>{'{{email}}'}</code> - Customer email</div>
                <div><code>{'{{phone}}'}</code> - Customer phone</div>
                <div><code>{'{{company}}'}</code> - Company name</div>
                <div><code>{'{{project}}'}</code> - Project name</div>
                <div><code>{'{{date}}'}</code> - Current date</div>
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
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium"
            >
              Create Template
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 font-medium"
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="bg-red-100 text-red-700 px-8 py-3 rounded-lg hover:bg-red-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}