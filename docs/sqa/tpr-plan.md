# KẾ HOẠCH RÀ SOÁT KẾ HOẠCH KIỂM THỬ (TPR PLAN)
## SOFTWARE INSPECTION CHO DỰ ÁN LOTUS STORE

**Người lập kế hoạch (Moderator):** Ngô Trọng Phúc  
**Ngày ban hành:** 10/11/2026  
**Dự án:** Lotus Store – Hệ thống Thương mại điện tử Bán hàng trực tuyến  
**Mã tài liệu:** `SQA-TPR-PLAN-2026`  

---

## 1. Mục tiêu và Tiêu chí chất lượng
- Rà soát tài liệu Kế hoạch kiểm thử ban đầu (`Test Plan v0.1`) nhằm phát hiện và loại bỏ sớm các khiếm khuyết về phạm vi, tiêu chí và tính khả thi trước khi thiết kế Test Case.
- Đạt 06 tiêu chí chất lượng TC1 – TC6 theo tiêu chuẩn IEEE Std 829-2008 và ISO/IEC/IEEE 29119-3.

## 2. Phân công 6 vai trò rà soát (5 thành viên)
1. **Moderator (Điều phối viên):** Ngô Trọng Phúc – Chịu trách nhiệm lập kế hoạch, điều hành họp, giám sát tiến độ và xác nhận đóng lỗi tại bước Follow-up.
2. **Author (Tác giả):** Nguyễn Phúc Vương – Trình bày tài liệu tại Walkthrough, tiếp thu góp ý và thực hiện Rework từ v0.1 lên v1.0.
3. **Reader (Người đọc):** Hà Ngọc Thiện – Đọc to và diễn giải từng mục trong phiên họp Inspection ngày 14/11.
4. **Recorder (Thư ký):** Triệu Nguyễn Huỳnh Khang – Ghi chép biên bản cuộc họp và quản lý Danh sách khiếm khuyết (Issue Log F01–F14).
5. **Inspector 1 (Thẩm định viên 1):** Nguyễn Văn Minh Triều – Chuyên sâu luồng Khách hàng và API giao dịch (REQ-01 đến REQ-07, REQ-13, REQ-14).
6. **Inspector 2 (Thẩm định viên 2):** Hà Ngọc Thiện (kiêm nhiệm) – Chuyên sâu luồng Quản trị, Môi trường, Dữ liệu mẫu và NFR (REQ-08 đến REQ-12).

## 3. Lịch trình 6 bước Fagan Inspection
| Bước | Hoạt động | Thời gian | Địa điểm / Hình thức | Sản phẩm đầu ra |
|:---:|:---|:---:|:---|:---|
| **1** | Lập kế hoạch (Planning) | 10/11/2026 | Ban hành kế hoạch qua kho Git | `docs/sqa/tpr-plan.md` |
| **2** | Tổng quan (Overview / Walkthrough) | 11/11/2026 | Họp trực tuyến (60 phút) | Biên bản họp Walkthrough |
| **3** | Rà soát cá nhân (Preparation) | 12/11 – 13/11 | Làm việc độc lập qua Checklist | Bộ Checklist đã điền ghi chú |
| **4** | Họp rà soát (Inspection Meeting) | 14/11/2026 | Họp trực tuyến (90 phút) | Biên bản rà soát, Issue Log |
| **5** | Sửa lỗi (Rework) | 15/11/2026 | Author cập nhật mã nguồn & docs | Test Plan v1.0, RTM v1.0 |
| **6** | Kiểm tra xác nhận (Follow-up) | 16/11/2026 | Moderator đối chiếu và nghiệm thu | Biên bản phê duyệt Test Plan v1.0 |
