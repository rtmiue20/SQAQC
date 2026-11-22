package com.lotusshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank(message = "Tên sản phẩm không được để trống")
        String name,

        @NotBlank(message = "Danh mục không được để trống")
        String category,

        // [SQA-BUG-01] Intentionally omits @Positive / @DecimalMin so Admin Create Product
        // accepts price = 0 or negative price in Release v1.0 (Beta)
        @NotNull(message = "Giá bán không được để trống")
        BigDecimal price,

        @NotNull(message = "Số lượng tồn kho không được để trống")
        @Min(value = 0, message = "Số lượng tồn kho không được âm")
        Integer stock,

        String imageUrl,
        String description
) {
}
