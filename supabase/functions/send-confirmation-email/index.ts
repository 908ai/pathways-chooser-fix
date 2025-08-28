import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  userEmail: string;
  companyName: string;
  compliancePath: string;
  selections: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, companyName, compliancePath, selections }: ConfirmationEmailRequest = await req.json();

    const pathType = compliancePath === "9365" || compliancePath === "9367" ? "Performance" : "Prescriptive";
    const pathName = compliancePath === "9365" ? "NBC 9.36.5" : 
                    compliancePath === "9367" ? "NBC 9.36.7" :
                    compliancePath === "9362" ? "NBC 9.36.2" : "NBC 9.36.8";

    const emailResponse = await resend.emails.send({
      from: "NBC Pathway Selector <onboarding@resend.dev>",
      to: [userEmail],
      subject: `${pathType} Path Application Submitted - ${pathName}`,
      html: `
        <h1>Application Submitted Successfully!</h1>
        <p>Dear ${companyName},</p>
        
        <p>We have received your <strong>${pathType} Path</strong> application for <strong>${pathName}</strong>.</p>
        
        <h2>Application Details:</h2>
        <ul>
          <li><strong>Compliance Path:</strong> ${pathName}</li>
          <li><strong>Application Type:</strong> ${pathType} Path</li>
          <li><strong>Company:</strong> ${companyName}</li>
          <li><strong>Submitted:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        
        <h2>Next Steps:</h2>
        <p>${pathType === "Performance" ? 
          "Your application will be reviewed and energy modeling will begin within 1-2 business days." :
          "Your application will be processed and compliance verification will begin within 1-2 business days."
        }</p>
        
        <p>You will receive another email once the review process begins.</p>
        
        <p>Best regards,<br>
        The NBC Compliance Team</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);