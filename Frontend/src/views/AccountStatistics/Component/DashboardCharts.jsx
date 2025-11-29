import React, { memo } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toJS } from "mobx";
import { formatShortMoney, formatVNDMoney } from "../../../LocalFunction";
import { AccountStatisticsType } from "../../../LocalConstants";
import { useStore } from "../../../stores";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

function DashboardChartsComponent () {
  const {accountStatisticsStore} = useStore ();
  const {t} = useTranslation ();
  const {
    searchObject,
    overallStatistics,
    accountStatisticsRevenueList,
    handleSetType,
  } = accountStatisticsStore;

  const pieData = [
    {name:t ("dashboard.success"), value:overallStatistics.successfulOrders, color:"#10b981"},
    {name:t ("dashboard.error"), value:overallStatistics.errorOrders, color:"#ef4444"},
    {name:t ("dashboard.refund"), value:overallStatistics.refundedOrders, color:"#f59e0b"},
    {name:t ("dashboard.processing"), value:overallStatistics.processingOrders, color:"#3b82f6"},
  ];

  const formatXAxis = (value) => {
    const date = new Date (value);
    return searchObject.type === AccountStatisticsType.DAILY.value
        ? date.toLocaleDateString ("vi-VN", {day:"2-digit", month:"2-digit"}) // dd/MM
        : date.toLocaleDateString ("vi-VN", {month:"2-digit", year:"numeric"}); // MM/yyyy
  };

  const formatTooltipLabel = (value) => {
    const date = new Date (value);
    return searchObject.type === AccountStatisticsType.DAILY.value
        ? date.toLocaleDateString ("vi-VN", {
          day:"2-digit",
          month:"2-digit",
          year:"numeric",
        })
        : date.toLocaleDateString ("vi-VN", {
          month:"long",
          year:"numeric",
        });
  };

  const lineData = toJS (accountStatisticsRevenueList || []);

  return (
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* ====== Biểu đồ Doanh thu ====== */}
        <div className="bg-white rounded-lg shadow-md p-6 col-span-12 md:col-span-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t ("dashboard.revenue-by")}{" "}
              {searchObject.type === AccountStatisticsType.DAILY.value? t ("dashboard.filter.day") : t ("dashboard.filter.month")}
            </h3>

            <div className="mt-3 sm:mt-0 flex items-center gap-2">
              <label htmlFor="period" className="text-sm text-gray-600">
                {t ("dashboard.choose-time")}
              </label>
              <select
                  id="period"
                  value={searchObject.type}
                  onChange={(e) => handleSetType (Number (e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white
                       hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value={AccountStatisticsType.DAILY.value}>{t ("dashboard.filter.day")}</option>
                <option value={AccountStatisticsType.MONTHLY.value}>{t ("dashboard.filter.month")}</option>
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis
                  dataKey="reportDate"
                  tickFormatter={formatXAxis}
                  tick={{fontSize:12, fill:"#4B5563"}}
                  label={{
                    value:
                        searchObject.type === AccountStatisticsType.DAILY.value
                            ? t ("dashboard.filter.day")
                            : t ("dashboard.filter.month"),
                    position:"insideBottom",
                    offset:-5,
                    style:{fill:"#374151", fontSize:12},
                  }}
              />
              <YAxis
                  label={{
                    value:t ("dashboard.revenue"),
                    angle:-90,
                    position:"insideLeft",
                    style:{textAnchor:"middle", fill:"#374151", fontSize:12},
                  }}
                  tickFormatter={(value) => formatShortMoney (value)}
              />
              <Tooltip
                  labelFormatter={formatTooltipLabel}
                  formatter={(value) => formatVNDMoney (value)}
              />
              <Legend/>
              <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  name={t ("dashboard.revenue")}
                  dot={{r:3}}
                  activeDot={{r:6}}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ====== Biểu đồ Trạng thái đơn hàng ====== */}
        <div className="bg-white rounded-lg shadow-md p-6 col-span-12 md:col-span-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t ("dashboard.order-status")}
          </h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                            // Ẩn nếu giá trị nhỏ hơn 5%
                            if (percent < 0.05) return null;

                            const RADIAN = Math.PI / 180;
                            const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                            return (
                                <text
                                    x={x}
                                    y={y}
                                    fill="#374151"
                                    textAnchor={x > cx ? "start" : "end"}
                                    dominantBaseline="central"
                                    fontSize={12}
                                >
                                    <tspan x={x}>{name}</tspan>
                                    <tspan x={x} dy="1.2em">{`${(percent * 100).toFixed(0)}%`}</tspan>
                                </text>
                            );
                        }}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
                    <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        wrapperStyle={{ fontSize: 12 }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
  );
}

export default memo (observer (DashboardChartsComponent));
