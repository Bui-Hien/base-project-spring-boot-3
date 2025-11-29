import React, { memo, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import CardItem from "./CardItem";
import { useStore } from "../../stores";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import InstructToolbar from "./InstructToolbar";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import { API_ENDPOINT } from "../../appConfig";
import CommonPagination from "../../common/CommonPagination";
import PageFooter from "../../common/Component/PageFooter";

const InstructIndex = () => {
  const {postStore} = useStore ();
  const {t} = useTranslation ();
  const navigate = useNavigate ();

  const {
    pagingPostPublic,
    dataList,
    totalElements,
    searchObject,
    setPageSize,
    totalPages,
    setPageIndex,
    resetStore
  } = postStore;
  useEffect (() => {
    pagingPostPublic ();
    return resetStore;
  }, []);

  const handleViewDetail = useCallback (
      (id) => {
        navigate (`/instruct/view/${id}`);
      },
      [navigate]
  );

  return (
      <div className="content-index">
        <div className="">
          <CommonBreadcrumb
              routeSegments={[
                {name:t ("navigation.instruction")},
              ]}
          />
        </div>
        <div className="mb-6 px-4 sm:px2">
          <InstructToolbar/>
        </div>
        <div className="mx-auto w-full max-w-7xl px-4 pb-4">
          {dataList.length > 0? (
              <>
                {/* Count */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Tìm thấy {dataList.length} kết quả
                  </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {dataList.map ((item) => (
                      <CardItem
                          key={item.id}
                          title={item.title}
                          desc={item.desc}
                          img={
                            item?.caption?.id
                                ? `${API_ENDPOINT}/api/file-description/public/${item.caption.id}`
                                : null
                          }
                          buttonText={t ("Xem chi tiết")}
                          onClick={() => handleViewDetail (item.id)}
                      />
                  ))}
                </div>
                {totalPages > 1 && (
                    <div
                        className="mt-12 border-t border-slate-200 pt-6 flex justify-center"
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
              </>
          ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center">
                  <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    Không có dữ liệu
                  </h3>
                  <p className="text-sm text-gray-500">
                    Không tìm thấy tài liệu nào phù hợp
                  </p>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default memo (observer (InstructIndex));