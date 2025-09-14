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
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms between retries
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            // Set profile immediately for faster loading
            setProfile({
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.first_name || '',
              last_name: session.user.user_metadata?.last_name || '',
              phone: session.user.user_metadata?.phone || '',
              balance: 0,
              total_orders: 0,
              total_spent: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            // Fetch real profile data in background
            getUserProfile(session.user.id).then(profileData => {
              if (mounted && profileData) {
                setProfile(profileData);
              }
            });
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      try {
        if (session?.user) {
          setUser(session.user);
          // Set profile immediately for faster loading
          setProfile({
            id: session.user.id,
            email: session.user.email || '',
            first_name: session.user.user_metadata?.first_name || '',
            last_name: session.user.user_metadata?.last_name || '',
            phone: session.user.user_metadata?.phone || '',
            balance: 0,
            total_orders: 0,
            total_spent: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          // Fetch real profile data in background
          getUserProfile(session.user.id).then(profileData => {
            if (mounted && profileData) {
              setProfile(profileData);
            }
          });
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    if (error) throw error;

    // Set user and profile immediately for instant redirect
    if (data.user) {
      setUser(data.user);
      setProfile({
        id: data.user.id,
        email: data.user.email || '',
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone || '',
        balance: 0,
        total_orders: 0,
        total_spent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // If user already exists but no session, sign them in
    if (data.user && !data.session) {
      await signIn(email, password);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data received');
    
    // Set user and profile immediately for instant redirect
    setUser(data.user);
    setProfile({
      id: data.user.id,
      email: data.user.email || '',
      first_name: data.user.user_metadata?.first_name || '',
      last_name: data.user.user_metadata?.last_name || '',
      phone: data.user.user_metadata?.phone || '',
      balance: 0,
      total_orders: 0,
      total_spent: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    setUser(null);
    setProfile(null);
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
