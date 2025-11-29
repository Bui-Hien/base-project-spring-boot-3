import React, { memo } from "react";
import NoticeCard from "./NoticeCard";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores";
import CommonPagination from "../../../common/CommonPagination";

const NoticeSection = () => {
  const {notificationStore} = useStore ();

  const {
    dataList,
    totalElements,
    setPageIndex,
    setPageSize,
    searchObject,
    totalPages,
  } = notificationStore;

  return (
      <section className="relative py-8">
        <div className="mx-auto w-full max-w-7xl px-4">
          {/* ===== Header ===== */}
          <div className="mb-16 text-center">
            <div className="inline-block mb-4">
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              Thông báo quan trọng
            </span>
            </div>
            <h2 className="mb-4 font-bold text-4xl text-slate-900">
              Trung tâm thông báo
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Các thông báo và hướng dẫn cập nhật để giúp bạn sử dụng dịch vụ một
              cách an toàn và hiệu quả nhất
            </p>
          </div>

          {/* ===== Cards Grid ===== */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 min-h-60">
            {dataList.map ((item, index) => (
                <NoticeCard
                    key={index}
                    title={item.title}
                    content={item.content}
                />
            ))}
          </div>

          {totalElements > 0 && (
              <div
                  className="mt-8 border-t border-slate-200 py-3 flex justify-center"
                  style={{
                    background:"linear-gradient(to top, rgba(255,255,255,0.8), transparent)",
                    transition:"all 0.3s ease",
                  }}
              >
                <CommonPagination
                    totalElements={totalElements}
                    pageSize={searchObject?.pageSize || 20}
                    setRowsPerPage={setPageSize}
                    totalPages={totalPages}
                    handleChangePage={setPageIndex}
                    page={searchObject?.pageIndex || 1}
                />
              </div>
          )}
        </div>
      </section>
  );
};

export default memo (observer (NoticeSection));
