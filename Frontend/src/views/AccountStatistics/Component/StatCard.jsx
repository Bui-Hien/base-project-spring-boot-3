import React, { memo } from "react";
import { formatVNDMoney } from "../../../LocalFunction";

const StatCardComponent = ({
                             title,
                             value,
                             icon:Icon,
                             trend,
                             trendValue,
                             color,
                             isPercentage,
                             isCurrency,
                           }) => {

  const displayValue = isCurrency
      ? formatVNDMoney (value)
      : isPercentage
          ? `${(value ?? 0).toFixed (1)}%`
          : (value ?? 0).toLocaleString ("vi-VN");

  const borderLeftStyle = {borderLeftColor:color};
  const iconBgStyle = {backgroundColor:`${color}20`};

  return (
      <div
          className="bg-white rounded-lg shadow-md p-6 border-l-4"
          style={borderLeftStyle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{displayValue}</h3>
          </div>

          <div className="ml-4 p-3 rounded-full" style={iconBgStyle}>
            <Icon className="w-8 h-8" style={{color}}/>
          </div>
        </div>
      </div>
  );
};

export const StatCard = memo (
    StatCardComponent,
    (prevProps, nextProps) =>
        prevProps.title === nextProps.title &&
        prevProps.value === nextProps.value &&
        prevProps.trend === nextProps.trend &&
        prevProps.trendValue === nextProps.trendValue &&
        prevProps.color === nextProps.color &&
        prevProps.isPercentage === nextProps.isPercentage &&
        prevProps.isCurrency === nextProps.isCurrency &&
        prevProps.icon === nextProps.icon
);
