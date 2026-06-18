/**
 * CampNexus API Client — aligned with Express backend routes
 * Base: http://localhost:5000/api
 * Includes a seamless, high-fidelity Offline/Demo Fallback mode when the backend is offline.
 */

import { toast } from "sonner";

const BASE_URL = "http://localhost:5000/api";

const INITIAL_COMMUNITIES = [
  { community_id: "c1", name: "CS Department", description: "Explore python, software development, and campus courses.", tags: ["Technology", "Engineering", "Academic"], userIsMember: true, role: "Moderator" },
  { community_id: "c2", name: "AI Research Club", description: "Explore the frontiers of AI, deep learning, and vector search.", tags: ["Technology", "AI & ML", "Research"], userIsMember: true, role: "Moderator" },
  { community_id: "c3", name: "Campus General", description: "General discussions, campus updates, and events.", tags: ["General", "Cultural"], userIsMember: true, role: "Member" },
];

const INITIAL_DISCUSSIONS = {
  c1: [
    { post_id: "p1", content: "Has anyone solved task 4 in the DSA lab sheet?", created_at: new Date(Date.now() - 3600000 * 2).toISOString(), status: "Accepted", user: { full_name: "Amit Patel", role: "Student" }, attachments: [], replies: [] },
  ],
  c2: [
    { post_id: "p2", content: "CampNexus relies on pgvector for semantic matching. Let's study cosine similarity math.", created_at: new Date(Date.now() - 3600000 * 4).toISOString(), status: "Accepted", user: { full_name: "Sneha Joshi", role: "Student" }, attachments: [], replies: [] },
  ]
};

const INITIAL_RESOURCES = {
  c1: [
    { post_id: "r1", content: "DSA Lab Sheet 4 Solutions", created_at: new Date(Date.now() - 3600000 * 3).toISOString(), user: { full_name: "Amit Patel" }, attachments: [{ attachment_id: "a1", title: "DSA_Sheet_4.pdf", url: "#", file_size: "1.2 MB" }] }
  ]
};

// Local storage helper
function getStoreItem(key, fallback) {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
}

function setStoreItem(key, val) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
}

// Fallback execution when backend is unreachable
function simulateOffline(path, method, body, formData) {
  console.warn(`[CampNexus API] Server offline. Simulating response for ${method} ${path}`);

  // Fetch or init datasets
  const communities = getStoreItem("campnexus-sim-communities", INITIAL_COMMUNITIES);
  
  // 1. Session check
  if (path === "/auth/session") {
    // Return a default mock session
    return {
      user: {
        user_id: "offline-user",
        email: "demo@campus.edu",
        full_name: "Demo Student",
        role: "Student" // Can be Student, Professor, ClubHead, Admin
      },
      profile: {
        profile_id: "offline-profile",
        bio: "Campus explorer & collaborative student",
        reputation_points: 120,
        open_to_mentoring: true
      }
    };
  }

  // 2. Communities getAll
  if (path === "/communities" && method === "GET") {
    return { communities };
  }

  // 3. Community create
  if (path === "/communities" && method === "POST") {
    const newComm = {
      community_id: `c-${Date.now()}`,
      name: body.name,
      description: body.description,
      tags: body.tags || ["General"],
      userIsMember: true,
      role: "Moderator"
    };
    const updated = [newComm, ...communities];
    setStoreItem("campnexus-sim-communities", updated);
    return { community: newComm };
  }

  // 4. Join community
  if (path.startsWith("/communities/") && path.endsWith("/members") && method === "POST") {
    const cid = path.split("/")[2];
    const updated = communities.map((c) => c.community_id === cid ? { ...c, userIsMember: true } : c);
    setStoreItem("campnexus-sim-communities", updated);
    return { message: "Successfully joined community" };
  }

  // 5. Discussions getAll
  if (path.startsWith("/discussions/")) {
    const cid = path.split("/")[2];
    const discsMap = getStoreItem("campnexus-sim-discussions", INITIAL_DISCUSSIONS);
    return { discussions: discsMap[cid] || [] };
  }

  // 6. Discussion create
  if (path === "/discussions" && method === "POST") {
    const cid = formData.get("communityId");
    const content = formData.get("content");
    const file = formData.get("file");

    const newPost = {
      post_id: `p-${Date.now()}`,
      content,
      created_at: new Date().toISOString(),
      status: "Accepted",
      user: { full_name: "Demo Student", role: "Student" },
      attachments: file ? [{ attachment_id: `a-${Date.now()}`, title: file.name, url: "#" }] : [],
      replies: []
    };

    const discsMap = getStoreItem("campnexus-sim-discussions", INITIAL_DISCUSSIONS);
    if (!discsMap[cid]) discsMap[cid] = [];
    discsMap[cid].unshift(newPost);
    setStoreItem("campnexus-sim-discussions", discsMap);

    return { discussion: newPost };
  }

  // 7. Resources getAll
  if (path.startsWith("/resources/")) {
    const cid = path.split("/")[2];
    const resMap = getStoreItem("campnexus-sim-resources", INITIAL_RESOURCES);
    return { resources: resMap[cid] || [] };
  }

  // 8. Resource upload
  if (path === "/resources" && method === "POST") {
    const cid = formData.get("communityId");
    const title = formData.get("title") || "Untitled Resource";
    const description = formData.get("description") || "";
    const file = formData.get("file");

    const newRes = {
      post_id: `r-${Date.now()}`,
      content: description,
      created_at: new Date().toISOString(),
      user: { full_name: "Demo Student" },
      attachments: [{
        attachment_id: `a-${Date.now()}`,
        title: title || file?.name || "Resource File",
        url: "#",
        file_size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "1.0 MB"
      }]
    };

    const resMap = getStoreItem("campnexus-sim-resources", INITIAL_RESOURCES);
    if (!resMap[cid]) resMap[cid] = [];
    resMap[cid].unshift(newRes);
    setStoreItem("campnexus-sim-resources", resMap);

    return { resource: newRes };
  }

  // 9. Replies getAll
  if (path.startsWith("/replies/")) {
    const pid = path.split("/")[2];
    const repliesMap = getStoreItem("campnexus-sim-replies", {});
    return { replies: repliesMap[pid] || [] };
  }

  // 10. Replies send
  if (path === "/replies" && method === "POST") {
    const pid = body.postId;
    const content = body.content;

    const newReply = {
      reply_id: `rep-${Date.now()}`,
      content,
      created_at: new Date().toISOString(),
      user: { full_name: "Demo Student" }
    };

    const repliesMap = getStoreItem("campnexus-sim-replies", {});
    if (!repliesMap[pid]) repliesMap[pid] = [];
    repliesMap[pid].unshift(newReply);
    setStoreItem("campnexus-sim-replies", repliesMap);

    return { reply: newReply };
  }

  // Fallback default
  return null;
}

