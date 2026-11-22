# BÁO CÁO ĐẢM BẢO CHẤT LƯỢNG KẾ HOẠCH KIỂM THỬ (PHẦN 1 & PHẦN 2)

**TRƯỜNG ĐẠI HỌC KINH TẾ TP. HỒ CHÍ MINH (UEH)**  
**KHOA CÔNG NGHỆ THÔNG TIN KINH DOANH**  
**Học phần:** Đảm bảo và kiểm soát chất lượng phần mềm (SQA/QC)  
**Đề tài:** Nhóm 9 – Dự án: Lotus Store (Hệ thống Thương mại điện tử Bán hàng trực tuyến)  
**Kho lưu trữ mã nguồn:** [https://github.com/rtmiue20/SQAQC.git](https://github.com/rtmiue20/SQAQC.git)  

---

## BẢNG THÔNG TIN THÀNH VIÊN VÀ PHÂN CÔNG THỰC HIỆN

| STT | Họ và tên | Vai trò trong nhóm / Quy trình TPR | Mức độ đóng góp |
|:---:|:---|:---|:---:|
| 1 | **Ngô Trọng Phúc** | Moderator (Điều phối viên) | 100% |
| 2 | **Nguyễn Phúc Vương** | Author (Tác giả Test Plan) | 100% |
| 3 | **Hà Ngọc Thiện** | Reader & Inspector 2 (Người đọc & Thẩm định viên 2) | 100% |
| 4 | **Triệu Nguyễn Huỳnh Khang** | Recorder (Thư ký ghi nhận) | 100% |
| 5 | **Nguyễn Văn Minh Triều** | Inspector 1 (Thẩm định viên 1) | 100% |

---

# PHẦN 1. GIỚI THIỆU DỰ ÁN

Lotus Store là hệ thống web thương mại điện tử chuyên cung cấp các sản phẩm thời trang và phụ kiện trực tuyến (áo sơ mi, quần jeans, tai nghe, balo). Dự án do nhóm tự phát triển với mã nguồn đầy đủ, có các chức năng hoạt động hoàn chỉnh và được quản lý công khai tại kho lưu trữ [https://github.com/rtmiue20/SQAQC.git](https://github.com/rtmiue20/SQAQC.git). Hệ thống phục vụ hai nhóm đối tượng: khách hàng mua sắm trực tuyến tinh gọn và ban quản trị cửa hàng quản lý danh mục, đơn hàng và doanh thu.

---

## 1.1. Kiến trúc công nghệ của hệ thống Lotus Store

Hệ thống Lotus Store được thiết kế theo kiến trúc phân tầng hiện đại, phân tách độc lập giữa phần mềm máy chủ (Backend) và giao diện người dùng (Frontend):

```
+-----------------------------------------------------------------------------------+
|                            FRONTEND (React 18 + TypeScript + Vite)                |
|  - Customer View: ProductCatalog, CartDrawer (useCart hook), OrderLookup         |
|  - Admin View: ProductManagement, OrderManagement, DashboardOverview              |
|  - Storage: LocalStorage (lotus_store_cart_v1) | Styling: Tailwind CSS v3         |
+-----------------------------------------------------------------------------------+
                                        | (RESTful JSON API / CORS Config)
                                        v
+-----------------------------------------------------------------------------------+
|                        BACKEND (Spring Boot 3.4.2 - Java 21)                      |
|  - Controllers: ProductController, OrderController, VoucherController,           |
|                 DashboardController, SeedController                               |
|  - Services: ProductService, OrderService, VoucherService, DashboardService      |
|  - Validation: Bean Validation (jakarta.validation)                               |
|  - Exception Handling: GlobalExceptionHandler -> ApiErrorResponse                 |
|  - Data Access: Spring Data JPA / Hibernate ORM                                   |
+-----------------------------------------------------------------------------------+
                                        |
                    +-------------------+-------------------+
                    | (Production/Dev)                      | (Automated Test Profile)
                    v                                       v
+---------------------------------------+   +---------------------------------------+
|        MariaDB 11 (database/schema.sql)|   |          H2 In-Memory Database        |
| - products, vouchers, orders,         |   | - application-h2.properties           |
|   order_items                         |   | - AuraStoreIntegrationTest.java       |
+---------------------------------------+   +---------------------------------------+
```

### 1. Phân hệ Backend (thư mục `backend/`)
- **Nền tảng:** Sử dụng Java 21 trên nền tảng Spring Boot 3.4.2.
- **Tầng Web/API:** Tích hợp Spring Web MVC xây dựng hệ thống RESTful API chuẩn hóa, kiểm soát chia sẻ tài nguyên nguồn gốc chéo tập trung tại `CorsConfig.java`.
- **Tầng Nghiệp vụ & Dữ liệu:** Spring Data JPA kết hợp Hibernate ORM tương tác với cơ sở dữ liệu quan hệ, sử dụng Bean Validation (`jakarta.validation.constraints`) để thẩm định dữ liệu đầu vào tại DTO (`ProductRequest`, `CreateOrderRequest`, `VoucherValidateRequest`).
- **Xử lý Ngoại lệ tập trung:** Toàn bộ ngoại lệ nghiệp vụ (`BusinessException`, `ResourceNotFoundException`, lỗi vi phạm ràng buộc DTO) được điều hướng xử lý tập trung qua `GlobalExceptionHandler.java`, trả về cấu trúc lỗi chuẩn hóa `ApiErrorResponse`.

### 2. Phân hệ Frontend (thư mục `frontend/`)
- **Nền tảng:** Ứng dụng đơn trang (Single Page Application - SPA) phát triển bằng React 18, ngôn ngữ TypeScript, Vite làm build tool tối ưu và Tailwind CSS v3 định dạng giao diện người dùng.
- **Quản lý Trạng thái:** Trạng thái giỏ hàng được quản lý độc lập thông qua custom hook `useCart.ts` và lưu trữ bền vững trong LocalStorage trình duyệt dưới khóa định danh `lotus_store_cart_v1`, đảm bảo không thất thoát dữ liệu giỏ hàng khi người dùng tải lại trang.
- **Phân tách Trải nghiệm:** Giao diện tách biệt rõ ràng giữa luồng khách hàng (`frontend/src/components/customer/`: danh mục sản phẩm, xem chi tiết, giỏ hàng popup, tra cứu đơn hàng) và bảng điều khiển quản trị (`frontend/src/components/admin/`: quản lý sản phẩm, vòng đời đơn hàng, bảng thống kê doanh thu).

### 3. Cơ sở dữ liệu và Môi trường thử nghiệm
- **Hệ quản trị CSDL chính:** MariaDB 11 với 4 bảng chuẩn hóa tại `database/schema.sql`, gồm `products` (sản phẩm), `vouchers` (mã giảm giá), `orders` (đơn hàng) và `order_items` (chi tiết mặt hàng).
- **Môi trường Test độc lập:** Dự án tích hợp cấu hình CSDL nhúng H2 in-memory thông qua Spring Profile `h2` (`application-h2.properties`, `application-test.properties`), phục vụ thực thi toàn bộ bộ kiểm thử tích hợp tự động (`AuraStoreIntegrationTest.java`) với tốc độ nhanh, độc lập và cô lập tuyệt đối khỏi môi trường dữ liệu phát triển.
- **Tiện ích Khôi phục Dữ liệu mẫu (Data Seeder):** Cung cấp API Seed Reset (`POST /api/seed/reset`) qua lớp `DataSeeder.java` và `SeedController.java` để đưa toàn bộ dữ liệu kiểm thử về trạng thái chuẩn xác định trước:
  - 08 sản phẩm mẫu đa dạng trạng thái tồn kho biên: Tồn kho bằng 0 (hết hàng), Tồn kho bằng 1 (biên tối thiểu), Tồn kho bằng 3 (cảnh báo sắp hết), và Tồn kho dồi dào (20).
  - 02 voucher đặc thù: `UEH10` (giảm 10%, tối đa 50.000đ, áp dụng đơn từ 200.000đ) và `FREESHIP` (giảm trực tiếp 30.000đ cho đơn từ 100.000đ).
  - 04 đơn hàng mẫu đại diện cho 4 trạng thái vòng đời (`ORD-1001` đến `ORD-1004`): `PENDING`, `SHIPPING`, `COMPLETED`, `CANCELLED`.

---

## 1.2. Danh mục đặc tả yêu cầu phần mềm (SRS - REQ-01 đến REQ-14)

Tài liệu SRS v1.0 của Lotus Store xác định 14 yêu cầu nghiệp vụ cốt lõi, được phân nhóm thành 3 khối chức năng:

```
+---------------------------------------------------------------------------------------+
|                     DANH MỤC 14 YÊU CẦU NGHIỆP VỤ (SRS v1.0)                          |
+---------------------------------------------------------------------------------------+
| [1] PHÂN HỆ KHÁCH HÀNG (REQ-01 -> REQ-07)                                             |
|  - REQ-01: Hiển thị & lọc danh mục (Áo, Quần, Phụ kiện), tìm kiếm theo tên           |
|  - REQ-02: Chi tiết sản phẩm & trạng thái tồn kho biên (stock = 0 khóa nút, stock = 1)|
|  - REQ-03: Quản lý giỏ hàng: thêm/bớt/xóa, tính tạm tính, lưu LocalStorage           |
|  - REQ-04: Đặt hàng trực tuyến COD, validate SĐT (9-12 số), tạo đơn PENDING           |
|  - REQ-05: Áp mã giảm giá: UEH10 (10% max 50k, đơn >= 200k), FREESHIP (30k)           |
|  - REQ-06: Khách hàng tra cứu lịch sử đơn hàng của chính mình theo SĐT                |
|  - REQ-07: Khách hàng tự hủy đơn PENDING & hệ thống tự động hoàn trả tồn kho          |
+---------------------------------------------------------------------------------------+
| [2] PHÂN HỆ QUẢN TRỊ & TIỆN ÍCH (REQ-08 -> REQ-11)                                    |
|  - REQ-08: Admin thêm/sửa sản phẩm, validate nghiêm ngặt: price > 0, stock >= 0       |
|  - REQ-09: Quản trị vòng đời đơn hàng: PENDING -> SHIPPING -> COMPLETED / CANCELLED   |
|  - REQ-10: Dashboard thống kê doanh thu thực, số đơn theo trạng thái, cảnh báo tồn < 5|
|  - REQ-11: Tiện ích khôi phục dữ liệu mẫu qua POST /api/seed/reset                    |
+---------------------------------------------------------------------------------------+
| [3] YÊU CẦU PHI CHỨC NĂNG (NFR) (REQ-12 -> REQ-14)                                   |
|  - REQ-12 (NFR-01): Hiệu năng: API giao dịch <= 500ms, tải trang danh mục <= 1.5s     |
|  - REQ-13 (NFR-02): Bảo mật & Riêng tư: Chặn rò rỉ đơn khi SĐT rỗng/ký tự đặc biệt   |
|  - REQ-14 (NFR-03): Toàn vẹn giao dịch ACID & nhất quán tồn kho khi tạo/hủy đơn       |
+---------------------------------------------------------------------------------------+
```

### Bảng tóm tắt chi tiết 14 yêu cầu SRS

| Mã REQ | Nhóm chức năng | Tên yêu cầu nghiệp vụ | Tóm tắt đặc tả quy tắc nghiệp vụ | Thành phần mã nguồn liên quan |
|:---|:---|:---|:---|:---|
| **REQ-01** | Khách hàng | Hiển thị và lọc danh mục | Khách hàng có thể duyệt toàn bộ sản phẩm đang hoạt động, lọc theo danh mục (`Áo`, `Quần`, `Phụ kiện`) và tìm kiếm từ khóa theo tên sản phẩm theo thời gian thực. | `ProductCatalog.tsx`, `ProductController.java` (`GET /api/products`) |
| **REQ-02** | Khách hàng | Xem chi tiết & Tồn kho biên | Xem thông tin chi tiết (ảnh, giá, mô tả, tồn kho). Nếu tồn kho = 0 (`OUT_OF_STOCK`): vô hiệu hóa nút mua, gắn nhãn Hết hàng; nếu tồn kho = 1: không cho tăng số lượng trong giỏ quá 1. | `ProductCard.tsx`, `CartDrawer.tsx`, `Product.java` |
| **REQ-03** | Khách hàng | Quản lý giỏ hàng | Khách hàng thêm sản phẩm vào giỏ, điều chỉnh số lượng, xóa từng món hoặc xóa tất cả. Giỏ hàng tính tạm tính tự động và duy trì bền vững trong LocalStorage. | `useCart.ts`, `CartDrawer.tsx` |
| **REQ-04** | Khách hàng | Đặt hàng COD | Thu thập thông tin giao hàng: Họ tên người nhận, Địa chỉ và Số điện thoại (9–12 chữ số). Tạo đơn hàng trạng thái mặc định `PENDING` và trừ tồn kho ngay khi đặt. | `CartDrawer.tsx`, `OrderController.java` (`POST /api/orders`) |
| **REQ-05** | Khách hàng | Áp dụng mã giảm giá | Hỗ trợ 2 voucher hợp lệ: `UEH10` (giảm 10%, trần tối đa 50.000đ, áp dụng cho đơn từ 200.000đ trở lên); `FREESHIP` (giảm 30.000đ cho đơn từ 100.000đ). Từ chối mã không hợp lệ hoặc không đủ điều kiện. | `VoucherService.java`, `VoucherController.java`, `CartDrawer.tsx` |
| **REQ-06** | Khách hàng | Tra cứu lịch sử đơn hàng | Khách hàng nhập số điện thoại đặt hàng để xem danh sách và trạng thái các đơn hàng của chính mình. | `OrderLookup.tsx`, `OrderController.java` (`GET /api/orders/lookup`) |
| **REQ-07** | Khách hàng | Khách tự hủy đơn hàng | Khách hàng có thể tự hủy đơn hàng nếu đơn vẫn ở trạng thái `PENDING`. Khi hủy thành công, hệ thống phải tự động hoàn trả số lượng hàng về tồn kho sản phẩm. | `OrderService.java` (`cancelOrderByCustomer`), `OrderLookup.tsx` |
| **REQ-08** | Quản trị | Quản lý sản phẩm | Admin thêm mới hoặc chỉnh sửa thông tin sản phẩm. Bắt buộc kiểm tra tính hợp lệ dữ liệu: tên không rỗng, giá bán `price > 0`, số lượng tồn kho `stock >= 0`. | `ProductFormModal.tsx`, `ProductService.java` (`createProduct`, `updateProduct`) |
| **REQ-09** | Quản trị | Quản lý vòng đời đơn hàng | Admin duyệt chuyển trạng thái đơn hàng theo luồng: `PENDING` -> `SHIPPING` -> `COMPLETED`. Admin có quyền hủy đơn (`CANCELLED`) ở trạng thái PENDING/SHIPPING kèm hoàn trả tồn kho. | `OrderManagement.tsx`, `OrderService.java` (`updateStatus`) |
| **REQ-10** | Quản trị | Bảng điều khiển Dashboard | Thống kê tổng doanh thu thực tế (chỉ tính đơn `COMPLETED`), số lượng đơn hàng theo từng trạng thái, và danh sách cảnh báo sản phẩm có tồn kho thấp (`stock < 5`). | `DashboardOverview.tsx`, `DashboardService.java` |
| **REQ-11** | Tiện ích | Khôi phục dữ liệu mẫu | Cung cấp tiện ích qua API `POST /api/seed/reset` để xóa sạch và nạp lại chính xác 8 sản phẩm biên, 2 voucher, 4 đơn hàng mẫu phục vụ việc lặp lại kiểm thử. | `SeedController.java`, `DataSeeder.java` |
| **REQ-12** | Phi chức năng | NFR-01: Hiệu năng phản hồi | Thời gian phản hồi trung bình của các API giao dịch chính (tạo đơn, áp voucher, tra cứu) <= 500ms; thời gian tải trang danh mục <= 1.5s dưới môi trường thử nghiệm. | Toàn hệ thống, `AuraStoreIntegrationTest.java`, Browser DevTools |
| **REQ-13** | Phi chức năng | NFR-02: Bảo mật tra cứu SĐT | Kiểm soát nghiêm ngặt tham số đầu vào trong API tra cứu; ngăn chặn tuyệt đối tình trạng rò rỉ đơn hàng của khách hàng khác khi để trống SĐT, khoảng trắng hoặc nhập ký tự đặc biệt. | `OrderController.java`, `OrderService.java` |
| **REQ-14** | Phi chức năng | NFR-03: Toàn vẹn giao dịch ACID | Đảm bảo tính nguyên tử (Atomicity) và nhất quán (Consistency) trong các giao dịch tạo đơn và hủy đơn có cập nhật nhiều bảng; chống Race Condition làm sai lệch tồn kho. | `@Transactional` trong `OrderService.java` |

---

## 1.3. Bối cảnh tài liệu Test Plan hiện có (v0.1) và lý do lựa chọn Đề tài 9

### 1. Bối cảnh tài liệu Test Plan v0.1
Tài liệu kế hoạch kiểm thử ban đầu của dự án (phiên bản v0.1) được soạn thảo sơ lược trong giai đoạn đầu phát triển phần mềm bởi một thành viên trong nhóm. Qua khảo sát hiện trạng, tài liệu này bộc lộ những khiếm khuyết rất nghiêm trọng:
- **Thiếu cấu trúc chuẩn:** Tài liệu không tuân thủ bất kỳ khung tiêu chuẩn quốc tế nào (như IEEE Std 829-2008 hay ISO/IEC/IEEE 29119-3), chỉ mang tính chất ghi chú công việc cá nhân.
- **Vùng mù kiểm thử lớn:** Bỏ sót hoàn toàn 6 trên 14 yêu cầu trong SRS (REQ-05 Voucher, REQ-07 Hủy đơn hoàn kho, REQ-08 Validate giá Admin, cùng toàn bộ 3 yêu cầu phi chức năng REQ-12, REQ-13, REQ-14).
- **Thiếu kiểm soát quản trị:** Không có tiêu chí vào/ra (Entry/Exit Criteria), không có tiêu chí đình chỉ/tiếp tục kiểm thử, không mô tả dữ liệu mẫu biên và môi trường thử nghiệm song song (MariaDB / H2 profile).
- **Phân công và tiến độ mơ hồ:** Lịch trình ghi sơ sài "cả nhóm cùng test vào tuần cuối", không có ước lượng giờ công và không phân định trách nhiệm cụ thể giữa các thành viên.

### 2. Lý do nhóm lựa chọn Đề tài 9: Đảm bảo chất lượng kế hoạch kiểm thử (Test Plan Review - TPR)
Nhóm nhận thức sâu sắc rằng: **Test Plan là tài liệu kim chỉ nam định hướng cho toàn bộ chiến dịch kiểm soát chất lượng của dự án.**
- Theo **mô hình khuếch đại khiếm khuyết (Defect Amplification Model)**, một lỗi hoặc lỗ hổng bỏ sót ở giai đoạn lập kế hoạch kiểm thử sẽ nhân bản theo cấp số nhân thành hàng chục ca kiểm thử thiếu sót. Hậu quả là tạo ra các "vùng mù kiểm thử" (test blind spots), khiến những lỗi nghiệp vụ chí mạng (tiền tệ, bảo mật, tồn kho) lọt thẳng ra môi trường vận hành thực tế.
- Do đó, hoạt động **Test Plan Review (TPR)** chính là rào chắn SQA đầu tiên, quan trọng nhất và tiết kiệm chi phí nhất để phòng ngừa rủi ro ngay từ gốc (Early Defect Detection).

```
   [Thiếu sót trong Test Plan v0.1]
                  │
                  ▼
   [Thiếu Test Case kiểm tra Voucher/Hủy đơn/Bảo mật]
                  │
                  ▼
   [Vùng mù kiểm thử: Không test kịch bản rủi ro]
                  │
                  ▼
   [LỖI NGHIỆP VỤ LỌT RA PRODUCTION -> THIỆT HẠI NẶNG NỀ]
```

---

## 1.4. Mục tiêu và phạm vi của báo cáo SQA

### 1. Mục tiêu cụ thể
Báo cáo tập trung vào phạm vi SQA (định hướng quy trình, xây dựng tiêu chí, rà soát có hệ thống, phòng ngừa rủi ro) với 05 mục tiêu cụ thể:
1. **Xây dựng khung tiêu chuẩn đánh giá:** Thiết lập bộ 06 tiêu chí định lượng (TC1 – TC6) và Bảng kiểm rà soát TPR Checklist gồm 15 tiêu chí dựa trên chuẩn IEEE Std 829-2008 và ISO/IEC/IEEE 29119-3.
2. **Tổ chức quy trình rà soát hình thức:** Vận dụng và thực thi nghiêm ngặt quy trình Software Inspection (Fagan Inspection) 6 bước chuẩn mực với sự tham gia độc lập của 5 thành viên nhóm.
3. **Đánh giá chất lượng toàn diện:** Phân tích thực trạng tài liệu Test Plan v0.1 trên 3 trục chất lượng cốt lõi: Tính đầy đủ (Completeness), Tính nhất quán (Consistency) và Khả năng truy vết (Traceability thông qua Ma trận truy vết RTM).
4. **Cải tiến và nâng cấp kế hoạch kiểm thử:** Khắc phục triệt để các khiếm khuyết phát hiện được (F01 – F14), tái lập cấu trúc và phát hành tài liệu Test Plan v1.0 hoàn chỉnh đạt chất lượng cao.
5. **Đánh giá hiệu quả phòng ngừa lỗi thực tế:** Đo lường các chỉ số chất lượng được cải thiện và chứng minh vai trò của Test Plan v1.0 trong việc định hướng phát hiện chính xác 4 lỗi nghiệp vụ tiềm ẩn trong mã nguồn Lotus Store (SQA-BUG-01 đến SQA-BUG-04).

### 2. Phạm vi của báo cáo
- **Nội dung trong phạm vi (In-Scope):** Toàn bộ quy trình rà soát, đánh giá, phát hiện khiếm khuyết trong tài liệu Test Plan v0.1 đối chiếu với SRS v1.0 và kiến trúc hệ thống Lotus Store; xây dựng RTM; cải tiến Test Plan lên v1.0; phân tích chuỗi nhân quả và minh chứng phòng ngừa lỗi.
- **Nội dung ngoài phạm vi (Out-of-Scope):** Báo cáo không thực thi kiểm thử chức năng chuyên sâu từng màn hình như một đề tài QC độc lập; không bao gồm việc kiểm thử các hệ thống bên ngoài không thuộc phạm vi Lotus Store (như cổng thanh toán điện tử thực tế VNPAY/MoMo hoặc hệ sinh thái giao hàng bên thứ ba).

---

# PHẦN 2. CƠ SỞ LÝ THUYẾT SQA

---

## 2.1. SQA, QC và chuỗi nhân quả Error – Fault/Defect – Failure

Trong kỹ nghệ phần mềm và quản lý chất lượng dự án, SQA (Software Quality Assurance) và QC (Software Quality Control) luôn song hành mật thiết nhưng giữ vai trò, tư duy và phương pháp luận hoàn toàn khác biệt:

### 1. So sánh bản chất giữa SQA và QC

```
+-----------------------------------------------------------------------------------+
|               SO SÁNH BẢN CHẤT GIỮA SQA VÀ QC TRONG KỸ NGHỆ PHẦN MỀM               |
+-----------------------------------+-----------------------------------------------+
| SQA (Software Quality Assurance)  | QC (Software Quality Control)                 |
+-----------------------------------+-----------------------------------------------+
| - Định hướng quy trình (Process)  | - Định hướng sản phẩm (Product-Oriented)      |
| - Chủ động (Proactive)            | - Phản ứng / Bị động (Reactive)               |
| - Phòng ngừa sai sót (Preventive) | - Phát hiện khiếm khuyết (Detective)          |
| - Đối tượng: Kế hoạch, quy trình, | - Đối tượng: Bản build phần mềm, mã nguồn     |
|   chuẩn mực, checklist, tài liệu  |   được thực thi, giao diện thực tế            |
| - Kỹ thuật: Audit, Review,        | - Kỹ thuật: Dynamic Testing (Unit,            |
|   Inspection, Process Improvement |   Integration, System, E2E, UAT)              |
| - Trọng tâm: "Làm đúng ngay từ    | - Trọng tâm: "Tìm ra bao nhiêu lỗi trước      |
|   đầu để không sinh ra lỗi"       |   khi phần mềm bàn giao cho khách hàng"       |
+-----------------------------------+-----------------------------------------------+
```

Hoạt động **Test Plan Review (TPR)** trong đồ án này hoàn toàn thuộc phạm trù **SQA**, bởi vì đối tượng rà soát là tài liệu quy trình và chiến lược kiểm thử, nhằm chuẩn hóa phương pháp và tiêu chí trước khi đội ngũ QC bắt tay vào viết và chạy từng test case cụ thể.

### 2. Chuỗi nhân quả Error – Fault/Defect – Failure
Mối quan hệ nhân quả trong sự suy giảm chất lượng phần mềm được mô tả qua chuỗi 3 mắt xích:

$$\text{Error (Sai sót con người)} \longrightarrow \text{Fault / Defect (Khiếm khuyết)} \longrightarrow \text{Failure (Hỏng hóc hệ thống)}$$

- **Error (Sai sót):** Xuất phát từ hành vi, nhận thức chưa đúng, thiếu thông tin hoặc áp lực tiến độ của con người (Developer, Tester, Business Analyst).
- **Fault / Defect (Khiếm khuyết):** Là biểu hiện cụ thể của Error nằm tiềm ẩn trong tài liệu yêu cầu, thiết kế kiến trúc, kế hoạch kiểm thử hoặc trong các dòng mã nguồn chương trình.
- **Failure (Hỏng hóc / Thất bại):** Là sự sai lệch không mong muốn giữa hành vi thực tế của hệ thống phần mềm và yêu cầu mong đợi khi chương trình được kích hoạt thực thi trong môi trường vận hành.

#### Áp dụng chuỗi nhân quả vào bối cảnh dự án Lotus Store:
1. **Error:** Tác giả soạn Test Plan v0.1 chủ quan cho rằng các tính năng Voucher (REQ-05) và Hủy đơn (REQ-07) là phụ, hoặc do hạn chế thời gian nên không đưa vào kế hoạch kiểm thử.
2. **Defect:** Test Plan v0.1 tồn tại khoảng trống kiểm thử lớn (Fault F01, F08), không có ca kiểm thử nào cho việc giới hạn trần giảm giá 50.000đ hay hoàn trả tồn kho khi khách tự hủy đơn.
3. **Failure:** Khi hệ thống đưa vào hoạt động thực tế, khách hàng đặt đơn 1.000.000đ áp mã `UEH10` bị trừ thẳng 100.000đ (thay vì tối đa 50.000đ), gây thất thoát doanh thu nghiêm trọng cho cửa hàng; hoặc khi khách bấm hủy đơn hàng, sản phẩm không được hoàn kho dẫn đến số lượng tồn kho ảo và mất mát hàng hóa.
$\rightarrow$ **Hoạt động SQA (TPR)** can thiệp vào giữa chuỗi nhân quả: phát hiện Defect trong tài liệu ngay từ khi phần mềm chưa chạy, từ đó triệt tiêu nguy cơ xảy ra Failure.

---

## 2.2. Vị trí của Software Review trong SDLC, Verification, Validation, Qualification

Trong vòng đời phát triển phần mềm (SDLC) theo mô hình chữ V (V-Model) cũng như quy trình phát triển linh hoạt Agile/Scrum, rà soát tĩnh (Static Review) giữ vị trí then chốt nhằm thực thi triết lý **Early Testing (Kiểm thử sớm)** và **Shift-Left Testing (Chuyển dịch kiểm thử về bên trái)**.

```
       Yêu cầu (SRS) <----------------- Verification -----------------> UAT (Validation)
             \                                                               /
      Thiết kế Kiến trúc <------------- Verification -------------> System Test
             \                                                         /
       Thiết kế Chi tiết <------------ Verification -------------> Integration Test
              \                                                   /
          Lập trình (Code) <---------- Verification -----------> Unit Test
```

### 1. Phân biệt 3 khái niệm nền tảng:
- **Xác minh (Verification):** Đánh giá xem sản phẩm hoặc tài liệu của một giai đoạn phát triển có đáp ứng đầy đủ các tiêu chuẩn, quy chuẩn và đặc tả kỹ thuật đã thiết lập ở giai đoạn trước đó hay không (*"Are we building the product right?"*). Hoạt động Test Plan Review thuộc nhóm Verification, vì hội đồng tiến hành đối chiếu trực tiếp Test Plan với SRS v1.0, cấu trúc kiến trúc mã nguồn và chuẩn quốc tế IEEE Std 829.
- **Xác nhận (Validation):** Đánh giá xem phần mềm sau khi hoàn thành có thực sự đáp ứng đúng nhu cầu, mục đích sử dụng và mong đợi thực tế của người dùng cuối trong môi trường hoạt động thực tế hay không (*"Are we building the right product?"*). Thường được thực hiện qua kiểm thử chấp nhận người dùng (User Acceptance Testing - UAT) trên bản build hoàn chỉnh.
- **Thẩm định điều kiện (Qualification):** Quá trình kiểm chứng có hệ thống nhằm xác nhận hệ thống phần mềm, cơ sở dữ liệu, môi trường hạ tầng và dữ liệu mẫu đạt đầy đủ các điều kiện kỹ thuật và pháp lý quy định để sẵn sàng bàn giao đưa vào vận hành (như việc thẩm định cấu hình Spring Boot 3.4.2, MariaDB 11, bộ dữ liệu khởi tạo chuẩn qua DataSeeder).

---

## 2.3. Các phương pháp Software Review

Theo tiêu chuẩn quốc tế IEEE Std 1028-2008 và bài giảng môn học SQA/QC, các kỹ thuật rà soát phần mềm được phân cấp theo mức độ hình thức và tính chặt chẽ từ thấp đến cao:

### 1. Informal Review (Desk Check / Peer Check)
Hình thức rà soát phi chính thức, linh hoạt, không bắt buộc tuân theo quy trình cố định hay tài liệu hóa biên bản. Có thể là cá nhân tác giả tự rà soát (Desk Check) hoặc nhờ một đồng nghiệp bên cạnh xem lướt qua để phát hiện nhanh các lỗi hiển nhiên. Chi phí thực hiện thấp nhưng hiệu quả phụ thuộc hoàn toàn vào kỹ năng cá nhân và không có tính cam kết.

### 2. Walkthrough (Duyệt tài liệu)
Buổi họp do chính tác giả tài liệu chủ trì (Author-led). Tác giả trình bày cấu trúc, kịch bản và logic của tài liệu/sản phẩm để chia sẻ kiến thức, làm sáng tỏ các khúc mắc nghiệp vụ và tiếp nhận các ý kiến đóng góp, phản hồi ban đầu từ các thành viên tham dự.

### 3. Technical Review (Rà soát kỹ thuật)
Cuộc họp chính thức có sự tham gia của các chuyên gia kỹ thuật và các bên liên quan nhằm thẩm định tính khả thi kỹ thuật, sự tuân thủ tiêu chuẩn kiến trúc và đánh giá các giải pháp thay thế. Kết thúc phiên họp thường có biên bản thẩm định và quyết định kỹ thuật cụ thể.

### 4. Software Inspection (Fagan Inspection)
Phương pháp rà soát chính thức, nghiêm ngặt và đạt hiệu quả phát hiện lỗi cao nhất trong kỹ nghệ phần mềm, do Michael Fagan sáng lập tại IBM. Quá trình Inspection bắt buộc tuân thủ quy trình chuẩn mực 6 bước (Planning, Overview, Preparation, Inspection Meeting, Rework, Follow-up), sử dụng bộ Bảng kiểm (Checklist) chuẩn hóa, phân định 5 vai trò độc lập và thu thập số liệu đo lường định lượng về mật độ khiếm khuyết.

### Bảng 1. So sánh các phương pháp Software Review và mức độ áp dụng trong dự án Lotus Store

| Phương pháp | Mức độ hình thức | Người chủ trì & Vai trò | Công cụ / Tiêu chí | Sản phẩm đầu ra | Áp dụng trong dự án Lotus Store |
|:---|:---|:---|:---|:---|:---|
| **Informal / Desk Check** | Thấp (Không chính thức) | Cá nhân tác giả hoặc đồng nghiệp cùng nhóm | Đọc trực tiếp, không bắt buộc dùng checklist | Ghi chú cá nhân, sửa lỗi đánh máy nhanh | Inspector tự nghiên cứu tài liệu trước phiên họp chính thức |
| **Walkthrough** | Trung bình (Bán chính thức) | Tác giả tài liệu chủ trì cuộc họp | Bản thảo tài liệu, kịch bản nghiệp vụ luồng đi | Biên bản góp ý, danh sách các câu hỏi làm rõ | Họp giới thiệu Test Plan v0.1 ngày 11/11 (60 phút) |
| **Technical Review** | Cao (Chính thức) | Trưởng nhóm kỹ thuật hoặc chuyên gia giải pháp | Tiêu chuẩn kỹ thuật, tài liệu kiến trúc đối chiếu | Biên bản thẩm định tính khả thi kỹ thuật | Đánh giá kiến trúc tích hợp Spring Boot, MariaDB và H2 |
| **Software Inspection** | Rất cao (Nghiêm ngặt) | Moderator, Author, Reader, Recorder, Inspector | Bảng kiểm Checklist chuẩn, số liệu đo lường | Biên bản Inspection, Danh sách vấn đề (Issue Log) | **Phương pháp cốt lõi thực hiện TPR (10/11 - 16/11)** |

---

## 2.4. Bản chất và các khía cạnh cốt lõi của Test Plan Review (TPR)

Test Plan Review (TPR) là hoạt động kiểm tra, thanh tra và thẩm định có hệ thống đối với tài liệu kế hoạch kiểm thử trước khi nhóm kiểm thử bắt đầu viết các kịch bản kiểm thử chi tiết. Dựa trên chuẩn mực **IEEE Std 829-2008** (Standard for Software and System Test Documentation) và **ISO/IEC/IEEE 29119-3**, chất lượng của một bản Kế hoạch kiểm thử được đánh giá toàn diện trên 03 trục cốt lõi:

```
                      +---------------------------------------+
                      |       3 TRỤC ĐÁNH GIÁ CHẤT LƯỢNG      |
                      |        TEST PLAN REVIEW (TPR)         |
                      +---------------------------------------+
                                          |
         +--------------------------------+-------------------------------+
         |                                |                               |
         v                                v                               v
+------------------+            +-------------------+           +-------------------+
|  TÍNH ĐẦY ĐỦ     |            |  TÍNH NHẤT QUÁN   |           | KHẢ NĂNG TRUY VẾT |
|  (Completeness)  |            |   (Consistency)   |           |   (Traceability)  |
+------------------+            +-------------------+           +-------------------+
| - Bao quát 100%  |            | - Khớp hoàn toàn  |           | - Ma trận RTM     |
|   yêu cầu SRS    |            |   với SRS, CSDL & |           |   hai chiều       |
| - Đủ 15 mục IEEE |            |   mã nguồn        |           | - REQ <-> TP <->  |
| - Entry/Exit,    |            | - Không mâu thuẫn |           |   Test Case       |
|   Môi trường,    |            |   nội tại tài liệu|           | - Không vùng mù   |
|   Lịch trình     |            | - Đồng bộ thuật   |           |   kiểm thử        |
+------------------+            +-------------------+           +-------------------+
```

### 1. Tính đầy đủ (Completeness)
Kế hoạch kiểm thử phải bao quát toàn diện phạm vi của hệ thống, không để lại bất kỳ khoảng trống nghiệp vụ nào:
- Bao phủ 100% các yêu cầu nghiệp vụ được quy định trong tài liệu yêu cầu (cả chức năng REQ-01 đến REQ-11 và phi chức năng REQ-12 đến REQ-14).
- Phải phân định ranh giới rõ ràng giữa hạng mục kiểm thử trong phạm vi (In-Scope) và ngoài phạm vi (Out-of-Scope).
- Chứa đựng đầy đủ các cấu phần quản trị chất lượng: Tiêu chí vào/ra (Entry/Exit Criteria), Tiêu chí đình chỉ/tiếp tục (Suspension/Resumption Criteria), cấu hình môi trường kiểm thử chi tiết, kế hoạch dữ liệu mẫu biên, phân công vai trò và ma trận quản trị rủi ro kiểm thử.

### 2. Tính nhất quán (Consistency)
Các nội dung trong tài liệu không được phát sinh mâu thuẫn nội tại hoặc sai lệch so với hiện trạng hệ thống:
- **Nhất quán nội bộ:** Lịch trình kiểm thử phải tương thích với nguồn lực nhân sự phân công; tiêu chí Pass/Fail phải đồng bộ với tiêu chuẩn nghiệm thu dự án.
- **Nhất quán với hệ thống:** Thuật ngữ trạng thái đơn hàng trong Test Plan phải khớp hoàn toàn với cấu trúc cơ sở dữ liệu (`database/schema.sql`) và mã nguồn Java (`OrderStatus.java`: `PENDING`, `SHIPPING`, `COMPLETED`, `CANCELLED`). Không được sử dụng thuật ngữ trái ngược như `DELIVERED` hay nhầm lẫn định danh của các dự án khác.

### 3. Khả năng truy vết (Traceability)
Mỗi yêu cầu nghiệp vụ từ khách hàng hoặc tài liệu SRS bắt buộc phải có ít nhất một hạng mục kiểm thử (Test Item) tương ứng trong Test Plan và ngược lại:
- Khả năng truy vết được hiện thực hóa và kiểm soát thông qua **Ma trận truy vết yêu cầu (Requirements Traceability Matrix - RTM)**.
- RTM hai chiều (Bidirectional Traceability) cho phép đội ngũ phát triển và kiểm thử dễ dàng xác minh:
  - *Truy vết thuận (Forward Traceability):* Từ yêu cầu $REQ_x \rightarrow$ Hạng mục kiểm thử $TP_y \rightarrow$ Ca kiểm thử cụ thể $TC_z$. Giúp khẳng định không có yêu cầu nào bị bỏ quên.
  - *Truy vết nghịch (Backward Traceability):* Từ một lỗi phát hiện hoặc một ca kiểm thử $TC_z \rightarrow$ Hạng mục kiểm thử $TP_y \rightarrow$ Yêu cầu gốc $REQ_x$. Giúp đánh giá phạm vi ảnh hưởng khi yêu cầu nghiệp vụ thay đổi và tránh viết các ca kiểm thử dư thừa không phục vụ mục tiêu hệ thống.

---

## TỔNG KẾT VÀ ĐIỀU HƯỚNG TÀI LIỆU MINH CHỨNG LIÊN QUAN

Tài liệu này là minh chứng chính thức cho **Phần 1 (Giới thiệu dự án)** và **Phần 2 (Cơ sở lý thuyết SQA)** trong Báo cáo Đảm bảo chất lượng kế hoạch kiểm thử của Nhóm 9 - Lotus Store. Các tài liệu minh chứng chi tiết đi kèm đã được cấu trúc và lưu trữ đầy đủ trong thư mục `docs/`:

1. **Đặc tả yêu cầu phần mềm:** [`docs/srs/srs-v1.0.md`](srs/srs-v1.0.md) (Chi tiết 14 yêu cầu REQ-01 đến REQ-14).
2. **Kiến trúc hệ thống:** [`docs/architecture/system-architecture.md`](architecture/system-architecture.md) (Chi tiết Backend, Frontend, MariaDB, H2, DataSeeder).
3. **Cơ sở lý thuyết SQA chuyên sâu:** [`docs/theory/sqa-theoretical-foundations.md`](theory/sqa-theoretical-foundations.md) (Phân tích chuẩn IEEE 829, 1028, ISO 29119-3).
4. **Kế hoạch kiểm thử v0.1 (Hiện trạng trước rà soát):** [`docs/test-plan/test-plan-v0.1.md`](test-plan/test-plan-v0.1.md).
5. **Kế hoạch kiểm thử v1.0 (Chuẩn hóa sau TPR):** [`docs/test-plan/test-plan-v1.0.md`](test-plan/test-plan-v1.0.md).
6. **Ma trận truy vết RTM:** [`docs/test-plan/rtm.md`](test-plan/rtm.md).
7. **Hồ sơ rà soát Software Inspection:**
   - Kế hoạch TPR: [`docs/sqa/tpr-plan.md`](sqa/tpr-plan.md)
   - Bảng kiểm Checklist: [`docs/sqa/checklists/`](sqa/checklists/)
   - Biên bản họp Walkthrough, Inspection, Phê duyệt: [`docs/sqa/minutes/`](sqa/minutes/)
   - Danh sách khiếm khuyết (Issue Log F01–F14): [`docs/sqa/issues/issue-log.md`](sqa/issues/issue-log.md)
8. **Toàn văn Báo cáo Đề tài 9:** [`docs/bao-cao-sqa-toan-van.md`](bao-cao-sqa-toan-van.md).
