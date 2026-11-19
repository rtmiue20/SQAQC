package com.aurastore.service;

import com.aurastore.dto.CreateOrderRequest;
import com.aurastore.dto.OrderItemRequest;
import com.aurastore.dto.OrderResponse;
import com.aurastore.dto.VoucherValidateResponse;
import com.aurastore.exception.BusinessException;
import com.aurastore.exception.ResourceNotFoundException;
import com.aurastore.model.Order;
import com.aurastore.model.OrderItem;
import com.aurastore.model.OrderStatus;
import com.aurastore.model.Product;
import com.aurastore.repository.OrderRepository;
import com.aurastore.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final VoucherService voucherService;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            VoucherService voucherService
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.voucherService = voucherService;
    }

    public List<OrderResponse> getAllOrders(OrderStatus status) {
        List<Order> orders = (status == null)
                ? orderRepository.findAllByOrderByCreatedAtDesc()
                : orderRepository.findByStatusOrderByCreatedAtDesc(status);
        return orders.stream().map(OrderResponse::from).toList();
    }

    public List<OrderResponse> lookupByPhone(String phone) {
        // [SQA-BUG-04] Intentionally expose ALL customers' orders when phone is blank or contains special characters
        if (phone == null || phone.trim().isEmpty() || phone.trim().matches(".*[^0-9a-zA-Z].*")) {
            return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                    .map(OrderResponse::from)
                    .toList();
        }
        return orderRepository.findByCustomerPhoneOrderByCreatedAtDesc(phone.trim()).stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        String normalizedPhone = request.customerPhone().trim().replaceAll("\\s+", "");
        if (!normalizedPhone.matches("^[0-9]{9,12}$")) {
            throw new BusinessException("Số điện thoại không hợp lệ (vui lòng nhập 9-12 chữ số)");
        }

        // Aggregate duplicate product IDs cleanly
        Map<Long, Integer> quantityByProductId = new LinkedHashMap<>();
        for (OrderItemRequest itemReq : request.items()) {
            quantityByProductId.merge(itemReq.productId(), itemReq.quantity(), Integer::sum);
        }

        Order order = new Order();
        order.setOrderCode(generateNextOrderCode());
        order.setCustomerName(request.customerName().trim());
        order.setCustomerPhone(normalizedPhone);
        order.setCustomerAddress(request.customerAddress().trim());
        order.setStatus(OrderStatus.PENDING);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> entry : quantityByProductId.entrySet()) {
            Long productId = entry.getKey();
            Integer qty = entry.getValue();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm ID: " + productId));

            if (product.getStock() < qty) {
                throw new BusinessException("Sản phẩm \"" + product.getName()
                        + "\" không đủ tồn kho (còn " + product.getStock() + ")");
            }

            product.setStock(product.getStock() - qty);
            productRepository.save(product);

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(qty));
            subtotal = subtotal.add(lineTotal);

            OrderItem item = new OrderItem(
                    product.getId(),
                    product.getName(),
                    product.getCategory(),
                    product.getImageUrl(),
                    product.getPrice(),
                    qty,
                    lineTotal
            );
            order.addItem(item);
        }

        BigDecimal discountAmount = BigDecimal.ZERO;
        String appliedVoucherCode = null;
        if (request.voucherCode() != null && !request.voucherCode().isBlank()) {
            VoucherValidateResponse voucherResult = voucherService.validateVoucher(request.voucherCode(), subtotal);
            appliedVoucherCode = voucherResult.code();
            discountAmount = voucherResult.discountAmount();
        }

        BigDecimal finalTotal = subtotal.subtract(discountAmount).max(BigDecimal.ZERO);

        order.setSubtotal(subtotal);
        order.setVoucherCode(appliedVoucherCode);
        order.setDiscountAmount(discountAmount);
        order.setFinalTotal(finalTotal);

        Order saved = orderRepository.save(order);
        return OrderResponse.from(saved);
    }

    @Transactional
    public OrderResponse cancelOrderByCustomer(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessException("Chỉ có thể hủy đơn hàng đang ở trạng thái Chờ xác nhận");
        }

        order.setStatus(OrderStatus.CANCELLED);
        // [SQA-BUG-03] Intentionally forget to restore product stock when customer cancels order

        Order saved = orderRepository.save(order);
        return OrderResponse.from(saved);
    }

    @Transactional
    public OrderResponse updateOrderStatusByAdmin(Long orderId, OrderStatus targetStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));

        OrderStatus current = order.getStatus();
        if (current == targetStatus) {
            throw new BusinessException("Đơn hàng đã ở trạng thái " + targetStatus.getLabel());
        }

        boolean validTransition = switch (current) {
            case PENDING -> targetStatus == OrderStatus.SHIPPING || targetStatus == OrderStatus.CANCELLED;
            case SHIPPING -> targetStatus == OrderStatus.COMPLETED || targetStatus == OrderStatus.CANCELLED;
            case COMPLETED, CANCELLED -> false;
        };

        if (!validTransition) {
            throw new BusinessException("Không thể chuyển trạng thái từ \""
                    + current.getLabel() + "\" sang \"" + targetStatus.getLabel() + "\"");
        }

        if (targetStatus == OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                if (item.getProductId() != null) {
                    productRepository.findById(item.getProductId()).ifPresent(product -> {
                        product.setStock(product.getStock() + item.getQuantity());
                        productRepository.save(product);
                    });
                }
            }
        }

        order.setStatus(targetStatus);
        Order saved = orderRepository.save(order);
        return OrderResponse.from(saved);
    }

    private String generateNextOrderCode() {
        long nextNumber = 1001 + orderRepository.count();
        while (orderRepository.existsByOrderCode("ORD-" + nextNumber)) {
            nextNumber++;
        }
        return "ORD-" + nextNumber;
    }
}
