import { create } from 'zustand';
import { User, Profile, NotificationItem } from '@/types';
import { authApi } from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  notifications: NotificationItem[];
  setAuth: (user: User, profile: Profile) => void;
  clearAuth: () => void;
  checkSession: () => Promise<void>;
  updateProfileState: (updatedProfile: Partial<Profile>) => void;
  addNotification: (notif: NotificationItem) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  loadNotifications: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const saveNotifs = (notifs: NotificationItem[]) => {
    if (typeof window !== 'undefined') {
      const userId = get().user?.user_id;
      const key = userId ? `campnexus_notifications_${userId}` : 'campnexus_notifications';
      localStorage.setItem(key, JSON.stringify(notifs));
    }
  };

  return {
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    notifications: [],

    setAuth: (user, profile) =>
      set({
        user,
        profile,
        isAuthenticated: true,
        isLoading: false,
      }),

    clearAuth: () =>
      set({
        user: null,
        profile: null,
        notifications: [],
        isAuthenticated: false,
        isLoading: false,
      }),

    checkSession: async () => {
      set({ isLoading: true });
      try {
        const data = await authApi.getSession();
        if (data && data.user) {
          set({
            user: data.user,
            profile: data.profile,
            isAuthenticated: true,
            isLoading: false,
          });
          get().loadNotifications();
        } else {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    },

    updateProfileState: (updatedProfile) => {
      const currentProfile = get().profile;
      if (currentProfile) {
        set({
          profile: { ...currentProfile, ...updatedProfile },
        });
      }
    },

    loadNotifications: () => {
      if (typeof window !== 'undefined') {
        const userId = get().user?.user_id;
        const key = userId ? `campnexus_notifications_${userId}` : 'campnexus_notifications';
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            set({ notifications: JSON.parse(stored) });
          } catch (e) {
            console.error('Failed to parse notifications from storage:', e);
          }
        } else {
          set({ notifications: [] });
        }
      }
    },

    addNotification: (notif) => {
      const updated = [notif, ...get().notifications];
      set({ notifications: updated });
      saveNotifs(updated);
    },

    markAsRead: (id) => {
      const updated = get().notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      set({ notifications: updated });
      saveNotifs(updated);
    },

    markAllAsRead: () => {
      const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
      set({ notifications: updated });
      saveNotifs(updated);
    },

    deleteNotification: (id) => {
      const updated = get().notifications.filter((n) => n.id !== id);
      set({ notifications: updated });
      saveNotifs(updated);
    },
  };
});
