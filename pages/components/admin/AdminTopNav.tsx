// components/TopNavbar.tsx
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface TopNavbarProps {
    className?: string;
}

const UserTopNavbar: React.FC<TopNavbarProps> = ({ className }) => {
    const supabase = useSupabaseClient();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error logging out:', error.message);
                alert('Failed to log out. Please try again.');
                window.location.href = '/login';
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.error('Unexpected error during logout:', err);
            alert('An unexpected error occurred. Please try again.');
            window.location.href = '/login';
        }
    };

    return (
        <nav className={`top-navbar bg-slate-100 flex justify-end px-6 py-2 drop-shadow ${className}`}>
            <ul>
                <li className="w-full flex justify-center m-0">
                     <select name="clients-dropdown" id="clientsDropdown">
                        <option value="1">View All</option>
                        <option value="2">Adam</option>
                        <option value="3">Charlie</option>
                        <option value="4">Brad</option>
                    </select>
                </li>
            </ul>
        </nav>
    );
};

export default UserTopNavbar;