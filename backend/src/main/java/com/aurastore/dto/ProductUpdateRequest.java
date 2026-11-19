package com.aurastore.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductUpdateRequest(
        @NotBlank(message = "Tên sản phẩm không được để trống")
        String name,

        @NotBlank(message = "Danh mục không được để trống")
        String category,

        @NotNull(message = "Giá bán không được để trống")
        @DecimalMin(value = "1", message = "Giá bán phải lớn hơn 0")
        BigDecimal price,

        @NotNull(message = "Số lượng tồn kho không được để trống")
        @Min(value = 0, message = "Số lượng tồn kho không được âm")
        Integer stock,

        String imageUrl,
        String description
) {
}
