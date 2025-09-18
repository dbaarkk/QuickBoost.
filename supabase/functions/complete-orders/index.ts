import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
}

interface OrderCompletionRequest {
  order_id?: string;
  api_key?: string;
  status?: 'completed' | 'processing' | 'partial' | 'refunded';
  progress?: number;
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
    const supabaseUrl = 'https://aubpburchvdzkbpfzbrn.supabase.co'
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    if (!supabaseServiceKey) {
      throw new Error('Missing Supabase Service Role Key')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Validate API key for security - USE A STRONG SECRET KEY!
    const API_KEY = Deno.env.get('ORDER_COMPLETION_API_KEY') || 'quickboost-secure-api-key-2024'
    
    let requestData: OrderCompletionRequest = {}
    
    if (req.method === 'POST') {
      try {
        requestData = await req.json()
      } catch {
        return new Response(
          JSON.stringify({
            status: 'error',
            message: 'Invalid JSON payload'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Check API key from multiple sources
    const providedApiKey = requestData.api_key || 
                          req.headers.get('x-api-key') || 
                          req.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!providedApiKey || providedApiKey !== API_KEY) {
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Invalid or missing API key'
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const targetStatus = requestData.status || 'completed'
    const targetProgress = requestData.progress || (targetStatus === 'completed' ? 100 : 50)

    // If specific order_id provided, complete that order
    if (requestData.order_id) {
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', requestData.order_id)
        .single()

      if (fetchError || !order) {
        return new Response(
          JSON.stringify({
            status: 'error',
            message: 'Order not found'
          }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Update order status and progress
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: targetStatus,
          progress: targetProgress,
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
          message: `Order ${requestData.order_id} updated to ${targetStatus} status`
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
          message: 'No pending orders found',
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
        status: targetStatus,
        progress: targetProgress,
        updated_at: new Date().toISOString()
      })
      .in('id', orderIds)

    if (bulkUpdateError) {
      throw bulkUpdateError
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        message: `${pendingOrders.length} orders updated to ${targetStatus} status`,
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
