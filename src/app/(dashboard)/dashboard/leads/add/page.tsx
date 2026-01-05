'use client';

import { useState } from 'react';
import CustomInput from "@/app/components/ui/customInput/customInput";
import CustomTextarea from "@/app/components/ui/customTextarea/customTextarea";

export default function AddLeadPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    source: '',
    status: 'new',
    notes: '',
    address: '',
    preferredContact: 'email'
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
    
    const leadData = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
    };
    
    console.log('Lead Data:', leadData);
    // Here you would send this data to your API
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Add New Lead</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">Add a new potential client to your leads database.</p>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Contact Information */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <CustomInput
                  id="name"
                  name="name"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="Enter full name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              {/* Email */}
              <div>
                <CustomInput
                  id="email"
                  name="email"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="Enter email address"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Phone */}
              <div>
                <CustomInput
                  id="phone"
                  name="phone"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="Enter phone number"
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              {/* Company */}
              <div>
                <CustomInput
                  id="company"
                  name="company"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="Enter company name (optional)"
                  label="Company Name"
                  value={formData.company}
                  onChange={handleInputChange}
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>
            </div>

            {/* Address */}
            <div className="mt-4">
              <CustomTextarea
                id="address"
                name="address"
                label="Address"
                placeholder="Enter project address or client address"
                value={formData.address}
                onChange={handleTextareaChange}
                border="border border-gray-300 rounded-lg"
                backgroundColor="bg-white"
                padding="py-3 px-4"
                rows={2}
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Project Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type <span className="text-red-500">*</span>
                </label>
                <select 
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select project type</option>
                  <option value="Interior Design">Interior Design</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Home Renovation">Home Renovation</option>
                  <option value="Office Design">Office Design</option>
                  <option value="Consultation">Consultation</option>
                  <option value="3D Modeling">3D Modeling</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select 
                  name="budget"
                  value={formData.budget}
                  onChange={handleSelectChange}
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select budget range</option>
                  <option value="Under 50K">Under 50K PKR</option>
                  <option value="50K - 100K">50K - 100K PKR</option>
                  <option value="100K - 250K">100K - 250K PKR</option>
                  <option value="250K - 500K">250K - 500K PKR</option>
                  <option value="500K - 1M">500K - 1M PKR</option>
                  <option value="Above 1M">Above 1M PKR</option>
                  <option value="To be discussed">To be discussed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Timeline
                </label>
                <select 
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleSelectChange}
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select timeline</option>
                  <option value="ASAP">ASAP</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6+ months">6+ months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              {/* Lead Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Source <span className="text-red-500">*</span>
                </label>
                <select 
                  name="source"
                  value={formData.source}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select lead source</option>
                  <option value="Website">Website</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Referral">Referral</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Facebook Ads">Facebook Ads</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lead Management */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Lead Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lead Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Status <span className="text-red-500">*</span>
                </label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal Sent</option>
                  <option value="negotiation">In Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
                <select 
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleSelectChange}
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="in-person">In-Person Meeting</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
              <CustomTextarea
                id="notes"
                name="notes"
                label="Notes & Comments"
                placeholder="Add any additional notes about this lead, their requirements, or conversation history..."
                value={formData.notes}
                onChange={handleTextareaChange}
                border="border border-gray-300 rounded-lg"
                backgroundColor="bg-white"
                padding="py-3 px-4"
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium"
            >
              Add Lead
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