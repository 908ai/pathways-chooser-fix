import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContactSection() {
  return (
    <>
      {
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl">📞</span>
                <h3 className="text-lg font-semibold">Need Help? We're Here for You!</h3>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                If you're unsure about anything, please call us directly. You'll speak to a real person from our small, local team. 
                We're here to walk you through the process, answer your questions, and help make energy compliance easy and stress-free.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button size="lg" onClick={() => window.open('tel:403-872-2441', '_self')}>
                  📞 Call Us: 403-872-2441
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>        
      }
    </>
  );
}