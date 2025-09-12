import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AccountInfoTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editedCompanyInfo, setEditedCompanyInfo] = useState<any>({});

  useEffect(() => {
    const loadCompanyInfo = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          setCompanyInfo(data);
        }
      } catch (error) {
        console.error('Error loading company info:', error);
      } finally {
        setLoadingCompany(false);
      }
    };
    loadCompanyInfo();
  }, [user]);

  const handleEditCompany = () => {
    setEditedCompanyInfo({
      company_name: companyInfo?.company_name || '',
      contact_email: companyInfo?.contact_email || user?.email || '',
      phone: companyInfo?.phone || '',
      address: companyInfo?.address || ''
    });
    setIsEditingCompany(true);
  };

  const handleSaveCompany = async () => {
    if (!user) return;
    try {
      if (companyInfo) {
        const { error } = await supabase
          .from('companies')
          .update(editedCompanyInfo)
          .eq('user_id', user.id);
        if (error) throw error;
        setCompanyInfo({ ...companyInfo, ...editedCompanyInfo });
      } else {
        const { error } = await supabase
          .from('companies')
          .insert({ ...editedCompanyInfo, user_id: user.id });
        if (error) throw error;
        setCompanyInfo({ ...editedCompanyInfo, user_id: user.id });
      }
      setIsEditingCompany(false);
      toast({ title: "Success", description: "Company information updated successfully" });
    } catch (error) {
      console.error('Error saving company info:', error);
      toast({ title: "Error", description: "Failed to save company information", variant: "destructive" });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingCompany(false);
    setEditedCompanyInfo({});
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Account Information</CardTitle>
          <CardDescription className="text-slate-200">
            Manage your personal and company information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white">Email</label>
              <p className="text-sm text-slate-200">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-white">Account Status</label>
              <p className="text-sm text-slate-200">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/60 to-blue-800/60 backdrop-blur-md border-slate-400/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Company Information</CardTitle>
          <CardDescription className="text-slate-200">
            Update your company details for project documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingCompany ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name" className="text-white">Company Name</Label>
                  <Input id="company_name" value={editedCompanyInfo.company_name || ''} onChange={e => setEditedCompanyInfo({ ...editedCompanyInfo, company_name: e.target.value })} placeholder="Enter company name" />
                </div>
                <div>
                  <Label htmlFor="contact_email" className="text-white">Contact Email</Label>
                  <Input id="contact_email" type="email" value={editedCompanyInfo.contact_email || ''} onChange={e => setEditedCompanyInfo({ ...editedCompanyInfo, contact_email: e.target.value })} placeholder="Enter contact email" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white">Phone</Label>
                  <Input id="phone" value={editedCompanyInfo.phone || ''} onChange={e => setEditedCompanyInfo({ ...editedCompanyInfo, phone: e.target.value })} placeholder="Enter phone number" />
                </div>
                <div>
                  <Label htmlFor="address" className="text-white">Address</Label>
                  <Input id="address" value={editedCompanyInfo.address || ''} onChange={e => setEditedCompanyInfo({ ...editedCompanyInfo, address: e.target.value })} placeholder="Enter address" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveCompany} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancelEdit} className="w-full sm:w-auto">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white">Company Name</label>
                  <p className="text-sm text-slate-200">{loadingCompany ? 'Loading...' : companyInfo?.company_name || 'No company information yet'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white">Contact Email</label>
                  <p className="text-sm text-slate-200">{loadingCompany ? 'Loading...' : companyInfo?.contact_email || user?.email || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white">Phone</label>
                  <p className="text-sm text-slate-200">{loadingCompany ? 'Loading...' : companyInfo?.phone || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white">Address</label>
                  <p className="text-sm text-slate-200">{loadingCompany ? 'Loading...' : companyInfo?.address || 'Not specified'}</p>
                </div>
              </div>
              {!loadingCompany && !companyInfo && <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Your account information will be automatically imported when you submit your first project.
                </p>
              </div>}
              <Button variant="outline" onClick={handleEditCompany} className="w-full sm:w-auto">
                <Edit className="h-4 w-4 mr-2" />
                Edit Company Information
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountInfoTab;