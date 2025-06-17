
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      
      // Check all user tables for matching credentials
      const tables = [
        { table: 'admin_users' as const, role: 'admin' as const },
        { table: 'supervisor_users' as const, role: 'supervisor' as const },
        { table: 'parent_users' as const, role: 'parent' as const },
        { table: 'student_users' as const, role: 'student' as const }
      ];

      for (const { table, role } of tables) {
        console.log(`Checking ${table} for user: ${username}`);
        
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single();

        console.log(`Result for ${table}:`, { data, error });

        if (data && !error) {
          const newUser: User = {
            id: data.id,
            name: data.name,
            username: data.username,
            email: data.email,
            role: role
          };
          
          setUser(newUser);
          localStorage.setItem('dormhub_user', JSON.stringify(newUser));
          setLoading(false);
          console.log('Login successful for:', newUser);
          return { success: true, user: newUser };
        }
      }
      
      setLoading(false);
      console.log('Login failed: Invalid credentials');
      return { success: false, error: 'Invalid username or password' };
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
