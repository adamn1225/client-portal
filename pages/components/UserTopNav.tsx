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
        <nav className={`top-navbar xs:hidden sm:hidden bg-slate-100 flex justify-end px-6 py-2 drop-shadow ${className}`}>
            <ul className='xs:hidden sm:hidden'>
                <li className="w-full flex justify-center m-0">
                    <button className="bg-slate-700 text-slate-100 font-bold px-6 py-1 rounded-sm" onClick={handleLogout}>
                        Contact Support
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default UserTopNavbar;