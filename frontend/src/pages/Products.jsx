import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import { Package, Plus, ChevronRight } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  return (
    <div className="min-h-full bg-black px-6 py-7 lg:px-8 lg:py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">

        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#636366] font-semibold mb-2">
            Catalog
          </p>

          <h1 className="text-3xl lg:text-[34px] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
            Products
          </h1>

          <p className="text-sm text-[#86868b] mt-1">
            View and manage store inventory items
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#e5e5e7] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>

      </div>

      {/* Product Table */}
      <div className="bg-[#111113] border border-white/[0.08] rounded-2xl overflow-hidden">

        {/* Table Header */}
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
              <Package className="w-4 h-4 text-[#d1d1d6]" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#f5f5f7]">
                Product Catalog
              </h2>

              <p className="text-[11px] text-[#636366] mt-0.5">
                {products.length} active products
              </p>
            </div>

          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[850px]">

            <thead>
              <tr className="border-b border-white/[0.06]">

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Product
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Category
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Current Price
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Cost Price
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Competitor
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Stock
                </th>

                <th className="px-5 py-3.5 w-10"></th>

              </tr>
            </thead>

            <tbody>
              {products.map((p, index) => (
                <tr
                  key={p.id}
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
                          {p.name}
                        </p>

                        <p className="text-[10px] text-[#48484a] mt-0.5">
                          Product #{String(index + 1).padStart(2, '0')}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.06] text-xs text-[#a1a1a6]">
                      {p.category_name}
                    </span>
                  </td>

                  {/* Current Price */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-[#f5f5f7]">
                      ₹{Number(p.current_price).toLocaleString()}
                    </span>
                  </td>

                  {/* Cost Price */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#a1a1a6]">
                      ₹{Number(p.cost_price).toLocaleString()}
                    </span>
                  </td>

                  {/* Competitor Price */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#a1a1a6]">
                      ₹{Number(p.competitor_price).toLocaleString()}
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">

                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          p.current_stock <= 10
                            ? 'bg-[#a1a1a6]'
                            : 'bg-[#f5f5f7]'
                        }`}
                      />

                      <span className="text-sm text-[#d1d1d6]">
                        {p.current_stock}
                      </span>

                      <span className="text-xs text-[#48484a]">
                        units
                      </span>

                    </div>
                  </td>

                  {/* Arrow */}
                  <td className="px-5 py-4">
                    <ChevronRight className="w-4 h-4 text-[#48484a]" />
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="py-16 text-center">
            <Package className="w-8 h-8 text-[#48484a] mx-auto mb-3" />

            <p className="text-sm text-[#86868b]">
              No products found
            </p>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between px-1">
        <p className="text-[11px] text-[#48484a]">
          Product inventory management
        </p>

        <span className="text-[11px] text-[#636366]">
          {products.length} items
        </span>
      </div>

    </div>
  );
};

export default Products;