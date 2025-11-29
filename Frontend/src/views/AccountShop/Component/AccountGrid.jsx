import React from 'react';
import AccountCard from './AccountCard';

const AccountGrid = ({accounts, selectedAccounts, onToggleSelect, formatPrice}) => {
  if (accounts.length === 0) {
    return (
        <div className="col-span-3 text-center py-16">
          <p className="text-slate-500 text-lg">Không có tài khoản nào</p>
        </div>
    );
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map (account => (
            <AccountCard
                key={account.id}
                account={account}
                isSelected={selectedAccounts.includes (account.id)}
                onToggle={() => onToggleSelect (account.id)}
                formatPrice={formatPrice}
            />
        ))}
      </div>
  );
};

export default AccountGrid;