import { useState, useCallback } from 'react';
import { TeamMember, TeamApiResponse, ImageUploadResponse, TeamRole } from '@/app/types/team';

interface UseTeamOptions {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export function useTeam(options: UseTeamOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchTeamMembers = useCallback(async (params?: {
    status?: 'active' | 'inactive' | 'all';
    role?: TeamRole | 'all';
    limit?: number;
    page?: number;
  }): Promise<TeamApiResponse> => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      
      if (params?.status) searchParams.set('status', params.status);
      if (params?.role) searchParams.set('role', params.role);
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.page) searchParams.set('page', params.page.toString());

      const response = await fetch(`/api/team?${searchParams.toString()}`);
      const data: TeamApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch team members');
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team members';
      options.onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const fetchTeamMember = useCallback(async (id: string): Promise<TeamMember> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/team/${id}`);
      const data: TeamApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch team member');
      }

      return data.data as TeamMember;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team member';
      options.onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const createTeamMember = useCallback(async (teamMemberData: any): Promise<TeamMember> => {
    setLoading(true);
    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamMemberData),
      });

      const data: TeamApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create team member');
      }

      options.onSuccess?.(data.message || 'Team member created successfully');
      return data.data as TeamMember;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create team member';
      options.onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const updateTeamMember = useCallback(async (id: string, teamMemberData: any): Promise<TeamMember> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamMemberData),
      });

      const data: TeamApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update team member');
      }

      options.onSuccess?.(data.message || 'Team member updated successfully');
      return data.data as TeamMember;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update team member';
      options.onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const deleteTeamMember = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
      });

      const data: TeamApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete team member');
      }

      options.onSuccess?.(data.message || 'Team member deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete team member';
      options.onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const uploadImage = useCallback(async (file: File): Promise<{
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  }> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/team/upload', {
        method: 'POST',
        body: formData,
      });

      const data: ImageUploadResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      options.onSuccess?.(data.message || 'Image uploaded successfully');
      return data.data!;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      options.onError?.(errorMessage);
      throw error;
    } finally {
      setUploading(false);
    }
  }, [options]);

  return {
    loading,
    uploading,
    fetchTeamMembers,
    fetchTeamMember,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    uploadImage,
  };
}