import React, { useEffect, useState } from "react";
import {
  Package,
  Boxes,
  AlertTriangle,
  CircleDollarSign,
  RefreshCw,
} from "lucide-react";

const API_BASE = "http://localhost:8000";

const Inventory = () => {
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const [summaryResponse, productsResponse] = await Promise.all([
        fetch(`${API_BASE}/api/inventory/summary`),
        fetch(`${API_BASE}/api/inventory/products`),
      ]);

      if (!summaryResponse.ok || !productsResponse.ok) {
        throw new Error("Failed to fetch inventory data");
      }

      const summaryData = await summaryResponse.json();
      const productsData = await productsResponse.json();

      setSummary(summaryData);
      setProducts(productsData);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to inventory API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Healthy":
        return "bg-white/[0.06] text-[#d1d1d6] border border-white/[0.08]";

      case "Low Stock":
        return "bg-white/[0.04] text-[#a1a1a6] border border-white/[0.12]";

      case "Out of Stock":
        return "bg-white/[0.02] text-[#f5f5f7] border border-white/[0.18]";

      default:
        return "bg-white/[0.04] text-[#86868b] border border-white/[0.06]";
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-black flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#2c2c2e] border-t-[#f5f5f7] animate-spin mb-4" />

        <p className="text-sm text-[#86868b]">
          Loading inventory data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-black px-6 py-7 lg:px-8 lg:py-8">

        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#636366] font-semibold mb-2">
            Inventory
          </p>

          <h1 className="text-3xl lg:text-[34px] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
            Inventory Management
          </h1>
        </div>

        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-6">
          <p className="text-sm text-[#a1a1a6]">
            {error}
          </p>

          <button
            onClick={fetchInventory}
            className="mt-5 inline-flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e5e5e7]"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-full bg-black px-6 py-7 lg:px-8 lg:py-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#636366] font-semibold mb-2">
          Stock Control
        </p>

        <h1 className="text-3xl lg:text-[34px] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
          Inventory Management
        </h1>

        <p className="text-sm text-[#86868b] mt-1">
          Monitor stock health, inventory value and product availability
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Total Products */}
        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#636366] font-semibold">
                Total Products
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
                {summary?.total_products ?? 0}
              </h2>
            </div>

            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
              <Package className="w-4 h-4 text-[#d1d1d6]" />
            </div>

          </div>

          <p className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-[#636366]">
            Active catalog items
          </p>
        </div>

        {/* Total Stock */}
        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#636366] font-semibold">
                Total Stock
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
                {Number(
                  summary?.total_stock_units ?? 0
                ).toLocaleString()}
              </h2>
            </div>

            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
              <Boxes className="w-4 h-4 text-[#d1d1d6]" />
            </div>

          </div>

          <p className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-[#636366]">
            Units currently available
          </p>
        </div>

        {/* Low Stock */}
        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#636366] font-semibold">
                Low Stock
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
                {summary?.low_stock_products ?? 0}
              </h2>
            </div>

            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[#d1d1d6]" />
            </div>

          </div>

          <p className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-[#636366]">
            Products need attention
          </p>
        </div>

        {/* Inventory Value */}
        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#636366] font-semibold">
                Inventory Value
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
                ₹
                {Number(
                  summary?.inventory_value ?? 0
                ).toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
              <CircleDollarSign className="w-4 h-4 text-[#d1d1d6]" />
            </div>

          </div>

          <p className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-[#636366]">
            Based on product cost price
          </p>
        </div>

      </div>

      {/* Stock Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113]">

        <div className="p-5 lg:p-6 border-b border-white/[0.06] flex items-center justify-between">

          <div>
            <h2 className="text-[17px] font-semibold text-[#f5f5f7]">
              Inventory Stock Health
            </h2>

            <p className="mt-1 text-xs text-[#636366]">
              Real-time product inventory from MySQL database
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />

            <span className="text-[11px] text-[#636366]">
              Live
            </span>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left min-w-[850px]">

            <thead>
              <tr className="border-b border-white/[0.06]">

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Product
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Current Stock
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Minimum Stock
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Cost Price
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Current Price
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.025] transition-colors"
                >

                  {/* Product */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-[#a1a1a6]" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[#f5f5f7]">
                          {product.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#48484a]">
                          Product ID: #{product.id}
                        </p>
                      </div>

                    </div>

                  </td>

                  {/* Current Stock */}
                  <td className="px-5 py-4">

                    <span className="text-sm font-semibold text-[#f5f5f7]">
                      {product.current_stock}
                    </span>

                    <span className="ml-1 text-xs text-[#636366]">
                      units
                    </span>

                  </td>

                  {/* Minimum Stock */}
                  <td className="px-5 py-4 text-sm text-[#a1a1a6]">
                    {product.min_stock} units
                  </td>

                  {/* Cost Price */}
                  <td className="px-5 py-4 text-sm text-[#a1a1a6]">
                    ₹
                    {Number(
                      product.cost_price
                    ).toLocaleString("en-IN")}
                  </td>

                  {/* Current Price */}
                  <td className="px-5 py-4 text-sm font-semibold text-[#f5f5f7]">
                    ₹
                    {Number(
                      product.current_price
                    ).toLocaleString("en-IN")}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(
                        product.stock_status
                      )}`}
                    >
                      {product.stock_status}
                    </span>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {products.length === 0 && (
          <div className="py-14 text-center">

            <Package className="w-8 h-8 text-[#48484a] mx-auto mb-3" />

            <p className="text-sm text-[#636366]">
              No inventory products found.
            </p>

          </div>
        )}

      </div>

      {/* Refresh */}
      <div className="mt-4 flex justify-end">

        <button
          onClick={fetchInventory}
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#111113] px-4 py-2.5 text-sm font-medium text-[#a1a1a6] transition hover:bg-[#1c1c1e] hover:text-[#f5f5f7]"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Inventory
        </button>

      </div>

    </div>
  );
};

export default Inventory;