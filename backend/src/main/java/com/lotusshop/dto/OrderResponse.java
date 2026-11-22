package com.lotusshop.dto;

import com.lotusshop.model.Order;
import com.lotusshop.model.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderCode,
        String customerName,
        String customerPhone,
        String customerAddress,
        OrderStatus status,
        String statusLabel,
        BigDecimal subtotal,
        String voucherCode,
        BigDecimal discountAmount,
        BigDecimal finalTotal,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<OrderItemResponse> items
) {
    public static OrderResponse from(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getOrderCode(),
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getCustomerAddress(),
                order.getStatus(),
                order.getStatus().getLabel(),
                order.getSubtotal(),
                order.getVoucherCode(),
                order.getDiscountAmount(),
                order.getFinalTotal(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                order.getItems().stream().map(OrderItemResponse::from).toList()
        );
    }
}
