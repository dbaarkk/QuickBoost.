import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserProfile, getUserProfile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { first_name: string; last_name: string; phone: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      const { data, error } = await getUserProfile(user.id);
      if (!error && data) setProfile(data);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        refreshProfile();
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await refreshProfile();
      } else {
        setProfile(null);
      }
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [user]);

  const signUp = async (email: string, password: string, userData: { first_name: string; last_name: string; phone: string }) => {
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
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setLoading(false);
    }
    // If successful, auth state change will handle the rest
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
