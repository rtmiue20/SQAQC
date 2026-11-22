package com.lotusshop.model;

public enum OrderStatus {
    PENDING("Chờ xác nhận"),
    SHIPPING("Đang giao hàng"),
    COMPLETED("Hoàn thành"),
    CANCELLED("Đã hủy");

    private final String label;

    OrderStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
