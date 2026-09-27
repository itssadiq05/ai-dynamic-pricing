import React, { useEffect, useState } from 'react';
import { getProducts, getDemandForecast } from '../services/api';
import { TrendingUp, CalendarDays } from 'lucide-react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const DemandForecast = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [horizon, setHorizon] = useState(7);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProducts().then((res) => {
      setProducts(res.data);

      if (res.data.length > 0) {
        setSelectedProduct(res.data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;

    setLoading(true);

    getDemandForecast(selectedProduct, horizon)
      .then((res) => setForecast(res.data.forecast))
      .finally(() => setLoading(false));
  }, [selectedProduct, horizon]);

  const selectedProductName =
    products.find((p) => p.id === Number(selectedProduct))?.name ||
    products.find((p) => p.id === selectedProduct)?.name ||
    'Select a product';

  return (
    <div className="min-h-full bg-black px-6 py-7 lg:px-8 lg:py-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#636366] font-semibold mb-2">
          Machine Learning
        </p>

        <h1 className="text-3xl lg:text-[34px] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
          Demand Forecast
        </h1>

        <p className="text-sm text-[#86868b] mt-1">
          ML-driven demand predictions for your product catalog
        </p>
      </div>

      {/* Controls */}
      <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5 lg:p-6 mb-4">

        <div className="flex flex-col lg:flex-row lg:items-end gap-5">

          {/* Product */}
          <div className="flex-1 max-w-md">
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366] mb-2.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Select Product
            </label>

            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full bg-[#1c1c1e] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#f5f5f7] focus:border-white/[0.2] outline-none appearance-none cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Horizon */}
          <div className="w-full lg:w-52">
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366] mb-2.5">
              <CalendarDays className="w-3.5 h-3.5" />
              Forecast Horizon
            </label>

            <select
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="w-full bg-[#1c1c1e] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#f5f5f7] focus:border-white/[0.2] outline-none appearance-none cursor-pointer"
            >
              <option value={7}>Next 7 Days</option>
              <option value={14}>Next 14 Days</option>
              <option value={30}>Next 30 Days</option>
            </select>
          </div>

          {/* Selected Product Info */}
          <div className="lg:ml-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <div className="w-2 h-2 rounded-full bg-white" />

            <div>
              <p className="text-[10px] text-[#636366] uppercase tracking-wider">
                Forecasting
              </p>

              <p className="text-xs font-medium text-[#d1d1d6] mt-0.5">
                {selectedProductName}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5 lg:p-6">

        <div className="flex items-start justify-between mb-6">

          <div>
            <h2 className="text-[17px] font-semibold text-[#f5f5f7]">
              Predicted Demand Curve
            </h2>

            <p className="text-xs text-[#636366] mt-1">
              Expected demand over the selected time horizon
            </p>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.06]">
            <span className="text-[10px] text-[#a1a1a6] uppercase tracking-wider">
              {horizon} Days
            </span>
          </div>

        </div>

        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center">

            <div className="w-8 h-8 rounded-full border-2 border-[#2c2c2e] border-t-[#f5f5f7] animate-spin mb-4" />

            <p className="text-sm text-[#86868b]">
              Calculating ML forecast...
            </p>

            <p className="text-[11px] text-[#48484a] mt-1">
              Processing demand patterns
            </p>

          </div>
        ) : (
          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={forecast}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  stroke="#2c2c2e"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
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
                    `${Number(value).toFixed(0)} units`,
                    'Predicted Demand',
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="predicted_demand"
                  stroke="#f5f5f7"
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                    fill: '#f5f5f7',
                    stroke: '#000000',
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 5,
                    fill: '#f5f5f7',
                    stroke: '#000000',
                    strokeWidth: 2,
                  }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>
        )}

      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between px-1">

        <p className="text-[11px] text-[#48484a]">
          AI demand prediction engine
        </p>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />

          <span className="text-[11px] text-[#636366]">
            Gradient Boosting Model
          </span>
        </div>

      </div>

    </div>
  );
};

export default DemandForecast;