import { renderHook, act } from '@testing-library/react';
import { useUIStore } from '../uiStore';

describe('UI Store', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset store to initial state
    useUIStore.setState({
      theme: 'dark',
      highContrast: false,
      uiScale: 100,
      sidebarCollapsed: false,
      activeTab: 'simulation',
      splitView: false,
      selectedRuns: [],
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useUIStore());
    
    expect(result.current.theme).toBe('dark');
    expect(result.current.highContrast).toBe(false);
    expect(result.current.uiScale).toBe(100);
    expect(result.current.sidebarCollapsed).toBe(false);
    expect(result.current.activeTab).toBe('simulation');
    expect(result.current.splitView).toBe(false);
    expect(result.current.selectedRuns).toEqual([]);
  });

  it('should set theme', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setTheme('light');
    });
    
    expect(result.current.theme).toBe('light');
  });

  it('should toggle theme', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe('light');
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe('dark');
  });

  it('should set high contrast', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setHighContrast(true);
    });
    
    expect(result.current.highContrast).toBe(true);
  });

  it('should set UI scale with bounds', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setUIScale(150);
    });
    
    expect(result.current.uiScale).toBe(150);
    
    act(() => {
      result.current.setUIScale(25); // Below minimum
    });
    
    expect(result.current.uiScale).toBe(50); // Should clamp to minimum
    
    act(() => {
      result.current.setUIScale(250); // Above maximum
    });
    
    expect(result.current.uiScale).toBe(200); // Should clamp to maximum
  });

  it('should set sidebar collapsed state', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setSidebarCollapsed(true);
    });
    
    expect(result.current.sidebarCollapsed).toBe(true);
  });

  it('should toggle sidebar', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.toggleSidebar();
    });
    
    expect(result.current.sidebarCollapsed).toBe(true);
    
    act(() => {
      result.current.toggleSidebar();
    });
    
    expect(result.current.sidebarCollapsed).toBe(false);
  });

  it('should set active tab', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setActiveTab('permutations');
    });
    
    expect(result.current.activeTab).toBe('permutations');
  });

  it('should set split view', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setSplitView(true);
    });
    
    expect(result.current.splitView).toBe(true);
  });

  it('should toggle split view', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.toggleSplitView();
    });
    
    expect(result.current.splitView).toBe(true);
    
    act(() => {
      result.current.toggleSplitView();
    });
    
    expect(result.current.splitView).toBe(false);
  });

  it('should set selected runs', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setSelectedRuns(['run1', 'run2']);
    });
    
    expect(result.current.selectedRuns).toEqual(['run1', 'run2']);
  });

  it('should persist state to localStorage', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setTheme('light');
      result.current.setHighContrast(true);
      result.current.setUIScale(150);
      result.current.setSidebarCollapsed(true);
    });
    
    // Check that localStorage was called
    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
