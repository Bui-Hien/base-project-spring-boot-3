import React from 'react';

const SelectionSummary = ({selectedCount, totalPrice}) => {
  return (
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4">
        <div className="mb-4">
          <p className="text-slate-00 text-sm mb-1">Đã chọn</p>
          <p className="text-3xl font-bold text-blue-600">{selectedCount}</p>
        </div>
        <div className="pt-4 border-t border-blue-200">
          <p className="text-slate-00 text-sm mb-1">Tổng tiền</p>
          <p className="text-2xl font-bold text-slate-900">{totalPrice}</p>
        </div>
      </div>
  );
};

export default SelectionSummary;