import { create } from "zustand";
import type { User } from "../types";
import { mockStudentUser, mockTeacherUser } from "../mock/data";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: (email: string, _password: string) => {
    // 목 데이터로 로그인 처리
    let user: User;
    if (email.includes("student")) {
      user = mockStudentUser;
    } else if (email.includes("teacher")) {
      user = mockTeacherUser;
    } else {
      user = mockStudentUser; // 기본값
    }

    set({ user, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
