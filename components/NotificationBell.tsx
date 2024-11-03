import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '@/lib/initSupabase';
import { Database } from '@/lib/schema';
import { Session } from '@supabase/auth-helpers-react';

type Notification = Database['public']['Tables']['notifications']['Row'];

interface NotificationBellProps {
    session: Session | null;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ session }) => {
    const [hasNotifications, setHasNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [errorText, setErrorText] = useState<string>('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!session?.user?.id) {
                console.error('No session or user ID found'); // Debugging log
                return;
            }

            try {
                // Fetch notifications
                const { data: notifications, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', session.user.id);

                if (error) {
                    setErrorText(error.message);
                    console.error('Error fetching notifications:', error.message);
                    return;
                }

                console.log('Fetched notifications:', notifications); // Debugging log

                // Check for unread notifications
                if (notifications.some(notification => !notification.is_read)) {
                    setHasNotifications(true);
                }
                setNotifications(notifications.filter(notification => notification.user_id !== null && notification.is_read !== null && notification.created_at !== null) as Notification[]);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setErrorText('Error fetching notifications');
            }
        };

        fetchNotifications();
    }, [session]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const markAsRead = async (notificationId: number) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (error) {
                console.error('Error marking notification as read:', error.message);
                return;
            }

            setNotifications(notifications.map(notification =>
                notification.id === notificationId ? { ...notification, is_read: true } : notification
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleSendEmailNotification = async (to: string, subject: string, text: string) => {
        try {
            const response = await fetch('/api/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ to, subject, text }),
            });

            if (!response.ok) {
                console.error('Error sending email:', await response.json());
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    return (
        <div className="relative mt-2 z-50 h-full" ref={dropdownRef}>
            <button onClick={toggleDropdown}>
                <Bell className="h-6 w-6" />
                {hasNotifications && <div className="absolute top-16 right-0 h-2 w-2 bg-red-500 rounded-full"></div>}
            </button>
            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-{1200px} max-w-max max-h-max h-screen bg-white dark:bg-gray-900 border border-gray-300 overflow-y-scroll rounded shadow-lg z-50">
                    <div className="p-2">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-2 border-b z-50 border-gray-200 ${notification.is_read ? 'bg-white dark:bg-gray-600' : 'bg-gray-300 dark:bg-gray-900'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="dark:text-stone-100">{notification.message}</span>
                                        {!notification.is_read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-blue-500 text-sm"
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-nowrap">No new notifications</div>
                        )}
                    </div>
                </div>
            )}
            {errorText && <div className="text-red-500">{errorText}</div>}
        </div>
    );
};

export default NotificationBell;