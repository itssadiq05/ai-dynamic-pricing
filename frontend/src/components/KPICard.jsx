import React from 'react';

const KPICard = ({
  title,
  value,
  subtext,
  icon: Icon,
}) => {
  return (
    <div className="group bg-[#111113] border border-white/[0.08] rounded-2xl p-5 transition-all duration-300 hover:bg-[#151517] hover:border-white/[0.12]">

      {/* Top */}
      <div className="flex items-start justify-between">

        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#636366] font-semibold">
            {title}
          </p>

          <h3 className="mt-3 text-2xl lg:text-[27px] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
            {value}
          </h3>
        </div>

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
          <Icon className="w-[18px] h-[18px] text-[#d1d1d6]" />
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-5 pt-4 border-t border-white/[0.06]">
        <p className="text-xs text-[#636366]">
          {subtext}
        </p>
      </div>

    </div>
  );
};

export default KPICard;