import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("stramApp-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("stramApp-theme", theme);
    set({ theme });
  },
}));
