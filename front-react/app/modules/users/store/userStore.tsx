import { create } from "zustand";
import { User, UserState } from "../interfaces";

export const useUserStore = create<UserState>((set) => ({
  users: [] as User[],
  pagination: null,
  setUsers: (users) => set({ users }),
  setPagination: (pagination) => set({ pagination }),
}));