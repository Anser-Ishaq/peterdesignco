'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTeam } from '@/app/hooks/useTeam';
import { TeamMember, TeamRole } from '@/app/types/team';
import { TEAM_ROLES } from '@/app/constants/team';
import { getRoleDisplayName } from '@/app/utils/teamUtils';

export default function TeamListingPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedRole, setSelectedRole] = useState<TeamRole | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive' | 'all'>('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { loading, fetchTeamMembers, deleteTeamMember } = useTeam({
    onSuccess: (message) => {
      console.log('Success:', message);
      loadTeamMembers(); // Reload after successful operations
    },
    onError: (error) => {
      console.error('Error:', error);
      alert(`Error: ${error}`);
    },
  });

  useEffect(() => {
    loadTeamMembers();
  }, [selectedRole, selectedStatus, currentPage]);

  const loadTeamMembers = async () => {
    try {
      const response = await fetchTeamMembers({
        role: selectedRole,
        status: selectedStatus,
        page: currentPage,
        limit: 12,
      });
      
      if (response.data && Array.isArray(response.data)) {
        setTeamMembers(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
        }
      }
    } catch (error) {
      console.error('Failed to load team members:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(id);
    try {
      await deleteTeamMember(id);
    } catch (error) {
      console.error('Failed to delete team member:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Team Listing</h1>
        <Link 
          href="/dashboard/team/add"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Team Member
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div>
            <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Role:
            </label>
            <select
              id="role-filter"
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value as TeamRole | 'all');
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              {TEAM_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status:
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as 'active' | 'inactive' | 'all');
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="ml-auto">
            <p className="text-sm text-gray-600">
              {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-gray-600">Loading team members...</div>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No team members found with the selected filters.</p>
            <Link 
              href="/dashboard/team/add"
              className="inline-block mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add First Team Member
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div key={member._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={member.image.url}
                      alt={member.image.alt || `${member.name} - ${member.position}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-avatar.png'; // Fallback image
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-blue-600 text-sm">{member.position}</p>
                      <p className="text-gray-500 text-xs capitalize">
                        {getRoleDisplayName(member.role)}
                      </p>
                    </div>
                  </div>

                  {member.bio.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {member.bio[0].length > 100 
                          ? `${member.bio[0].substring(0, 100)}...` 
                          : member.bio[0]
                        }
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-wrap mb-4">
                    <div className="flex space-x-2">
                      {member.socialLinks.linkedin && (
                        <a
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          LinkedIn
                        </a>
                      )}
                      {member.socialLinks.instagram && (
                        <a
                          href={member.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-800 text-xs"
                        >
                          Instagram
                        </a>
                      )}
                      {member.socialLinks.facebook && (
                        <a
                          href={member.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:text-blue-900 text-xs"
                        >
                          Facebook
                        </a>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status}
                      </span>
                      <span className="text-xs text-gray-500">#{member.order}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/team/edit/${member._id}`}
                      className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm hover:bg-blue-200 text-center transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(member._id, member.name)}
                      disabled={isDeleting === member._id}
                      className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      {isDeleting === member._id ? 'Deleting...' : 'Remove'}
                    </button>
                  </div>

                  {/* Admin info */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Created by: {member.createdBy.name}</p>
                      <p>Updated: {new Date(member.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      currentPage === page
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}