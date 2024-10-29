// components/AdminLogin.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/initSupabase';
import AdminDashboard from './admin/AdminAnalytics'; // Ensure you have this component

const AdminLogin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError.message);
        setLoading(false);
        return;
      }

      if (user) {
        console.log('User ID:', user.id); // Debugging
        const { data, error } = await supabase
          .from('profiles') // Ensure the table name is correct
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error.message);
        } else if (data) {
          console.log('User Role:', data.role); // Debugging
          if (data.role === 'admin') {
            setIsAdmin(true);
          }
        } else {
          console.error('No user role found for user ID:', user.id);
        }
      }
      setLoading(false);
    };

    checkAdminRole();
  }, []);

  useEffect(() => {
    console.log('isAdmin:', isAdmin); // Debugging
  }, [isAdmin]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAdmin) {
    return <p>You do not have access to this page.</p>;
  }

  return <AdminDashboard />;
};

export default AdminLogin;