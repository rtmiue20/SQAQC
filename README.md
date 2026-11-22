# LOTUS STORE – Hệ thống Quản lý Bán hàng & Thương mại Trực tuyến (Release v1.0 Beta)

Ứng dụng web Full-Stack phục vụ bán hàng trực tuyến và thực hành kiểm thử phần mềm (**SQA & QC**), xây dựng với **Java Spring Boot**, **React TypeScript + Tailwind CSS**, và **MariaDB**.

---

## 1. Kiến trúc & Công nghệ

- **Backend (`backend/`)**: Java 21, Spring Boot 3.4.2 (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`), MariaDB JDBC Driver (`mariadb-java-client`), Maven Wrapper (`mvnw` / `mvnw.cmd`).
- **Frontend (`frontend/`)**: React 18, TypeScript, Vite, Tailwind CSS v3, Lucide Icons (`lucide-react`), lưu giỏ hàng bền vững qua `localStorage` (`aura_store_cart_v1`).
- **Database (`database/schema.sql`)**: MariaDB (`aura_store`) với 4 bảng `products`, `vouchers`, `orders`, `order_items`. Kèm nút **Reset Dữ liệu Mẫu** trên thanh điều hướng để khôi phục nhanh toàn bộ dữ liệu test.

---

## 2. Hướng dẫn Cài đặt & Chạy Hệ thống

### Bước 1: Chuẩn bị MariaDB
1. Đảm bảo dịch vụ **MariaDB** đang chạy tại `localhost:3306`.
2. Backend cấu hình tự động tạo database `aura_store` (`createDatabaseIfNotExist=true`) và tự seed dữ liệu mẫu khi khởi động nếu DB trống. Hoặc bạn có thể chạy thủ công file [`database/schema.sql`](database/schema.sql) trong MariaDB / HeidiSQL / DBeaver.
3. Mặc định trong [`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties):
   - `DB_URL=jdbc:mariadb://localhost:3306/aura_store?createDatabaseIfNotExist=true&useUnicode=true&characterEncoding=UTF-8`
   - `DB_USERNAME=root`
   - `DB_PASSWORD=` (trống)
   Nếu tài khoản MariaDB của bạn có mật khẩu, hãy đặt biến môi trường trước khi chạy (hoặc sửa trực tiếp trong `application.properties`):
   ```powershell
   $env:DB_USERNAME="root"
   $env:DB_PASSWORD="your_mariadb_password"
   ```

### Bước 2: Chạy Backend (Spring Boot - Port 8080)
Mở terminal tại thư mục `backend/`:

- **Chạy với MariaDB (mặc định):**
  ```powershell
  .\mvnw.cmd spring-boot:run
  ```
- **Chạy chế độ H2 in-memory tương thích MariaDB** (dùng nhanh nếu chưa muốn nhập cấu hình mật khẩu MariaDB):
  ```powershell
  .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
  ```
- **Chạy Integration Test tự động:**
  ```powershell
  .\mvnw.cmd test
  ```

### Bước 3: Chạy Frontend (React + TypeScript - Port 5173)
Mở terminal tại thư mục `frontend/`:
```powershell
npm install
npm run dev
```
Sau đó mở trình duyệt tại: `http://localhost:5173` (Vite tự động proxy toàn bộ API `/api/*` sang `http://localhost:8080`).

---

## 3. Dữ liệu Khởi tạo Mẫu (Seed Data)

### Sản phẩm mẫu (8 sản phẩm)
Gồm 3 danh mục (`Áo`, `Quần`, `Phụ kiện`) với các giá trị biên tồn kho để kiểm thử:
- `Quần Jeans Selvedge Indigo`: **Tồn kho = 1** (kiểm thử biên đặt vượt quá tồn kho).
- `Tai Nghe Chụp Tai Aura Studio ANC`: **Tồn kho = 0** (hiển thị badge **Hết hàng**, khóa nút thêm vào giỏ).
- `Áo Sơ Mi Oxford Slim Fit`: **Tồn kho = 3** (hiển thị cảnh báo sắp hết hàng `< 5` trên Dashboard Admin).

### Mã giảm giá (2 voucher)
| Mã | Mô tả nghiệp vụ chuẩn |
| --- | --- |
| `UEH10` | Giảm **10%** tổng đơn, **tối đa 50.000đ**, áp dụng cho đơn từ **200.000đ** trở lên |
| `FREESHIP` | Giảm trực tiếp **30.000đ** |

### Đơn hàng mẫu (4 đơn hàng ở 4 trạng thái)
| Mã đơn | Khách hàng | SĐT | Trạng thái | Tổng thanh toán |
| --- | --- | --- | --- | --- |
| `ORD-1001` | Nguyễn Minh Anh | `0901234567` | Hoàn thành | `2.710.000 ₫` |
| `ORD-1002` | Trần Gia Huy | `0912345678` | Đang giao hàng | `1.220.000 ₫` |
| `ORD-1003` | Phạm Quốc Bảo | `0938112233` | Chờ xác nhận | `1.760.000 ₫` |
| `ORD-1004` | Lê Thảo Vy | `0987654321` | Đã hủy | `290.000 ₫` |

---

## 4. Danh sách 4 Lỗi Nghiệp vụ Cố ý (Release v1.0 Beta — Dành cho Thực hành SQA/QC)

| Mã lỗi | Phân hệ | Mô tả lỗi cố ý | Cách tái hiện (Steps to Reproduce) |
| --- | --- | --- | --- |
| **SQA-BUG-01** | Admin — Thêm sản phẩm | Form Tạo sản phẩm mới cho phép lưu `Giá bán = 0` hoặc **số âm** mà không báo lỗi validation. | Chuyển sang **Quản trị & Bán hàng** → **Sản phẩm & Kho** → **+ Thêm sản phẩm mới** → nhập Giá bán `0` hoặc `-50000` → bấm **Lưu sản phẩm**. |
| **SQA-BUG-02** | Khách hàng — Voucher `UEH10` | Khi tổng tiền đơn hàng **> 500.000đ**, mã `UEH10` trừ thẳng 10% tổng đơn thay vì giới hạn mức giảm tối đa `50.000đ`. | Thêm sản phẩm vào giỏ sao cho Tạm tính > 500.000đ (VD: `1.000.000đ`) → nhập mã `UEH10` → hệ thống giảm `100.000đ` thay vì `50.000đ`. |
| **SQA-BUG-03** | Khách hàng — Hủy đơn hàng | Khi khách hàng hủy đơn đang ở trạng thái **Chờ xác nhận**, trạng thái chuyển thành **Đã hủy** nhưng tồn kho sản phẩm **không được cộng hoàn lại**. | Đặt 1 đơn hàng mới (hoặc tra cứu SĐT `0938112233` đơn `ORD-1003`), ghi nhận tồn kho trước/sau khi khách bấm **Hủy đơn hàng** → tồn kho không tăng lại. *(Lưu ý: Admin hủy đơn vẫn hoàn kho bình thường).* |
| **SQA-BUG-04** | Khách hàng — Tra cứu đơn hàng | Để trống ô SĐT hoặc nhập ký tự đặc biệt (VD: `@#$%`, dấu cách) rồi bấm **Tìm kiếm** sẽ hiển thị **toàn bộ đơn hàng của tất cả khách hàng khác** thay vì báo lỗi. | Vào tab **Tra cứu đơn hàng** → để trống SĐT hoặc nhập `@@@` → bấm **Tìm kiếm** → toàn bộ đơn hàng của mọi khách hàng bị lộ ra. |
