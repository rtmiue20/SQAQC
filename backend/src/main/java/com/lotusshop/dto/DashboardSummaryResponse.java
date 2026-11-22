package com.lotusshop.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record DashboardSummaryResponse(
        BigDecimal totalCompletedRevenue,
        long totalOrders,
        long lowStockCount,
        BigDecimal averageOrderValue,
        List<ProductResponse> lowStockProducts,
        Map<String, Long> statusCounts,
        List<DailyRevenuePoint> dailyRevenue,
        List<CategoryRevenuePoint> categoryRevenue
) {
    public record DailyRevenuePoint(
            String date,
            String label,
            BigDecimal completedRevenue,
            BigDecimal totalOrderValue,
            long orderCount
    ) {
    }

    public record CategoryRevenuePoint(
            String category,
            BigDecimal revenue,
            long unitsSold
    ) {
    }
}
