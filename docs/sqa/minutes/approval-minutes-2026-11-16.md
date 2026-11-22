# BIÊN BẢN PHÊ DUYỆT KẾ HOẠCH KIỂM THỬ (TEST PLAN v1.0)
## BƯỚC 6: KIỂM TRA XÁC NHẬN (FOLLOW-UP) & QUYẾT ĐỊNH PHÊ DUYỆT

**Thời gian:** 16/11/2026  
**Chủ trì phê duyệt (Moderator):** Ngô Trọng Phúc  
**Tác giả tài liệu (Author):** Nguyễn Phúc Vương  
**Thành phần nghiệm thu:** Toàn thể thành viên nhóm SQA Đề tài 9  

---

## 1. Kết quả kiểm tra xác nhận việc đóng khiếm khuyết (Follow-up Verification)
Moderator (Ngô Trọng Phúc) đã đối chiếu chéo chi tiết từng dòng trong Issue Log (F01 đến F14) với tài liệu `docs/test-plan/test-plan-v1.0.md` và `docs/test-plan/rtm.md`:

1. **Khắc phục các lỗi Critical (F01, F02, F03):**
   - Đã bao phủ đầy đủ 14/14 yêu cầu (cả Voucher, Hủy đơn, Giá Admin, Hiệu năng, Bảo mật, ACID).
   - Đã xây dựng hoàn chỉnh Tiêu chí vào/ra (Entry/Exit Criteria) với ngưỡng đạt $\ge 95\%$ và 0 lỗi Critical/Major.
   - Đã bổ sung lịch trình 4 giai đoạn chi tiết với 68 giờ công và mốc thời gian rõ ràng.
2. **Khắc phục các lỗi Major (F04 đến F10):**
   - Đã đặc tả môi trường kiểm thử song song MariaDB 11 và H2 in-memory, kèm quy định reset dữ liệu qua DataSeeder.
   - Đã đồng bộ 100% thuật ngữ trạng thái đơn hàng (`PENDING, SHIPPING, COMPLETED, CANCELLED`) theo đúng `OrderStatus.java`.
   - Đã hoàn thành Ma trận truy vết hai chiều (RTM) liên kết 1-1 giữa 14 yêu cầu và các ca kiểm thử.
   - Đã lượng hóa rõ ràng các chỉ tiêu hiệu năng (API $\le 500$ms, tải trang $\le 1.5$s, 0 lỗi rò rỉ dữ liệu).
3. **Khắc phục các lỗi Minor (F11 đến F14):**
   - Đã chuẩn hóa phiên bản v1.0, bổ sung tài liệu tham chiếu và danh mục sản phẩm bàn giao.

**Thống kê trạng thái:** 14/14 khiếm khuyết (100%) đã được khắc phục triệt để và được Moderator chính thức ký xác nhận trạng thái **CLOSED**.

## 2. Quyết định phê duyệt (Approval Decision)
- **Căn cứ:**
  - 100% tiêu chí trong Bảng kiểm TPR Checklist đạt yêu cầu (15/15).
  - Thỏa mãn toàn bộ 6 tiêu chí chất lượng TC1 – TC6.
  - Không còn bất kỳ khiếm khuyết Critical hoặc Major nào còn mở.
- **QUYẾT ĐỊNH:** **CHÍNH THỨC PHÊ DUYỆT (OFFICIALLY APPROVED) TÀI LIỆU KẾ HOẠCH KIỂM THỬ PHIÊN BẢN v1.0 (`TP-LOTUS-v1.0`).**
- Kế hoạch kiểm thử v1.0 chính thức được đưa vào làm căn cứ chuẩn mực để triển khai thiết kế ca kiểm thử (Test Case Design) và thực thi kiểm thử trong các giai đoạn tiếp theo của dự án.
