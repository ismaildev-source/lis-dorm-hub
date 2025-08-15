
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Type definition for the authentication response
interface AuthResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    name: string;
    username: string;
    email: string;
    role: 'admin' | 'supervisor' | 'parent' | 'student';
  };
}

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'supervisor' | 'parent' | 'student';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkUser = () => {
      const savedUser = localStorage.getItem('dormhub_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('dormhub_user');
        }
      }
      setLoading(false);
    };
    
    checkUser();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      setLoading(true);
      
      // Use secure server-side authentication function
      // This prevents credential exposure and performs authentication securely
      const { data, error } = await supabase.rpc('authenticate_user', {
        p_username: username,
        p_password: password
      });

      if (error) {
        console.error('Authentication error:', error);
        setLoading(false);
        return { success: false, error: 'Login failed. Please try again.' };
      }

      // Parse the JSON response from the secure function
      const authResponse = data as unknown as AuthResponse;
      
      if (authResponse?.success && authResponse?.user) {
        const newUser: User = {
          id: authResponse.user.id,
          name: authResponse.user.name,
          username: authResponse.user.username,
          email: authResponse.user.email,
          role: authResponse.user.role
        };
        
        setUser(newUser);
        localStorage.setItem('dormhub_user', JSON.stringify(newUser));
        setLoading(false);
        console.log('Login successful for:', newUser);
        return { success: true, user: newUser };
      } else {
        setLoading(false);
        console.log('Login failed: Invalid credentials');
        return { success: false, error: authResponse?.error || 'Invalid username or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dormhub_user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
