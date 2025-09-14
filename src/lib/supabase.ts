import { createClient } from '@supabase/supabase-js';

// Read from .env file via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables before initializing the client
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'quickboost-web'
    }
  }
});

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

// Services
export const getServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('platform', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const getServiceById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
};

// Orders
export const createOrder = async (orderData: {
  service_id: number | string;
  quantity: number;
  link: string;
  amount: number;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check balance
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('balance')
      .eq('id', user.id)
      .single();
    
    if (profileError) throw profileError;
    if (!profile || profile.balance < orderData.amount) {
      throw new Error('Insufficient balance');
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        service_id: Number(orderData.service_id),
        quantity: orderData.quantity,
        link: orderData.link,
        amount: orderData.amount
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { data: null, error };
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        service:services(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return { data: [], error };
  }
};

// Deposits
export const createDeposit = async (depositData: {
  amount: number;
  payment_method: 'upi' | 'crypto';
  utr_number?: string;
  txid?: string;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('deposits')
      .insert({
        user_id: user.id,
        ...depositData
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error creating deposit:', error);
    return { data: null, error };
  }
};

export const getUserDeposits = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error: any) {
    console.error('Error fetching deposits:', error);
    return { data: [], error };
  }
};
