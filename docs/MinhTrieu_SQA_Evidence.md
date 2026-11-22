# Minh chứng SQA cá nhân – Minh Triều

> Vai trò: **Inspector** (rà soát cá nhân, ma trận truy vết, phân tích rủi ro) | Nhóm: **[số nhóm]** | Đề tài 9: Test Plan Review
> Dự án: **ShopViet** [thay bằng tên dự án] | MSSV: [điền]
> Đặt file tại `docs/sqa/members/MinhTrieu_SQA_Evidence.md`. Thay mọi mục `[điền]` bằng dữ liệu thật. Các bạn khác nộp file minh chứng riêng của từng người.

## 1. Phần việc của tôi

| # | Nhiệm vụ | Sản phẩm | Vị trí trong repo |
|---|---|---|---|
| 1 | Rà soát cá nhân Test Plan v0.1 theo checklist | Checklist cá nhân (mục 3), ghi chú rà soát (mục 4) | `docs/sqa/checklists/` [điền] |
| 2 | Tham gia họp Inspection với vai trò Inspector | Danh sách vấn đề tôi nêu (mục 4) | `docs/sqa/minutes/` [điền] |
| 3 | Lập ma trận truy vết yêu cầu ↔ hạng mục kiểm thử | RTM trước/sau (mục 5) | `docs/test-plan/rtm` [điền] |
| 4 | Phân tích rủi ro khi Test Plan chưa phù hợp | Bảng rủi ro (mục 6) | Mục 6 |
| 5 | Đo hiệu quả SQA, viết phần kết quả trong báo cáo | Bảng chỉ số (mục 7) | Mục 7 |

## 2. Quá trình rà soát cá nhân

- **Tài liệu:** Test Plan v0.1, đối chiếu SRS v[điền]
- **Phương pháp:** peer/desk check theo checklist 15 tiêu chí, đọc từng mục của Test Plan và đối chiếu với từng yêu cầu trong SRS
- **Thời gian rà soát:** [điền] giờ, từ ngày [dd/mm] đến [dd/mm]
- **Công cụ:** [Excel/Google Sheets], bản Test Plan v0.1 trong repo
- **Minh chứng kèm theo:** ảnh chụp checklist đang điền `docs/sqa/evidence/minhtrieu-checklist.png` [điền]

## 3. Checklist cá nhân (Test Plan v0.1)

Đ = Đạt, K = Không đạt.

| # | Tiêu chí | Kết quả | Vị trí/bằng chứng trong Test Plan | Ghi chú của tôi |
|---|---|---|---|---|
| 1 | Có định danh, phiên bản, lịch sử thay đổi nhất quán | K | Tiêu đề, mục lịch sử | Phiên bản và ngày lệch nhau (F11) |
| 2 | Mục tiêu kiểm thử rõ ràng, gắn với mục tiêu chất lượng | Đ | Mục 1 | |
| 3 | Nêu rõ phạm vi cần kiểm thử và ngoài phạm vi | K | Mục Phạm vi | Không có phần "Ngoài phạm vi" (F01) |
| 4 | Hạng mục kiểm thử bao phủ 100% yêu cầu | K | Mục Hạng mục | Thiếu 6/14 yêu cầu (F01) |
| 5 | Có ma trận truy vết hai chiều | K | – | Không có RTM (F08) |
| 6 | Chiến lược và mức kiểm thử phù hợp | Đ | Mục Chiến lược | |
| 7 | Có tiêu chí vào/ra, đình chỉ/tiếp tục | K | – | Không có (F02) |
| 8 | Tiêu chí đạt/không đạt đo lường được | K | Mục NFR | "Chạy nhanh" không định lượng (F10) |
| 9 | Mô tả môi trường và dữ liệu kiểm thử | K | Mục Môi trường | Chỉ 2 trình duyệt, SRS yêu cầu 4 (F04, F06) |
| 10 | Vai trò, trách nhiệm cụ thể | K | Mục Nhân sự | "Cả nhóm cùng test" (F07) |
| 11 | Có lịch trình và ước lượng công sức | K | Mục Lịch | Chỉ ghi "tuần cuối" (F03) |
| 12 | Nêu công cụ kiểm thử và quản lý lỗi | Đ | Mục Công cụ | |
| 13 | Có phân tích rủi ro kiểm thử | K | – | Không có (F09) |
| 14 | Thuật ngữ, mức lỗi, bàn giao, tham chiếu nhất quán | K | Toàn bộ | F05, F12–F14 |
| 15 | Ngôn ngữ rõ ràng, dễ hiểu | Đ | Toàn bộ | |

**Kết quả cá nhân:** đạt 4/15 (27%). Sửa theo kết quả thật của bạn.

## 4. Nhật ký vấn đề tôi phát hiện

Chỉ ghi vấn đề do tôi nêu. Danh sách đầy đủ của cả nhóm nằm trong file của Recorder.

