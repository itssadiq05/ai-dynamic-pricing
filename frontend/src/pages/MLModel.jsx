import React, { useEffect, useState } from 'react';
import { getModelMetrics } from '../services/api';
import { Cpu, CheckCircle } from 'lucide-react';

const MLModel = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    getModelMetrics().then(res => setMetrics(res.data));
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Machine Learning Performance & Validation</h1>
        <p className="text-sm text-slate-400">Live evaluation metrics generated during execution</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">Model Name</th>
              <th className="p-4">MAE</th>
              <th className="p-4">RMSE</th>
              <th className="p-4">R² Score</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {metrics.map((m) => (
              <tr key={m.id} className={m.is_selected ? 'bg-indigo-950/20' : ''}>
                <td className="p-4 font-semibold text-slate-200 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" /> {m.model_name}
                </td>
                <td className="p-4">{m.mae.toFixed(4)}</td>
                <td className="p-4">{m.rmse.toFixed(4)}</td>
                <td className="p-4 font-bold text-indigo-400">{m.r2_score.toFixed(4)}</td>
                <td className="p-4">
                  {m.is_selected ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Selected
                    </span>
                  ) : (
                    <span className="text-slate-500 text-xs">Evaluated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MLModel;

