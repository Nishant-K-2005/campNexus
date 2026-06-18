import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

const useActivityStore = create(
  persist(
    (set, get) => ({
      // State
      notifications: [
        {
          id: "initial-1",
          type: "Reputation",
          text: "Welcome to CampNexus! You earned 10 starter reputation points.",
          time: new Date(Date.now() - 3600000 * 2).toISOString(), // 2h ago
          read: false,
          category: "reputation",
          icon: "⭐",
          color: "var(--cn-primary)"
        },
        {
          id: "initial-2",
          type: "Declaration",
          text: "IT Department: Campus Wi-Fi maintenance scheduled for tonight.",
          time: new Date(Date.now() - 3600000 * 5).toISOString(), // 5h ago
          read: true,
          category: "declarations",
          icon: "📣",
          color: "var(--cn-danger)"
        }
      ],
      activities: [
        { id: "act-1", text: "Joined CampNexus", time: "2h ago", type: "community", icon: "🎉", color: "#6366F1" },
        { id: "act-2", text: "Saved Python Notes.pdf", time: "1h ago", type: "resource", icon: "📄", color: "#10B981" }
      ],
      reputation: 10,
      xp: 150,
      level: 1,
      streak: 3,
      badges: [
        { id: "starter", title: "Fresh Nexus", desc: "Signed up on CampNexus", icon: "🌱", date: "Just now" }
      ],
      socketConnected: false,

      // Actions
      addNotification: (notif) => {
        const newNotif = {
          id: notif.id || `${Date.now()}-${Math.random()}`,
          type: notif.type || "Activity",
          text: notif.text,
          time: notif.time || new Date().toISOString(),
          read: false,
          category: notif.category || "activity",
          icon: notif.icon || "🔔",
          color: notif.color || "var(--cn-primary)"
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications].slice(0, 50)
        }));
      },

      addActivity: (act) => {
        const newAct = {
          id: act.id || `${Date.now()}-${Math.random()}`,
          text: act.text,
          time: act.time || "just now",
          type: act.type || "activity",
          icon: act.icon || "⚡",
          color: act.color || "#6366F1"
        };
        set((state) => ({
          activities: [newAct, ...state.activities].slice(0, 30)
        }));
      },

      markRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },

      markAllRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true }))
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      updateReputation: (points, source = "") => {
        set((state) => {
          const newRep = Math.max(0, state.reputation + points);
          const newXp = state.xp + (points * 15);
          const newLevel = Math.floor(newXp / 500) + 1;
          const nextNotifications = [...state.notifications];
          const nextActivities = [...state.activities];

          // Add reputation notification
          const msg = `Reputation updated: ${points > 0 ? "+" : ""}${points} points (${source || "contribution"})`;
          nextNotifications.unshift({
            id: `rep-${Date.now()}-${Math.random()}`,
            type: "Reputation",
            text: msg,
            time: new Date().toISOString(),
            read: false,
            category: "reputation",
            icon: "⭐",
            color: "var(--cn-warning)"
          });

          // Add activity for reputation update
          nextActivities.unshift({
            id: `act-rep-${Date.now()}`,
            text: msg,
            time: "just now",
            type: "reputation",
            icon: "⭐",
            color: "#F59E0B"
          });

          // Level up check
          if (newLevel > state.level) {
            toast.success(`🎉 Level Up! You reached Level ${newLevel}!`);
            nextNotifications.unshift({
              id: `lvl-${newLevel}-${Date.now()}`,
              type: "Reputation",
              text: `Congratulations! You unlocked Level ${newLevel} Badge!`,
              time: new Date().toISOString(),
              read: false,
              category: "reputation",
              icon: "🏆",
              color: "var(--cn-warning)"
            });
            nextActivities.unshift({
              id: `act-lvl-${newLevel}-${Date.now()}`,
              text: `Unlocked Level ${newLevel} Badge`,
              time: "just now",
              type: "badge",
              icon: "🏆",
              color: "#F59E0B"
            });
          }

          return {
            reputation: newRep,
            xp: newXp,
            level: newLevel,
            notifications: nextNotifications.slice(0, 50),
            activities: nextActivities.slice(0, 30)
          };
        });
      },

      unlockBadge: (badge) => {
        set((state) => {
          if (state.badges.some((b) => b.id === badge.id)) return {};
          const newBadge = {
            id: badge.id,
            title: badge.title,
            desc: badge.desc,
            icon: badge.icon || "🏅",
            date: new Date().toLocaleDateString()
          };
          
          toast.success(`🏅 Badge Unlocked: ${badge.title}!`);

          const nextNotifications = [...state.notifications];
          nextNotifications.unshift({
            id: `badge-${Date.now()}-${Math.random()}`,
            type: "Reputation",
            text: `Badge Unlocked: ${badge.title} - ${badge.desc || ""}`,
            time: new Date().toISOString(),
            read: false,
            category: "reputation",
            icon: badge.icon || "🏅",
            color: "#8B5CF6"
          });

          const nextActivities = [...state.activities];
          nextActivities.unshift({
            id: `act-badge-${Date.now()}`,
            text: `Unlocked Badge: ${badge.title}`,
            time: "just now",
            type: "badge",
            icon: badge.icon || "🏅",
            color: "#8B5CF6"
          });

          return {
            badges: [...state.badges, newBadge],
            notifications: nextNotifications.slice(0, 50),
            activities: nextActivities.slice(0, 30)
          };
        });
      },

      incrementStreak: () => {
        set((state) => ({ streak: state.streak + 1 }));
      },

      // Socket Listeners Handler
      initSocketListeners: (socket) => {
        if (!socket) return;
        if (get().socketConnected) return;

        console.log("[Socket Store] Initializing all listeners");
        set({ socketConnected: true });

        // 1. notification:new
        socket.on("notification:new", (data) => {
          get().addNotification({
            type: "Activity",
            text: data.message || "New activity notification",
            category: "activity",
            icon: "🔔",
            color: "var(--cn-primary)"
          });
          toast.info(data.message || "New activity notification");
        });

        // 2. declaration:new
        socket.on("declaration:new", (data) => {
          get().addNotification({
            type: "Declaration",
            text: `Announcement in ${data.communityName || "Campus"}: ${data.title}`,
            category: "declarations",
            icon: "📣",
            color: "var(--cn-danger)"
          });
          get().addActivity({
            text: `New declaration: ${data.title}`,
            type: "declaration",
            icon: "📣",
            color: "#EF4444"
          });
          toast.error(`📣 New announcement: ${data.title}`, { duration: 6000 });
        });

        // 3. discussion:new
        socket.on("discussion:new", (data) => {
          const txt = `New post in ${data.communityName}: "${data.title}"`;
          get().addNotification({
            type: "Discussion",
            text: txt,
            category: "discussions",
            icon: "💬",
            color: "#6366F1"
          });
          get().addActivity({
            text: txt,
            type: "discussion",
            icon: "💬",
            color: "#6366F1"
          });
          toast.info(txt);
        });

        // 4. discussion:comment
        socket.on("discussion:comment", (data) => {
          get().addNotification({
            type: "Discussion",
            text: `${data.userName} commented on your post`,
            category: "discussions",
            icon: "💬",
            color: "var(--cn-primary)"
          });
          toast.info(`${data.userName} commented on your post`);
        });

        // 5. resource:new
        socket.on("resource:new", (data) => {
          const txt = `Resource uploaded in ${data.communityName}: ${data.title}`;
          get().addNotification({
            type: "Resource",
            text: txt,
            category: "resources",
            icon: "📄",
            color: "#10B981"
          });
          get().addActivity({
            text: txt,
            type: "resource",
            icon: "📄",
            color: "#10B981"
          });
          toast.success(txt);
        });

        // 6. community:new
        socket.on("community:new", (data) => {
          const txt = `New community created: ${data.name}`;
          get().addNotification({
            type: "Community",
            text: txt,
            category: "activity",
            icon: "🏛️",
            color: "#8B5CF6"
          });
          get().addActivity({
            text: txt,
            type: "community",
            icon: "🏛️",
            color: "#8B5CF6"
          });
          toast.success(txt);
        });

        // 7. community:memberJoined
        socket.on("community:memberJoined", (data) => {
          const txt = `${data.userName} joined ${data.communityName}`;
          get().addNotification({
            type: "Community",
            text: txt,
            category: "activity",
            icon: "👥",
            color: "#06B6D4"
          });
          get().addActivity({
            text: txt,
            type: "community",
            icon: "👥",
            color: "#06B6D4"
          });
          toast.info(txt);
        });

        // 8. moderation:pending
        socket.on("moderation:pending", (data) => {
          get().addNotification({
            type: "AI Moderation",
            text: `Post is undergoing AI audit...`,
            category: "moderation",
            icon: "🤖",
            color: "var(--cn-warning)"
          });
        });

        // 9. moderation:approved
        socket.on("moderation:approved", (data) => {
          get().addNotification({
            type: "AI Moderation",
            text: `Post Approved! Match similarity score: ${data.similarityScore || 87}%`,
            category: "moderation",
            icon: "✅",
            color: "var(--cn-success)"
          });
          get().addActivity({
            text: `Post approved by AI moderation`,
            type: "moderation",
            icon: "✅",
            color: "#10B981"
          });
          get().updateReputation(10, "Post Approved");
          toast.success(`✅ Post Approved! similarity score: ${data.similarityScore || 87}%`);
        });

        // 10. moderation:rejected
        socket.on("moderation:rejected", (data) => {
          get().addNotification({
            type: "AI Moderation",
            text: `Post Rejected: ${data.reason || "Did not pass community criteria."}`,
            category: "moderation",
            icon: "❌",
            color: "var(--cn-danger)"
          });
          toast.error(`❌ Post Rejected: ${data.reason || "Violated guidelines"}`);
        });

        // 11. reputation:updated
        socket.on("reputation:updated", (data) => {
          get().updateReputation(data.points, data.reason);
          toast.success(`⭐ Reputation updated: ${data.points > 0 ? "+" : ""}${data.points} points (${data.reason || "contribution"})`);
        });

        // 12. badge:unlocked
        socket.on("badge:unlocked", (data) => {
          get().unlockBadge({
            id: data.badgeId,
            title: data.badgeTitle,
            desc: data.badgeDesc,
            icon: data.badgeIcon
          });
        });
      },

      clearSocketListeners: (socket) => {
        if (!socket) return;
        socket.off("notification:new");
        socket.off("declaration:new");
        socket.off("discussion:new");
        socket.off("discussion:comment");
        socket.off("resource:new");
        socket.off("community:new");
        socket.off("community:memberJoined");
        socket.off("moderation:pending");
        socket.off("moderation:approved");
        socket.off("moderation:rejected");
        socket.off("reputation:updated");
        socket.off("badge:unlocked");
        set({ socketConnected: false });
        console.log("[Socket Store] Cleared all listeners");
      }
    }),
    {
      name: "campnexus-activity-storage",
      partialize: (state) => ({
        notifications: state.notifications,
        activities: state.activities,
        reputation: state.reputation,
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        badges: state.badges
      })
    }
  )
);

export default useActivityStore;
