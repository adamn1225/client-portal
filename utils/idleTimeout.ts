// utils/idleTimeout.ts
import { supabase } from '@/lib/database';

let idleTimeout: NodeJS.Timeout;

const IDLE_TIME_LIMIT = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

const resetIdleTimeout = () => {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(logoutUser, IDLE_TIME_LIMIT);
};

const logoutUser = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; // Redirect to login page
};

const setupIdleTimeout = () => {
    window.addEventListener('mousemove', resetIdleTimeout);
    window.addEventListener('keydown', resetIdleTimeout);
    window.addEventListener('scroll', resetIdleTimeout);
    window.addEventListener('beforeunload', logoutUser);

    resetIdleTimeout(); // Initialize the timeout
};

export default setupIdleTimeout;