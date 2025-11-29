import React, { memo } from "react";
import { AlertCircle, CheckCircle, RefreshCw, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const OrderStatCard = memo (({icon:Icon, value, label, color}) => (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <div className="flex justify-center mb-2">
        <Icon className={`w-8 h-8 text-${color}-500`}/>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
));

const OrderStatsGrid = memo (
    ({successfulOrders, errorOrders, refundedOrders, processingOrders}) => {
      const {t} = useTranslation ();
      const statsConfig = [
        {
          icon:CheckCircle,
          value:successfulOrders,
          label: t("dashboard.order-success"),
          color:"green",
        },
        {
          icon:XCircle,
          value:errorOrders,
          label:t("dashboard.order-error"),
          color:"red",
        },
        {
          icon:RefreshCw,
          value:refundedOrders,
          label:t("dashboard.order-refund"),
          color:"orange",
        },
        {
          icon:AlertCircle,
          value:processingOrders,
          label:t("dashboard.order-processing"),
          color:"blue",
        },
      ];

      return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {statsConfig.map ((item, idx) => (
                <OrderStatCard key={idx} {... item} />
            ))}
          </div>
      );
    }
);

export default OrderStatsGrid;
