import React, { ReactNode, useState, useEffect } from 'react';
import UserSideNav from './UserSideNav'; 
import UserTopNav from './UserTopNav';

interface UserLayoutProps {
    children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
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
        <div className="md:layout">
            <div className='z-50'><UserSideNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /></div>
            <div className="fixed top-0 left-0 z-30 w-full">
                <UserTopNav />
            </div>
            <main className="main-content ml-0 lg:ml-52 z-0 md:p-4 mt-20 relative">

                {children}
            </main>
        </div>
    );
};

export default UserLayout;