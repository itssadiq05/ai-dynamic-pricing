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
      <div className="p-8">
        <h1 className="text-3xl font-bold text-slate-100">
          Sales Analytics
        </h1>

        <p className="mt-2 text-slate-400">
          Loading sales data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-slate-100">
          Sales Analytics
        </h1>

        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">
          Sales Analytics
        </h1>

        <p className="mt-2 text-slate-400">
          In-depth sales metrics visualization.
        </p>
      </div>

      {/* Revenue Trend */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Revenue Trend
          </h2>

          <p className="text-sm text-slate-400">
            Monthly revenue and sales quantity
          </p>
        </div>

        {data.revenue_trend.length > 0 ? (
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenue_trend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />

                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                />

                <YAxis
                  stroke="#94a3b8"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-slate-500">
            No revenue data available
          </div>
        )}
      </div>

      {/* Two charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Category Revenue */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Category Revenue
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Revenue distribution by category
          </p>

          {data.category_revenue.length > 0 ? (
            <div className="mt-6 h-[330px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.category_revenue}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {data.category_revenue.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={[
                          "#6366f1",
                          "#22c55e",
                          "#f59e0b",
                          "#ef4444",
                          "#06b6d4",
                          "#a855f7",
                        ][index % 6]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                    }}
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-slate-500">
              No category data available
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Top Selling Products
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Products with highest units sold
          </p>

          {data.top_products.length > 0 ? (
            <div className="mt-6 h-[330px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.top_products}
                  layout="vertical"
                  margin={{
                    left: 30,
                    right: 20,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                  />

                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    stroke="#94a3b8"
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                    }}
                  />

                  <Bar
                    dataKey="quantity"
                    fill="#22c55e"
                    radius={[0, 6, 6, 0]}
                    name="Units Sold"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-slate-500">
              No product data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;