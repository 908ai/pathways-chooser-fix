import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { User, Building, FileText, Info, Shield } from 'lucide-react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

const DashboardOld = () => {
  const { user } = useAuth();
  const { userRole } = useUserRole();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome, {user?.email}</h1>
            <p className="text-gray-500 dark:text-gray-400">Here's your dashboard overview.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2" />
                  My Profile
                </CardTitle>
                <CardDescription>View and manage your account details.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Your current role: <span className="font-semibold">{userRole}</span></p>
                <Link to="/account">
                  <Button className="mt-4 w-full">Go to Profile</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2" />
                  My Projects
                </CardTitle>
                <CardDescription>Access and manage your energy compliance projects.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>You have 3 active projects.</p>
                <Link to="/projects">
                  <Button className="mt-4 w-full">View Projects</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2" />
                  Start New Project
                </CardTitle>
                <CardDescription>Begin a new compliance calculation.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Use our calculator to determine your project's compliance path.</p>
                <Link to="/calculator">
                  <Button className="mt-4 w-full">Open Calculator</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2" />
                  Resources
                </CardTitle>
                <CardDescription>Find helpful documents and guides.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Access our library of resources to help with your projects.</p>
                <Link to="/resources">
                  <Button className="mt-4 w-full">Browse Resources</Button>
                </Link>
              </CardContent>
            </Card>

            {userRole === 'admin' && (
              <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2" />
                    Admin Panel
                  </CardTitle>
                  <CardDescription>Manage users, projects, and site settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Access the administrative dashboard.</p>
                  <Link to="/admin">
                    <Button className="mt-4 w-full">Go to Admin</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardOld;