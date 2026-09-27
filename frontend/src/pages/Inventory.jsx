import React, { useEffect, useState } from "react";

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
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

      case "Low Stock":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";

      case "Out of Stock":
        return "bg-red-500/10 text-red-400 border border-red-500/20";

      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-100">
          Inventory Management
        </h1>

        <p className="mt-2 text-slate-400">
          Loading inventory data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-100">
          Inventory Management
        </h1>

        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
          {error}
        </div>

        <button
          onClick={fetchInventory}
          className="mt-4 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">
          Inventory Management
        </h1>

        <p className="mt-2 text-slate-400">
          Monitor stock health, inventory value and product availability.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* Products */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm font-medium text-slate-400">
            Total Products
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-100">
            {summary?.total_products ?? 0}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Active catalog items
          </p>
        </div>

        {/* Stock */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm font-medium text-slate-400">
            Total Stock
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-100">
            {Number(summary?.total_stock_units ?? 0).toLocaleString()}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Units currently available
          </p>
        </div>

        {/* Low Stock */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm font-medium text-slate-400">
            Low Stock
          </p>

          <h2 className="mt-3 text-3xl font-bold text-yellow-400">
            {summary?.low_stock_products ?? 0}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Products need attention
          </p>
        </div>

        {/* Inventory Value */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm font-medium text-slate-400">
            Inventory Value
          </p>

          <h2 className="mt-3 text-3xl font-bold text-emerald-400">
            ₹{Number(summary?.inventory_value ?? 0).toLocaleString("en-IN")}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Based on product cost price
          </p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">

        <div className="border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-slate-100">
            Inventory Stock Health
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Real-time product inventory from MySQL database
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-slate-800/60">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                  Product
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                  Current Stock
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                  Minimum Stock
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                  Cost Price
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                  Current Price
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                  Stock Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">

              {products.map((product) => (
                <tr
                  key={product.id}
                  className="transition hover:bg-slate-800/40"
                >

                  <td className="px-6 py-5">
                    <div className="font-medium text-slate-100">
                      {product.name}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      Product ID: #{product.id}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="font-semibold text-slate-100">
                      {product.current_stock}
                    </span>

                    <span className="ml-1 text-sm text-slate-500">
                      units
                    </span>
                  </td>

                  <td className="px-6 py-5 text-slate-300">
                    {product.min_stock} units
                  </td>

                  <td className="px-6 py-5 text-slate-300">
                    ₹{Number(product.cost_price).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-5 font-medium text-slate-100">
                    ₹{Number(product.current_price).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
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
          <div className="p-10 text-center text-slate-500">
            No inventory products found.
          </div>
        )}
      </div>

      {/* Refresh */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={fetchInventory}
          className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
        >
          ↻ Refresh Inventory
        </button>
      </div>
    </div>
  );
};

export default Inventory;