| Mã | Mức độ | Loại | Mô tả | Tôi nêu ở bước | Trạng thái | Commit sửa |
|---|---|---|---|---|---|---|
| F01 | Critical | Đầy đủ / Truy vết | Thiếu REQ-04, 05, 09, 10, 12, 13 trong phạm vi; không có mục ngoài phạm vi | Rà soát cá nhân | Đã đóng | [hash] |
| F04 | Major | Nhất quán | Test Plan ghi 2 trình duyệt, SRS yêu cầu 4 | Rà soát cá nhân | Đã đóng | [hash] |
| F08 | Major | Truy vết | Hạng mục kiểm thử không gắn mã yêu cầu | Rà soát cá nhân | Đã đóng | [hash] |
| F10 | Major | Đo lường | Yêu cầu "chạy nhanh" không có ngưỡng | Họp Inspection | Đã đóng | [hash] |
| [điền] | [điền] | [điền] | [điền] | [điền] | [điền] | [hash] |

**Số vấn đề tôi nêu:** [điền] (Critical: [điền], Major: [điền], Minor: [điền]).

## 5. Ma trận truy vết (RTM) do tôi lập

| Yêu cầu | Nội dung | Test Plan v0.1 | Test Plan v1.0 |
|---|---|---|---|
| REQ-01 | Đăng ký, đăng nhập | Có (không gắn mã) | TP-01 → TC-001..012 |
| REQ-02 | Tìm kiếm sản phẩm | [điền] | [điền] |
| REQ-03 | Giỏ hàng | Có (không gắn mã) | TP-03 → TC-021..030 |
| REQ-04 | Thanh toán | Thiếu | TP-04 → TC-031..045 |
| REQ-05 | Hủy đơn hàng | Thiếu | TP-05 → TC-046..052 |
| REQ-06 … 08 | [điền] | [điền] | [điền] |
| REQ-09 | Mã giảm giá | Thiếu | TP-09 → TC-070..078 |
| REQ-10 | Phân quyền quản trị | Thiếu | TP-10 → TC-079..088 |
| REQ-11 | Quản lý kho | [điền] | [điền] |
| REQ-12 | Báo cáo doanh thu | Thiếu | TP-12 → TC-095..100 |
| REQ-13 | Hiệu năng (NFR) | Thiếu | TP-13 → kịch bản tải L1..L3 |
| REQ-14 | [điền] | [điền] | [điền] |

**Bao phủ yêu cầu** = số yêu cầu có hạng mục kiểm thử / tổng yêu cầu trong SRS. v0.1: 8/14 (57%); v1.0: 14/14 (100%).

## 6. Phân tích rủi ro khi Test Plan chưa phù hợp

Điểm = P × I (thang 1–5).

| ID | Rủi ro | P | I | Điểm | Biện pháp |
|---|---|---|---|---|---|
| R1 | Bỏ sót kiểm thử thanh toán, phân quyền, hiệu năng | 4 | 5 | 20 | Bổ sung hạng mục và truy vết (F01, F08) |
| R2 | Không biết khi nào kết thúc hoặc dừng kiểm thử | 4 | 4 | 16 | Thêm tiêu chí vào/ra (F02) |
| R3 | Không ai chịu trách nhiệm kiểm thử | 4 | 4 | 16 | Phân công theo vai trò (F07) |
| R4 | Kiểm thử sai môi trường, thiếu trình duyệt | 3 | 4 | 12 | Chuẩn hóa môi trường (F04, F06) |
| R5 | Lịch kiểm thử dồn vào tuần cuối | 4 | 3 | 12 | Lập lịch theo sprint (F03) |

## 7. Đo hiệu quả SQA (phần tôi tính)

| Chỉ số | Cách tính | Trước (v0.1) | Sau (v1.0) |
|---|---|---|---|
| Bao phủ yêu cầu | Yêu cầu có test / tổng yêu cầu | 57% (8/14) | 100% (14/14) |
| Tiêu chí checklist đạt | Tiêu chí đạt / 15 | 27% (4/15) | 100% (15/15) |
| Vấn đề Critical/Major còn mở | Đếm trong danh sách vấn đề | 10 | 0 |
| NFR có tiêu chí đo | Số NFR có ngưỡng / 3 | 0/3 | 3/3 |

## 8. Các commit của tôi

| Commit | Nội dung | Ngày |
|---|---|---|
| [hash] | Thêm checklist cá nhân | [điền] |
| [hash] | Thêm RTM trước rà soát | [điền] |
| [hash] | Cập nhật RTM sau khi sửa Test Plan v1.0 | [điền] |
| [hash] | Thêm phân tích rủi ro và bảng chỉ số | [điền] |

## 9. Tự đánh giá đóng góp

- **Công việc đã làm:** [điền: ví dụ rà soát cá nhân, nêu [điền] vấn đề, lập RTM, phân tích rủi ro, viết mục 5.2–5.3 và 6.3 trong báo cáo]
- **Tỷ lệ đóng góp ước tính:** [điền]%
- **Tôi có thể giải thích:** vì sao TPR là hoạt động QA (phòng ngừa) chứ không phải QC; khác nhau giữa Inspection, Walkthrough và Formal Design Review; cách tính bao phủ yêu cầu và vì sao truy vết hai chiều giúp phát hiện yêu cầu bị bỏ sót.
