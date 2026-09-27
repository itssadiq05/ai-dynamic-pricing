import React, { useEffect, useState } from 'react';
import { getDashboardSummary, getDashboardCharts } from '../services/api';
import KPICard from '../components/KPICard';
import {
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardSummary(),
      getDashboardCharts(),
    ])
      .then(([sumRes, chartRes]) => {
        setSummary(sumRes.data);
        setCharts(chartRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-full bg-black p-8 flex items-center justify-center">
        <div className="text-sm text-[#86868b]">
          Loading dashboard data...
        </div>
      </div>
    );
  }

  const COLORS = [
    '#f5f5f7',
    '#a1a1a6',
    '#636366',
    '#48484a',
    '#2c2c2e',
  ];

  return (
    <div className="min-h-full bg-black px-6 py-7 lg:px-8 lg:py-8">

      {/* Page Header */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#636366] font-semibold mb-2">
          Overview
        </p>

        <div className="flex flex-col gap-1">
          <h1 className="text-3xl lg:text-[34px] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
            Executive Analytics
          </h1>

          <p className="text-sm text-[#86868b]">
            Real-time demand metrics and dynamic pricing overview
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

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

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Revenue Trend */}
        <div className="xl:col-span-2 bg-[#111113] border border-white/[0.08] rounded-2xl p-5 lg:p-6">

          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-[17px] font-semibold text-[#f5f5f7]">
                Revenue Trend
              </h2>

              <p className="text-xs text-[#636366] mt-1">
                Monthly revenue performance
              </p>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.06]">
              <span className="text-[10px] text-[#a1a1a6] uppercase tracking-wider">
                Monthly
              </span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={charts?.revenue_trend || []}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#f5f5f7"
                      stopOpacity={0.16}
                    />

                    <stop
                      offset="100%"
                      stopColor="#f5f5f7"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#2c2c2e"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  stroke="#636366"
                  tick={{
                    fill: '#86868b',
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  stroke="#636366"
                  tick={{
                    fill: '#86868b',
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    `₹${Number(value).toLocaleString()}`
                  }
                />

                <Tooltip
                  cursor={{
                    stroke: '#48484a',
                    strokeWidth: 1,
                  }}
                  contentStyle={{
                    backgroundColor: '#1c1c1e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#f5f5f7',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                  }}
                  labelStyle={{
                    color: '#a1a1a6',
                    marginBottom: '4px',
                  }}
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString()}`,
                    'Revenue',
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f5f5f7"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  fillOpacity={1}
                  activeDot={{
                    r: 4,
                    fill: '#f5f5f7',
                    stroke: '#000000',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5 lg:p-6">

          <div className="mb-4">
            <h2 className="text-[17px] font-semibold text-[#f5f5f7]">
              Category Breakdown
            </h2>

            <p className="text-xs text-[#636366] mt-1">
              Revenue distribution by category
            </p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.category_revenue || []}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={82}
                  innerRadius={48}
                  paddingAngle={3}
                >
                  {(charts?.category_revenue || []).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#111113"
                        strokeWidth={2}
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1c1e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#f5f5f7',
                  }}
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString()}`,
                    'Revenue',
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category List */}
          <div className="space-y-2 mt-1">
            {(charts?.category_revenue || []).map(
              (item, index) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          COLORS[index % COLORS.length],
                      }}
                    />

                    <span className="text-xs text-[#a1a1a6]">
                      {item.category}
                    </span>
                  </div>

                  <span className="text-xs text-[#d1d1d6]">
                    ₹{Number(item.revenue).toLocaleString()}
                  </span>
                </div>
              )
            )}
          </div>

        </div>

      </div>

      {/* Bottom Status */}
      <div className="mt-4 flex items-center justify-between px-1">
        <p className="text-[11px] text-[#48484a]">
          Dynamic pricing analytics engine
        </p>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="text-[11px] text-[#636366]">
            Live Data
          </span>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;