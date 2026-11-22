package com.lotusshop.service;

import com.lotusshop.dto.DashboardSummaryResponse;
import com.lotusshop.dto.DashboardSummaryResponse.CategoryRevenuePoint;
import com.lotusshop.dto.DashboardSummaryResponse.DailyRevenuePoint;
import com.lotusshop.dto.ProductResponse;
import com.lotusshop.model.Order;
import com.lotusshop.model.OrderItem;
import com.lotusshop.model.OrderStatus;
import com.lotusshop.repository.OrderRepository;
import com.lotusshop.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private static final int LOW_STOCK_THRESHOLD = 5;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter LABEL_FORMATTER = DateTimeFormatter.ofPattern("dd/MM");

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public DashboardService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public DashboardSummaryResponse getSummary() {
        List<Order> allOrders = orderRepository.findAllByOrderByCreatedAtDesc();

        BigDecimal totalCompletedRevenue = BigDecimal.ZERO;
        long completedCount = 0;

        Map<String, Long> statusCounts = new LinkedHashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            statusCounts.put(status.name(), 0L);
        }

        for (Order order : allOrders) {
            statusCounts.merge(order.getStatus().name(), 1L, Long::sum);
            if (order.getStatus() == OrderStatus.COMPLETED) {
                totalCompletedRevenue = totalCompletedRevenue.add(order.getFinalTotal());
                completedCount++;
            }
        }

        BigDecimal averageOrderValue = completedCount > 0
                ? totalCompletedRevenue.divide(BigDecimal.valueOf(completedCount), 0, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        List<ProductResponse> lowStockProducts = productRepository
                .findByStockLessThanOrderByStockAsc(LOW_STOCK_THRESHOLD)
                .stream()
                .map(ProductResponse::from)
                .toList();

        List<DailyRevenuePoint> dailyRevenue = buildDailyRevenue(allOrders);
        List<CategoryRevenuePoint> categoryRevenue = buildCategoryRevenue(allOrders);

        return new DashboardSummaryResponse(
                totalCompletedRevenue,
                allOrders.size(),
                lowStockProducts.size(),
                averageOrderValue,
                lowStockProducts,
                statusCounts,
                dailyRevenue,
                categoryRevenue
        );
    }

    private List<DailyRevenuePoint> buildDailyRevenue(List<Order> allOrders) {
        LocalDate today = LocalDate.now();
        List<DailyRevenuePoint> points = new ArrayList<>();

        for (int offset = 6; offset >= 0; offset--) {
            LocalDate targetDate = today.minusDays(offset);
            BigDecimal completedDayRevenue = BigDecimal.ZERO;
            BigDecimal totalDayOrderValue = BigDecimal.ZERO;
            long orderCount = 0;

            for (Order order : allOrders) {
                if (order.getCreatedAt() != null && order.getCreatedAt().toLocalDate().equals(targetDate)) {
                    if (order.getStatus() != OrderStatus.CANCELLED) {
                        totalDayOrderValue = totalDayOrderValue.add(order.getFinalTotal());
                        orderCount++;
                    }
                    if (order.getStatus() == OrderStatus.COMPLETED) {
                        completedDayRevenue = completedDayRevenue.add(order.getFinalTotal());
                    }
                }
            }

            points.add(new DailyRevenuePoint(
                    targetDate.format(DATE_FORMATTER),
                    targetDate.format(LABEL_FORMATTER),
                    completedDayRevenue,
                    totalDayOrderValue,
                    orderCount
            ));
        }
        return points;
    }

    private List<CategoryRevenuePoint> buildCategoryRevenue(List<Order> allOrders) {
        Map<String, BigDecimal> revenueByCategory = new LinkedHashMap<>();
        Map<String, Long> unitsByCategory = new LinkedHashMap<>();
        for (String cat : List.of("Áo", "Quần", "Phụ kiện")) {
            revenueByCategory.put(cat, BigDecimal.ZERO);
            unitsByCategory.put(cat, 0L);
        }

        for (Order order : allOrders) {
            if (order.getStatus() == OrderStatus.COMPLETED) {
                for (OrderItem item : order.getItems()) {
                    String cat = item.getProductCategory();
                    revenueByCategory.merge(cat, item.getLineTotal(), BigDecimal::add);
                    unitsByCategory.merge(cat, item.getQuantity().longValue(), Long::sum);
                }
            }
        }

        List<CategoryRevenuePoint> result = new ArrayList<>();
        for (String cat : revenueByCategory.keySet()) {
            result.add(new CategoryRevenuePoint(cat, revenueByCategory.get(cat), unitsByCategory.get(cat)));
        }
        return result;
    }
}
