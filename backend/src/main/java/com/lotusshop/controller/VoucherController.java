package com.lotusshop.controller;

import com.lotusshop.dto.VoucherResponse;
import com.lotusshop.dto.VoucherValidateRequest;
import com.lotusshop.dto.VoucherValidateResponse;
import com.lotusshop.service.VoucherService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
public class VoucherController {

    private final VoucherService voucherService;

    public VoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }

    @GetMapping
    public ResponseEntity<List<VoucherResponse>> getActiveVouchers() {
        return ResponseEntity.ok(voucherService.getActiveVouchers());
    }

    @PostMapping("/validate")
    public ResponseEntity<VoucherValidateResponse> validateVoucher(
            @Valid @RequestBody VoucherValidateRequest request
    ) {
        return ResponseEntity.ok(voucherService.validateVoucher(request.code(), request.subtotal()));
    }
}
