# KẾ HOẠCH KIỂM THỬ HỆ THỐNG LOTUS STORE (PHIÊN BẢN v1.0)
## CHUẨN HÓA THEO TIÊU CHUẨN IEEE STD 829-2008 & ISO/IEC/IEEE 29119-3

**Đơn vị:** Trường Đại học Kinh tế TP. Hồ Chí Minh (UEH) – Khoa Công nghệ Thông tin Kinh doanh  
**Học phần:** Đảm bảo và kiểm soát chất lượng phần mềm (SQA/QC)  
**Dự án:** Lotus Store – Hệ thống Thương mại điện tử Bán hàng trực tuyến  
**Kho lưu trữ:** [https://github.com/rtmiue20/SQAQC.git](https://github.com/rtmiue20/SQAQC.git)  
**Mã tài liệu:** `TP-LOTUS-v1.0`  
**Ngày phê duyệt:** 16/11/2026 | **Trạng thái:** Approved by Moderator (Ngô Trọng Phúc)  

---

## 1. Lịch sử thay đổi phiên bản (Document History)

| Phiên bản | Ngày cập nhật | Người thực hiện | Nội dung thay đổi chính |
|:---:|:---:|:---|:---|
| **v0.1** | 05/11/2026 | Nguyễn Phúc Vương (Author) | Bản phác thảo ban đầu, phát hiện 14 khiếm khuyết trong buổi TPR ngày 14/11. |
| **v1.0** | 15/11/2026 | Nguyễn Phúc Vương (Author) | Nâng cấp toàn diện sau TPR: bổ sung đủ 14 REQ, lập RTM, chuẩn hóa Entry/Exit Criteria, môi trường MariaDB/H2, phân tích rủi ro R1-R5, lịch trình và phân công cụ thể. |

---

## 2. Mục tiêu kiểm thử (Test Objectives)
- Đảm bảo 100% các chức năng nghiệp vụ của Lotus Store đáp ứng đúng đặc tả SRS v1.0.
- Xác thực tính toàn vẹn tồn kho trong toàn bộ vòng đời đơn hàng (tạo đơn, khách hủy đơn, admin hủy đơn).
- Đảm bảo tính chính xác trong tính toán tiền tệ và giới hạn trần chiết khấu của voucher khuyến mãi.
- Ngăn ngừa các lỗ hổng rò rỉ dữ liệu khách hàng và đảm bảo chỉ số hiệu năng đạt chuẩn cam kết.

---

## 3. Phạm vi kiểm thử (Scope of Testing)

### 3.1. Trong phạm vi kiểm thử (In-Scope)
Bao phủ toàn diện 14 yêu cầu theo SRS v1.0:
1. **Phân hệ Khách hàng:** REQ-01 (Hiển thị & lọc danh mục), REQ-02 (Xem chi tiết & tồn kho biên 0, 1), REQ-03 (Quản lý giỏ hàng & LocalStorage), REQ-04 (Đặt hàng COD & validate SĐT), REQ-05 (Voucher UEH10 tối đa 50k & FREESHIP 30k), REQ-06 (Khách tra cứu đơn theo SĐT), REQ-07 (Khách tự hủy đơn PENDING & tự động hoàn kho).
2. **Phân hệ Quản trị & Tiện ích:** REQ-08 (Admin thêm/sửa SP & validate price > 0, stock $\ge$ 0), REQ-09 (Quản lý vòng đời đơn & hoàn kho khi hủy), REQ-10 (Dashboard doanh thu thực đơn COMPLETED & cảnh báo stock < 5), REQ-11 (Tiện ích reset dữ liệu mẫu qua POST `/api/seed/reset`).
3. **Yêu cầu phi chức năng:** REQ-12 (NFR-01: Hiệu năng API $\le 500$ms, tải trang $\le 1.5$s), REQ-13 (NFR-02: Bảo mật tra cứu, chặn SĐT rỗng/ký tự đặc biệt), REQ-14 (NFR-03: Toàn vẹn giao dịch ACID).

### 3.2. Ngoài phạm vi kiểm thử (Out-of-Scope)
- Tích hợp cổng thanh toán trực tuyến của bên thứ ba (VNPAY, MoMo, ZaloPay, thẻ tín dụng quốc tế).
- Hệ thống định vị GPS và đơn vị vận chuyển bên thứ ba (Giao Hàng Nhanh, Viettel Post).
- Hệ thống quản lý tài khoản người dùng có đăng nhập xác thực OAuth2 / JWT.

---

## 4. Ma trận truy vết yêu cầu (RTM Summary)
Chi tiết ánh xạ 14 yêu cầu nghiệp vụ sang các nhóm ca kiểm thử được lưu trữ riêng tại [`docs/test-plan/rtm.md`](rtm.md).
- **Tổng số yêu cầu:** 14/14 yêu cầu được bao phủ (100%).
- **Tổng số kịch bản kiểm thử dự kiến:** 74 Test Cases chức năng (TC-001 đến TC-074) + 12 Test Cases phi chức năng (TC-NFR-01 đến TC-NFR-12).

---

## 5. Tiêu chí kiểm thử (Testing Criteria)

### 5.1. Tiêu chí bắt đầu (Entry Criteria)
- Bản build mã nguồn Backend và Frontend biên dịch không có lỗi cú pháp.
- Bộ kiểm thử tự động `AuraStoreIntegrationTest.java` chạy thành công qua lệnh `mvnw test` trên profile `h2`.
- Tài liệu Kế hoạch kiểm thử v1.0 và Bảng kiểm Test Case đã được rà soát và phê duyệt bởi Test Lead/Moderator.
- API `POST /api/seed/reset` hoạt động bình thường để sẵn sàng nạp bộ dữ liệu mẫu ban đầu.

### 5.2. Tiêu chí kết thúc (Exit Criteria)
- 100% các ca kiểm thử mức Critical và High được thực thi và đạt (Pass).
- Tỷ lệ đạt tổng thể của toàn bộ bộ ca kiểm thử $\ge 95\%$.
- Không còn bất kỳ lỗi nào ở mức Critical hoặc Major còn mở (Open) chưa được xử lý.
- Mọi tài liệu bàn giao (Test Execution Log, Defect Report) đã được cập nhật đầy đủ lên kho GitHub.

### 5.3. Tiêu chí đình chỉ và tiếp tục (Suspension & Resumption Criteria)
- **Đình chỉ kiểm thử khi:** API `POST /api/seed/reset` bị lỗi không thể thiết lập dữ liệu ban đầu, hoặc môi trường máy chủ Backend bị crash ngăn cản trên 30% số lượng Test Case được thực thi.
- **Tiếp tục kiểm thử khi:** Lỗi chặn (blocking defect) đã được đội phát triển khắc phục hoàn toàn, triển khai bản vá thành công và nạp lại dữ liệu mẫu thành công.

---

## 6. Môi trường và Dữ liệu kiểm thử (Test Environment & Data)

### 6.1. Cấu hình Môi trường
- **Backend:** Java 21 LTS, Spring Boot 3.4.2 chạy tại cổng `http://localhost:8080`.
- **Frontend:** React 18, TypeScript, Vite chạy tại cổng `http://localhost:5173`.
- **Cơ sở dữ liệu:**
  - MariaDB 11 chạy tại port 3306 (CSDL chính phục vụ kiểm thử thủ công và E2E).
  - H2 Database In-Memory (`profile=h2`) phục vụ chạy kiểm thử tích hợp tự động qua Maven.
- **Trình duyệt kiểm thử:** Google Chrome (chính), Mozilla Firefox, Microsoft Edge phiên bản mới nhất.

### 6.2. Chiến lược Dữ liệu kiểm thử biên (Boundary Test Data)
Bắt buộc gọi API `POST /api/seed/reset` trước mỗi đợt chạy kiểm thử để khởi tạo chính xác:
- **Sản phẩm biên:** Tồn kho bằng 0 (Tai nghe), Tồn kho bằng 1 (Quần jeans), Tồn kho bằng 3 (Balo), Tồn kho 20 (Áo sơ mi).
- **Voucher biên:** `UEH10` (đơn 199.000đ từ chối, đơn 200.000đ giảm 20.000đ, đơn 1.000.000đ chặn trần giảm đúng 50.000đ).
- **Đơn hàng mẫu:** 4 đơn tương ứng 4 trạng thái (`ORD-1001` PENDING, `ORD-1002` SHIPPING, `ORD-1003` COMPLETED, `ORD-1004` CANCELLED).

---

## 7. Phân công vai trò và Lịch trình thực hiện

### 7.1. Phân công trách nhiệm
| Vai trò | Nhân sự phụ trách | Nhiệm vụ chính |
|:---|:---|:---|
| **Test Lead** | Ngô Trọng Phúc | Điều phối chiến dịch kiểm thử, giám sát tuân thủ Entry/Exit, nghiệm thu báo cáo lỗi. |
| **Tester 1** | Nguyễn Văn Minh Triều | Thiết kế và thực thi kiểm thử phân hệ Khách hàng (REQ-01 đến REQ-07). |
| **Tester 2** | Hà Ngọc Thiện | Thiết kế và thực thi kiểm thử phân hệ Quản trị & Seed (REQ-08 đến REQ-11). |
| **Automation & NFR Tester** | Nguyễn Phúc Vương | Thực thi bộ kiểm thử tích hợp tự động và đo lường NFR (REQ-12 đến REQ-14). |
| **Defect Manager** | Triệu Nguyễn Huỳnh Khang | Ghi nhận, gắn nhãn và theo dõi vòng đời khiếm khuyết trên GitHub Issues. |

### 7.2. Lịch trình kiểm thử theo giai đoạn
| Giai đoạn | Hoạt động trọng tâm | Thời lượng dự kiến | Thời điểm |
|:---|:---|:---:|:---:|
| **Giai đoạn 1** | Phê duyệt Test Plan v1.0 & Thiết kế chi tiết Test Case theo RTM | 16 giờ công | 17/11 – 18/11 |
| **Giai đoạn 2** | Chạy kiểm thử tự động `mvnw test` & Kiểm thử chức năng đợt 1 | 24 giờ công | 19/11 – 20/11 |
| **Giai đoạn 3** | Kiểm thử NFR (Hiệu năng, Bảo mật, ACID) & Ghi nhận Bug | 16 giờ công | 21/11 |
| **Giai đoạn 4** | Kiểm thử hồi quy (Regression Testing) & Nghiệm thu chất lượng | 12 giờ công | 22/11 |

---

## 8. Quản trị rủi ro kiểm thử (Risk Management)
Được cấu trúc chi tiết theo ma trận Xác suất $\times$ Tác động ($P \times I$) với 5 rủi ro cốt lõi từ R1 đến R5 như đã phân tích tại Báo cáo SQA.

---

## 9. Quy trình Quản lý khiếm khuyết (Defect Management)
- **Công cụ:** GitHub Issues kết hợp Pull Request theo mẫu `.github/PULL_REQUEST_TEMPLATE.md`.
- **Quy chuẩn 4 cấp độ nghiêm trọng:**
  1. `Critical`: Hệ thống bị crash, sai lệch dữ liệu tài chính, rò rỉ dữ liệu bảo mật, chức năng chính bị chặn hoàn toàn.
  2. `Major`: Chức năng nghiệp vụ chính hoạt động sai logic mà không có cách giải quyết tạm thời (workaround).
  3. `Minor`: Lỗi giao diện, sai định dạng hiển thị nhỏ, không ảnh hưởng đến dòng chảy nghiệp vụ chính.
  4. `Trivial`: Lỗi chính tả, căn lề chưa chuẩn.
