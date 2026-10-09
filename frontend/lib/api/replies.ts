import { apiClient } from './apiClient';
import { Reply } from '@/types';

export interface CreateReplyParams {
  postId: string;
  content: string;
  parent_id?: string | null;
}

export interface GetRepliesResponse {
  message: string;
  replies: Reply[];
}

export interface CreateReplyResponse {
  message: string;
  reply: Reply;
}

export const repliesApi = {
  getReplies: async (postId: string, parentId?: string | null): Promise<Reply[]> => {
    const params: Record<string, string> = {};
    if (parentId) {
      params.parent_id = parentId;
    }
    const response = await apiClient.get<GetRepliesResponse>(`/api/replies/${postId}`, { params });
    return response.data.replies;
  },

  createReply: async (params: CreateReplyParams): Promise<CreateReplyResponse> => {
    const response = await apiClient.post<CreateReplyResponse>('/api/replies', params);
    return response.data;
  },

  deleteReply: async (replyId: string): Promise<void> => {
    await apiClient.delete(`/api/replies/${replyId}`);
  },
};
