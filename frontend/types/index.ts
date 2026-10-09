export type UserRole = 'Student' | 'Professor' | 'Club Head' | 'ClubHead' | 'Admin';

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  deleted_at?: string | null;
}

export interface Profile {
  user_id: string;
  bio: string | null;
  interested_tags: string[];
  reputation_points: number;
  open_to_mentoring: boolean;
  portfolio_link: string | null;
}

export interface Community {
  community_id: string;
  name: string;
  description: string | null;
  tags: string[];
  created_by_user_id: string;
  deleted_at?: string | null;
  role?: 'Member' | 'Moderator'; // Member role within the community if joined
}

export type PostType = 'Discussion' | 'Resource' | 'Announcement';
export type PostStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Flagged';

export interface PostAttachment {
  attachment_id: string;
  post_id: string;
  type: 'Doc' | 'Image' | 'Link';
  url: string;
  title: string;
  file_size?: string | null;
  isVerified: boolean;
}

export interface Post {
  post_id: string;
  user_id: string;
  community_id: string;
  content: string;
  type: PostType;
  status: PostStatus;
  created_at: string;
  deleted_at?: string | null;
  user?: {
    user_id: string;
    full_name: string;
    email: string;
    role: UserRole;
  };
  attachments?: PostAttachment[];
}

export interface Reply {
  reply_id: string;
  post_id: string;
  user_id: string;
  content: string;
  depth: number;
  created_at: string;
  parent_id?: string | null;
  deleted_at?: string | null;
  user?: {
    user_id: string;
    email: string;
    full_name: string;
    role: UserRole;
  };
}

export interface LLMAuditLog {
  log_id: string;
  post_id: string;
  decision: 'Accepted' | 'Rejected' | 'Flagged';
  reason?: string | null;
  confidenceScore: number;
  processed_at: string;
}

export interface FlagReport {
  report_id: string;
  post_id: string;
  reporter_user_id: string;
  reason: string;
  status: 'Open' | 'Resolved' | 'Dismissed';
}

export interface SocketModerationData {
  userId: string;
  postId: string;
  status: PostStatus;
  message: string;
}

export interface NotificationItem {
  id: string;
  postId: string;
  status: 'Accepted' | 'Rejected' | 'Pending';
  message: string;
  timestamp: string;
  isRead: boolean;
}
