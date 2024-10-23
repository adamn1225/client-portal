import React, { ReactNode, useState, useEffect } from 'react';
import UserSideNav from './UserSideNav';

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
        <div className="relative flex h-screen overflow-hidden">
            <UserSideNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex flex-col flex-grow ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 ease-in-out overflow-auto`}>
                <main className="flex-grow p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default UserLayout;