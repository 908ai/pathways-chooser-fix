import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { useUserRole } from '@/hooks/useUserRole';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const profileSchema = z.object({
  profile_type: z.string().min(1, "Profile type is required"),
});

const companySchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  contact_email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type CompanyFormValues = z.infer<typeof companySchema>;

const Account = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { userRole, loading: roleLoading, isBuilder, isEnergyAdvisor } = useUserRole();
  const [loading, setLoading] = useState(true);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { profile_type: '' },
  });

  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: { company_name: '', contact_email: '', phone: '', address: '' },
  });

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setLoading(true);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('profile_type')
          .eq('id', user.id)
          .single();

        if (profileData) {
          profileForm.reset({ profile_type: profileData.profile_type || '' });
        }

        if (isBuilder || isEnergyAdvisor) {
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (companyData) {
            companyForm.reset(companyData);
          }
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [user, userRole, isBuilder, isEnergyAdvisor, profileForm, companyForm]);

  const onProfileSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ profile_type: data.profile_type }).eq('id', user.id);
    if (error) {
      toast({ title: 'Error updating profile', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated successfully' });
    }
  };

  const onCompanySubmit: SubmitHandler<CompanyFormValues> = async (data) => {
    if (!user) return;
    const { data: existingCompany, error: fetchError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingCompany) {
      const { error } = await supabase.from('companies').update(data).eq('user_id', user.id);
      if (error) {
        toast({ title: 'Error updating company', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Company information updated' });
      }
    } else {
      const { error } = await supabase.from('companies').insert({ ...data, user_id: user.id });
      if (error) {
        toast({ title: 'Error saving company', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Company information saved' });
      }
    }
  };

  if (loading || roleLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">My Account</h1>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details.</CardDescription>
              </CardHeader>
              <CardContent>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {userRole}</p>
                <p><strong>User ID:</strong> {user?.id}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4">Change Password</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        To change your password, please click the button below to receive a password reset email.
                      </DialogDescription>
                    </DialogHeader>
                    <Button onClick={async () => {
                      if (!user?.email) return;
                      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
                      if (error) {
                        toast({ title: 'Error', description: error.message, variant: 'destructive' });
                      } else {
                        toast({ title: 'Success', description: 'Password reset email sent.' });
                      }
                    }}>
                      Send Reset Email
                    </Button>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Update Profile Type</CardTitle>
                <CardDescription>Select the profile that best describes you.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="profile_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a profile type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="builder">Builder / Designer</SelectItem>
                              <SelectItem value="energy_advisor">Energy Advisor</SelectItem>
                              <SelectItem value="building_official">Building Official</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Save Profile Type</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {(isBuilder || isEnergyAdvisor) && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Provide details about your company.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...companyForm}>
                    <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
                      <FormField
                        control={companyForm.control}
                        name="company_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="contact_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Save Company Information</Button>
                    </form>
                  </Form>
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

export default Account;