# SOFTWARE REQUIREMENTS SPECIFICATION (SRS v1.0)
## DỰ ÁN: LOTUS STORE – HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ BÁN HÀNG TRỰC TUYẾN

**Đơn vị:** Trường Đại học Kinh tế TP. Hồ Chí Minh (UEH) – Khoa Công nghệ Thông tin Kinh doanh  
**Học phần:** Đảm bảo và kiểm soát chất lượng phần mềm (SQA/QC)  
**Nhóm thực hiện:** Nhóm 9  
**Kho lưu trữ:** [https://github.com/rtmiue20/SQAQC.git](https://github.com/rtmiue20/SQAQC.git)  
**Phiên bản:** 1.0 (Trạng thái: Approved & Baselined)

---

## 1. Giới thiệu tổng quan
Tài liệu này đặc tả chi tiết 14 yêu cầu phần mềm cốt lõi (11 yêu cầu chức năng REQ-01 đến REQ-11 và 03 yêu cầu phi chức năng REQ-12 đến REQ-14) của hệ thống Lotus Store. Tài liệu làm căn cứ gốc cho hoạt động rà soát Kế hoạch kiểm thử (Test Plan Review - TPR), thiết kế ca kiểm thử (Test Case Design) và nghiệm thu chất lượng (Quality Acceptance).

---

## 2. Danh mục 14 yêu cầu phần mềm (SRS REQ-01 đến REQ-14)

### 2.1. Phân hệ Khách hàng (Customer Module: REQ-01 -> REQ-07)

#### REQ-01: Hiển thị và lọc danh mục sản phẩm
- **Mô tả:** Khách hàng truy cập trang chủ hệ thống có thể xem danh sách toàn bộ các sản phẩm đang được mở bán (`active = true`).
- **Quy tắc nghiệp vụ:**
  - Hỗ trợ bộ lọc nhanh theo 3 danh mục chính: `Áo`, `Quần`, `Phụ kiện`.
  - Hỗ trợ ô tìm kiếm thời gian thực theo tên sản phẩm (không phân biệt chữ hoa, chữ thường).
  - Hiển thị đầy đủ: Ảnh đại diện, Tên sản phẩm, Danh mục, Giá niêm yết (định dạng VNĐ) và Trạng thái tồn kho.
- **Thành phần kỹ thuật:** `frontend/src/components/customer/ProductCatalog.tsx`, API `GET /api/products`.

#### REQ-02: Xem chi tiết sản phẩm và phản ánh trạng thái tồn kho biên
- **Mô tả:** Khách hàng bấm vào thẻ sản phẩm để xem thông tin chi tiết.
- **Quy tắc nghiệp vụ:**
  - Nếu `stock = 0` (`OUT_OF_STOCK`): Nút "Thêm vào giỏ" bị vô hiệu hóa (disabled), hiển thị huy hiệu "Hết hàng".
  - Nếu `stock = 1` (Biên tối thiểu): Cho phép thêm vào giỏ 1 sản phẩm. Khi đã có trong giỏ, nút tăng số lượng trong giỏ hàng bị vô hiệu hóa hoặc cảnh báo nếu vượt quá tồn kho.
  - Nếu `stock > 1`: Cho phép chọn số lượng thêm vào giỏ nhưng không được vượt quá số lượng tồn kho khả dụng.
- **Thành phần kỹ thuật:** `frontend/src/components/customer/ProductCard.tsx`, `CartDrawer.tsx`, entity `Product.java`.

#### REQ-03: Quản lý giỏ hàng trực tuyến
- **Mô tả:** Khách hàng quản lý các sản phẩm đã chọn mua trong phiên làm việc.
- **Quy tắc nghiệp vụ:**
  - Thêm mới sản phẩm vào giỏ, cập nhật số lượng (+ / -), xóa một sản phẩm, hoặc làm rỗng giỏ hàng.
  - Tự động tính toán tổng tiền tạm tính (`subtotal = sum(price * quantity)`).
  - Bền vững dữ liệu: Trạng thái giỏ hàng được đồng bộ liên tục vào LocalStorage trình duyệt với khóa `lotus_store_cart_v1`, không mất khi F5 tải lại trang.
- **Thành phần kỹ thuật:** `frontend/src/hooks/useCart.ts`, `frontend/src/components/customer/CartDrawer.tsx`.

#### REQ-04: Đặt hàng trực tuyến thanh toán khi nhận hàng (COD)
- **Mô tả:** Khách hàng tiến hành thanh toán giỏ hàng bằng hình thức Ship COD (Cash on Delivery).
- **Quy tắc nghiệp vụ:**
  - Thu thập thông tin giao hàng: Họ tên khách hàng (bắt buộc, không để trống), Địa chỉ nhận hàng (bắt buộc), Số điện thoại người nhận.
  - Ràng buộc số điện thoại: Bắt buộc là chuỗi ký số có độ dài từ 9 đến 12 chữ số.
  - Trạng thái khởi tạo: Đơn hàng mới tạo luôn có mã định danh duy nhất (VD: `ORD-XXXX`) và trạng thái mặc định là `PENDING` (Chờ xác nhận).
  - Tồn kho của các sản phẩm tương ứng trong đơn phải bị trừ ngay tại thời điểm tạo đơn thành công.
- **Thành phần kỹ thuật:** API `POST /api/orders`, `CreateOrderRequest.java`, `OrderService.java`.

#### REQ-05: Áp dụng mã giảm giá (Voucher)
- **Mô tả:** Khách hàng nhập mã khuyến mãi tại giỏ hàng trước khi xác nhận đặt hàng.
- **Quy tắc nghiệp vụ:**
  - Mã `UEH10`: Giảm 10% giá trị tạm tính của đơn hàng; điều kiện áp dụng: tạm tính $\ge 200.000$đ; mức giảm tối đa (giới hạn trần) là 50.000đ (`maxDiscount = 50000`).
  - Mã `FREESHIP`: Giảm trực tiếp 30.000đ phí giao hàng; điều kiện áp dụng: tạm tính $\ge 100.000$đ.
  - Từ chối áp dụng và hiển thị thông báo lỗi rõ ràng nếu: Mã không tồn tại, mã đã hết hạn sử dụng, hoặc giá trị đơn hàng chưa đạt giá trị tối thiểu (`minOrderAmount`).
- **Thành phần kỹ thuật:** API `POST /api/vouchers/validate`, `VoucherService.java`, `CartDrawer.tsx`.

#### REQ-06: Khách hàng tra cứu lịch sử đơn hàng theo số điện thoại
- **Mô tả:** Khách hàng tự theo dõi tiến độ và trạng thái các đơn hàng đã đặt của mình.
- **Quy tắc nghiệp vụ:**
  - Khách hàng nhập số điện thoại đặt hàng vào màn hình tra cứu.
  - Hệ thống trả về danh sách chính xác các đơn hàng thuộc về số điện thoại đó, sắp xếp theo thời gian tạo mới nhất.
  - Hiển thị đầy đủ: Mã đơn, ngày đặt, danh sách sản phẩm, số tiền thanh toán, trạng thái hiện tại.
- **Thành phần kỹ thuật:** API `GET /api/orders/lookup?phone={phone}`, `OrderLookup.tsx`, `OrderController.java`.

#### REQ-07: Khách hàng tự hủy đơn hàng Chờ xác nhận và tự động hoàn trả tồn kho
- **Mô tả:** Cho phép khách hàng tự hủy đơn hàng trong thời gian chờ cửa hàng xử lý.
- **Quy tắc nghiệp vụ:**
  - Chỉ cho phép hủy khi đơn hàng đang ở trạng thái `PENDING`. Nếu đơn đã chuyển sang `SHIPPING` hoặc `COMPLETED`, hệ thống từ chối cho phép khách hủy.
  - Khi đơn hàng hủy thành công, trạng thái chuyển thành `CANCELLED`.
  - **Quy tắc hoàn kho bắt buộc:** Hệ thống phải tự động cộng hoàn trả đầy đủ số lượng của toàn bộ các sản phẩm trong chi tiết đơn hàng (`order_items`) trở lại kho hàng (`products.stock`).
- **Thành phần kỹ thuật:** API `POST /api/orders/{id}/customer-cancel`, `OrderService.java`, `OrderLookup.tsx`.

---

### 2.2. Phân hệ Quản trị và Tiện ích (Admin & Utility Module: REQ-08 -> REQ-11)

#### REQ-08: Admin thêm mới và cập nhật sản phẩm
- **Mô tả:** Quản trị viên quản lý danh mục sản phẩm của cửa hàng.
- **Quy tắc nghiệp vụ:**
  - Các trường bắt buộc: Tên sản phẩm, Danh mục (`Áo`, `Quần`, `Phụ kiện`), Giá bán, Số lượng tồn kho.
  - Kiểm tra tính hợp lệ dữ liệu (Validation Rules):
    - Tên sản phẩm: Không được rỗng hoặc chỉ chứa khoảng trắng.
    - Giá bán (`price`): Phải là số dương lớn hơn 0 (`price > 0`). Nghiêm cấm lưu sản phẩm có giá $\le 0$ hoặc số âm.
    - Tồn kho (`stock`): Phải là số nguyên không âm (`stock >= 0`).
- **Thành phần kỹ thuật:** API `POST /api/products`, `PUT /api/products/{id}`, `ProductFormModal.tsx`, `ProductService.java`.

#### REQ-09: Quản lý vòng đời trạng thái đơn hàng phía Admin
- **Mô tả:** Ban quản trị kiểm soát quy trình xử lý đơn hàng từ lúc tiếp nhận đến khi hoàn tất.
- **Quy tắc nghiệp vụ:**
  - Chuyển trạng thái hợp lệ: `PENDING` $\rightarrow$ `SHIPPING` $\rightarrow$ `COMPLETED`.
  - Admin có quyền hủy đơn (`CANCELLED`) khi đơn đang ở trạng thái `PENDING` hoặc `SHIPPING`.
  - Khi Admin hủy đơn hàng, hệ thống phải thực hiện hoàn trả tồn kho sản phẩm về bảng `products`.
- **Thành phần kỹ thuật:** API `PATCH /api/orders/{id}/status`, `OrderManagement.tsx`, `OrderService.java`.

#### REQ-10: Bảng điều khiển Dashboard thống kê doanh thu và cảnh báo tồn kho
- **Mô tả:** Cung cấp số liệu tổng quan về hoạt động kinh doanh cho ban quản lý.
- **Quy tắc nghiệp vụ:**
  - Tổng doanh thu thực tế: Chỉ tính tổng tiền của các đơn hàng có trạng thái `COMPLETED` (không tính các đơn PENDING, SHIPPING hay CANCELLED).
  - Thống kê phân bổ: Đếm chính xác số lượng đơn hàng theo từng trạng thái (`PENDING`, `SHIPPING`, `COMPLETED`, `CANCELLED`).
  - Cảnh báo tồn kho thấp: Tự động liệt kê danh sách các mặt hàng có số lượng tồn kho còn dưới 5 sản phẩm (`stock < 5`) để kịp thời nhập thêm hàng.
- **Thành phần kỹ thuật:** API `GET /api/dashboard/summary`, `DashboardOverview.tsx`, `DashboardService.java`.

#### REQ-11: Tiện ích khôi phục dữ liệu mẫu kiểm thử (Data Seeder Reset)
- **Mô tả:** Tiện ích phục vụ đội ngũ phát triển và kiểm thử đưa cơ sở dữ liệu về trạng thái định sẵn.
- **Quy tắc nghiệp vụ:**
  - Gọi API `POST /api/seed/reset` sẽ xóa sạch dữ liệu hiện tại trong 4 bảng và tái tạo lại chính xác:
    - 08 sản phẩm mẫu biên: SP tồn 0, SP tồn 1, SP tồn 3, SP tồn 20.
    - 02 voucher chuẩn: `UEH10` và `FREESHIP`.
    - 04 đơn hàng mẫu: `ORD-1001` (PENDING), `ORD-1002` (SHIPPING), `ORD-1003` (COMPLETED), `ORD-1004` (CANCELLED).
- **Thành phần kỹ thuật:** API `POST /api/seed/reset`, `SeedController.java`, `DataSeeder.java`.

---

### 2.3. Yêu cầu phi chức năng (Non-Functional Requirements: REQ-12 -> REQ-14)

#### REQ-12 (NFR-01): Hiệu năng phản hồi hệ thống
- **Đặc tả định lượng:**
  - Thời gian phản hồi trung bình (Response Time) của các API giao dịch trọng yếu (`POST /api/orders`, `POST /api/vouchers/validate`, `GET /api/orders/lookup`) phải $\le 500$ ms trong điều kiện thử nghiệm tiêu chuẩn.
  - Thời gian tải trang hiển thị danh mục sản phẩm phía khách hàng $\le 1,5$ giây.

#### REQ-13 (NFR-02): Bảo mật dữ liệu và quyền riêng tư tra cứu
- **Đặc tả an toàn:**
  - Ngăn chặn tuyệt đối tình trạng rò rỉ dữ liệu đơn hàng của khách hàng khác qua API `GET /api/orders/lookup`.
  - Nếu tham số `phone` bị bỏ trống, chỉ chứa khoảng trắng, hoặc chứa các ký tự đặc biệt (VD: `@#$%`, `@@@`), hệ thống bắt buộc phải từ chối xử lý hoặc trả về danh sách rỗng, tuyệt đối không được trả về toàn bộ dữ liệu đơn hàng trong hệ thống (`findAll`).

#### REQ-14 (NFR-03): Toàn vẹn giao dịch ACID và nhất quán tồn kho
- **Đặc tả tính toàn vẹn:**
  - Mọi thao tác tạo đơn hàng và hủy đơn hàng cập nhật đồng thời nhiều bảng (`orders`, `order_items`, `products`) phải được bao bọc trong một Transaction duy nhất (`@Transactional`).
  - Tuân thủ nghiêm ngặt tính Nguyên tử (Atomicity) và Nhất quán (Consistency): nếu một bước gặp sự cố, toàn bộ giao dịch phải được Rollback nguyên vẹn, không để xảy ra tình trạng trừ tiền mà không tạo đơn hoặc hủy đơn mà sai lệch tồn kho.
