import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
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
  profile: Profile | null;
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

const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
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
  const [profile, setProfile] = useState<Profile | null>(null);

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const profileData = await getUserProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

useEffect(() => {
  let mounted = true;

  const initAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (mounted && session?.user) {
        setUser(session.user);
        
        // Try to get profile - if it doesn't exist, create it
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profileData) {
          // Profile doesn't exist - create it
          const { data: newProfile } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_meta_data?.first_name || '',
              last_name: session.user.user_meta_data?.last_name || '',
              phone: session.user.user_meta_data?.phone || '',
              balance: 0,
              total_orders: 0,
              total_spent: 0
            }, {
              onConflict: 'id'
            })
            .select()
            .single();
          
          if (newProfile) {
            setProfile(newProfile);
          }
        } else {
          setProfile(profileData);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  };

  initAuth();

  // ... rest of your auth listener code
}, []);
