// 🧩 CardItem.jsx
import React, { memo, useState } from "react";

const DEFAULT_IMAGE =
    "https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/06/hinh-nen-trang-thumb.jpg";

const CardItem = memo(({ title, desc, img, buttonText = "Xem chi tiết", onClick }) => {
  const [imgSrc, setImgSrc] = useState(img || DEFAULT_IMAGE);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(DEFAULT_IMAGE);
    }
  };

  return (
      <div
          className="flex flex-col h-full bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
          onClick={onClick}
      >
        {/* Ảnh */}
        <div className="h-48 overflow-hidden bg-gray-50">
          <img
              src={imgSrc}
              alt={title || "Image"}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={handleImageError}
          />
        </div>

        {/* Nội dung */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[48px]">
            {title}
          </h3>

          {desc && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {desc}
              </p>
          )}

          <div className="mt-auto">
          <span className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            {buttonText} →
          </span>
          </div>
        </div>
      </div>
  );
});

export default CardItem;