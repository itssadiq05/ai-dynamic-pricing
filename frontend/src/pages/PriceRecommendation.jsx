import React, { useEffect, useState } from 'react';
import { getProducts, getPriceRecommendation } from '../services/api';
import { Sparkles, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

const PriceRecommendation = () => {
  const [products, setProducts] = useState([]);
  const [selectedProdId, setSelectedProdId] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProducts().then(res => {
      setProducts(res.data);
      if (res.data.length > 0) setSelectedProdId(res.data[0].id);
    });
  }, []);

  const handleFetchRecommendation = () => {
    if (!selectedProdId) return;
    setLoading(true);
    getPriceRecommendation({ product_id: parseInt(selectedProdId) })
      .then(res => setRecommendation(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedProdId) handleFetchRecommendation();
  }, [selectedProdId]);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dynamic Price Recommendation Engine</h1>
        <p className="text-sm text-slate-400">Explainable pricing algorithm balancing demand, margins, and competition</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
        <div className="w-1/3">
          <label className="block text-xs font-semibold text-slate-400 mb-2">Select Target Product</label>
          <select
            value={selectedProdId}
            onChange={(e) => setSelectedProdId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 outline-none"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleFetchRecommendation}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Run Pricing Optimization
        </button>
      </div>

      {recommendation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h3 className="text-base font-bold text-slate-300">Price Adjustment Summary</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Current Price:</span>
              <span className="text-lg font-bold text-slate-200">₹{recommendation.current_price}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Competitor Price:</span>
              <span className="text-lg font-semibold text-slate-300">₹{recommendation.competitor_price}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Cost Floor Price:</span>
              <span className="text-lg font-semibold text-slate-400">₹{recommendation.cost_price}</span>
            </div>

            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
              <span className="text-indigo-400 text-sm font-semibold">Recommended Price:</span>
              <span className="text-2xl font-extrabold text-indigo-400">₹{recommendation.recommended_price}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              {recommendation.price_change_percent >= 0 ? (
                <span className="text-emerald-400 flex items-center"><ArrowUpRight className="w-4 h-4" />+{recommendation.price_change_percent}% change</span>
              ) : (
                <span className="text-rose-400 flex items-center"><ArrowDownRight className="w-4 h-4" />{recommendation.price_change_percent}% change</span>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-bold mb-4">
                <Info className="w-5 h-5" />
                <h3>Algorithmic Justification & Logic Breakdown</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm bg-slate-800/40 p-5 rounded-xl border border-slate-700/50">
                {recommendation.explanation}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500">Predicted Demand</span>
                <p className="text-xl font-bold text-slate-200 mt-1">{recommendation.predicted_demand} units</p>
              </div>
              <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500">Expected Revenue</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">₹{recommendation.expected_revenue}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceRecommendation;

