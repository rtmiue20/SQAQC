# BIÊN BẢN HỌP WALKTHROUGH TEST PLAN v0.1
## BƯỚC 2: TỔNG QUAN (OVERVIEW) TRONG QUY TRÌNH TPR

**Thời gian:** 19:30 – 20:30, Thứ Tư ngày 11/11/2026 (60 phút)  
**Hình thức:** Họp trực tuyến (Google Meet)  
**Chủ trì (Author):** Nguyễn Phúc Vương  
**Thư ký (Recorder):** Triệu Nguyễn Huỳnh Khang  
**Thành viên tham dự:** Ngô Trọng Phúc (Moderator), Hà Ngọc Thiện (Reader/Inspector 2), Nguyễn Văn Minh Triều (Inspector 1). Đủ 5/5 thành viên.  

---

## 1. Nội dung cuộc họp
1. **Trình bày của Tác giả:**
   - Nguyễn Phúc Vương trình bày tổng quan cấu trúc bản thảo Test Plan v0.1, các chức năng dự kiến kiểm thử và chiến lược kiểm thử kết hợp manual test trên Chrome và unit/integration test trên Spring Boot.
   - Giải thích lý do ban đầu chưa đưa voucher và hủy đơn vào test plan là do tập trung trước cho luồng mua hàng cơ bản (Happy path).
2. **Ý kiến phản hồi và chất vấn sơ bộ từ các thành viên:**
   - *Nguyễn Văn Minh Triều (Inspector 1):* Nhận thấy luồng voucher (`UEH10`, `FREESHIP`) là tính năng có rủi ro tài chính cao nếu tính sai tiền, bắt buộc phải đưa vào phạm vi kiểm thử chính thức. Ngoài ra cần làm rõ logic hoàn kho khi khách hàng tự hủy đơn.
   - *Hà Ngọc Thiện (Inspector 2):* Nhận thấy chưa có cấu hình cụ thể cho cơ sở dữ liệu (MariaDB và profile H2), thiếu tiện ích reset dữ liệu kiểm thử, và chưa có kế hoạch kiểm thử cho các yêu cầu phi chức năng (bảo mật tra cứu đơn, hiệu năng API).
   - *Ngô Trọng Phúc (Moderator):* Đánh giá tài liệu v0.1 còn sơ sài, thiếu nhiều cấu phần quản trị quan trọng (Entry/Exit Criteria, RTM, phân công chi tiết). Thống nhất giữ nguyên hiện trạng tài liệu v0.1 làm đối tượng rà soát cho bước tiếp theo (Rà soát cá nhân bằng Checklist).

## 2. Kết luận và phân công bước kế tiếp
- Toàn bộ thành viên nhận bộ hồ sơ rà soát gồm: Test Plan v0.1, SRS v1.0, Bảng kiểm TPR Checklist 15 tiêu chí.
- Inspector 1 và Inspector 2 tiến hành rà soát độc lập từ ngày 12/11 đến hết ngày 13/11.
- Cuộc họp rà soát hình thức (Inspection Meeting) được ấn định vào 19:30 ngày 14/11/2026.
