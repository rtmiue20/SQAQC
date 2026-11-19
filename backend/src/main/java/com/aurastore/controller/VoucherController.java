package com.aurastore.controller;

import com.aurastore.dto.VoucherResponse;
import com.aurastore.dto.VoucherValidateRequest;
import com.aurastore.dto.VoucherValidateResponse;
import com.aurastore.service.VoucherService;
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
