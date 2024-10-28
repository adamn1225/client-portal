// admin-dash/index.tsx
import React from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import AdminSignUp from '@/components/AdminSignUp';
const AdminDashboard = () => {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();

  // Add your admin dashboard functionalities here

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AdminSignUp />
    </div>
  );
};

export default AdminDashboard;