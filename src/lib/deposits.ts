// lib/deposits.ts
import { supabase } from './supabaseClient';

export interface Deposit {
  id: string;
  user_id: string;
  amount: number;
  payment_method: 'upi' | 'crypto';
  utr_number?: string;
  txid?: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

// Create a new deposit
export async function createDeposit(depositData: Partial<Deposit>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error("Not logged in"), data: null };

  const { data, error } = await supabase
    .from('deposits')
    .insert([{ user_id: user.id, ...depositData }])
    .select();

  return { data, error };
}

// Fetch all deposits for current user
export async function getUserDeposits() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error("Not logged in"), data: null };

  const { data, error } = await supabase
    .from('deposits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data, error };
}
