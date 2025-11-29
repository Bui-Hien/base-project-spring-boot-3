import React from "react";

const NoticeCard = ({title, content}) => (
    <div
        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-400">
      <div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

      <div className="relative flex gap-4">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-blue-600"
            >
              <path
                  d="M5 18H19V11.0314C19 7.14806 15.866 4 12 4C8.13401 4 5 7.14806 5 11.0314V18ZM12 2C16.9706 2 21 6.04348 21 11.0314V20H3V11.0314C3 6.04348 7.02944 2 12 2ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z"/>
            </svg>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="mb-2 font-semibold text-slate-900 text-lg">{title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
);

export default NoticeCard;