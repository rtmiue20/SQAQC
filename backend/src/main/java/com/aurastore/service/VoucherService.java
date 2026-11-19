package com.aurastore.service;

import com.aurastore.dto.VoucherResponse;
import com.aurastore.dto.VoucherValidateResponse;
import com.aurastore.exception.BusinessException;
import com.aurastore.model.DiscountType;
import com.aurastore.model.Voucher;
import com.aurastore.repository.VoucherRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

@Service
public class VoucherService {

    private final VoucherRepository voucherRepository;

    public VoucherService(VoucherRepository voucherRepository) {
        this.voucherRepository = voucherRepository;
    }

    public List<VoucherResponse> getActiveVouchers() {
        return voucherRepository.findByActiveTrueOrderByCodeAsc().stream()
                .map(VoucherResponse::from)
                .toList();
    }

    public VoucherValidateResponse validateVoucher(String rawCode, BigDecimal subtotal) {
        if (rawCode == null || rawCode.isBlank()) {
            throw new BusinessException("Vui lòng nhập mã giảm giá");
        }
        BigDecimal safeSubtotal = subtotal == null ? BigDecimal.ZERO : subtotal;
        String code = rawCode.trim().toUpperCase(Locale.ROOT);

        Voucher voucher = voucherRepository.findByCodeIgnoreCase(code)
                .filter(Voucher::isActive)
                .orElseThrow(() -> new BusinessException("Mã giảm giá \"" + code + "\" không hợp lệ hoặc đã hết hạn"));

        if (safeSubtotal.compareTo(voucher.getMinOrderAmount()) < 0) {
            throw new BusinessException("Mã " + voucher.getCode() + " chỉ áp dụng cho đơn hàng từ "
                    + formatVnd(voucher.getMinOrderAmount()));
        }

        BigDecimal discountAmount = calculateDiscount(voucher, safeSubtotal);
        BigDecimal finalTotal = safeSubtotal.subtract(discountAmount).max(BigDecimal.ZERO);

        return new VoucherValidateResponse(
                true,
                voucher.getCode(),
                discountAmount,
                finalTotal,
                voucher.getDescription(),
                "Áp dụng mã " + voucher.getCode() + " thành công"
        );
    }

    public BigDecimal calculateDiscount(Voucher voucher, BigDecimal subtotal) {
        if (subtotal.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        if (voucher.getDiscountType() == DiscountType.PERCENT) {
            BigDecimal rawDiscount = subtotal
                    .multiply(voucher.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);

            // [SQA-BUG-02] Intentionally omit capping rawDiscount by voucher.getMaxDiscount() (50,000 VND)
            // When subtotal > 500,000 VND, UEH10 deducts full 10% instead of capping at 50,000 VND.
            return rawDiscount.min(subtotal);
        }

        return voucher.getDiscountValue().min(subtotal);
    }

    private String formatVnd(BigDecimal amount) {
        NumberFormat nf = NumberFormat.getInstance(Locale.forLanguageTag("vi-VN"));
        return nf.format(amount) + "đ";
    }
}
