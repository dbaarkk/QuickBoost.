import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
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

export interface Service {
  id: number;
  name: string;
  platform: string;
  category: string;
  price: number;
  min_order: number;
  max_order: number;
  description: string;
  delivery_time: string;
  rating: number;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  service_id: number;
  quantity: number;
  link: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  progress: number;
  created_at: string;
  updated_at: string;
  service?: Service;
}

export interface Deposit {
  id: string;
  user_id: string;
  amount: number;
  payment_method: 'upi' | 'crypto';
  utr_number?: string;
  txid?: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Auth functions
export const signUp = async (
  email: string,
  password: string,
  userData: { first_name: string; last_name: string; phone?: string }
) => {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: userData }
  });
};

export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// User profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from<UserProfile>('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from<UserProfile>('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Services
export const getServices = async () => {
  const { data, error } = await supabase
    .from<Service>('services')
    .select('*')
    .eq('is_active', true)
    .order('platform', { ascending: true });
  return { data, error };
};

export const getServiceById = async (id: number) => {
  const { data, error } = await supabase
    .from<Service>('services')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

// Orders
export const createOrder = async (orderData: {
  service_id: number;
  quantity: number;
  link: string;
  amount: number;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: 'User not authenticated' } };

  // Check balance
  const { data: profile, error: profileError } = await getUserProfile(user.id);
  if (profileError || !profile) return { data: null, error: profileError || { message: 'Profile not found' } };
  if (profile.balance < orderData.amount) return { data: null, error: { message: 'Insufficient balance' } };

  const { data, error } = await supabase
    .from<Order>('orders')
    .insert({ user_id: user.id, ...orderData })
    .select()
    .single();
  return { data, error };
};

export const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from<Order>('orders')
    .select(`*, service:services(*)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false }); // newest first
  return { data, error };
};

// Deposits
export const createDeposit = async (depositData: {
  amount: number;
  payment_method: 'upi' | 'crypto';
  utr_number?: string;
  txid?: string;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: 'User not authenticated' } };

  const { data, error } = await supabase
    .from<Deposit>('deposits')
    .insert({ user_id: user.id, ...depositData })
    .select()
    .single();
  return { data, error };
};

export const getUserDeposits = async (userId: string) => {
  const { data, error } = await supabase
    .from<Deposit>('deposits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};
