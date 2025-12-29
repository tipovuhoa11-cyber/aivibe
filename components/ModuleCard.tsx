
import React from 'react';
import { Module } from '../types';

interface ModuleCardProps {
  module: Module;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  return (
    <div className="group p-8 rounded-[2.5rem] bg-[#f5f5f7] hover:bg-white border border-transparent hover:border-[#d2d2d7] transition-all duration-500 shadow-sm hover:shadow-xl">
      <div className="text-[11px] font-bold text-[#d70015] mb-5 tracking-widest uppercase">
        Học phần {module.id}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-[#1d1d1f] tracking-tight group-hover:text-[#0071e3] transition-colors leading-tight">
        {module.title}
      </h3>
      <p className="text-[#424245] text-[16px] leading-relaxed font-medium">
        {module.description}
      </p>
    </div>
  );
};

export default ModuleCard;
