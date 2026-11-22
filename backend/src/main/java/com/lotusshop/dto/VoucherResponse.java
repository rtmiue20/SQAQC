package com.lotusshop.dto;

import com.lotusshop.model.DiscountType;
import com.lotusshop.model.Voucher;

import java.math.BigDecimal;

public record VoucherResponse(
        Long id,
        String code,
        DiscountType discountType,
        BigDecimal discountValue,
        BigDecimal maxDiscount,
        BigDecimal minOrderAmount,
        String description,
        boolean active
) {
    public static VoucherResponse from(Voucher voucher) {
        return new VoucherResponse(
                voucher.getId(),
                voucher.getCode(),
                voucher.getDiscountType(),
                voucher.getDiscountValue(),
                voucher.getMaxDiscount(),
                voucher.getMinOrderAmount(),
                voucher.getDescription(),
                voucher.isActive()
        );
    }
}
