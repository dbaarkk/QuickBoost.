import { createClient } from '@supabase/supabase-js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Get environment variables with proper error handling
const getEnvVariable = (key: string, fallback?: string): string => {
  if (isBrowser) {
    // In browser, use import.meta.env
    const value = (import.meta.env as any)[key];
    if (value) return value;
  } else {
    // In Node.js, use process.env
    const value = process.env[key];
    if (value) return value;
  }
  
  if (fallback) return fallback;
  
  throw new Error(`Environment variable ${key} is required but not found`);
};

let supabase;

try {
  const supabaseUrl = getEnvVariable('VITE_SUPABASE_URL');
  const supabaseAnonKey = getEnvVariable('VITE_SUPABASE_ANON_KEY');
  
  console.log('🔧 Supabase Config:', {
    url: supabaseUrl,
    keyLength: supabaseAnonKey.length,
    hasEnvUrl: !!getEnvVariable('VITE_SUPABASE_URL', null),
    hasEnvKey: !!getEnvVariable('VITE_SUPABASE_ANON_KEY', null)
  });

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  });
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error);
  
  // Create a mock client that will throw errors when used
  supabase = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not initialized') }),
      getSession: () => Promise.resolve({ data: { session: null }, error: new Error('Supabase not initialized') })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Supabase not initialized') })
        })
      })
    })
  } as any;
}

export { supabase };

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
  status: 'pending' | 'success' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Helper function to get user profile with retry logic
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log('🔍 Fetching profile for user:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('❌ Profile fetch error:', error);
      return null;
    }
    
    console.log('✅ Profile fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ Profile fetch exception:', error);
    return null;
  }
};

// Update user balance
export const updateUserBalance = async (userId: string, newBalance: number) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Balance update error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('❌ Balance update exception:', error);
    return { data: null, error };
  }
};

// Update deposit status
export const updateDepositStatus = async (depositId: string, status: 'pending' | 'success' | 'rejected') => {
  try {
    const { data, error } = await supabase
      .from('deposits')
      .update({ status })
      .eq('id', depositId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Deposit status update error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('❌ Deposit status update exception:', error);
    return { data: null, error };
  }
};

// Services
export const getServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('platform', { ascending: true });
    
    if (error) {
      console.error('❌ Services fetch error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('❌ Services fetch exception:', error);
    return { data: null, error };
  }
};

// Orders
export const createOrder = async (orderData: {
  service_id: number;
  quantity: number;
  link: string;
  amount: number;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    console.log('🛒 Creating order:', orderData);

    // Check balance first
    const profile = await getUserProfile(user.id);
    if (!profile) {
      return { data: null, error: { message: 'Profile not found' } };
    }
    
    if (profile.balance < orderData.amount) {
      return { data: null, error: { message: 'Insufficient balance' } };
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({ user_id: user.id, ...orderData })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Order creation error:', error);
      return { data: null, error };
    }
    
    console.log('✅ Order created:', data);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Order creation exception:', error);
    return { data: null, error };
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`*, service:services(*)`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Orders fetch error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('❌ Orders fetch exception:', error);
    return { data: null, error };
  }
};

// Deposits
export const createDeposit = async (depositData: {
  amount: number;
  payment_method: 'upi' | 'crypto';
  utr_number?: string;
  txid?: string;
  status?: 'pending' | 'success' | 'rejected';
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('deposits')
      .insert({ 
        user_id: user.id, 
        status: 'pending',
        ...depositData 
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Deposit creation error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('❌ Deposit creation exception:', error);
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
    
    if (error) {
      console.error('❌ Deposits fetch error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('❌ Deposits fetch exception:', error);
    return { data: null, error };
  }
};
