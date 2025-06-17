
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type GenderType = 'Male' | 'Female';

interface AdminUser {
  id: string;
  name: string;
  username: string;
  gender: GenderType;
  email: string;
  password: string;
}

export const useAdminUsers = (onUserCountChange: () => void) => {
  const { toast } = useToast();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('admin_users').select('*');
      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin users",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const addUser = async (userData: Omit<AdminUser, 'id'>) => {
    try {
      const { error } = await supabase.from('admin_users').insert([userData]);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin user added successfully",
      });

      fetchAdminUsers();
      onUserCountChange();
      return true;
    } catch (error: any) {
      console.error('Error adding admin user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add admin user",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUser = async (user: AdminUser) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update(user)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin user updated successfully",
      });

      fetchAdminUsers();
      onUserCountChange();
      return true;
    } catch (error: any) {
      console.error('Error updating admin user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update admin user",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin user?')) return false;

    try {
      const { error } = await supabase.from('admin_users').delete().eq('id', id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin user deleted successfully",
      });

      fetchAdminUsers();
      onUserCountChange();
      return true;
    } catch (error: any) {
      console.error('Error deleting admin user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete admin user",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  return {
    adminUsers,
    loading,
    addUser,
    updateUser,
    deleteUser,
    fetchAdminUsers
  };
};