async function request(path, { method = "GET", body, formData } = {}) {
  const options = { method, credentials: "include" };

  if (formData) {
    options.body = formData;
  } else if (body) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, options);

    if (res.status === 204) return null;

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const err = new Error(data?.error || `Request failed: ${res.status}`);
      err.status = res.status;
      throw err;
    }

    return data;
  } catch (err) {
    // If it's a TypeError (fetch failed - connection refused)
    if (err instanceof TypeError || err.message?.includes("Failed to fetch") || err.status === 503) {
      const offlineResult = simulateOffline(path, method, body, formData);
      if (offlineResult !== null) {
        return offlineResult;
      }
    }
    throw err;
  }
}

export const api = {
  auth: {
    login: (credentials) => request("/auth/login", { method: "POST", body: credentials }),
    signup: (userData) => request("/auth/signup", { method: "POST", body: userData }),
    logout: () => request("/auth/logout", { method: "POST" }),
    session: () => request("/auth/session"),
    deleteUser: (userId) => request(`/auth/delete/${userId}`, { method: "DELETE" }),
  },

  communities: {
    getAll: () => request("/communities"),
    create: ({ name, description, tags }) =>
      request("/communities", { method: "POST", body: { name, description, tags } }),
    join: (communityId) =>
      request(`/communities/${communityId}/members`, { method: "POST" }),
    delete: (communityId) =>
      request(`/communities/${communityId}`, { method: "DELETE" }),
  },

  discussions: {
    getAll: (communityId) => request(`/discussions/${communityId}`),
    create: ({ communityId, content, file }) => {
      const fd = new FormData();
      fd.append("communityId", communityId);
      fd.append("content", content);
      if (file) fd.append("file", file);
      return request("/discussions", { method: "POST", formData: fd });
    },
    delete: (postId) => request(`/discussions/${postId}`, { method: "DELETE" }),
  },

  resources: {
    getAll: (communityId) => request(`/resources/${communityId}`),
    upload: ({ communityId, title, description, file }) => {
      const fd = new FormData();
      fd.append("communityId", communityId);
      if (title) fd.append("title", title);
      if (description) fd.append("description", description);
      fd.append("file", file);
      return request("/resources", { method: "POST", formData: fd });
    },
    delete: (postId) => request(`/resources/${postId}`, { method: "DELETE" }),
  },

  replies: {
    getAll: (postId, parentId) => {
      const q = parentId ? `?parent_id=${parentId}` : "";
      return request(`/replies/${postId}${q}`);
    },
    send: ({ postId, content, parent_id }) =>
      request("/replies", { method: "POST", body: { postId, content, parent_id } }),
    delete: (replyId) => request(`/replies/${replyId}`, { method: "DELETE" }),
  },
};

export default api;
