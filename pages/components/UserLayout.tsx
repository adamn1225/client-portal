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
        <div className="layout">
            <UserSideNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <main className="main-content z-0 p-4 mt-20 relative">
                <div className="fixed top-0 left-0 w-full z-50">
                    <UserTopNav />
                </div>
                {children}
            </main>
        </div>
    );
};

export default UserLayout;