import React, { ReactNode } from 'react';
import SideNavbar from './SideNavbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout">
            <div className="flex flex-grow">
                <SideNavbar />
                <main className="main-content p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;