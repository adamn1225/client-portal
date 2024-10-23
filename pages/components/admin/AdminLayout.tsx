import React, { ReactNode, useState, useEffect } from 'react';
import AdminSideNav from './AdminSideNav'; // Adjust the import path if necessary
import AdminTopNav from './AdminTopNav'; // Adjust the import path if necessary
import AdminQuoteRequests from '@/components/admin/AdminQuoteRequests'; // Import AdminQuoteRequests

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Check if the screen size is large enough to display the sidebar by default
        const mediaQuery = window.matchMedia('(min-width: 1024px)');
        if (mediaQuery.matches) {
            setIsSidebarOpen(true);
        }

        // Add a listener to update the state if the screen size changes
        const handleMediaQueryChange = (e: MediaQueryListEvent) => {
            setIsSidebarOpen(e.matches);
        };

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        // Clean up the event listener on component unmount
        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    return (
        <div className="relative flex h-screen overflow-hidden">
            <AdminSideNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex flex-col flex-grow ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 ease-in-out overflow-auto`}>
                {/* <AdminTopNav /> */}
                <main className="flex-grow p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;