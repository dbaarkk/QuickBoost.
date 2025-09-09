import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { first_name: string; last_name: string; phone: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

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

    // Get initial session
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await refreshProfile();
          } else {
            setProfile(null);
          }
          if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [user]);

  const signUp = async (email: string, password: string, userData: { first_name: string; last_name: string; phone: string }) => {
    try {
      setLoading(true);
      
      // First try to sign up
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData }
      });

      // If user already exists or signup failed, try to sign in
      if (signUpError) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          setLoading(false);
          return { error: signInError };
        }
        
        // Sign in successful, auth state change will handle the rest
        return { error: null };
      }

      // If signup was successful, sign them in immediately
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setLoading(false);
        return { error: signInError };
      }

      // Sign in successful, auth state change will handle the rest
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
      // If successful, auth state change will handle the rest
      
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
