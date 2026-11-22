# BIÊN BẢN HỌP SOFTWARE INSPECTION TEST PLAN
## BƯỚC 4: HỌP RÀ SOÁT HÌNH THỨC (INSPECTION MEETING)

**Thời gian:** 19:30 – 21:00, Thứ Bảy ngày 14/11/2026 (90 phút)  
**Hình thức:** Họp trực tuyến  
**Chủ trì điều phối (Moderator):** Ngô Trọng Phúc  
**Người đọc (Reader):** Hà Ngọc Thiện  
**Thư ký ghi nhận (Recorder):** Triệu Nguyễn Huỳnh Khang  
**Tác giả tài liệu (Author):** Nguyễn Phúc Vương  
**Thẩm định viên (Inspector 1):** Nguyễn Văn Minh Triều  

---

## 1. Diễn biến phiên họp
- **19:30 – 19:40:** Moderator tuyên bố lý do, phổ biến nguyên tắc phiên họp (tập trung tìm khiếm khuyết trong tài liệu, không phê bình cá nhân, tuân thủ bảng kiểm checklist 15 tiêu chí).
- **19:40 – 20:45:** Reader (Hà Ngọc Thiện) lần lượt đọc từng mục của Test Plan v0.1:
  - Khi đọc mục Phạm vi (Scope), Inspector 1 và Inspector 2 chỉ ra các lỗ hổng nghiêm trọng về việc bỏ sót 6 yêu cầu nghiệp vụ (Voucher, Hủy đơn, Giá Admin, Hiệu năng, Bảo mật, ACID). Hội đồng thống nhất xác lập lỗi **F01** (Critical).
  - Khi đọc mục Tiêu chí đánh giá, hội đồng phát hiện thiếu hoàn toàn Entry/Exit Criteria và Suspension/Resumption Criteria $\rightarrow$ Ghi nhận lỗi **F02** (Critical).
  - Khi đọc mục Lịch trình và Phân công, hội đồng chỉ ra sự mơ hồ khi ghi "tuần cuối cả nhóm cùng test" $\rightarrow$ Ghi nhận lỗi **F03** (Critical) và **F07** (Major).
  - Khi đọc mục Môi trường và Dữ liệu, hội đồng đối chiếu với mã nguồn `application-h2.properties` và `DataSeeder.java`, phát hiện tài liệu chưa đồng bộ cơ chế H2/MariaDB và thiếu kế hoạch reset dữ liệu mẫu $\rightarrow$ Ghi nhận lỗi **F04**, **F06** (Major).
  - Reader và Recorder phát hiện các điểm sai lệch thuật ngữ (DELIVERED vs COMPLETED, thang đo mức độ lỗi) $\rightarrow$ Ghi nhận lỗi **F05** (Major).
  - Các lỗi khác về RTM, rủi ro, định lượng NFR, định danh phiên bản và tài liệu bàn giao được thống nhất phân loại (F08 đến F14).
- **20:45 – 21:00:** Tổng hợp kết quả và bỏ phiếu thông qua.

## 2. Kết quả đánh giá định lượng
- **Tổng số vấn đề ghi nhận:** 14 khiếm khuyết.
  - Critical: 03 (F01, F02, F03).
  - Major: 07 (F04, F05, F06, F07, F08, F09, F10).
  - Minor: 04 (F11, F12, F13, F14).
- **Kết quả bỏ phiếu thẩm định:** **KHÔNG PHÊ DUYỆT (REJECT) BẢN v0.1**.

## 3. Quyết định của Hội đồng và Kế hoạch Rework
- Yêu cầu Author (Nguyễn Phúc Vương) sửa đổi toàn diện tài liệu theo Danh sách vấn đề Issue Log F01–F14, hoàn thiện bản nâng cấp Test Plan v1.0 và Ma trận truy vết RTM trong vòng 24 giờ (hạn chót: 23:59 ngày 15/11/2026).
- Moderator (Ngô Trọng Phúc) chịu trách nhiệm kiểm tra xác nhận (Follow-up) vào ngày 16/11/2026.
