import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import AdminDashboard from '@/pages/admin/admin-dashboard'; // Ensure the correct path

const AdminLogin = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error.message);
        } else if (data) {
          if (data.role === 'admin') {
            setIsAdmin(true);
            router.push('/admin/admin-dashboard'); // Redirect to admin dashboard
          }
        }
      }
      setLoading(false);
    };

    checkAdminRole();
  }, [session, supabase, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAdmin) {
    return <p>You do not have access to this page.</p>;
  }

  return null; // Since we are redirecting, we don't need to render anything here
};

export default AdminLogin;