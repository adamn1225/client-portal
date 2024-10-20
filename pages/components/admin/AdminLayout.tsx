// components/admin/AdminLayout.tsx
import React, { ReactNode } from 'react';
import AdminSideNav from './AdminSideNav'; // Adjust the import path if necessary
import AdminTopNav from './AdminTopNav'; // Adjust the import path if necessary
import AdminQuoteRequests from '@/components/admin/AdminQuoteRequests'; // Import AdminQuoteRequests

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="relative flex h-screen overflow-hidden">
            <AdminSideNav />
            <div className="flex flex-col flex-grow ml-64 overflow-auto"> {/* Adjust margin-left to match the width of the side nav */}
                <AdminTopNav />
                <main className="flex-grow p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;