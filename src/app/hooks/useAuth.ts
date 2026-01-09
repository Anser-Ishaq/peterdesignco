import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  role: 'User' | 'Admin';
  isVerified: boolean;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false
  });

  const logout = useCallback(async () => {
    try {
      // Call logout API to clear HTTP-only cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }

    // Clear cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false
    });

    // Redirect to login page
    window.location.href = '/login';
  }, []);

  useEffect(() => {
    // Check for stored auth data on component mount
    const checkAuthState = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser);
          
          // Verify token is still valid by checking with server
          try {
            const response = await fetch('/api/auth/verify', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${storedToken}`,
              },
              credentials: 'include'
            });

            if (response.ok) {
              setAuthState({
                user,
                token: storedToken,
                isLoading: false,
                isAuthenticated: true
              });
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              setAuthState({
                user: null,
                token: null,
                isLoading: false,
                isAuthenticated: false
              });
            }
          } catch (error) {
            // Network error, assume token is still valid for now
            setAuthState({
              user,
              token: storedToken,
              isLoading: false,
              isAuthenticated: true
            });
          }
        } else {
          setAuthState(prev => ({ 
            ...prev, 
            isLoading: false,
            isAuthenticated: false 
          }));
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    };

    checkAuthState();
  }, [logout]);

  const login = useCallback((user: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setAuthState({
      user,
      token,
      isLoading: false,
      isAuthenticated: true
    });
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    updateUser
  };
}