// components/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import AnalyticsCard from './AnalyticsCard';
import { fetchSignups, fetchQuoteRequests, fetchUsageStats } from '@/lib/analytics';

const AdminAnalytics = () => {
    const [signups, setSignups] = useState<number>(0);
    const [quoteRequests, setQuoteRequests] = useState<number>(0);
    const [usageStats, setUsageStats] = useState<{ loginCount: number; activeTime: number }>({ loginCount: 0, activeTime: 0 });

    useEffect(() => {
        const fetchData = async () => {
            const signupsData = await fetchSignups('month');
            const quoteRequestsData = await fetchQuoteRequests('month');
            const usageStatsData = await fetchUsageStats('month');

            setSignups(signupsData.length);
            setQuoteRequests(quoteRequestsData.length);
            setUsageStats({
                loginCount: usageStatsData.reduce((acc, stat) => acc + stat.login_count, 0),
                activeTime: usageStatsData.reduce((acc, stat) => acc + stat.active_time, 0),
            });
        };

        fetchData();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AnalyticsCard title="New Signups" value={signups} description="Signups in the last month" />
                <AnalyticsCard title="Quote Requests" value={quoteRequests} description="Quote requests in the last month" />
                <AnalyticsCard title="Login Counts" value={usageStats.loginCount} description="Logins in the last month" />
                <AnalyticsCard title="Active Time" value={usageStats.activeTime} description="Active time in the last month (minutes)" />
            </div>
        </div>
    );
};

export default AdminAnalytics;