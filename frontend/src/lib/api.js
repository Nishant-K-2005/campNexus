/**
 * CampNexus API Client
 * Centralised fetch wrapper for the Express backend at http://localhost:5000
 */

const BASE_URL = "http://localhost:5000/api";

async function request(path, { method = "GET", body, formData } = {}) {
  const options = {
    method,
    credentials: "include",
  };

  if (formData) {
    // Let the browser set multipart Content-Type with boundary automatically
    options.body = formData;
  } else if (body) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return data;
}

// ─── AUTH ─────────────────────────────────────────────
export const api = {
  auth: {
    login: (credentials) =>
      request("/auth/login", { method: "POST", body: credentials }),
    signup: (userData) =>
      request("/auth/signup", { method: "POST", body: userData }),
    logout: () => request("/auth/logout", { method: "POST" }),
    session: () => request("/auth/session"),
  },

  // ─── COMMUNITIES ────────────────────────────────────
  communities: {
    getAll: () => request("/community/getCommunities"),
    create: ({ name, description, tags }) =>
      request("/community/createCommunity", {
        method: "POST",
        body: { name, description, tags },
      }),
    join: (communityId) =>
      request("/community/joinCommunity", {
        method: "POST",
        body: { communityId },
      }),
  },

  // ─── DISCUSSIONS ─────────────────────────────────────
  discussions: {
    getAll: (communityId) =>
      request(`/discussions/getDiscussions/${communityId}`),
    create: ({ communityId, content, file }) => {
      const fd = new FormData();
      fd.append("communityId", communityId);
      fd.append("content", content);
      if (file) fd.append("file", file);
      return request("/discussions/startDiscussion", {
        method: "POST",
        formData: fd,
      });
    },
  },

  // ─── RESOURCES ───────────────────────────────────────
  resources: {
    getAll: (communityId) =>
      request(`/resources/getResources/${communityId}`),
    upload: ({ communityId, title, description, file }) => {
      const fd = new FormData();
      fd.append("communityId", communityId);
      if (title) fd.append("title", title);
      if (description) fd.append("description", description);
      fd.append("file", file);
      return request("/resources/uploadResource", {
        method: "POST",
        formData: fd,
      });
    },
  },

  // ─── REPLIES ─────────────────────────────────────────
  replies: {
    getAll: (postId) => request(`/replies/getReplies/${postId}`),
    send: ({ postId, content }) =>
      request("/replies/sendReply", {
        method: "POST",
        body: { postId, content },
      }),
  },
};

export default api;
