import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UIState } from '../types';

interface UIActions {
  setTheme: (theme: 'dark' | 'light') => void;
  setHighContrast: (enabled: boolean) => void;
  setUIScale: (scale: number) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSplitView: (enabled: boolean) => void;
  setSelectedRuns: (runs: string[]) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  toggleSplitView: () => void;
}

const initialState: UIState = {
  theme: 'dark',
  highContrast: false,
  uiScale: 100,
  sidebarCollapsed: false,
  activeTab: 'simulation',
  splitView: false,
  selectedRuns: [],
};

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setTheme: (theme) => set({ theme }),
      
      setHighContrast: (enabled) => set({ highContrast: enabled }),
      
      setUIScale: (scale) => set({ uiScale: Math.max(50, Math.min(200, scale)) }),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setSplitView: (enabled) => set({ splitView: enabled }),
      
      setSelectedRuns: (runs) => set({ selectedRuns: runs }),
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      toggleSplitView: () => set((state) => ({ 
        splitView: !state.splitView 
      })),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        highContrast: state.highContrast,
        uiScale: state.uiScale,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
