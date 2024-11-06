import React, { useEffect, useState } from 'react';
import AnalyticsCard from './AnalyticsCard';
import UserSearch from './UserSearch';
import { fetchSignups, fetchQuoteRequests, fetchUsageStats } from '@/lib/analytics';

const AdminAnalytics = () => {
    const [signups, setSignups] = useState<number>(0);
    const [quoteRequests, setQuoteRequests] = useState<number>(0);
    const [usageStats, setUsageStats] = useState<{ loginCount: number; activeTime: number }>({ loginCount: 0, activeTime: 0 });
    const [signupsByDay, setSignupsByDay] = useState<number>(0);
    const [signupsByWeek, setSignupsByWeek] = useState<number>(0);
    const [signupsByMonth, setSignupsByMonth] = useState<number>(0);
    const [signupsByYear, setSignupsByYear] = useState<number>(0);

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

            // Fetch signups by day, week, month, and year
            const signupsByDayData = await fetchSignups('day');
            const signupsByWeekData = await fetchSignups('week');
            const signupsByMonthData = await fetchSignups('month');
            const signupsByYearData = await fetchSignups('year');

            setSignupsByDay(signupsByDayData.length);
            setSignupsByWeek(signupsByWeekData.length);
            setSignupsByMonth(signupsByMonthData.length);
            setSignupsByYear(signupsByYearData.length);
        };

        fetchData();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AnalyticsCard title="New Signups" value={signups} description="Signups in the last month" />
                <AnalyticsCard title="Quote Requests" value={quoteRequests} description="Quote requests in the last month" />
                <AnalyticsCard title="Login Counts" value={usageStats.loginCount} description="Logins in the last month" />
                <AnalyticsCard title="Active Time" value={usageStats.activeTime} description="Active time in the last month (minutes)" />
                <AnalyticsCard title="Signups by Day" value={signupsByDay} description="Signups in the last day" />
                <AnalyticsCard title="Signups by Week" value={signupsByWeek} description="Signups in the last week" />
                <AnalyticsCard title="Signups by Month" value={signupsByMonth} description="Signups in the last month" />
                <AnalyticsCard title="Signups by Year" value={signupsByYear} description="Signups in the last year" />
            </div>
            <UserSearch />
        </div>
    );
};

export default AdminAnalytics;