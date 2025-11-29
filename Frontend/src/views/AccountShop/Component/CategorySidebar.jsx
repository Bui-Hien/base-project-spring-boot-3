import React, { memo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../stores';

const CategorySidebar = () => {
  const {accountStore} = useStore();
  const {
    accountCategoryStore,
    handleSetSearchObject,
    publicPagingSearchAccount
  } = accountStore;

  const handleSearch = async (selected) => {
    handleSetSearchObject({accountCategory: selected});
    accountCategoryStore.handleSetSelected(selected);
    await publicPagingSearchAccount();
  }

  return (
      <div className="lg:col-span-1">
        <div className="sticky top-0">
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <h3 className="text-base font-semibold text-gray-900">
                Danh mục
              </h3>
            </div>

            {/* Category List */}
            <div className="flex flex-col gap-2">
              {[...(accountCategoryStore.dataList || [])].map((cat) => {
                const isSelected = accountCategoryStore.selectedRow?.code === cat?.code;
                return (
                    <button
                        key={cat.id ?? 'all'}
                        onClick={() => handleSearch(cat)}
                        className={`
                    text-left px-4 py-2 rounded-xl text-[15px] font-medium
                    transition-all duration-200 ease-in-out
                    ${isSelected
                            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                            : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
                        }
                  `}
                    >
                      {cat.name}
                    </button>
                );
              })}
            </div>

            {/* Load more */}
            {(accountCategoryStore.searchObject.pageIndex < accountCategoryStore.totalPages) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                      onClick={accountCategoryStore.handleMoreAccountCategory}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
                      title="Xem thêm"
                  >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    Xem thêm
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default memo(observer(CategorySidebar));