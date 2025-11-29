import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores";

function PriceList () {
  const {t} = useTranslation ();
  const {accountStore} = useStore ();

  const {
    priceList,
    handleSetSearchObject,
    publicPagingSearchAccount,
    searchObject
  } = accountStore;

  if (!priceList || priceList.length === 0) {
    return null;
  }

  const handleFilter = (value) => {
    if (value === searchObject?.price) {
      handleSetSearchObject ({price:null});
      publicPagingSearchAccount ();
    } else {
      handleSetSearchObject ({price:value});
      publicPagingSearchAccount ();
    }
  }

  return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
          <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-base font-semibold text-gray-900">
            Đơn giá
          </h3>
        </div>

        {/* Price List */}
        <div className="flex flex-wrap gap-2">
          {priceList.map ((item, index) => {
            const isSelected = searchObject?.price === item;
            return (
                <span
                    key={index}
                    onClick={() => handleFilter (item)}
                    className={`
                inline-flex items-center px-3 py-1.5
                rounded-lg border text-sm font-medium
                transition-all duration-200 cursor-pointer
                hover:-translate-y-0.5 hover:shadow-md
                ${isSelected
                        ? 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700'
                    }
              `}
                >
              {item}
            </span>
            );
          })}
        </div>
      </div>
  );
}

export default observer (PriceList);