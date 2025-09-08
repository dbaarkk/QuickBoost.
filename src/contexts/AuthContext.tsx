import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserProfile, getUserProfile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userData: { first_name: string; last_name: string; phone?: string }
  ) => Promise<{ error: any }>;
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
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) await refreshProfile();
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user ?? null);
        if (session?.user) await refreshProfile();
        else setProfile(null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userData: { first_name: string; last_name: string; phone?: string }
  ) => {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData },
    });

    if (signUpError) return { error: signUpError };

    // Automatically log in after signup
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!signInError && signInData.user) {
      setUser(signInData.user);
      await refreshProfile();
    }

    return { error: signInError };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      setUser(data.user);
      await refreshProfile();
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
