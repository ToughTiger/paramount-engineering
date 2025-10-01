
import React from 'react';

interface LogoProps {
    variant?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark' }) => {
    const baseTextColor = variant === 'dark' ? 'text-slate-800' : 'text-white';
    const subTextColor = variant === 'dark' ? 'text-slate-500' : 'text-slate-300';
    
    return (
        <div className="select-none">
            <span className={`text-3xl font-bold tracking-tight ${baseTextColor}`}>
                <span>PARA</span>
                <span className="text-lime-400 font-extrabold">MOUNT</span>
            </span>
            <p className={`text-xs font-thin ${subTextColor} tracking-[0.3em] uppercase -mt-1`} style={{ paddingLeft: '0.3em' }}>Engineering</p>
        </div>
    );
};
