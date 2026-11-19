-- =============================================================================
-- AURA STORE - He thong Quan ly Ban hang & Thuong mai Truc tuyen
-- Database Schema & Seed Data (MariaDB / MySQL Compatible)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS aura_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE aura_store;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS vouchers;
DROP TABLE IF EXISTS products;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Products Table
-- [SQA-BUG-01] Intentionally NO CHECK (price > 0) constraint so Release v1.0 Beta
-- allows testing zero/negative price input via Admin Create Product.
-- -----------------------------------------------------------------------------
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    stock INT NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    description VARCHAR(1000) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Vouchers Table
-- -----------------------------------------------------------------------------
CREATE TABLE vouchers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(15, 2) NOT NULL,
    max_discount DECIMAL(15, 2) NOT NULL,
    min_order_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    description VARCHAR(500) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Orders Table
-- -----------------------------------------------------------------------------
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_address VARCHAR(500) NOT NULL,
    status VARCHAR(30) NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    voucher_code VARCHAR(50) NULL,
    discount_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    final_total DECIMAL(15, 2) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_orders_phone (customer_phone),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Order Items Table
-- Note: product_id is nullable and has NO FK to products so deleting a product
-- in Admin CRUD preserves historical order snapshots safely.
-- -----------------------------------------------------------------------------
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_category VARCHAR(100) NOT NULL,
    product_image_url VARCHAR(1000) NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    quantity INT NOT NULL,
    line_total DECIMAL(15, 2) NOT NULL,
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- 2 Vouchers
INSERT INTO vouchers (code, discount_type, discount_value, max_discount, min_order_amount, description, active) VALUES
('UEH10', 'PERCENT', 10.00, 50000.00, 200000.00, 'Giảm 10% tối đa 50.000đ cho đơn từ 200.000đ', 1),
('FREESHIP', 'FIXED', 30000.00, 30000.00, 0.00, 'Giảm trực tiếp 30.000đ phí vận chuyển', 1);

-- 8 Products (includes boundary stock = 1 and stock = 0, plus low stock = 3)
INSERT INTO products (id, name, category, price, stock, image_url, description) VALUES
(1, 'Áo Khoác Bomber Minimalist Slate', 'Áo', 690000.00, 18, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', 'Áo khoác bomber chất liệu dù chống thấm nhẹ, phom dáng hiện đại tối giản.'),
(2, 'Áo Thun Cotton Oversize Essential', 'Áo', 290000.00, 35, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', 'Áo thun 100% cotton 250gsm co giãn thoáng mát, giữ form chuẩn sau nhiều lần giặt.'),
(3, 'Áo Sơ Mi Oxford Slim Fit', 'Áo', 450000.00, 3, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', 'Áo sơ mi vải Oxford mềm mịn, phù hợp môi trường công sở và dạo phố.'),
(4, 'Quần Tây Ống Đứng Tailored Fit', 'Quần', 580000.00, 14, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80', 'Quần tây nam nữ phong cách smart-casual, ít nhăn và tôn dáng.'),
(5, 'Quần Jeans Selvedge Indigo', 'Quần', 750000.00, 1, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80', 'Quần jeans denim dệt biên cao cấp, màu indigo trầm cổ điển.'),
(6, 'Tai Nghe Chụp Tai Aura Studio ANC', 'Phụ kiện', 1890000.00, 0, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 'Tai nghe không dây chống ồn chủ động ANC, thời lượng pin 40 giờ.'),
(7, 'Đồng Hồ Thông Minh Aura Watch S2', 'Phụ kiện', 2450000.00, 9, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', 'Đồng hồ thông minh màn hình AMOLED sắc nét, theo dõi nhịp tim và luyện tập.'),
(8, 'Balo Laptop Chống Sốc TechPack 15"', 'Phụ kiện', 890000.00, 12, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', 'Balo chống nước đa ngăn, ngăn chống sốc riêng cho laptop 15.6 inch.');

-- 4 Sample Orders across all 4 statuses
INSERT INTO orders (id, order_code, customer_name, customer_phone, customer_address, status, subtotal, voucher_code, discount_amount, final_total, created_at, updated_at) VALUES
(1, 'ORD-1001', 'Nguyễn Minh Anh', '0901234567', '279 Nguyễn Tri Phương, P.5, Q.10, TP.HCM', 'COMPLETED', 2740000.00, 'FREESHIP', 30000.00, 2710000.00, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 'ORD-1002', 'Trần Gia Huy', '0912345678', '59C Nguyễn Đình Chiểu, Q.3, TP.HCM', 'SHIPPING', 1270000.00, 'UEH10', 50000.00, 1220000.00, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 'ORD-1003', 'Phạm Quốc Bảo', '0938112233', '208 Nguyễn Hữu Cảnh, Q. Bình Thạnh, TP.HCM', 'PENDING', 1790000.00, 'FREESHIP', 30000.00, 1760000.00, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(4, 'ORD-1004', 'Lê Thảo Vy', '0987654321', '1A Hoàng Diệu, Q. Phú Nhuận, TP.HCM', 'CANCELLED', 290000.00, NULL, 0.00, 290000.00, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO order_items (order_id, product_id, product_name, product_category, product_image_url, unit_price, quantity, line_total) VALUES
(1, 7, 'Đồng Hồ Thông Minh Aura Watch S2', 'Phụ kiện', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', 2450000.00, 1, 2450000.00),
(1, 2, 'Áo Thun Cotton Oversize Essential', 'Áo', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', 290000.00, 1, 290000.00),
(2, 1, 'Áo Khoác Bomber Minimalist Slate', 'Áo', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', 690000.00, 1, 690000.00),
(2, 4, 'Quần Tây Ống Đứng Tailored Fit', 'Quần', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80', 580000.00, 1, 580000.00),
(3, 3, 'Áo Sơ Mi Oxford Slim Fit', 'Áo', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', 450000.00, 2, 900000.00),
(3, 8, 'Balo Laptop Chống Sốc TechPack 15"', 'Phụ kiện', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', 890000.00, 1, 890000.00),
(4, 2, 'Áo Thun Cotton Oversize Essential', 'Áo', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', 290000.00, 1, 290000.00);
