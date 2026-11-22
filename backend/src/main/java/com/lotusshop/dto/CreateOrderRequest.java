package com.lotusshop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CreateOrderRequest(
        @NotBlank(message = "Vui lòng nhập họ tên khách hàng")
        String customerName,

        @NotBlank(message = "Vui lòng nhập số điện thoại")
        String customerPhone,

        @NotBlank(message = "Vui lòng nhập địa chỉ giao hàng")
        String customerAddress,

        String voucherCode,

        @NotEmpty(message = "Giỏ hàng đang trống")
        @Valid
        List<OrderItemRequest> items
) {
}
