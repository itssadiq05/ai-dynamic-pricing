import React, { useEffect, useState } from 'react';
import { getProducts, getDemandForecast } from '../services/api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const DemandForecast = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [horizon, setHorizon] = useState(7);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProducts().then(res => {
      setProducts(res.data);
      if (res.data.length > 0) setSelectedProduct(res.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;
    setLoading(true);
    getDemandForecast(selectedProduct, horizon)
      .then(res => setForecast(res.data.forecast))
      .finally(() => setLoading(false));
  }, [selectedProduct, horizon]);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Demand Forecasting Engine</h1>
        <p className="text-sm text-slate-400">ML-driven time horizon demand predictions</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-wrap gap-6 items-center">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">Select Product</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 outline-none"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">Horizon (Days)</label>
          <select
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 outline-none"
          >
            <option value={7}>Next 7 Days</option>
            <option value={14}>Next 14 Days</option>
            <option value={30}>Next 30 Days</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-slate-200 mb-6">Predicted Demand Curve</h3>
        {loading ? (
          <div className="h-72 flex items-center justify-center text-slate-500">Calculating ML Forecast...</div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                <Line type="monotone" dataKey="predicted_demand" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandForecast;

