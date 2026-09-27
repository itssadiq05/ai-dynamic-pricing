import React, { useEffect, useState } from 'react';
import { getModelMetrics } from '../services/api';
import {
  Cpu,
  CheckCircle,
  BrainCircuit,
  Activity,
} from 'lucide-react';

const MLModel = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    getModelMetrics().then((res) => setMetrics(res.data));
  }, []);

  const selectedModel = metrics.find((m) => m.is_selected);

  return (
    <div className="min-h-full bg-black px-6 py-7 lg:px-8 lg:py-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#636366] font-semibold mb-2">
          Machine Learning
        </p>

        <h1 className="text-3xl lg:text-[34px] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
          Model Performance
        </h1>

        <p className="text-sm text-[#86868b] mt-1">
          Live evaluation metrics generated during model validation
        </p>
      </div>

      {/* Model Status */}
      {selectedModel && (
        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5 lg:p-6 mb-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-[#d1d1d6]" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-[#636366] font-semibold">
                  Selected Model
                </p>

                <h2 className="text-lg font-semibold text-[#f5f5f7] mt-1">
                  {selectedModel.model_name}
                </h2>
              </div>

            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08]">

              <span className="w-1.5 h-1.5 rounded-full bg-white" />

              <span className="text-xs text-[#a1a1a6]">
                Production Model
              </span>

            </div>

          </div>

        </div>
      )}

      {/* Metrics Table */}
      <div className="bg-[#111113] border border-white/[0.08] rounded-2xl overflow-hidden">

        {/* Table Header */}
        <div className="px-5 py-5 lg:px-6 border-b border-white/[0.06]">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#d1d1d6]" />
            </div>

            <div>
              <h2 className="text-[17px] font-semibold text-[#f5f5f7]">
                Model Validation Metrics
              </h2>

              <p className="text-xs text-[#636366] mt-1">
                Comparative evaluation of trained regression models
              </p>
            </div>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left min-w-[750px]">

            <thead>
              <tr className="border-b border-white/[0.06]">

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Model Name
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  MAE
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  RMSE
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  R² Score
                </th>

                <th className="px-5 py-3.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#636366]">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {metrics.map((m) => (
                <tr
                  key={m.id}
                  className={`border-b border-white/[0.05] last:border-b-0 transition-colors ${
                    m.is_selected
                      ? 'bg-white/[0.035]'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >

                  {/* Model */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center">
                        <Cpu className="w-4 h-4 text-[#a1a1a6]" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[#f5f5f7]">
                          {m.model_name}
                        </p>

                        {m.is_selected && (
                          <p className="text-[10px] text-[#636366] mt-0.5">
                            Active prediction model
                          </p>
                        )}
                      </div>

                    </div>

                  </td>

                  {/* MAE */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#d1d1d6]">
                      {m.mae.toFixed(4)}
                    </span>
                  </td>

                  {/* RMSE */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#d1d1d6]">
                      {m.rmse.toFixed(4)}
                    </span>
                  </td>

                  {/* R2 */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-[#f5f5f7]">
                      {m.r2_score.toFixed(4)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">

                    {m.is_selected ? (
                      <span className="inline-flex items-center gap-1.5 text-[#d1d1d6] bg-white/[0.06] border border-white/[0.08] px-2.5 py-1 rounded-full text-[11px] font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    ) : (
                      <span className="text-[#636366] text-xs">
                        Evaluated
                      </span>
                    )}

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {metrics.length === 0 && (
          <div className="py-16 text-center">

            <Cpu className="w-8 h-8 text-[#48484a] mx-auto mb-3" />

            <p className="text-sm text-[#636366]">
              No model metrics available.
            </p>

          </div>
        )}

      </div>

      {/* Metric Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-xs font-semibold text-[#d1d1d6]">
            MAE
          </p>

          <p className="text-[11px] text-[#636366] mt-2 leading-5">
            Mean Absolute Error measures the average absolute prediction error.
          </p>
        </div>

        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-xs font-semibold text-[#d1d1d6]">
            RMSE
          </p>

          <p className="text-[11px] text-[#636366] mt-2 leading-5">
            Root Mean Squared Error gives greater weight to larger prediction errors.
          </p>
        </div>

        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-5">
          <p className="text-xs font-semibold text-[#d1d1d6]">
            R² Score
          </p>

          <p className="text-[11px] text-[#636366] mt-2 leading-5">
            R² indicates how much variation in demand is explained by the model.
          </p>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between px-1">

        <p className="text-[11px] text-[#48484a]">
          Machine learning validation engine
        </p>

        <span className="text-[11px] text-[#636366]">
          {metrics.length} models evaluated
        </span>

      </div>

    </div>
  );
};

export default MLModel;