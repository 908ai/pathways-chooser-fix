import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import starryMountainsBg from '@/assets/vibrant-starry-mountains-bg.jpg';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundImage: `url(${starryMountainsBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0"></div>
      <div className="text-center relative z-10">
        <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-lg">404</h1>
        <p className="text-xl text-gray-200 mb-6 drop-shadow-md">Oops! Page not found</p>
        <a href="/" className="text-white hover:text-gray-300 underline text-lg hover:no-underline transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
