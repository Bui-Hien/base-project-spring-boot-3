import React from 'react';
import { Check, Clock, Shield } from 'lucide-react';

const AccountCard = ({ account, isSelected, onToggle, formatPrice }) => {
  return (
      <div
          onClick={onToggle}
          className={`group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 border-2 ${
              isSelected
                  ? 'border-blue-500 shadow-lg shadow-blue-200 bg-blue-50'
                  : 'border-slate-200 bg-white hover:shadow-lg hover:border-slate-300'
          }`}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 p-8 text-center">
          {/* Category Badge */}
          <div className="absolute top-3 left-3 inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {account.accountCategoryName}
          </div>

          {/* Warranty Badge */}
          {account.warrantyIssued && (
              <div className="absolute top-3 right-3 inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Check size={12} />
                Bảo hành
              </div>
          )}

          {/* Icon */}
          <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
            🎮
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Account Name */}
          <h3 className="font-bold text-slate-900 text-lg truncate">{account.accountName}</h3>

          {/* Owner */}
          <div className="flex items-center gap-2 text-slate-600">
            <Shield size={14} className="text-blue-500 flex-shrink-0" />
            <span className="text-sm">{account.owner}</span>
          </div>

          {/* Warranty */}
          <div className="flex items-center gap-2 text-slate-600 bg-green-50 rounded-lg p-2.5">
            <Clock size={14} className="text-green-600 flex-shrink-0" />
            <span className="text-sm font-medium">Bảo hành {account.warrantyPeriod} ngày</span>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200"></div>

          {/* Prices */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Đơn giá:</span>
              <span className="text-slate-500 line-through">{formatPrice(account.unitPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-900">Giá bán:</span>
              <span className="font-bold text-blue-600 text-lg">{formatPrice(account.price)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-900">Thành tiền:</span>
              <span className="font-bold text-red-600 text-lg">{formatPrice(account.totalAmount)}</span>
            </div>
          </div>

          {/* Selection Button */}
          <button
              className={`w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                  isSelected
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
          >
            <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-slate-400'
                }`}
            >
              {isSelected && (
                  <Check size={16} className="text-white" />
              )}
            </div>
            <span>{isSelected ? 'Đã chọn' : 'Chọn tài khoản'}</span>
          </button>
        </div>
      </div>
  );
};

export default AccountCard;