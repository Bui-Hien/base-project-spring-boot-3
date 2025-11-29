import React from 'react';
import { ShoppingCart } from 'lucide-react';

const CheckoutFooter = ({totalPrice, selectedCount}) => {
  if (selectedCount === 0) return null;

  return (
      <>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-slate-600 text-sm mb-1">Tổng thanh toán</p>
                <p className="text-slate-900 text-3xl font-bold">{totalPrice}</p>
              </div>
              <button
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50">
                <ShoppingCart size={24}/>
                <span>Mua ngay ({selectedCount} sản phẩm)</span>
              </button>
            </div>
          </div>
        </div>
        <div className="h-24"></div>
      </>
  );
};

export default CheckoutFooter;