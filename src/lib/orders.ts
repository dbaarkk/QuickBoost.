// lib/orders.ts
import { supabase } from './supabase';
import { validateSocialUrl, detectPlatform, PLATFORMS } from './socialUtils';

export interface Order {
  id: string;
  user_id: string;
  service_id: string;
  platform: string;
  username: string;
  profile_url: string;
  quantity: number;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'partial' | 'refunded' | 'cancelled';
  api_order_id?: string;
  created_at: string;
  updated_at: string;
}

export const placeOrder = async (orderData: {
  user_id: string;
  service_id: string;
  profile_url: string;
  quantity: number;
  amount: number;
  platform?: string; // Optional: if not provided, auto-detect
}): Promise<{ data: Order | null; error: string | null }> => {
  try {
    // Auto-detect platform if not provided
    let platform = orderData.platform;
    let username = '';
    
    if (!platform) {
      const detection = detectPlatform(orderData.profile_url);
      if (detection.error) {
        return { data: null, error: detection.error };
      }
      platform = detection.platform;
      username = detection.username;
    } else {
      // Validate against specific platform
      const validation = validateSocialUrl(orderData.profile_url, platform);
      if (!validation.isValid) {
        return { data: null, error: validation.error || 'Invalid URL' };
      }
      username = validation.username;
    }

    if (platform === 'unknown') {
      return { data: null, error: 'Unsupported platform. Please enter a valid social media URL.' };
    }

    // Call your SMM API
    const apiResponse = await fetch('/api/place-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SMM_API_KEY}`
      },
      body: JSON.stringify({
        service: orderData.service_id,
        username: username,
        quantity: orderData.quantity,
        platform: platform
      }),
    });

    const apiData = await apiResponse.json();

    if (!apiResponse.ok) {
      return { data: null, error: apiData.message || `API error: ${apiData.error || 'Unknown error'}` };
    }

    // Save order to database
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        user_id: orderData.user_id,
        service_id: orderData.service_id,
        platform: platform,
        username: username,
        profile_url: orderData.profile_url,
        quantity: orderData.quantity,
        amount: orderData.amount,
        status: 'pending',
        api_order_id: apiData.order_id || apiData.id,
      }])
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Deduct balance
    const { error: balanceError } = await supabase.rpc('decrement_balance', {
      user_uuid: orderData.user_id,
      amount: orderData.amount
    });

    if (balanceError) {
      console.error('Balance update failed:', balanceError);
    }

    return { data, error: null };

  } catch (error) {
    console.error('Order placement error:', error);
    return { data: null, error: 'Network error. Please try again.' };
  }
};

export const getUserOrders = async (userId: string): Promise<{ data: Order[] | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        services:service_id (
          name,
          category,
          rate_per_1000
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch orders' };
  }
};

export const getOrderStatus = async (orderId: string): Promise<{ status: string; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('status, api_order_id')
      .eq('id', orderId)
      .single();

    if (error) {
      return { status: 'error', error: error.message };
    }

    // Optionally: Sync with API for latest status
    if (data.api_order_id) {
      const apiResponse = await fetch(`/api/order-status/${data.api_order_id}`);
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        if (apiData.status !== data.status) {
          // Update status in database
          await supabase
            .from('orders')
            .update({ status: apiData.status })
            .eq('id', orderId);
        }
        return { status: apiData.status };
      }
    }

    return { status: data.status };
  } catch (error) {
    return { status: 'error', error: 'Failed to fetch order status' };
  }
};
