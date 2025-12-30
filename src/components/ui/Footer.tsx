import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="absolute bottom-6 left-0 w-full flex justify-center items-center pointer-events-none z-10">
            <div className="bg-black/30 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 shadow-lg text-center">
                <p className="text-[10px] sm:text-xs font-medium text-gray-400 tracking-wide pointer-events-auto select-none leading-relaxed">
                    Crafted with passion by <span className="text-teal-500 font-bold">Ashwin Rathore</span> ❤️ <br className="sm:hidden" />
                    <span className="hidden sm:inline mx-1">•</span>
                    <a
                        href="mailto:ashwin.rathore001@gmail.com"
                        className="hover:text-white transition-colors underline decoration-gray-600 underline-offset-2"
                    >
                        ashwin.rathore001@gmail.com
                    </a>
                </p>
            </div>
        </footer>
    );
};
