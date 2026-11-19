package com.aurastore.dto;

import java.math.BigDecimal;

public record VoucherValidateResponse(
        boolean valid,
        String code,
        BigDecimal discountAmount,
        BigDecimal finalTotal,
        String description,
        String message
) {
}
