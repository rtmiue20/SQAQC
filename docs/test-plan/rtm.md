# REQUIREMENTS TRACEABILITY MATRIX (RTM)
## MA TRẬN TRUY VẾT HAI CHIỀU YÊU CẦU ↔ HẠNG MỤC KIỂM THỬ

**Dự án:** Lotus Store – Hệ thống Thương mại điện tử Bán hàng trực tuyến  
**Học phần:** Đảm bảo và kiểm soát chất lượng phần mềm (SQA/QC) – UEH Nhóm 9  
**Mã tài liệu:** `RTM-LOTUS-v1.0`  
**Ngày phát hành:** 16/11/2026 (Đồng bộ cùng Test Plan v1.0)  

---

## 1. Mục đích của Ma trận truy vết
Ma trận truy vết yêu cầu (Requirements Traceability Matrix - RTM) bảo đảm mối liên kết hai chiều chặt chẽ giữa 14 yêu cầu phần mềm trong SRS v1.0, các hạng mục kiểm thử trong Test Plan v1.0, và các ca kiểm thử chi tiết. Ma trận này đảm bảo **tỷ lệ bao phủ kiểm thử đạt 100% (Zero Coverage Gaps)**.

---

## 2. Bảng Ma trận truy vết hai chiều (Bidirectional RTM)

| Mã REQ | Mô tả yêu cầu (SRS v1.0) | Phân hệ | Hạng mục Test Plan | Dải mã Test Case chi tiết | Thành phần mã nguồn kiểm chứng | Trạng thái v0.1 | Trạng thái v1.0 |
|:---|:---|:---|:---|:---|:---|:---:|:---:|
| **REQ-01** | Hiển thị & lọc danh mục sản phẩm (Áo, Quần, Phụ kiện), tìm kiếm theo tên | Khách hàng | `TP-01` | `TC-001` .. `TC-008` | `ProductCatalog.tsx`, `ProductController.java` (`GET /api/products`) | Có (chưa gắn mã) | **Đã bao phủ 100%** |
| **REQ-02** | Xem chi tiết sản phẩm & trạng thái tồn kho biên (`stock = 0`, `stock = 1`) | Khách hàng | `TP-02` | `TC-009` .. `TC-014` | `ProductCard.tsx`, `CartDrawer.tsx`, `Product.java` | Có (chưa gắn mã) | **Đã bao phủ 100%** |
| **REQ-03** | Quản lý giỏ hàng: thêm/bớt/xóa, tính tạm tính, lưu LocalStorage | Khách hàng | `TP-03` | `TC-015` .. `TC-022` | `useCart.ts`, `CartDrawer.tsx` (`lotus_store_cart_v1`) | Có (chưa gắn mã) | **Đã bao phủ 100%** |
| **REQ-04** | Đặt hàng trực tuyến COD, kiểm tra SĐT (9-12 số), tạo đơn `PENDING` | Khách hàng | `TP-04` | `TC-023` .. `TC-030` | `CreateOrderRequest.java`, `OrderController.java`, `OrderService.java` | Có (chưa gắn mã) | **Đã bao phủ 100%** |
| **REQ-05** | Áp dụng mã voucher: `UEH10` (giảm 10% max 50k), `FREESHIP` (30k) | Khách hàng | `TP-05` | `TC-031` .. `TC-038` | `VoucherService.java` (`calculateDiscount`), `VoucherController.java` | **THIẾU** | **Đã bổ sung 100%** |
| **REQ-06** | Khách hàng tra cứu lịch sử đơn hàng của chính mình theo SĐT | Khách hàng | `TP-06` | `TC-039` .. `TC-043` | `OrderLookup.tsx`, `OrderController.java` (`GET /api/orders/lookup`) | Có (chưa gắn mã) | **Đã bao phủ 100%** |
| **REQ-07** | Khách tự hủy đơn `PENDING` & hệ thống tự động hoàn trả tồn kho | Khách hàng | `TP-07` | `TC-044` .. `TC-048` | `OrderService.java` (`cancelOrderByCustomer`), `OrderLookup.tsx` | **THIẾU** | **Đã bổ sung 100%** |
| **REQ-08** | Admin thêm/sửa sản phẩm, validate nghiêm ngặt: `price > 0`, `stock >= 0` | Quản trị | `TP-08` | `TC-049` .. `TC-056` | `ProductFormModal.tsx`, `ProductService.java` (`createProduct`) | **THIẾU** | **Đã bổ sung 100%** |
| **REQ-09** | Quản lý vòng đời đơn: `PENDING` -> `SHIPPING` -> `COMPLETED`, Admin hủy hoàn kho | Quản trị | `TP-09` | `TC-057` .. `TC-064` | `OrderManagement.tsx`, `OrderService.java` (`updateStatus`) | Có (chưa gắn mã) | **Đã bao phủ 100%** |
| **REQ-10** | Dashboard doanh thu thực (đơn `COMPLETED`) & cảnh báo tồn kho thấp (`< 5`) | Quản trị | `TP-10` | `TC-065` .. `TC-070` | `DashboardOverview.tsx`, `DashboardService.java` | Có (chưa gắn mã) | **Đã bao phủ 100%** |
| **REQ-11** | Tiện ích khôi phục dữ liệu mẫu kiểm thử qua API `POST /api/seed/reset` | Tiện ích | `TP-11` | `TC-071` .. `TC-074` | `SeedController.java`, `DataSeeder.java` | Có (chưa gắn mã) | **Đã bao phủ 100%** |
| **REQ-12** | NFR-01: Hiệu năng phản hồi (API $\le 500$ms, tải trang danh mục $\le 1.5$s) | Phi chức năng | `TP-12` | `TC-NFR-01` .. `TC-NFR-04` | Browser DevTools Network, Spring Boot Metrics | **THIẾU** | **Đã bổ sung 100%** |
| **REQ-13** | NFR-02: Bảo mật tra cứu SĐT, chặn rò rỉ đơn khi SĐT rỗng/ký tự đặc biệt | Phi chức năng | `TP-13` | `TC-NFR-05` .. `TC-NFR-08` | `OrderController.java`, `OrderService.java` (`lookupByPhone`) | **THIẾU** | **Đã bổ sung 100%** |
| **REQ-14** | NFR-03: Toàn vẹn giao dịch ACID & nhất quán tồn kho khi tạo/hủy đơn | Phi chức năng | `TP-14` | `TC-NFR-09` .. `TC-NFR-12` | `@Transactional` trong `OrderService.java`, DB Isolation | **THIẾU** | **Đã bổ sung 100%** |

---

## 3. Thống kê độ bao phủ kiểm thử (Coverage Analysis)
- **Tỷ lệ bao phủ yêu cầu chức năng (REQ-01 -> REQ-11):** 11/11 yêu cầu = **100%**
- **Tỷ lệ bao phủ yêu cầu phi chức năng (REQ-12 -> REQ-14):** 3/3 yêu cầu = **100%**
- **Tổng số hạng mục kiểm thử cấp cao:** 14 hạng mục (`TP-01` đến `TP-14`).
- **Tổng số kịch bản kiểm thử chi tiết:** 86 Test Cases.
- **Vùng mù kiểm thử trước TPR:** 6/14 yêu cầu (43% bị bỏ sót).
- **Vùng mù kiểm thử sau TPR:** **0% (Loại bỏ hoàn toàn rủi ro sót yêu cầu).**
