import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '@/context/DarkModeContext';

interface DarkModeToggleProps {
    className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className }) => {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <div className={`flex items-center ${className}`}>
            <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                className={`mr-2 data-[state=unchecked]:bg-gray-600 data-[state=checked]:bg-stone-300`}
            >
                <span className={`block w-6 h-6 rounded-full ${darkMode ? 'bg-gray-900' : 'bg-gray-900'}`}></span>
            </Switch>
            {darkMode ? <Sun className="text-yellow-500" /> : <Moon className="dark:text-slate-100 text-gray-900" />}
        </div>
    );
};

export default DarkModeToggle;