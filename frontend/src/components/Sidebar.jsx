import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  DollarSign, 
  BarChart2, 
  Boxes, 
  Receipt, 
  Cpu 
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Demand Forecast', path: '/forecast', icon: TrendingUp },
    { name: 'Price Recommendation', path: '/pricing', icon: DollarSign },
    { name: 'Sales Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Inventory', path: '/inventory', icon: Boxes },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'ML Model', path: '/ml-model', icon: Cpu },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white font-bold">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-none">DynamicPricer</h1>
          <span className="text-xs text-indigo-400 font-medium">AI Optimization Engine</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        B.Tech Data Science Project © 2026
      </div>
    </aside>
  );
};

export default Sidebar;

