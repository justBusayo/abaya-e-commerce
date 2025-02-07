import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  // Fetch authenticated user using the token from localStorage
  fetchAuthenticatedUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("res 112", response);

      if (response.ok) {
        const user = await response.json(); // Extract user details from the response
        console.log("user 115", user);
        set({ user }); // Set user in state
        return user;
      } else {
        set({ user: null }); // Reset user if no user found
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch authenticated user:", error);
      set({ user: null }); // Reset user on error
      return null;
    }
  },

  // Initialize the user and authentication state from localStorage
  initialize: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ isAuthenticated: true }); // If token exists, user is authenticated
      await useUserStore.getState().fetchAuthenticatedUser(); // Fetch and set user details
    } else {
      set({ isAuthenticated: false, user: null }); // No token, reset everything
    }
  },

  register: async (data) => {
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const user = await response.json();
        return { user, success: true, message: "Registration successful" };
      }
      return { success: false, message: "Registration failed" };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },

  login: async (data) => {
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("token", user.token); // Save token to localStorage
        set({ user, isAuthenticated: true });
        return { success: true, message: "Login successful" };
      }
      return { success: false, message: "Login failed" };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },

  socialLogin: async (provider) => {
    try {
      // const response = await fetch(`/api/users/${provider}`, {
      //   method: "GET",
      //   credentials: "include", // For handling cookies if needed
      // });
      window.location.href = `/api/users/${provider}`

      // if (response.ok) {
      //   const user = await response.json();
      //   localStorage.setItem("token", user.token);
      //   set({ user, isAuthenticated: true });
      //   return { success: true, message: `${provider} login successful` };
      // }
      // return { success: false, message: `${provider} login failed` };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },

  logout: async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "POST",
      });

      if (response.ok) {
        localStorage.removeItem("token"); // Remove token from localStorage
        set({ user: null, isAuthenticated: false });
        return { success: true, message: "Logout successful" };
      }
      return { success: false, message: "Logout failed" };
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },

  getUserDetails: () => {
    return useUserStore.getState().user;
  },
}));

export default useUserStore;
