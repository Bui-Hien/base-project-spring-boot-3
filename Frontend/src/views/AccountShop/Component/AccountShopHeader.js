import React from 'react';

const AccountShopHeader = () => {
  return (
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Cửa hàng tài khoản</h1>
              <p className="text-slate-600 text-lg mt-2">Chọn tài khoản game yêu thích của bạn</p>
            </div>
            <div className="hidden sm:block text-5xl">🎮</div>
          </div>
        </div>
      </div>
  );
};

export default AccountShopHeader;