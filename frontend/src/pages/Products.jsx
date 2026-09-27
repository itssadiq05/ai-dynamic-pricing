import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import { Package, Plus } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Product Management</h1>
          <p className="text-sm text-slate-400">View and manage store inventory items</p>
        </div>
        <button className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-500 transition-all">
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Current Price</th>
              <th className="p-4">Cost Price</th>
              <th className="p-4">Competitor Price</th>
              <th className="p-4">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-4 font-semibold text-slate-200">{p.name}</td>
                <td className="p-4 text-slate-400">{p.category_name}</td>
                <td className="p-4 font-bold text-slate-200">₹{p.current_price}</td>
                <td className="p-4 text-slate-400">₹{p.cost_price}</td>
                <td className="p-4 text-slate-400">₹{p.competitor_price}</td>
                <td className="p-4 font-medium">{p.current_stock} units</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;

