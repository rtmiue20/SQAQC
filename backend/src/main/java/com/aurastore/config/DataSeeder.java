package com.aurastore.config;

import com.aurastore.dto.SeedResetResponse;
import com.aurastore.model.DiscountType;
import com.aurastore.model.Order;
import com.aurastore.model.OrderItem;
import com.aurastore.model.OrderStatus;
import com.aurastore.model.Product;
import com.aurastore.model.Voucher;
import com.aurastore.repository.OrderRepository;
import com.aurastore.repository.ProductRepository;
import com.aurastore.repository.VoucherRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final VoucherRepository voucherRepository;
    private final OrderRepository orderRepository;

    public DataSeeder(
            ProductRepository productRepository,
            VoucherRepository voucherRepository,
            OrderRepository orderRepository
    ) {
        this.productRepository = productRepository;
        this.voucherRepository = voucherRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (productRepository.count() == 0 && voucherRepository.count() == 0 && orderRepository.count() == 0) {
            seedInitialData();
        }
    }

    @Transactional
    public SeedResetResponse resetSeedData() {
        orderRepository.deleteAll();
        productRepository.deleteAll();
        voucherRepository.deleteAll();

        orderRepository.flush();
        productRepository.flush();
        voucherRepository.flush();

        seedInitialData();

        return new SeedResetResponse(
                true,
                "Đã khôi phục dữ liệu mẫu thành công (8 sản phẩm, 2 voucher, 4 đơn hàng)",
                productRepository.count(),
                voucherRepository.count(),
                orderRepository.count()
        );
    }

    private void seedInitialData() {
        voucherRepository.saveAll(List.of(
                new Voucher("UEH10", DiscountType.PERCENT, new BigDecimal("10"), new BigDecimal("50000"),
                        new BigDecimal("200000"), "Giảm 10% tối đa 50.000đ cho đơn từ 200.000đ", true),
                new Voucher("FREESHIP", DiscountType.FIXED, new BigDecimal("30000"), new BigDecimal("30000"),
                        BigDecimal.ZERO, "Giảm trực tiếp 30.000đ phí vận chuyển", true)
        ));

        List<Product> products = productRepository.saveAll(List.of(
                buildProduct("Áo Khoác Bomber Minimalist Slate", "Áo", "690000", 18,
                        "photo-1591047139829-d91aecb6caea",
                        "Áo khoác bomber chất liệu dù chống thấm nhẹ, phom dáng hiện đại tối giản."),
                buildProduct("Áo Thun Cotton Oversize Essential", "Áo", "290000", 35,
                        "photo-1521572163474-6864f9cf17ab",
                        "Áo thun 100% cotton 250gsm co giãn thoáng mát, giữ form chuẩn sau nhiều lần giặt."),
                buildProduct("Áo Sơ Mi Oxford Slim Fit", "Áo", "450000", 3,
                        "photo-1596755094514-f87e34085b2c",
                        "Áo sơ mi vải Oxford mềm mịn, phù hợp môi trường công sở và dạo phố."),
                buildProduct("Quần Tây Ống Đứng Tailored Fit", "Quần", "580000", 14,
                        "photo-1473966968600-fa801b869a1a",
                        "Quần tây nam nữ phong cách smart-casual, ít nhăn và tôn dáng."),
                buildProduct("Quần Jeans Selvedge Indigo", "Quần", "750000", 1,
                        "photo-1542272604-787c3835535d",
                        "Quần jeans denim dệt biên cao cấp, màu indigo trầm cổ điển."),
                buildProduct("Tai Nghe Chụp Tai Aura Studio ANC", "Phụ kiện", "1890000", 0,
                        "photo-1505740420928-5e560c06d30e",
                        "Tai nghe không dây chống ồn chủ động ANC, thời lượng pin 40 giờ."),
                buildProduct("Đồng Hồ Thông Minh Aura Watch S2", "Phụ kiện", "2450000", 9,
                        "photo-1523275335684-37898b6baf30",
                        "Đồng hồ thông minh màn hình AMOLED sắc nét, theo dõi nhịp tim và luyện tập."),
                buildProduct("Balo Laptop Chống Sốc TechPack 15\"", "Phụ kiện", "890000", 12,
                        "photo-1553062407-98eeb64c6a62",
                        "Balo chống nước đa ngăn, ngăn chống sốc riêng cho laptop 15.6 inch.")
        ));

        LocalDateTime now = LocalDateTime.now();

        Order o1 = buildOrder("ORD-1001", "Nguyễn Minh Anh", "0901234567",
                "279 Nguyễn Tri Phương, P.5, Q.10, TP.HCM", OrderStatus.COMPLETED,
                "FREESHIP", "30000", now.minusDays(3), now.minusDays(2),
                List.of(toItem(products.get(6), 1), toItem(products.get(1), 1)));

        Order o2 = buildOrder("ORD-1002", "Trần Gia Huy", "0912345678",
                "59C Nguyễn Đình Chiểu, Q.3, TP.HCM", OrderStatus.SHIPPING,
                "UEH10", "50000", now.minusDays(2), now.minusDays(1),
                List.of(toItem(products.get(0), 1), toItem(products.get(3), 1)));

        Order o3 = buildOrder("ORD-1003", "Phạm Quốc Bảo", "0938112233",
                "208 Nguyễn Hữu Cảnh, Q. Bình Thạnh, TP.HCM", OrderStatus.PENDING,
                "FREESHIP", "30000", now.minusHours(2), now.minusHours(2),
                List.of(toItem(products.get(2), 2), toItem(products.get(7), 1)));

        Order o4 = buildOrder("ORD-1004", "Lê Thảo Vy", "0987654321",
                "1A Hoàng Diệu, Q. Phú Nhuận, TP.HCM", OrderStatus.CANCELLED,
                null, "0", now.minusDays(1), now.minusDays(1),
                List.of(toItem(products.get(1), 1)));

        orderRepository.saveAll(List.of(o1, o2, o3, o4));
    }

    private Product buildProduct(String name, String category, String price, int stock, String photoId, String desc) {
        String url = "https://images.unsplash.com/" + photoId + "?auto=format&fit=crop&w=800&q=80";
        return new Product(name, category, new BigDecimal(price), stock, url, desc);
    }

    private OrderItem toItem(Product product, int qty) {
        return new OrderItem(
                product.getId(),
                product.getName(),
                product.getCategory(),
                product.getImageUrl(),
                product.getPrice(),
                qty,
                product.getPrice().multiply(BigDecimal.valueOf(qty))
        );
    }

    private Order buildOrder(
            String orderCode, String customerName, String phone, String address,
            OrderStatus status, String voucherCode, String discountAmount,
            LocalDateTime createdAt, LocalDateTime updatedAt, List<OrderItem> items
    ) {
        BigDecimal subtotal = items.stream()
                .map(OrderItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal discount = new BigDecimal(discountAmount);

        Order order = new Order();
        order.setOrderCode(orderCode);
        order.setCustomerName(customerName);
        order.setCustomerPhone(phone);
        order.setCustomerAddress(address);
        order.setStatus(status);
        order.setSubtotal(subtotal);
        order.setVoucherCode(voucherCode);
        order.setDiscountAmount(discount);
        order.setFinalTotal(subtotal.subtract(discount).max(BigDecimal.ZERO));
        order.setCreatedAt(createdAt);
        order.setUpdatedAt(updatedAt);
        items.forEach(order::addItem);
        return order;
    }
}
