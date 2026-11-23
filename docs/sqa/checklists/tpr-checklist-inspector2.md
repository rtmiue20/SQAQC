# BẢNG KIỂM RÀ SOÁT TEST PLAN (INSPECTOR 2)
## PHẠM VI: LUỒNG QUẢN TRỊ, MÔI TRƯỜNG/DỮ LIỆU & PHI CHỨC NĂNG (REQ-08 -> REQ-12)

**Thẩm định viên (Inspector 2):** Hà Ngọc Thiện  
**Đối tượng rà soát:** Test Plan v0.1 đối chiếu SRS v1.0, CSDL `database/schema.sql`, cấu hình H2 & Admin Frontend  
**Ngày thực hiện:** 12/11/2026 – 13/11/2026  

---

| # | Tiêu chí rà soát theo IEEE 829 & ISO 29119-3 | Kết quả v0.1 | Đánh giá chi tiết & Bằng chứng đối chiếu mã nguồn | Ghi chú mã khiếm khuyết |
|:---:|:---|:---:|:---|:---:|
| 1 | Có định danh, phiên bản và lịch sử thay đổi | **K** | Không có thông tin người phê duyệt và mã định danh chuẩn của tài liệu. | F11 |
| 2 | Mục tiêu kiểm thử rõ ràng, gắn với chất lượng | **Đ** | Xác định được mục tiêu kiểm tra chức năng hệ thống. | – |
| 3 | Nêu rõ phạm vi kiểm thử và ngoài phạm vi | **K** | Bỏ sót kiểm thử ràng buộc Admin nhập giá bán `price > 0` (`REQ-08`), kiểm thử khôi phục dữ liệu qua Seed API (`REQ-11`). | F01 |
| 4 | Hạng mục kiểm thử bao phủ 100% SRS | **K** | Bỏ sót hoàn toàn cả 3 yêu cầu phi chức năng: Hiệu năng (`REQ-12`), Bảo mật tra cứu SĐT (`REQ-13`), Toàn vẹn ACID (`REQ-14`). | F01 |
| 5 | Có ma trận truy vết hai chiều (RTM) | **K** | Không có ma trận liên kết giữa yêu cầu Admin/Dashboard với các kịch bản kiểm thử. | F08 |
| 6 | Chiến lược và mức kiểm thử phù hợp | **Đ** | Có xác định mức kiểm thử hệ thống và tích hợp. | – |
| 7 | Có tiêu chí vào/ra, đình chỉ/tiếp tục | **K** | Không quy định khi nào thì được dừng kiểm thử, khi nào phải đình chỉ nếu Backend crash. | F02 |
| 8 | Tiêu chí đạt/không đạt đo lường được | **K** | Không lượng hóa tiêu chí NFR-01 (ngưỡng 500ms API, 1.5s tải trang danh mục). | F10 |
| 9 | Mô tả môi trường và dữ liệu kiểm thử | **K** | Chỉ ghi "Chrome", hoàn toàn không nhắc đến cơ chế chạy song song MariaDB 11 và H2 in-memory (`application-h2.properties`) và tiện ích `POST /api/seed/reset`. | F04, F06 |
| 10 | Vai trò và trách nhiệm cụ thể | **K** | Không chỉ định người phụ trách kiểm thử màn hình quản trị và kiểm thử tự động. | F07 |
| 11 | Có lịch trình và ước lượng công sức | **K** | Không phân rã các pha thực thi kiểm thử và hồi quy. | F03 |
| 12 | Nêu công cụ kiểm thử và quản lý lỗi | **Đ** | Có nhắc đến JUnit và Spring Boot Test. | – |
| 13 | Có phân tích rủi ro kiểm thử | **K** | Chưa nhận diện rủi ro sai lệch dữ liệu giữa các lần chạy do không reset cơ sở dữ liệu mẫu. | F09 |
| 14 | Thuật ngữ và sản phẩm bàn giao nhất quán | **K** | Trạng thái đơn hàng trong tài liệu ghi DELIVERED, trong khi `OrderStatus.java` dùng COMPLETED; thiếu danh mục bàn giao. | F05, F12, F13 |
| 15 | Ngôn ngữ rõ ràng, dễ hiểu | **Đ** | Văn phong diễn đạt dễ hiểu. | – |

**Kết luận của Inspector 2:** Test Plan v0.1 không đạt điều kiện để sử dụng. Bắt buộc phải bổ sung cấu hình môi trường H2/MariaDB, quy trình nạp dữ liệu DataSeeder và toàn bộ các yêu cầu phi chức năng.
