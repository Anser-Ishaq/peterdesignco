'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CustomInput from "@/app/components/ui/customInput/customInput";
import CustomTextarea from "@/app/components/ui/customTextarea/customTextarea";
import { useTeam } from '@/app/hooks/useTeam';
import { TeamMember, TeamMemberFormData, TeamRole } from '@/app/types/team';
import { TEAM_ROLES } from '@/app/constants/team';
import { generateSlug, convertFormDataToTeamMember } from '@/app/utils/teamUtils';

// Helper function for URL validation
function isValidUrl(url: string, domain?: string): boolean {
  try {
    const urlObj = new URL(url);
    if (domain) {
      return urlObj.hostname.includes(domain);
    }
    return true;
  } catch {
    return false;
  }
}

export default function EditTeamPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.id as string;

  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: '',
    slug: '',
    role: '' as TeamRole,
    position: '',
    imageUrl: '',
    imagePublicId: '',
    imageAlt: '',
    bioText: '',
    linkedinUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    order: 1,
    status: 'active'
  });

  const [bioPoints, setBioPoints] = useState<string[]>(['']);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);

  const { loading, uploading, fetchTeamMember, updateTeamMember, uploadImage } = useTeam({
    onSuccess: (message) => {
      alert(`Success: ${message}`);
      router.push('/dashboard/team');
    },
    onError: (error) => {
      alert(`Error: ${error}`);
    },
  });

  useEffect(() => {
    if (teamId) {
      loadTeamMember();
    }
  }, [teamId]);

  const loadTeamMember = async () => {
    try {
      setIsLoading(true);
      const member = await fetchTeamMember(teamId);
      setTeamMember(member);
      
      // Populate form with existing data
      setFormData({
        name: member.name,
        slug: member.slug,
        role: member.role,
        position: member.position,
        imageUrl: member.image.url,
        imagePublicId: member.image.publicId,
        imageAlt: member.image.alt || '',
        bioText: member.bio.join('\n'),
        linkedinUrl: member.socialLinks.linkedin || '',
        instagramUrl: member.socialLinks.instagram || '',
        facebookUrl: member.socialLinks.facebook || '',
        order: member.order,
        status: member.status,
      });

      setBioPoints(member.bio.length > 0 ? member.bio : ['']);
      setImagePreview(member.image.url);
    } catch (error) {
      console.error('Failed to load team member:', error);
      alert('Failed to load team member');
      router.push('/dashboard/team');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      const slug = generateSlug(value);
      setFormData({
        ...formData,
        [name]: value,
        slug: slug,
        imageAlt: `${value} - ${formData.position || 'Team Member'}`
      });
    } else if (name === 'position') {
      setFormData({
        ...formData,
        [name]: value,
        imageAlt: `${formData.name} - ${value}`
      });
    } else if (name === 'order') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
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

  const handleImageChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }
      
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      
      setFormData({
        ...formData,
        imageAlt: `${formData.name} - ${formData.position}`
      });
    }
  };

  const addBioPoint = () => {
    setBioPoints([...bioPoints, '']);
  };

  const removeBioPoint = (index: number) => {
    if (bioPoints.length > 1) {
      setBioPoints(bioPoints.filter((_, i) => i !== index));
    }
  };

  const updateBioPoint = (index: number, value: string) => {
    const newBioPoints = [...bioPoints];
    newBioPoints[index] = value;
    setBioPoints(newBioPoints);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      // Validate form
      const validationErrors: string[] = [];
      
      if (!formData.name.trim()) {
        validationErrors.push('Full name is required');
      }
      
      if (!formData.slug.trim()) {
        validationErrors.push('Slug is required');
      } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
        validationErrors.push('Slug can only contain lowercase letters, numbers, and hyphens');
      }
      
      if (!formData.role) {
        validationErrors.push('Role is required');
      }
      
      if (!formData.position.trim()) {
        validationErrors.push('Position/Title is required');
      }
      
      if (!formData.imageUrl && !selectedFile) {
        validationErrors.push('Profile image is required');
      }
      
      if (formData.order < 0) {
        validationErrors.push('Display order cannot be negative');
      }
      
      // Validate URLs if provided
      if (formData.linkedinUrl && !isValidUrl(formData.linkedinUrl, 'linkedin.com')) {
        validationErrors.push('LinkedIn URL must be a valid LinkedIn URL');
      }
      
      if (formData.instagramUrl && !isValidUrl(formData.instagramUrl, 'instagram.com')) {
        validationErrors.push('Instagram URL must be a valid Instagram URL');
      }
      
      if (formData.facebookUrl && !isValidUrl(formData.facebookUrl, 'facebook.com')) {
        validationErrors.push('Facebook URL must be a valid Facebook URL');
      }
      
      const validBioPoints = bioPoints.filter(point => point.trim() !== '');
      if (validBioPoints.length === 0) {
        validationErrors.push('At least one bio point is required');
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      let imageData = {
        url: formData.imageUrl,
        publicId: formData.imagePublicId,
      };

      // Upload new image if selected
      if (selectedFile) {
        const uploadResult = await uploadImage(selectedFile);
        imageData = {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
        };
      }

      // Prepare team member data
      const teamMemberData = convertFormDataToTeamMember({
        ...formData,
        imageUrl: imageData.url,
        imagePublicId: imageData.publicId,
        bioText: validBioPoints.join('\n'),
      });

      // Update team member
      await updateTeamMember(teamId, teamMemberData);

    } catch (error) {
      console.error('Failed to update team member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoadingState = loading || uploading || isSubmitting || isLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading team member...</div>
      </div>
    );
  }

  if (!teamMember) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Team member not found</h2>
          <button
            onClick={() => router.push('/dashboard/team')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Team
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Edit Team Member</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Team
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">Update team member information.</p>
        
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Basic Information</h3>
            
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

              {/* Auto-generated Slug */}
              <div>
                <CustomInput
                  id="slug"
                  name="slug"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="auto-generated-from-name"
                  label="URL Slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-gray-100"
                  padding="py-3 px-4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select role</option>
                  {TEAM_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Position */}
              <div>
                <CustomInput
                  id="position"
                  name="position"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="e.g., Lead Architect, Senior Designer"
                  label="Position/Title"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Profile Image</h3>
            
            <CustomInput
              label="Profile Photo (Leave empty to keep current image)"
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              onFileChange={handleImageChange}
              border="border border-gray-300 rounded-lg"
              backgroundColor="bg-white"
              padding="py-3 px-4"
            />
            
            <p className="text-sm text-gray-600 mt-2">
              Supported formats: JPEG, PNG, WebP. Max size: 5MB
            </p>
            
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {selectedFile ? 'New Image Preview:' : 'Current Image:'}
                </p>
                <img 
                  src={imagePreview} 
                  alt={formData.imageAlt}
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Bio Information */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Bio Information</h3>
            
            <div className="space-y-3">
              {bioPoints.map((bioPoint, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <CustomTextarea
                      id={`bio-${index}`}
                      name={`bio-${index}`}
                      placeholder={`Bio point ${index + 1}...`}
                      value={bioPoint}
                      onChange={(e) => updateBioPoint(index, e.target.value)}
                      border="border border-gray-300 rounded-lg"
                      backgroundColor="bg-white"
                      padding="py-3 px-4"
                      rows={2}
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <button
                      type="button"
                      onClick={addBioPoint}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      title="Add bio point"
                    >
                      +
                    </button>
                    {bioPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBioPoint(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        title="Remove bio point"
                      >
                        -
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">Social Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* LinkedIn */}
              <div>
                <CustomInput
                  id="linkedinUrl"
                  name="linkedinUrl"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="https://linkedin.com/in/username"
                  label="LinkedIn URL"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              {/* Instagram */}
              <div>
                <CustomInput
                  id="instagramUrl"
                  name="instagramUrl"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="https://instagram.com/username"
                  label="Instagram URL"
                  type="url"
                  value={formData.instagramUrl}
                  onChange={handleInputChange}
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              {/* Facebook */}
              <div>
                <CustomInput
                  id="facebookUrl"
                  name="facebookUrl"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="https://facebook.com/username"
                  label="Facebook URL"
                  type="url"
                  value={formData.facebookUrl}
                  onChange={handleInputChange}
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>
            </div>
          </div>

          {/* Order and Status */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Display Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Display Order */}
              <div>
                <CustomInput
                  id="order"
                  name="order"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="1"
                  label="Display Order"
                  type="number"
                  min="0"
                  value={formData.order.toString()}
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
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoadingState}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingState ? 'Updating...' : 'Update Team Member'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoadingState}
              className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}