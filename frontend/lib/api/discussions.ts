import { apiClient } from './apiClient';
import { Post } from '@/types';

export interface CreateDiscussionParams {
  communityId: string;
  content: string;
  file?: File | null;
}

export interface GetDiscussionsResponse {
  message: string;
  discussions: Post[];
}

export interface GetDiscussionResponse {
  message: string;
  discussion: Post;
}

export interface CreateDiscussionResponse {
  message: string;
  discussion: Post;
  attachment?: any;
}

export const discussionsApi = {
  getDiscussions: async (communityId: string): Promise<Post[]> => {
    const response = await apiClient.get<GetDiscussionsResponse>(`/api/discussions/${communityId}`);
    return response.data.discussions;
  },

  getDiscussion: async (postId: string): Promise<Post> => {
    const response = await apiClient.get<GetDiscussionResponse>(`/api/discussions/post/${postId}`);
    return response.data.discussion;
  },

  createDiscussion: async ({ communityId, content, file }: CreateDiscussionParams): Promise<CreateDiscussionResponse> => {
    const formData = new FormData();
    formData.append('communityId', communityId);
    formData.append('content', content);
    if (file) {
      formData.append('file', file);
    }
    const response = await apiClient.post<CreateDiscussionResponse>('/api/discussions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteDiscussion: async (postId: string): Promise<void> => {
    await apiClient.delete(`/api/discussions/${postId}`);
  },
};

