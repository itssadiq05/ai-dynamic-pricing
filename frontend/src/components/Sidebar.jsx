import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  DollarSign,
  BarChart3,
  Boxes,
  Receipt,
  Cpu,
} from 'lucide-react';

const navItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Products',
    path: '/products',
    icon: Package,
  },
  {
    name: 'Demand Forecast',
    path: '/forecast',
    icon: TrendingUp,
  },
  {
    name: 'Price Recommendation',
    path: '/pricing',
    icon: DollarSign,
  },
  {
    name: 'Sales Analytics',
    path: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Inventory',
    path: '/inventory',
    icon: Boxes,
  },
  {
    name: 'Transactions',
    path: '/transactions',
    icon: Receipt,
  },
  {
    name: 'ML Model',
    path: '/ml-model',
    icon: Cpu,
  },
];

const Sidebar = () => {
  return (
    <aside className="w-[250px] min-h-screen bg-[#0b0b0d] border-r border-white/[0.08] flex flex-col shrink-0">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-black" />
          </div>

          <div>
            <h1 className="text-[15px] font-semibold text-[#f5f5f7] tracking-tight">
              DynamicPricer
            </h1>

            <p className="text-[10px] text-[#86868b] mt-0.5">
              AI Optimization Engine
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">

        <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.12em] text-[#636366] font-semibold">
          Overview
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-black font-medium'
                    : 'text-[#a1a1a6] hover:bg-[#1c1c1e] hover:text-white'
                }`
              }
            >
              <Icon className="w-[17px] h-[17px] shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Status */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="rounded-xl bg-[#151517] border border-white/[0.06] px-3 py-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white" />

            <span className="text-xs text-[#d1d1d6]">
              System Status
            </span>
          </div>

          <p className="text-[11px] text-[#636366] mt-1.5 ml-4">
            AI Engine Active
          </p>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;