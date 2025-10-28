import { toast } from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios.js";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Password do not match");
    }

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data, loading: false });
      toast.success("Account created successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response.data.message || "An error occurred, Pls try again later"
      );
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data, loading: false });
      toast.success("Login successful");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response.data.message || "An error occurred, Pls try again later"
      );
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success("Logout successful");
    } catch (error) {
      toast.error(
        error.response.data.message || "An error occurred, Pls try again later"
      );
    }
  },

  //protected function to navigate user to home if they are authorized
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },
}));

//TODO Implement the axios interceptors for refreshing the access token in every 15 min