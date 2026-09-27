import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Layers3,
} from "lucide-react";

const API_URL = "http://localhost:8000";

const SalesAnalytics = () => {
  const [data, setData] = useState({
    revenue_trend: [],
    category_revenue: [],
    top_products: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/dashboard/charts`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        setData({
          revenue_trend: result.revenue_trend || [],
          category_revenue: result.category_revenue || [],
          top_products: result.top_products || [],
        });
      } catch (err) {
        console.error("Analytics API Error:", err);
        setError("Unable to load sales analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-full bg-black px-6 py-7 lg:px-8 lg:py-8 flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#2c2c2e] border-t-[#f5f5f7] animate-spin mb-4" />

        <p className="text-sm text-[#86868b]">
          Loading sales analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-black px-6 py-7 lg:px-8 lg:py-8">

        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#636366] font-semibold mb-2">
            Analytics
          </p>

          <h1 className="text-3xl lg:text-[34px] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
            Sales Analytics
          </h1>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-6">
          <p className="text-sm text-[#a1a1a6]">
            {error}
          </p>
        </div>

      </div>
    );
  }

  const PIE_COLORS = [
    "#f5f5f7",
    "#a1a1a6",
    "#636366",
    "#48484a",
    "#d1d1d6",
    "#2c2c2e",
  ];

  return (
    <div className="min-h-full bg-black px-6 py-7 lg:px-8 lg:py-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#636366] font-semibold mb-2">
          Business Intelligence
        </p>

        <h1 className="text-3xl lg:text-[34px] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
          Sales Analytics
        </h1>

        <p className="text-sm text-[#86868b] mt-1">
          In-depth sales performance and revenue visualization
        </p>
      </div>

      {/* Revenue Trend */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-5 lg:p-6 mb-4">

        <div className="flex items-start justify-between mb-6">

          <div className="flex items-start gap-3">

            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#d1d1d6]" />
            </div>

            <div>
              <h2 className="text-[17px] font-semibold text-[#f5f5f7]">
                Revenue Trend
              </h2>

              <p className="text-xs text-[#636366] mt-1">
                Monthly revenue and sales performance
              </p>
            </div>

          </div>

          <div className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.06]">
            <span className="text-[10px] text-[#a1a1a6] uppercase tracking-wider">
              Monthly
            </span>
          </div>

        </div>

        {data.revenue_trend.length > 0 ? (
          <div className="h-[380px]">

            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.revenue_trend}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2c2c2e"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  stroke="#636366"
                  tick={{
                    fill: "#86868b",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  stroke="#636366"
                  tick={{
                    fill: "#86868b",
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
                    stroke: "#48484a",
                  }}
                  contentStyle={{
                    backgroundColor: "#1c1c1e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#f5f5f7",
                  }}
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f5f5f7"
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                    fill: "#f5f5f7",
                    stroke: "#000000",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 5,
                    fill: "#f5f5f7",
                    stroke: "#000000",
                    strokeWidth: 2,
                  }}
                  name="Revenue"
                />

              </LineChart>
            </ResponsiveContainer>

          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-[#636366]">
            No revenue data available
          </div>
        )}

      </div>

      {/* Category + Products */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Category Revenue */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-5 lg:p-6">

          <div className="flex items-start gap-3 mb-4">

            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
              <Layers3 className="w-4 h-4 text-[#d1d1d6]" />
            </div>

            <div>
              <h2 className="text-[17px] font-semibold text-[#f5f5f7]">
                Category Revenue
              </h2>

              <p className="text-xs text-[#636366] mt-1">
                Revenue distribution by category
              </p>
            </div>

          </div>

          {data.category_revenue.length > 0 ? (
            <div className="mt-3 h-[330px]">

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>

                  <Pie
                    data={data.category_revenue}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="48%"
                    outerRadius={105}
                    innerRadius={55}
                    paddingAngle={3}
                  >
                    {data.category_revenue.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          PIE_COLORS[
                            index % PIE_COLORS.length
                          ]
                        }
                        stroke="#111113"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                    contentStyle={{
                      backgroundColor: "#1c1c1e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#f5f5f7",
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      color: "#a1a1a6",
                      fontSize: "11px",
                    }}
                  />

                </PieChart>
              </ResponsiveContainer>

            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-[#636366]">
              No category data available
            </div>
          )}

        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-5 lg:p-6">

          <div className="flex items-start gap-3 mb-4">

            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#d1d1d6]" />
            </div>

            <div>
              <h2 className="text-[17px] font-semibold text-[#f5f5f7]">
                Top Selling Products
              </h2>

              <p className="text-xs text-[#636366] mt-1">
                Products with highest units sold
              </p>
            </div>

          </div>

          {data.top_products.length > 0 ? (
            <div className="mt-3 h-[330px]">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.top_products}
                  layout="vertical"
                  margin={{
                    left: 20,
                    right: 20,
                    top: 5,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#2c2c2e"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    stroke="#636366"
                    tick={{
                      fill: "#86868b",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={140}
                    stroke="#636366"
                    tick={{
                      fill: "#a1a1a6",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    cursor={{
                      fill: "rgba(255,255,255,0.03)",
                    }}
                    contentStyle={{
                      backgroundColor: "#1c1c1e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#f5f5f7",
                    }}
                  />

                  <Bar
                    dataKey="quantity"
                    fill="#d1d1d6"
                    radius={[0, 6, 6, 0]}
                    name="Units Sold"
                  />

                </BarChart>
              </ResponsiveContainer>

            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-[#636366]">
              No product data available
            </div>
          )}

        </div>

      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between px-1">

        <p className="text-[11px] text-[#48484a]">
          Sales intelligence and performance analytics
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

export default SalesAnalytics;