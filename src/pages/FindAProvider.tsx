import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { useProviderAccess } from '@/hooks/useProviderAccess';
import { Link } from 'react-router-dom';

const fetchServiceProviders = async () => {
  const { data, error } = await supabase
    .from('service_providers')
    .select('*')
    .eq('is_approved', true);
  if (error) throw new Error(error.message);
  return data;
};

const FindAProvider = () => {
  const { canAccess, loading: accessLoading } = useProviderAccess();
  const { data: providers, isLoading, error } = useQuery({
    queryKey: ['service_providers'],
    queryFn: fetchServiceProviders,
    enabled: canAccess,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [serviceCategory, setServiceCategory] = useState('All');
  const [location, setLocation] = useState('');

  const filteredProviders = providers?.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = serviceCategory === 'All' || provider.service_category === serviceCategory;
    const matchesLocation = !location || provider.location_province?.toLowerCase().includes(location.toLowerCase()) || provider.location_city?.toLowerCase().includes(location.toLowerCase());
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const serviceCategories = ['All', ...new Set(providers?.map(p => p.service_category) || [])];

  if (accessLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!canAccess) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>Access Required</CardTitle>
              <CardDescription>You need permission to view this page.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This directory is available to approved builders and energy advisors.</p>
              <Button asChild className="mt-4">
                <Link to="/request-provider-access">Request Access</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Find a Service Provider</h1>
          <p className="text-muted-foreground mb-6">Browse our directory of approved energy advisors, builders, and other service providers.</p>

          <Card className="mb-8">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or keyword..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={serviceCategory} onValueChange={setServiceCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Service Category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input
                placeholder="Filter by location..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full md:w-[200px]"
              />
            </CardContent>
          </Card>

          {isLoading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}
          {error && <div className="text-red-500">Error: {error.message}</div>}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProviders?.map(provider => (
              <Card key={provider.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{provider.name}</CardTitle>
                      <CardDescription>{provider.service_category}</CardDescription>
                    </div>
                    {provider.logo_url && <img src={provider.logo_url} alt={`${provider.name} logo`} className="h-12 w-12 object-contain" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{provider.description || ''}</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Location:</strong> {provider.location_city}, {provider.location_province}</p>
                    <p><strong>Email:</strong> {provider.contact_email}</p>
                    <p><strong>Phone:</strong> {provider.phone_number}</p>
                    {provider.website && <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Visit Website</a>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredProviders?.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-lg font-semibold">No providers found</p>
              <p className="text-muted-foreground">Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindAProvider;