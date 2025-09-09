import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// UserProfile interface
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  balance: number;
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

// Auth context types
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { first_name: string; last_name: string; phone: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {}
});

// Custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Function to fetch user profile
const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      if (user) {
        const { data, error } = await getUserProfile(user.id);
        if (!error && data) {
          setProfile(data);
        }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await refreshProfile();
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await refreshProfile();
          } else {
            setProfile(null);
          }
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // ✅ Run only once on mount

  const signUp = async (email: string, password: string, userData: { first_name: string; last_name: string; phone: string }) => {
    try {
      setLoading(true);

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData }
      });

      if (signUpError) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          setLoading(false);
          return { error: signInError };
        }

        return { error: null };
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setLoading(false);
        return { error: signInError };
      }

      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
      }
      return { error };
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
