import React, { useEffect, useState } from "react";
import {
  Receipt,
  Package,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

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
    <div className="min-h-full bg-black px-6 py-7 lg:px-8 lg:py-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#636366] font-semibold mb-2">
          Sales Records
        </p>

        <h1 className="text-3xl lg:text-[34px] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
          Transactions
        </h1>

        <p className="text-sm text-[#86868b] mt-1">
          Historical sales and transaction records from MySQL
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">

        {/* Transactions */}
        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#636366] font-semibold">
                Total Transactions
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
                {transactions.length.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
              <Receipt className="w-4 h-4 text-[#d1d1d6]" />
            </div>

          </div>

          <p className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-[#636366]">
            Historical sales records
          </p>

        </div>

        {/* Units */}
        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#636366] font-semibold">
                Units Sold
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
                {totalUnits.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
              <Package className="w-4 h-4 text-[#d1d1d6]" />
            </div>

          </div>

          <p className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-[#636366]">
            Total quantity sold
          </p>

        </div>

        {/* Revenue */}
        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#636366] font-semibold">
                Total Revenue
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
                {formatCurrency(totalRevenue)}
              </h2>
            </div>

            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#d1d1d6]" />
            </div>

          </div>

          <p className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-[#636366]">
            Cumulative sales revenue
          </p>

        </div>

      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113]">

        <div className="border-b border-white/[0.06] px-5 py-5 lg:px-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-[17px] font-semibold text-[#f5f5f7]">
                Sales Transaction History
              </h2>

              <p className="mt-1 text-xs text-[#636366]">
                Real-time transaction records from the sales database
              </p>
            </div>

            <button
              onClick={fetchTransactions}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-[#a1a1a6] hover:bg-white/[0.08] hover:text-[#f5f5f7]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>

          </div>

        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">

            <div className="w-8 h-8 rounded-full border-2 border-[#2c2c2e] border-t-[#f5f5f7] animate-spin mb-4" />

            <p className="text-sm text-[#86868b]">
              Loading transactions...
            </p>

          </div>
        )}

        {!loading && error && (
          <div className="px-6 py-16 text-center">

            <p className="text-sm text-[#a1a1a6]">
              {error}
            </p>

            <button
              onClick={fetchTransactions}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-[#e5e5e7]"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>

          </div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div className="px-6 py-16 text-center">

            <Receipt className="w-8 h-8 text-[#48484a] mx-auto mb-3" />

            <p className="text-sm text-[#636366]">
              No transaction records found.
            </p>

          </div>
        )}

        {!loading && !error && transactions.length > 0 && (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead>
                <tr className="border-b border-white/[0.06]">

                  <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                    ID
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                    Product
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                    Date
                  </th>

                  <th className="px-5 py-3.5 text-right text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                    Quantity
                  </th>

                  <th className="px-5 py-3.5 text-right text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                    Selling Price
                  </th>

                  <th className="px-5 py-3.5 text-right text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                    Discount
                  </th>

                  <th className="px-5 py-3.5 text-right text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                    Revenue
                  </th>

                  <th className="px-5 py-3.5 text-center text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                    Promotion
                  </th>

                </tr>
              </thead>

              <tbody>

                {transactions.map((transaction, index) => (

                  <tr
                    key={transaction.id || index}
                    className="border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.025] transition-colors"
                  >

                    {/* ID */}
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-[#a1a1a6]">
                        #{transaction.id || index + 1}
                      </span>
                    </td>

                    {/* Product */}
                    <td className="px-5 py-4">

                      <div>
                        <p className="text-sm font-medium text-[#f5f5f7]">
                          {transaction.product_name ||
                            transaction.product ||
                            `Product #${
                              transaction.product_id || "-"
                            }`}
                        </p>

                        {transaction.product_id && (
                          <p className="mt-1 text-[10px] text-[#48484a]">
                            Product ID: {transaction.product_id}
                          </p>
                        )}
                      </div>

                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-sm text-[#a1a1a6]">
                      {formatDate(transaction.date)}
                    </td>

                    {/* Quantity */}
                    <td className="px-5 py-4 text-right text-sm font-medium text-[#d1d1d6]">
                      {Number(
                        transaction.quantity_sold || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    {/* Selling Price */}
                    <td className="px-5 py-4 text-right text-sm text-[#a1a1a6]">
                      {formatCurrency(
                        transaction.selling_price
                      )}
                    </td>

                    {/* Discount */}
                    <td className="px-5 py-4 text-right text-sm text-[#a1a1a6]">
                      {Number(
                        transaction.discount_percent || 0
                      ).toFixed(2)}
                      %
                    </td>

                    {/* Revenue */}
                    <td className="px-5 py-4 text-right text-sm font-semibold text-[#f5f5f7]">
                      {formatCurrency(transaction.revenue)}
                    </td>

                    {/* Promotion */}
                    <td className="px-5 py-4 text-center">

                      {transaction.is_promotion ? (
                        <span className="inline-flex rounded-full bg-white/[0.07] border border-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-[#d1d1d6]">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-[#636366]">
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

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between px-1">

        <p className="text-[11px] text-[#48484a]">
          Transaction ledger and sales records
        </p>

        <span className="text-[11px] text-[#636366]">
          {transactions.length.toLocaleString("en-IN")} records
        </span>

      </div>

    </div>
  );
};

export default Transactions;