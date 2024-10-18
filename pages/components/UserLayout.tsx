// components/UserLayout.tsx
import React, { ReactNode } from 'react';
import UserSideNav from './UserSideNav';
import UserTopNav from './UserTopNav';

interface UserLayoutProps {
    children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    return (
        <div className="relative flex h-screen overflow-hidden">
            <UserSideNav />
            <div className="flex flex-col flex-grow ml-64 overflow-auto"> {/* Adjust margin-left to match the width of the side nav */}
                <UserTopNav />
                <main className="flex-grow p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default UserLayout;