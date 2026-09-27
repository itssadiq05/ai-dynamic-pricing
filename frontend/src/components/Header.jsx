import React from 'react';
import { Bell, Search, UserCheck } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50 w-72">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products, predictions..."
          className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-bold text-sm">
            DS
          </div>
          <div className="text-xs">
            <p className="font-medium text-slate-200">Academic Demo</p>
            <p className="text-slate-500">B.Tech 5th Sem</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

