import React, { useEffect, useState } from 'react';
import { getProducts, getPriceRecommendation } from '../services/api';
import {
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  CircleDollarSign,
  Target,
  TrendingUp,
} from 'lucide-react';

const PriceRecommendation = () => {
  const [products, setProducts] = useState([]);
  const [selectedProdId, setSelectedProdId] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProducts().then((res) => {
      setProducts(res.data);

      if (res.data.length > 0) {
        setSelectedProdId(res.data[0].id);
      }
    });
  }, []);

  const handleFetchRecommendation = () => {
    if (!selectedProdId) return;

    setLoading(true);

    getPriceRecommendation({
      product_id: parseInt(selectedProdId),
    })
      .then((res) => setRecommendation(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedProdId) {
      handleFetchRecommendation();
    }
  }, [selectedProdId]);

  return (
    <div className="min-h-full bg-black px-6 py-7 lg:px-8 lg:py-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#636366] font-semibold mb-2">
          Optimization Engine
        </p>

        <h1 className="text-3xl lg:text-[34px] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
          Price Recommendation
        </h1>

        <p className="text-sm text-[#86868b] mt-1">
          Explainable pricing based on demand, margins and competition
        </p>
      </div>

      {/* Controls */}
      <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5 lg:p-6 mb-4">

        <div className="flex flex-col lg:flex-row lg:items-end gap-5">

          <div className="flex-1 max-w-md">
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366] mb-2.5">
              <Target className="w-3.5 h-3.5" />
              Select Target Product
            </label>

            <select
              value={selectedProdId}
              onChange={(e) => setSelectedProdId(e.target.value)}
              className="w-full bg-[#1c1c1e] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#f5f5f7] focus:border-white/[0.2] outline-none appearance-none cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleFetchRecommendation}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-white text-black font-medium text-sm px-5 py-3 rounded-xl hover:bg-[#e5e5e7] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />

            {loading ? 'Optimizing...' : 'Run Pricing Optimization'}
          </button>

        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl min-h-[420px] flex flex-col items-center justify-center">

          <div className="w-9 h-9 rounded-full border-2 border-[#2c2c2e] border-t-[#f5f5f7] animate-spin mb-4" />

          <p className="text-sm text-[#86868b]">
            Running pricing optimization...
          </p>

          <p className="text-[11px] text-[#48484a] mt-1">
            Analyzing demand, cost and competition
          </p>

        </div>
      )}

      {/* Recommendation */}
      {!loading && recommendation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Price Summary */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5 lg:p-6">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-[17px] font-semibold text-[#f5f5f7]">
                  Price Summary
                </h2>

                <p className="text-xs text-[#636366] mt-1">
                  Current pricing position
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
                <CircleDollarSign className="w-4 h-4 text-[#d1d1d6]" />
              </div>

            </div>

            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#86868b]">
                  Current Price
                </span>

                <span className="text-sm font-semibold text-[#f5f5f7]">
                  ₹{recommendation.current_price}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#86868b]">
                  Competitor Price
                </span>

                <span className="text-sm font-medium text-[#d1d1d6]">
                  ₹{recommendation.competitor_price}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#86868b]">
                  Cost Floor
                </span>

                <span className="text-sm font-medium text-[#a1a1a6]">
                  ₹{recommendation.cost_price}
                </span>
              </div>

            </div>

            {/* Recommended Price */}
            <div className="mt-6 pt-5 border-t border-white/[0.08]">

              <p className="text-[10px] uppercase tracking-[0.12em] text-[#636366] font-semibold">
                Recommended Price
              </p>

              <div className="flex items-end justify-between gap-3 mt-2">

                <span className="text-3xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
                  ₹{recommendation.recommended_price}
                </span>

                <div className="mb-1">
                  {recommendation.price_change_percent >= 0 ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-[#d1d1d6]">
                      <ArrowUpRight className="w-4 h-4" />
                      +{recommendation.price_change_percent}%
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-[#d1d1d6]">
                      <ArrowDownRight className="w-4 h-4" />
                      {recommendation.price_change_percent}%
                    </span>
                  )}
                </div>

              </div>

              <p className="text-[11px] text-[#636366] mt-2">
                Suggested adjustment from current price
              </p>

            </div>

          </div>

          {/* Explanation */}
          <div className="lg:col-span-2 bg-[#111113] border border-white/[0.08] rounded-2xl p-5 lg:p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
                <Info className="w-4 h-4 text-[#d1d1d6]" />
              </div>

              <div>
                <h2 className="text-[17px] font-semibold text-[#f5f5f7]">
                  Algorithmic Justification
                </h2>

                <p className="text-xs text-[#636366] mt-1">
                  Why the engine recommends this price
                </p>
              </div>

            </div>

            <div className="bg-[#1c1c1e] border border-white/[0.06] rounded-xl p-5">

              <p className="text-sm text-[#c7c7cc] leading-7">
                {recommendation.explanation}
              </p>

            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

              <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-4">

                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#86868b]" />

                  <span className="text-[10px] uppercase tracking-[0.1em] text-[#636366] font-semibold">
                    Predicted Demand
                  </span>
                </div>

                <p className="text-xl font-semibold text-[#f5f5f7]">
                  {recommendation.predicted_demand}
                  <span className="text-xs text-[#636366] font-normal ml-1">
                    units
                  </span>
                </p>

              </div>

              <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-4">

                <div className="flex items-center gap-2 mb-2">
                  <CircleDollarSign className="w-4 h-4 text-[#86868b]" />

                  <span className="text-[10px] uppercase tracking-[0.1em] text-[#636366] font-semibold">
                    Expected Revenue
                  </span>
                </div>

                <p className="text-xl font-semibold text-[#f5f5f7]">
                  ₹{recommendation.expected_revenue}
                </p>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between px-1">

        <p className="text-[11px] text-[#48484a]">
          Dynamic pricing optimization engine
        </p>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />

          <span className="text-[11px] text-[#636366]">
            AI Pricing Active
          </span>
        </div>

      </div>

    </div>
  );
};

export default PriceRecommendation;