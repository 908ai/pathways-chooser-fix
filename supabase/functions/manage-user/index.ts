// @ts-nocheck

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  action: 'delete' | 'block' | 'unblock' | 'approve' | 'reject';
  user_id: string;
  role?: 'municipal' | 'agency' | 'energy_advisor'; // Required for 'approve' action ONLY if changing role
  notes?: string;
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
    const { action, user_id, role, notes }: RequestBody = await req.json();

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

      case 'approve':
        // If a role is provided, it must be valid.
        // If NO role is provided, we assume it's a simple verification approval (e.g. Energy Advisor) and skip role update.
        if (role && (role !== 'municipal' && role !== 'agency' && role !== 'energy_advisor')) {
           throw new Error("Valid role (municipal, agency, or energy_advisor) is required if a role is specified.");
        }

        // 1. Update user_roles IF a role was provided
        if (role) {
            const { error: roleUpdateError } = await supabaseAdmin
            .from('user_roles')
            .upsert({ user_id: user_id, role: role }, { onConflict: 'user_id' });
            
            if (roleUpdateError) throw roleUpdateError;
        }

        // 2. Update profiles verification status
        const { error: profileUpdateError } = await supabaseAdmin
          .from('profiles')
          .update({
            verification_status: 'approved',
            verification_reviewed_at: new Date().toISOString(),
            verification_reviewed_by: user.id,
            verification_notes: notes || null
          })
          .eq('id', user_id);

        if (profileUpdateError) throw profileUpdateError;

        responseData = { message: `User ${user_id} approved${role ? ` as ${role}` : ''}.` };
        break;

      case 'reject':
        // Update profiles verification status only
        const { error: rejectError } = await supabaseAdmin
          .from('profiles')
          .update({
            verification_status: 'rejected',
            verification_reviewed_at: new Date().toISOString(),
            verification_reviewed_by: user.id,
            verification_notes: notes || null
          })
          .eq('id', user_id);

        if (rejectError) throw rejectError;

        responseData = { message: `User ${user_id} verification rejected.` };
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