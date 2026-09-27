import React, { useEffect, useState } from 'react';
import { getDashboardSummary, getDashboardCharts } from '../services/api';
import KPICard from '../components/KPICard';
import { Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Cell, PieChart, Pie } from 'recharts';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardSummary(), getDashboardCharts()])
      .then(([sumRes, chartRes]) => {
        setSummary(sumRes.data);
        setCharts(chartRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Loading Dashboard Data...</div>;

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Executive Analytics Dashboard</h1>
        <p className="text-sm text-slate-400">Real-time demand metrics and dynamic pricing overview</p>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Products"
          value={summary?.total_products || 0}
          subtext="Active catalog items"
          icon={Package}
          color="indigo"
        />
        <KPICard
          title="Total Revenue"
          value={`₹${(summary?.total_revenue || 0).toLocaleString()}`}
          subtext="Cumulative gross revenue"
          icon={DollarSign}
          color="emerald"
        />
        <KPICard
          title="Units Sold"
          value={(summary?.total_sales_units || 0).toLocaleString()}
          subtext="Historical orders count"
          icon={TrendingUp}
          color="amber"
        />
        <KPICard
          title="Low Stock Warning"
          value={summary?.low_stock_products || 0}
          subtext="Items below minimum buffer"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-slate-200 mb-4">Revenue Trend (Monthly)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.revenue_trend || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-slate-200 mb-4">Category Breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.category_revenue || []}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ category }) => category}
                >
                  {(charts?.category_revenue || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

