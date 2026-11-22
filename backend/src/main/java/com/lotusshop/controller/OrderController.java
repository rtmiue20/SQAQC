package com.lotusshop.controller;

import com.lotusshop.dto.CreateOrderRequest;
import com.lotusshop.dto.OrderResponse;
import com.lotusshop.dto.UpdateOrderStatusRequest;
import com.lotusshop.model.OrderStatus;
import com.lotusshop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(
            @RequestParam(required = false) OrderStatus status
    ) {
        return ResponseEntity.ok(orderService.getAllOrders(status));
    }

    @GetMapping("/lookup")
    public ResponseEntity<List<OrderResponse>> lookupByPhone(
            @RequestParam(required = false, defaultValue = "") String phone
    ) {
        // [SQA-BUG-04] Empty or special-character phone query exposes all customers' orders
        return ResponseEntity.ok(orderService.lookupByPhone(phone));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(request));
    }

    @PostMapping("/{id}/customer-cancel")
    public ResponseEntity<OrderResponse> cancelOrderByCustomer(@PathVariable Long id) {
        // [SQA-BUG-03] Customer cancel transitions status to CANCELLED without restoring product stock
        return ResponseEntity.ok(orderService.cancelOrderByCustomer(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatusByAdmin(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatusByAdmin(id, request.status()));
    }
}
