// lib/deposits.ts
import { supabase } from './supabase';

export interface Deposit {
  id: string;
  user_id: string;
  amount: number;
  payment_method: 'upi' | 'crypto';
  status: 'pending' | 'success' | 'rejected';
  utr_number?: string;
  created_at: string;
}

// Create or update user profile
export const updateUserProfile = async (userId: string, updates: { balance?: number }): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...updates,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    });

  return { error };
};

// Get user profile with balance
export const getUserProfile = async (userId: string): Promise<{ data: any | null; error: any }> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};

// Manual balance update function
export const updateUserBalance = async (userId: string, amount: number): Promise<{ error: any }> => {
  const { error } = await supabase.rpc('increment_balance', {
    user_uuid: userId,
    amount: amount
  });

  return { error };
};

// Your existing deposit functions...
export const createDeposit = async (depositData: {
  user_id: string;
  amount: number;
  payment_method: 'upi' | 'crypto';
  utr_number?: string;
  status?: 'pending' | 'success' | 'rejected';
}): Promise<{ data: Deposit | null; error: any }> => {
  const { data, error } = await supabase
    .from('deposits')
    .insert([{
      ...depositData,
      status: depositData.status || 'pending'
    }])
    .select()
    .single();

  return { data, error };
};

export const getUserDeposits = async (userId: string): Promise<{ data: Deposit[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('deposits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const updateDepositStatus = async (depositId: string, status: 'success' | 'rejected'): Promise<{ data: Deposit | null; error: any }> => {
  const { data, error } = await supabase
    .from('deposits')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', depositId)
    .select()
    .single();

  return { data, error };
};
