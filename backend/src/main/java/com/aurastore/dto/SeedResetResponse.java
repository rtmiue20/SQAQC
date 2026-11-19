package com.aurastore.dto;

public record SeedResetResponse(
        boolean success,
        String message,
        long productsCount,
        long vouchersCount,
        long ordersCount
) {
}
