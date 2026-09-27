import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="apple-glass sticky top-0 z-30 w-full border-b border-white/[0.08] px-6 py-3">
      <div className="flex items-center justify-between gap-4">

        {/* Search */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#86868b]" />
          </div>

          <input
            type="text"
            placeholder="Search products, predictions..."
            className="w-full bg-[#1c1c1e] text-[#f5f5f7] placeholder-[#86868b] text-sm rounded-full pl-10 pr-4 py-2.5 border border-white/[0.08] focus:outline-none focus:border-white/20"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Notification */}
          <button
            type="button"
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#a1a1a6] hover:text-white hover:bg-[#2c2c2e]"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />

            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-white" />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-white/[0.08]" />

          {/* User */}
          <div className="flex items-center gap-3">

            <div className="h-9 w-9 rounded-full bg-[#2c2c2e] border border-white/[0.10] flex items-center justify-center text-[#f5f5f7] font-semibold text-xs">
              DS
            </div>

            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-[#f5f5f7] leading-tight">
                Academic Demo
              </p>

              <p className="text-[11px] text-[#86868b] mt-0.5">
                B.Tech 5th Sem
              </p>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;