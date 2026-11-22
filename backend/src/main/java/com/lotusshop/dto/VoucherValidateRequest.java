package com.lotusshop.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record VoucherValidateRequest(
        @NotBlank(message = "Vui lòng nhập mã giảm giá")
        String code,

        @NotNull(message = "Tổng tiền tạm tính không hợp lệ")
        @DecimalMin(value = "0", message = "Tổng tiền tạm tính không được âm")
        BigDecimal subtotal
) {
}
