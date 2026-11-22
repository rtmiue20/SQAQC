package com.lotusshop.repository;

import com.lotusshop.model.Order;
import com.lotusshop.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByCustomerPhoneOrderByCreatedAtDesc(String customerPhone);

    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    boolean existsByOrderCode(String orderCode);
}
