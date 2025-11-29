import React, { memo } from "react";
import { CheckCircle, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";
import { useTranslation } from "react-i18next";

const DashboardStatsGrid = memo (
    ({totalRevenue, totalOrders, successfulOrders, successRate}) => {
      const {t} = useTranslation ();
      const statsConfig = [
        {
          title:t ('dashboard.total-revenue'),
          value:totalRevenue,
          icon:DollarSign,
          trend:"up",
          trendValue:12.5,
          color:"#10b981",
          isCurrency:true,
        },
        {
          title:t ('dashboard.total-order'),
          value:totalOrders,
          icon:ShoppingCart,
          trend:"up",
          trendValue:8.3,
          color:"#3b82f6",
        },
        {
          title:t ('dashboard.order-success'),
          value:successfulOrders,
          icon:CheckCircle,
          color:"#10b981",
        },
        {
          title:t ('dashboard.percentage-success'),
          value:successRate,
          icon:TrendingUp,
          color:"#8b5cf6",
          isPercentage:true,
        },
      ];

      return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsConfig.map ((item, idx) => (
                <StatCard key={idx} {... item} />
            ))}
          </div>
      );
    }
);

export default DashboardStatsGrid;
