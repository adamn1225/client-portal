import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import NotificationBell from '@/components/NotificationBell';

interface TopNavbarProps {
    className?: string;
}

const UserTopNavbar: React.FC<TopNavbarProps> = ({ className = '' }) => {
    const supabase = useSupabaseClient<Database>();
    const session = useSession();
    const { userProfile } = useUser();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error logging out:', error.message);
                alert('Failed to log out. Please try again.');
            }
            window.location.href = '/login'; // Redirect to login page
        } catch (err) {
            console.error('Unexpected error during logout:', err);
            alert('An unexpected error occurred. Please try again.');
            window.location.href = '/login'; // Redirect to login page
        }
    };

    const profilePictureUrl = userProfile?.profile_picture
        ? supabase.storage.from('profile-pictures').getPublicUrl(userProfile.profile_picture).data.publicUrl
        : 'https://www.gravatar.com/avatar?d=mp&s=100';

    return (
        <nav className={`w-full bg-slate-100 z-50 flex justify-end px-4 py-1 drop-shadow ${className}`}>
            <ul className='flex gap-4 z-50 items-end justify-center mr-4'>
                <li className="m-0 z-50">
                    <NotificationBell session={session} />
                </li>
                <li className="flex flex-col justify-center items-center m-0">
                    <Image
                        src={profilePictureUrl}
                        alt='profile-img'
                        className='rounded-full shadow-md'
                        width={40}
                        height={40} />
                </li>
            </ul>
        </nav>
    );
};

export default UserTopNavbar;