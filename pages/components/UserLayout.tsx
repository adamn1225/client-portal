import React, { ReactNode, useState, useEffect } from 'react';
import UserSideNav from './UserSideNav';
import UserTopNav from './UserTopNav';

interface UserLayoutProps {
    children: ReactNode;
    currentView: string;
    setCurrentView: (view: string) => void;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children, currentView, setCurrentView }) => {
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
            <div className='z-40'>
                <UserSideNav
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                />
            </div>
            <main className="main-content ml-0 xl:ml-52 z-0 md:p-4 mt-28 md:mt-24 relative">
                <div className="w-full fixed top-0 left-0">
                    <UserTopNav />
                </div>
                {children}
            </main>
        </div>
    );
};

export default UserLayout;