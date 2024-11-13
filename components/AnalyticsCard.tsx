import React from 'react';

interface AnalyticsCardProps {
    title: string;
    value: number;
    description: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, description }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-3xl">{value}</p>
            <p className="text-zinc-500">{description}</p>
        </div>
    );
};

export default AnalyticsCard;