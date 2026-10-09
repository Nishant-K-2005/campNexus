import { apiClient } from './apiClient';
import { Post } from '@/types';

export interface UploadResourceParams {
  title: string;
  description: string;
  communityId: string;
  file: File;
}

export interface GetResourcesResponse {
  message: string;
  resources: Post[];
}

export interface UploadResourceResponse {
  message: string;
  resource: Post;
  attachment: any;
}

export const resourcesApi = {
  getResources: async (communityId: string): Promise<Post[]> => {
    const response = await apiClient.get<GetResourcesResponse>(`/api/resources/${communityId}`);
    return response.data.resources;
  },

  uploadResource: async ({ title, description, communityId, file }: UploadResourceParams): Promise<UploadResourceResponse> => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('communityId', communityId);
    formData.append('file', file);

    const response = await apiClient.post<UploadResourceResponse>('/api/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteResource: async (postId: string): Promise<void> => {
    await apiClient.delete(`/api/resources/${postId}`);
  },
};
