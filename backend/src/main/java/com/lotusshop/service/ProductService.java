package com.lotusshop.service;

import com.lotusshop.dto.ProductRequest;
import com.lotusshop.dto.ProductResponse;
import com.lotusshop.dto.ProductUpdateRequest;
import com.lotusshop.exception.ResourceNotFoundException;
import com.lotusshop.model.Product;
import com.lotusshop.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class ProductService {

    private static final String DEFAULT_IMAGE_URL =
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80";

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> getProducts(String search, String category, String sort) {
        List<Product> products = productRepository.findAllByOrderByIdDesc();

        String normalizedCategory = category == null ? "" : category.trim();
        String normalizedSearch = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);
        String normalizedSort = sort == null ? "default" : sort.trim().toLowerCase(Locale.ROOT);

        var stream = products.stream()
                .filter(p -> normalizedCategory.isEmpty()
                        || normalizedCategory.equalsIgnoreCase("Tất cả")
                        || normalizedCategory.equalsIgnoreCase("all")
                        || p.getCategory().equalsIgnoreCase(normalizedCategory))
                .filter(p -> normalizedSearch.isEmpty()
                        || p.getName().toLowerCase(Locale.ROOT).contains(normalizedSearch)
                        || p.getCategory().toLowerCase(Locale.ROOT).contains(normalizedSearch));

        if ("price_asc".equals(normalizedSort)) {
            stream = stream.sorted(Comparator.comparing(Product::getPrice));
        } else if ("price_desc".equals(normalizedSort)) {
            stream = stream.sorted(Comparator.comparing(Product::getPrice).reversed());
        }

        return stream.map(ProductResponse::from).toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));
        return ProductResponse.from(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        // [SQA-BUG-01] Intentionally skip price > 0 validation in Admin Create Product
        String imageUrl = (request.imageUrl() == null || request.imageUrl().isBlank())
                ? DEFAULT_IMAGE_URL
                : request.imageUrl().trim();

        Product product = new Product(
                request.name().trim(),
                request.category().trim(),
                request.price(),
                request.stock(),
                imageUrl,
                request.description() == null ? "" : request.description().trim()
        );
        Product saved = productRepository.save(product);
        return ProductResponse.from(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        product.setName(request.name().trim());
        product.setCategory(request.category().trim());
        product.setPrice(request.price());
        product.setStock(request.stock());
        if (request.imageUrl() != null && !request.imageUrl().isBlank()) {
            product.setImageUrl(request.imageUrl().trim());
        } else if (product.getImageUrl() == null || product.getImageUrl().isBlank()) {
            product.setImageUrl(DEFAULT_IMAGE_URL);
        }
        if (request.description() != null) {
            product.setDescription(request.description().trim());
        }

        Product updated = productRepository.save(product);
        return ProductResponse.from(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));
        productRepository.delete(product);
    }
}
