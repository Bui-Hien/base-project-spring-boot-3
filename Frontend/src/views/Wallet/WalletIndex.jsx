import { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import WalletIcon from '@mui/icons-material/Wallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HistoryIcon from '@mui/icons-material/History';
import WalletForm from "./WalletForm";
import { useNavigate } from "react-router-dom";

function WalletIndex () {
  const navigate = useNavigate ();
  const {walletStore} = useStore ();
  const {t} = useTranslation ();
  const {handleGetWallet, openWithdrawWalletPopup, handleOpenPopupWithdraw, resetStore, selectedRow} = walletStore;

  useEffect (() => {
    handleGetWallet ();
    return resetStore;
  }, []);

  return (
      <div className="content-index">
        <CommonBreadcrumb routeSegments={[{name:t ("Ví của tôi")}]}/>
        <div className="index-card">
          <div className="max-w-2xl mx-auto py-8 px-4">
            {/* Main Wallet Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                      <WalletIcon className="w-5 h-5 text-white"/>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{t ("Ví điện tử")}</h2>
                      <p className="text-xs text-gray-500">{t ("Số dư khả dụng")}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  {t ("Active")}
                </span>
                </div>
              </div>

              {/* Balance Section */}
              <div className="px-6 py-10 text-center bg-white">
                <div className="inline-block">
                  <p className="text-sm text-gray-500 mb-2">{t ("Tổng số dư")}</p>
                  <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                    {selectedRow?.balance?.toLocaleString () || "0"}
                    <span className="text-2xl text-gray-600 ml-1">₫</span>
                  </h1>
                </div>
              </div>

              {/* Actions Section */}
              <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <button
                      onClick={handleOpenPopupWithdraw}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    <TrendingUpIcon className="w-5 h-5"/>
                    <span>{t ("Rút tiền")}</span>
                  </button>

                  <button
                      onClick={() => navigate (`/transaction`)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-medium transition-all duration-200 hover:border-gray-300"
                  >
                    <HistoryIcon className="w-5 h-5"/>
                    <span>{t ("Lịch sử giao dịch")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {openWithdrawWalletPopup && (
            <WalletForm/>
        )}
      </div>
  );
}

export default memo (observer (WalletIndex));