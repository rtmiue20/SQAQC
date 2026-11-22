# KẾ HOẠCH KIỂM THỬ HỆ THỐNG LOTUS STORE (PHIÊN BẢN v0.1)
*(Tài liệu sơ lược ban đầu trước khi thực hiện quy trình Test Plan Review)*

**Dự án:** Lotus Store – Web bán hàng trực tuyến  
**Người soạn thảo:** Nguyễn Phúc Vương (Author)  
**Ngày soạn thảo:** 05/11/2026  
**Trạng thái:** Bản nháp (Draft - Bị từ chối phê duyệt sau TPR)  

---

## 1. Giới thiệu tổng quan
Dự án Lotus Store xây dựng trang web bán hàng quần áo, phụ kiện thời trang. Mục tiêu là kiểm tra xem hệ thống có chạy ổn định và bán được hàng hay không.

## 2. Mục tiêu kiểm thử
- Đảm bảo hệ thống web hoạt động bình thường, không bị sập.
- Kiểm tra tính năng mua hàng, xem sản phẩm.

## 3. Phạm vi kiểm thử (In-scope)
Hệ thống sẽ kiểm thử các tính năng sau:
- Trang chủ hiển thị danh sách sản phẩm.
- Xem chi tiết sản phẩm.
- Thêm sản phẩm vào giỏ hàng.
- Đặt hàng thanh toán COD.
- Khách hàng tra cứu đơn hàng bằng số điện thoại.
- Admin xem danh sách đơn hàng và đổi trạng thái.
- Admin xem trang thống kê doanh thu.
- Chức năng reset dữ liệu mẫu.

*(Ghi chú sau TPR: Bỏ sót 6 yêu cầu: REQ-05 Áp mã Voucher, REQ-07 Khách hủy đơn hoàn kho, REQ-08 Validate giá bán Admin, REQ-12 Hiệu năng, REQ-13 Bảo mật tra cứu SĐT, REQ-14 Toàn vẹn giao dịch ACID; không nêu rõ Out-of-scope -> Lỗi F01).*

## 4. Chiến lược kiểm thử
- Thực hiện kiểm thử tích hợp tự động qua file `AuraStoreIntegrationTest.java`.
- Thực hiện kiểm thử thủ công chức năng trên trình duyệt Chrome.

## 5. Môi trường kiểm thử
- Kiểm thử trên trình duyệt Google Chrome máy tính cá nhân.
- Backend chạy trên máy localhost port 8080.
- Frontend chạy trên port 5173.

*(Ghi chú sau TPR: Thiếu cấu hình chi tiết Java 21, Spring Boot, MariaDB 11, H2 in-memory profile h2, và kế hoạch chuẩn bị dữ liệu mẫu DataSeeder -> Lỗi F04, F06).*

## 6. Tiêu chí đánh giá
- Hệ thống phản hồi nhanh, không bị đơ giật.
- Giao diện hiển thị đẹp, rõ ràng.

*(Ghi chú sau TPR: Tiêu chí mang tính định tính, không có ngưỡng đo lường cụ thể cho NFR -> Lỗi F10. Thiếu hoàn toàn Entry/Exit Criteria và Suspension/Resumption Criteria -> Lỗi F02).*

## 7. Phân công và Lịch trình
- Cả nhóm cùng kiểm thử vào tuần cuối trước ngày nộp bài.

*(Ghi chú sau TPR: Phân công mơ hồ, dồn kiểm thử vào tuần cuối, không ước lượng công sức -> Lỗi F03, F07).*

## 8. Quản lý lỗi
- Báo lỗi qua nhóm chat Zalo của nhóm.
- Mức độ lỗi gồm: Lỗi nặng, Lỗi trung bình, Lỗi nhẹ.

*(Ghi chú sau TPR: Chưa dùng GitHub Issues / Pull Request Template, lệch thang 4 mức độ tiêu chuẩn -> Lỗi F05, F12).*
