import React, { memo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import PageFooter from "../../common/Component/PageFooter";

const InstructViewDetailItem = () => {
  const navigate = useNavigate ();
  const {id} = useParams ();
  const {postStore} = useStore ();

  const {selectedRow, handleGetPublicById} = postStore;

  useEffect (() => {
    const fetchData = async () => {
      const data = await handleGetPublicById (id);
      if (!data) {
        navigate ("/admin/instruct");
      }
    };
    if (id) {
      fetchData ();
    }
  }, [id]);

  if (!selectedRow) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
          <div className="text-center px-4 sm:px2">
            <p className="text-gray-600">Không tìm thấy bài viết</p>
          </div>
          <PageFooter/>
        </div>
    );
  }

  return (
      <div className="content-index bg-slate-50 min-h-screen">
        <div className="px-4 sm:px2">
          {/* Back Button */}
          <div className="mb-6 border-b border-gray-200 h-[44px] flex items-center">
            <button
                onClick={() => navigate (-1)}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowBackIcon sx={{fontSize:18}}/>
              <span>Quay lại danh sách</span>
            </button>
          </div>

          {/* Content Card */}
          <div className="">
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedRow.title || "Không có tiêu đề"}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <PersonIcon sx={{fontSize:18}}/>
                  <span>{selectedRow?.author?.username || "Không rõ"}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <VisibilityIcon sx={{fontSize:18}}/>
                  <span>{selectedRow?.view || 0} lượt xem</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-8">
              <article
                  className="prose prose-gray max-w-none
                                prose-headings:font-semibold prose-headings:text-gray-900
                                prose-p:text-gray-700 prose-p:leading-relaxed
                                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                prose-img:rounded-lg"
                  dangerouslySetInnerHTML={{
                    __html:selectedRow?.content || "<p class='text-gray-500'>Chưa có nội dung</p>"
                  }}
              />
            </div>
          </div>
        </div>
        <PageFooter/>
      </div>
  );
};

export default memo (observer (InstructViewDetailItem));