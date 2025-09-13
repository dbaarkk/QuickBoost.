import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface OrderCompletionRequest {
  order_id?: string;
  api_key?: string;
}

interface OrderCompletionResponse {
  status: 'success' | 'error';
  order_id?: string;
  message: string;
  completed_orders?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Validate API key for security
    const API_KEY = Deno.env.get('ORDER_COMPLETION_API_KEY') || 'quickboost-api-2024'
    
    let requestData: OrderCompletionRequest = {}
    
    if (req.method === 'POST') {
      try {
        requestData = await req.json()
      } catch {
        requestData = {}
      }
    }

    // Check API key
    const providedApiKey = requestData.api_key || req.headers.get('x-api-key')
    if (providedApiKey !== API_KEY) {
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Invalid API key'
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // If specific order_id provided, complete that order
    if (requestData.order_id) {
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', requestData.order_id)
        .eq('status', 'pending')
        .single()

      if (fetchError || !order) {
        return new Response(
          JSON.stringify({
            status: 'error',
            message: 'Order not found or already completed'
          }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Update order to completed with 100% progress
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          progress: 100,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestData.order_id)

      if (updateError) {
        throw updateError
      }

      return new Response(
        JSON.stringify({
          status: 'success',
          order_id: requestData.order_id,
          message: 'Order completed successfully'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Auto-complete all pending orders (default behavior)
    const { data: pendingOrders, error: fetchAllError } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (fetchAllError) {
      throw fetchAllError
    }

    if (!pendingOrders || pendingOrders.length === 0) {
      return new Response(
        JSON.stringify({
          status: 'success',
          message: 'No pending orders to complete',
          completed_orders: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Complete all pending orders
    const orderIds = pendingOrders.map(order => order.id)
    
    const { error: bulkUpdateError } = await supabase
      .from('orders')
      .update({
        status: 'completed',
        progress: 100,
        updated_at: new Date().toISOString()
      })
      .in('id', orderIds)

    if (bulkUpdateError) {
      throw bulkUpdateError
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        message: `${pendingOrders.length} orders completed successfully`,
        completed_orders: pendingOrders.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Order completion error:', error)
    
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message || 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})