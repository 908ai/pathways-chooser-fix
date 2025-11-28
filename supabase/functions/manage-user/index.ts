// @ts-nocheck

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  action: 'delete' | 'block' | 'unblock';
  user_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // First, verify the caller is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseAdmin.auth.getUser(jwt);

    if (!user) {
      throw new Error("Authentication failed.");
    }

    const { data: userRole, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || userRole?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Permission denied. Admins only.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Proceed with the action
    const { action, user_id }: RequestBody = await req.json();

    if (!user_id) {
      throw new Error("User ID is required.");
    }

    let responseData;

    switch (action) {
      case 'delete':
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id);
        if (deleteError) throw deleteError;
        responseData = { message: `User ${user_id} deleted successfully.` };
        break;
      
      case 'block':
        const { data: blockData, error: blockError } = await supabaseAdmin.auth.admin.updateUserById(
          user_id,
          { ban_duration: '36500d' } // Ban for 100 years
        );
        if (blockError) throw blockError;
        responseData = { message: `User ${user_id} blocked successfully.`, user: blockData.user };
        break;

      case 'unblock':
        const { data: unblockData, error: unblockError } = await supabaseAdmin.auth.admin.updateUserById(
          user_id,
          { ban_duration: 'none' }
        );
        if (unblockError) throw unblockError;
        responseData = { message: `User ${user_id} unblocked successfully.`, user: unblockData.user };
        break;

      default:
        throw new Error("Invalid action specified.");
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in manage-user function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});