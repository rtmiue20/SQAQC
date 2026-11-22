package com.lotusshop.dto;

import com.lotusshop.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
        @NotNull(message = "Trạng thái mới không được để trống")
        OrderStatus status
) {
}
