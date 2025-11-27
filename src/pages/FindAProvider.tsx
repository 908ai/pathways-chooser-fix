import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building, Mail, Phone, Globe, Search } from 'lucide-react';

const fetchProviders = async () => {
  const { data, error } = await supabase
    .from('service_providers')
    .select('*')
    .eq('is_approved', true)
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

const FindAProvider = () => {
  const { signOut } = useAuth();
  const { data: providers, isLoading, error } = useQuery({
    queryKey: ['service_providers'],
    queryFn: fetchProviders,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');

  const serviceCategories = providers ? [...new Set(providers.map(p => p.service_category))] : [];
  const provinces = providers ? [...new Set(providers.map(p => p.location_province).filter(Boolean))] : [];

  const filteredProviders = providers?.filter(provider => {
    const nameMatch = provider.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = categoryFilter === 'all' || provider.service_category === categoryFilter;
    const provinceMatch = provinceFilter === 'all' || provider.location_province === provinceFilter;
    return nameMatch && categoryMatch && provinceMatch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-foreground">Find a Service Provider</h1>
          <p className="text-muted-foreground text-lg">
            Browse our directory of trusted professionals.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {serviceCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={provinceFilter} onValueChange={setProvinceFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                {provinces.map(prov => <SelectItem key={prov} value={prov}>{prov}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {isLoading && <p className="text-center text-foreground">Loading providers...</p>}
        {error && <p className="text-center text-destructive">Error loading providers: {error.message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders?.map(provider => (
            <Card key={provider.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  {provider.logo_url && <img src={provider.logo_url} alt={`${provider.name} logo`} className="h-16 w-16 object-contain rounded-md bg-white p-1" />}
                  <div className="flex-1">
                    <CardTitle>{provider.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">{provider.service_category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{provider.description}</p>
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{provider.location_city}, {provider.location_province}</span>
                  </div>
                  {provider.contact_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${provider.contact_email}`} className="hover:underline">{provider.contact_email}</a>
                    </div>
                  )}
                  {provider.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{provider.phone_number}</span>
                    </div>
                  )}
                  {provider.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={provider.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{provider.website}</a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredProviders?.length === 0 && !isLoading && (
          <p className="text-center text-muted-foreground mt-8">No service providers found matching your criteria.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FindAProvider;