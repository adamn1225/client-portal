import AdminLayout from '../../components/admin-portal/AdminLayout'; // Ensure consistent casing
import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { UserProvider } from '@/context/UserContext';
import AdminDocuments from '@/components/admin/AdminDocuments';


const AdminQuoteRequestsPage: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <p>Loading...</p>;
    }
    return (
        <AdminLayout>
            <AdminDocuments session={session} />
        </AdminLayout>
    );
};

export default AdminQuoteRequestsPage;