## Mô tả Pull Request
- **Phiên bản:** AURA STORE – Release v1.0 (Beta)
- **Mục tiêu:** Khởi tạo hệ thống Quản lý Bán hàng & Thương mại Trực tuyến phục vụ thực hành kiểm thử phần mềm (SQA & QC).

## Tóm tắt Thay đổi
- **Backend (`backend/`):** Java 21, Spring Boot 3.4.2, Spring Data JPA, Spring Validation, MariaDB JDBC Driver, Maven Wrapper (`mvnw`, `mvnw.cmd`), `DataSeeder` & `SeedController` (`POST /api/seed/reset`), `GlobalExceptionHandler`, `AuraStoreIntegrationTest`.
- **Frontend (`frontend/`):** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Role Switcher (`Khách hàng` / `Quản trị & Bán hàng`), Giỏ hàng `localStorage` (`aura_store_cart_v1`), nút **Reset Dữ liệu Mẫu**.
- **Database (`database/`):** Script [`database/schema.sql`](database/schema.sql) tạo schema `aura_store` trên MariaDB kèm seed data (**8 sản phẩm** có biên `stock = 1` và `stock = 0`, **2 voucher** `UEH10` & `FREESHIP`, **4 đơn hàng** ở đủ 4 trạng thái).
- **Tài liệu:** [`README.md`](README.md) hướng dẫn cài đặt MariaDB/H2, chạy Backend/Frontend và danh sách test data.

## 4 Lỗi Nghiệp vụ Cố ý (SQA/QC Practice - Release v1.0 Beta)
- [ ] `SQA-BUG-01`: Admin — Form Thêm sản phẩm cho phép lưu `Giá bán = 0` hoặc số âm.
- [ ] `SQA-BUG-02`: Khách hàng — Voucher `UEH10` không giới hạn mức giảm tối đa `50.000đ` khi đơn `> 500.000đ`.
- [ ] `SQA-BUG-03`: Khách hàng — Hủy đơn hàng chuyển trạng thái sang `Đã hủy` nhưng không hoàn lại tồn kho sản phẩm.
- [ ] `SQA-BUG-04`: Khách hàng — Tra cứu đơn hàng với SĐT rỗng hoặc ký tự đặc biệt trả về toàn bộ đơn hàng của khách hàng khác.

## Kết quả Kiểm thử
- [x] `backend`: `.\mvnw.cmd test` — 6/6 integration tests passed (`BUILD SUCCESS`).
- [x] `frontend`: `npm run build` (`tsc -b && vite build`) — build thành công, 0 lỗi TypeScript.

## Checklist trước khi Merge
- [x] Không commit `frontend/node_modules/`, `frontend/dist/`, `backend/target/`, `.idea/`, `*.tsbuildinfo`.
- [x] Không chứa mật khẩu MariaDB hoặc secret cá nhân trong `application.properties` (sử dụng biến môi trường `DB_USERNAME`, `DB_PASSWORD`).
- [x] Giữ lại `backend/mvnw`, `backend/mvnw.cmd`, `backend/.mvn/`, `frontend/package-lock.json` để nhóm clone về chạy được ngay.
