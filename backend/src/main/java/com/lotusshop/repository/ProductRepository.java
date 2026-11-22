package com.lotusshop.repository;

import com.lotusshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderByIdDesc();

    List<Product> findByStockLessThanOrderByStockAsc(Integer threshold);
}
