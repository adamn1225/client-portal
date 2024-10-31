import AdminLayout from '../../components/admin-portal/AdminLayout'; // Ensure consistent casing
import AdminQuoteRequests from '@/components/admin/AdminQuoteRequests';

const AdminQuoteRequestsPage = () => {
    return (
        <AdminLayout>
            <AdminQuoteRequests />
        </AdminLayout>
    );
};

export default AdminQuoteRequestsPage;