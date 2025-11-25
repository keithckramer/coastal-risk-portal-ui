/**
 * Authentication context and provider
 * Manages global authentication state and provides auth actions
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { LoginCredentials, AuthState } from '../types/auth';
import * as authService from '../services/auth.service';

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component
 * Wraps the application to provide auth state and actions
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from storage on mount
  useEffect(() => {
    const initializeAuth = () => {
      const isAuth = authService.isAuthenticated();
      const user = authService.getCurrentUser();

      setState({
        user,
        token: isAuth ? 'present' : null,
        isAuthenticated: isAuth,
        isLoading: false,
      });
    };

    initializeAuth();
  }, []);

  /**
   * Handles user login
   */
  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await authService.login(credentials);

      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  };

  /**
   * Handles user logout
   */
  const logout = async () => {
    await authService.logout();

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  /**
   * Checks if user has a specific role
   */
  const hasRole = (role: string): boolean => {
    return state.user?.roles.includes(role) ?? false;
  };

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
