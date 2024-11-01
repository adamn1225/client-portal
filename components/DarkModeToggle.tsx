import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
    className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className }) => {
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDarkMode);
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        document.documentElement.classList.toggle('dark', newDarkMode);
    };

    return (
        <div className={`flex items-center ${className}`}>
            <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                className={`mr-2 data-[state=unchecked]:bg-gray-700 data-[state=checked]:bg-amber-400`}
            >
                <span className={`block w-6 h-6 rounded-full ${darkMode ? 'bg-yellow-500' : 'bg-gray-900'}`}></span>
            </Switch>
            {darkMode ? <Sun className="text-yellow-500" /> : <Moon className="dark:text-slate-100 text-gray-900" />}
        </div>
    );
};

export default DarkModeToggle;