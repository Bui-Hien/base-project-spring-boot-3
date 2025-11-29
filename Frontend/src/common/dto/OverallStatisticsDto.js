export default class OverallStatisticsDto {
  totalRevenue = null;      // Tổng doanh thu
  totalOrders = null;             // Tổng số đơn hàng
  successfulOrders = null;        // Số đơn hàng thành công
  errorOrders = null;             // Số đơn hàng có lỗi/báo cáo
  refundedOrders = null;          // Số đơn hàng hoàn trả
  processingOrders = null;        // Số đơn hàng đang xử lý

  successRate = null;           // Tỷ lệ thành công (%)
  errorRate = null;             // Tỷ lệ lỗi (%)
  refundedRate = null;          // Tỷ lệ hoàn trả (%)
  processingRate = null;        // Tỷ lệ đang xử lý (%)

  constructor () {
  }
}
