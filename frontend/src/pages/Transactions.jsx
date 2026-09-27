import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/api/sales`);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // Supports both:
      // [ ...sales ]
      // { sales: [ ...sales ] }
      const salesData = Array.isArray(data)
        ? data
        : data.sales || data.data || [];

      setTransactions(salesData);
    } catch (err) {
      console.error("Transactions API error:", err);
      setError("Unable to load transaction data.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (isNaN(d.getTime())) return date;

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalUnits = transactions.reduce(
    (sum, item) => sum + Number(item.quantity_sold || 0),
    0
  );

  const totalRevenue = transactions.reduce(
    (sum, item) => sum + Number(item.revenue || 0),
    0
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">
          Transactions Ledger
        </h1>

        <p className="mt-1 text-slate-400">
          Historical sales and transaction records from MySQL database.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-8">

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Total Transactions</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-100">
            {transactions.length.toLocaleString("en-IN")}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Historical sales records
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Units Sold</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-100">
            {totalUnits.toLocaleString("en-IN")}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Total quantity sold
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-400">Total Revenue</p>
          <h2 className="mt-3 text-3xl font-bold text-emerald-400">
            {formatCurrency(totalRevenue)}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Cumulative sales revenue
          </p>
        </div>

      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">

        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-100">
            Sales Transaction History
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Real-time transaction records from the sales database.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-slate-400">
              Loading transactions...
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="px-6 py-16 text-center">
            <p className="text-red-400">{error}</p>

            <button
              onClick={fetchTransactions}
              className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div className="px-6 py-16 text-center text-slate-400">
            No transaction records found.
          </div>
        )}

        {!loading && !error && transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">

              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Selling Price
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Discount
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Revenue
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Promotion
                  </th>

                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction, index) => (

                  <tr
                    key={transaction.id || index}
                    className="border-b border-slate-800/70 transition hover:bg-slate-800/30"
                  >

                    <td className="px-6 py-4 text-sm font-medium text-indigo-400">
                      #{transaction.id || index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-100">
                        {transaction.product_name ||
                          transaction.product ||
                          `Product #${transaction.product_id || "-"}`}
                      </div>

                      {transaction.product_id && (
                        <div className="mt-1 text-xs text-slate-500">
                          Product ID: {transaction.product_id}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {formatDate(transaction.date)}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-200">
                      {Number(transaction.quantity_sold || 0).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-6 py-4 text-right text-sm text-slate-300">
                      {formatCurrency(transaction.selling_price)}
                    </td>

                    <td className="px-6 py-4 text-right text-sm text-slate-300">
                      {Number(transaction.discount_percent || 0).toFixed(2)}%
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-semibold text-emerald-400">
                      {formatCurrency(transaction.revenue)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {transaction.is_promotion ? (
                        <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-700/50 px-3 py-1 text-xs font-medium text-slate-400">
                          No
                        </span>
                      )}
                    </td>

                  </tr>

                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default Transactions;