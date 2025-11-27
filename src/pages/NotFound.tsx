import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="text-center space-y-6 max-w-lg w-full">
        <div className="flex justify-center items-center gap-4">
          <AlertTriangle className="h-16 w-16 text-destructive" />
          <h1 className="text-8xl font-bold text-primary">404</h1>
        </div>
        <h2 className="text-3xl font-semibold">Oops! Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Button asChild size="lg">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;