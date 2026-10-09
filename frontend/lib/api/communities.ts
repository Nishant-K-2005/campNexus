import { apiClient } from './apiClient';
import { Community } from '@/types';

export interface CreateCommunityParams {
  name: string;
  description: string;
  tags: string[];
}

export interface GetCommunitiesResponse {
  message: string;
  communities: Community[];
}

export interface CreateCommunityResponse {
  message: string;
  community: Community;
  communityMember: {
    user_id: string;
    community_id: string;
    role: 'Moderator' | 'Member';
    joined_at: string;
  };
}

export const communitiesApi = {
  getCommunities: async (): Promise<Community[]> => {
    const response = await apiClient.get<GetCommunitiesResponse>('/api/communities');
    return response.data.communities;
  },

  createCommunity: async (params: CreateCommunityParams): Promise<CreateCommunityResponse> => {
    const response = await apiClient.post<CreateCommunityResponse>('/api/communities', params);
    return response.data;
  },

  joinCommunity: async (communityId: string): Promise<any> => {
    const response = await apiClient.post(`/api/communities/${communityId}/members`);
    return response.data;
  },

  deleteCommunity: async (communityId: string): Promise<void> => {
    await apiClient.delete(`/api/communities/${communityId}`);
  },
};
