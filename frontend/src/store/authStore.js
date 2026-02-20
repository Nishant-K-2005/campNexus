import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }

          set({
            user: data.user,
            profile: data.profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success("Login successful! Welcome back!");

          return data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
            user: null,
            profile: null,
            isAuthenticated: false,
          });

          toast.error(error.message || "Login failed. Please try again.");

          throw error;
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Signup failed');
          }

          set({
            user: data.user,
            profile: data.profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success("Account created successfully! Welcome to CampNexus!");

          return data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
            user: null,
            profile: null,
            isAuthenticated: false,
          });

          toast.error(error.message || "Signup failed. Please try again.");

          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await fetch('http://localhost:5000/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          toast.info("Logged out successfully!");
        }
      },

      checkSession: async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth/session', {
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            set({
              user: data.user,
              profile: data.profile,
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          console.error('Session check error:', error);
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
