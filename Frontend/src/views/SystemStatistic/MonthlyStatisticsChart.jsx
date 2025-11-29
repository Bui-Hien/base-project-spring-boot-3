import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { memo, useEffect } from "react";
import { observer, } from "mobx-react-lite";
import { useStore } from "../../stores";
import { toJS } from "mobx";
import { formatDate } from "../../LocalFunction";

function MonthlyStatisticsChart () {
  const {systemStatisticStore} = useStore ();
  const {monthlyStatisticsChartList:data, handleGetMonthlyStatisticsList, searchObject} = systemStatisticStore;

  useEffect (() => {
    handleGetMonthlyStatisticsList ();
  }, []);

  return (
      <div style={{width:"100%", height:400}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
              data={toJS (data)}
              margin={{top:20, right:30, left:20, bottom:20}}
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis
                dataKey="label"
                label={{
                  value:`Thống kê người dùng trong tháng ${formatDate ('MM/yyyy', searchObject?.date)}`,
                  position:"insideBottom",
                  offset:-5
                }}
                tickFormatter={(d) => `Ngày ${d < 10? "0" : ""}${d}`}
            />
            <YAxis
                label={{value:"Số người dùng trung bình", angle:-90, position:"insideLeft"}}
            />
            <Tooltip
                formatter={(value, name) => [Number (value).toFixed (2), name]}
                labelFormatter={(label) => `Ngày ${label < 10? "0" : ""}${label}`}
            />
            <Legend verticalAlign="top"/>
            <Line
                type="monotone"
                dataKey="avgTotalUsers"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{r:5}}
                name="Trung bình số người dùng hệ thống"
            />
            <Line
                type="monotone"
                dataKey="avgOnlineUsers"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{r:5}}
                name="Trung bình số người trực tuyến"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
  );
}

export default memo (observer (MonthlyStatisticsChart));
