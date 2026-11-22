# DANH SÁCH VẤN ĐỀ RÀ SOÁT TEST PLAN (ISSUE LOG)
## GHI NHẬN TẠI PHIÊN SOFTWARE INSPECTION NGÀY 14/11/2026

**Dự án:** Lotus Store – Hệ thống Thương mại điện tử Bán hàng trực tuyến  
**Đối tượng rà soát:** Test Plan v0.1 đối chiếu SRS v1.0  
**Thư ký ghi nhận (Recorder):** Triệu Nguyễn Huỳnh Khang  
**Người xác nhận đóng lỗi (Moderator):** Ngô Trọng Phúc  
**Tổng số vấn đề:** 14 (3 Critical, 7 Major, 4 Minor) | **Trạng thái:** 100% CLOSED tại phiên Follow-up 16/11/2026  

---

| Mã | Mức độ | Trục đánh giá | Mô tả khiếm khuyết phát hiện trong Test Plan v0.1 | Biện pháp khắc phục trong Test Plan v1.0 | Người sửa | Người duyệt | Trạng thái |
|:---:|:---:|:---:|:---|:---|:---:|:---:|:---:|
| **F01** | Critical | Đầy đủ / Truy vết | Bỏ sót 6/14 yêu cầu trong SRS (REQ-05 Voucher, REQ-07 Khách hủy đơn hoàn kho, REQ-08 Validate giá Admin, REQ-12 Hiệu năng, REQ-13 Bảo mật tra cứu SĐT, REQ-14 ACID); không nêu Out-of-scope. | Bổ sung đủ 14 yêu cầu vào mục 3.1; định nghĩa rõ thanh toán online, vận chuyển bên thứ 3 là Out-of-scope. | Vương | Phúc | **CLOSED** |
| **F02** | Critical | Đầy đủ | Thiếu hoàn toàn tiêu chí vào/ra (Entry/Exit) và tiêu chí đình chỉ/tiếp tục kiểm thử (Suspension/Resumption). | Xây dựng mục 5 quy định rõ điều kiện bắt đầu, kết thúc ($\ge 95\%$ pass) và ngưỡng đình chỉ. | Vương | Phúc | **CLOSED** |
| **F03** | Critical | Đầy đủ | Không có lịch trình kiểm thử và ước lượng công sức chi tiết; chỉ ghi chung chung "kiểm thử vào tuần cuối". | Bổ sung bảng tiến độ 4 giai đoạn với ước lượng 68 giờ công chi tiết. | Vương | Phúc | **CLOSED** |
| **F04** | Major | Nhất quán | Môi trường kiểm thử chưa đồng bộ với kiến trúc: chỉ nêu Chrome, bỏ qua đa trình duyệt và cấu hình MariaDB 11 / H2 in-memory. | Bổ sung mục 6.1 đặc tả chi tiết cấu hình Spring Boot, MariaDB, profile H2 và Chrome/Edge/Firefox. | Vương | Phúc | **CLOSED** |
| **F05** | Major | Nhất quán | Lệch thuật ngữ trạng thái đơn (ghi DELIVERED thay vì COMPLETED theo `OrderStatus.java`); dùng thang 3 mức độ lỗi thay vì 4 mức. | Chuẩn hóa thuật ngữ khớp 100% với mã nguồn; áp dụng quy chuẩn 4 cấp độ nghiêm trọng chuẩn (Critical, Major, Minor, Trivial). | Vương | Phúc | **CLOSED** |
| **F06** | Major | Đầy đủ | Bỏ sót kế hoạch chuẩn bị dữ liệu mẫu kiểm thử biên (DataSeeder, API `POST /api/seed/reset`, tồn kho biên 0/1/3/20, 2 voucher, 4 đơn mẫu). | Bổ sung mục 6.2 quy định bắt buộc reset dữ liệu mẫu qua DataSeeder trước mỗi đợt kiểm thử. | Vương | Phúc | **CLOSED** |
| **F07** | Major | Đầy đủ | Phân công trách nhiệm mơ hồ ("cả nhóm cùng test"), không chỉ định người phụ trách từng phân hệ. | Lập bảng phân công 5 vai trò kiểm thử chuyên trách (Test Lead, Tester 1, Tester 2, Automation Tester, Defect Manager). | Vương | Phúc | **CLOSED** |
| **F08** | Major | Truy vết | Các hạng mục kiểm thử không gắn mã yêu cầu REQ-01 đến REQ-14, chưa có Ma trận truy vết yêu cầu (RTM). | Xây dựng tài liệu `docs/test-plan/rtm.md` ánh xạ hai chiều giữa REQ-01..14 với TP-01..14 và các Test Case. | Vương | Phúc | **CLOSED** |
| **F09** | Major | Đầy đủ | Thiếu phân tích rủi ro kiểm thử (nguy cơ lọt lỗi tính voucher, mất tồn kho, rò rỉ dữ liệu). | Bổ sung ma trận rủi ro R1–R5 kèm biện pháp kiểm soát và kế hoạch dự phòng. | Vương | Phúc | **CLOSED** |
| **F10** | Major | Đo lường | Yêu cầu hiệu năng chỉ ghi định tính ("hệ thống phản hồi nhanh"), không có ngưỡng định lượng theo REQ-12. | Định lượng cụ thể: API giao dịch $\le 500$ms, tải trang danh mục $\le 1.5$s, 0 trường hợp rò rỉ dữ liệu. | Vương | Phúc | **CLOSED** |
| **F11** | Minor | Nhất quán | Số phiên bản và ngày cập nhật ở tiêu đề không khớp với bảng lịch sử thay đổi. | Đồng bộ phiên bản v1.0, ngày phê duyệt 16/11/2026 trên toàn bộ tài liệu. | Vương | Phúc | **CLOSED** |
| **F12** | Minor | Đầy đủ | Thiếu danh mục sản phẩm bàn giao kiểm thử (Test Deliverables). | Bổ sung danh mục: Test Plan v1.0, RTM, bộ Test Case, báo cáo Integration Test, Defect Log. | Vương | Phúc | **CLOSED** |
| **F13** | Minor | Đầy đủ | Thiếu mục tài liệu tham chiếu (SRS v1.0, lược đồ CSDL `database/schema.sql`, link repo GitHub). | Bổ sung danh mục tài liệu tham chiếu kỹ thuật và đường dẫn mã nguồn. | Vương | Phúc | **CLOSED** |
| **F14** | Minor | Trình bày | Đánh số đề mục và định dạng bảng biểu trong tài liệu chưa liên tục. | Chuẩn hóa toàn bộ cấu trúc mục, heading Markdown và bảng biểu theo chuẩn IEEE 829. | Vương | Phúc | **CLOSED** |
