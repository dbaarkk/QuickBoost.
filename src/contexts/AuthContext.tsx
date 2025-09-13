import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserProfile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { first_name: string; last_name: string; phone?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const profileData = await getUserProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            const profileData = await getUserProfile(session.user.id);
            setProfile(profileData);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      try {
        if (session?.user) {
          setUser(session.user);
          const profileData = await getUserProfile(session.user.id);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: { first_name: string; last_name: string; phone?: string }) => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address.');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: undefined // Disable email confirmation
        }
      });

      if (error) {
        // Handle specific error cases with user-friendly messages
        if (error.message.includes('User already registered')) {
          throw new Error('This email is already registered. Please sign in instead.');
        }
        if (error.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (error.message.includes('Unable to validate email address')) {
          throw new Error('Please enter a valid email address.');
        }
        if (error.message.includes('Signup is disabled')) {
          throw new Error('Account creation is temporarily disabled. Please try again later.');
        }
        throw new Error('Account creation failed. Please try again.');
      }

      if (data.user) {
        // Automatically sign in the user after successful signup
        const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          throw new Error('Account created but login failed. Please try signing in manually.');
        }

        setUser(signInData.user);
        const profileData = await getUserProfile(signInData.user.id);
        setProfile(profileData);

        // User state will be updated through onAuthStateChange
      } else {
        throw new Error('Account creation failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error; // Re-throw the error with user-friendly message
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Handle specific error cases with user-friendly messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials.');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before signing in.');
        }
        if (error.message.includes('User not found')) {
          throw new Error('Email not registered. Please sign up first.');
        }
        throw new Error('Login failed. Please try again.');
      }

      if (!data.user) throw new Error('Login failed. Please try again.');

      setUser(data.user);
      const profileData = await getUserProfile(data.user.id);
      setProfile(profileData);

      // User state will be updated through onAuthStateChange
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error; // Re-throw the error with user-friendly message
    }
  };


  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};