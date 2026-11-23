# BẢNG KIỂM RÀ SOÁT TEST PLAN (INSPECTOR 1)
## PHẠM VI: LUỒNG KHÁCH HÀNG & API GIAO DỊCH (REQ-01 -> REQ-07, REQ-13, REQ-14)

**Thẩm định viên (Inspector 1):** Nguyễn Văn Minh Triều  
**Đối tượng rà soát:** Test Plan v0.1 đối chiếu SRS v1.0 & Mã nguồn Controller/Service/Customer Frontend  
**Ngày thực hiện:** 12/11/2026 – 13/11/2026  

---

| # | Tiêu chí rà soát theo IEEE 829 & ISO 29119-3 | Kết quả v0.1 | Đánh giá chi tiết & Bằng chứng đối chiếu mã nguồn | Ghi chú mã khiếm khuyết |
|:---:|:---|:---:|:---|:---:|
| 1 | Có định danh, phiên bản và lịch sử thay đổi | **K** | Tiêu đề ghi v0.1 nhưng không có bảng Document History theo dõi sửa đổi. | F11 |
| 2 | Mục tiêu kiểm thử rõ ràng, gắn với chất lượng | **Đ** | Nêu được mục tiêu kiểm tra tính ổn định và bán được hàng. | – |
| 3 | Nêu rõ phạm vi kiểm thử và ngoài phạm vi | **K** | Bỏ sót kiểm thử Voucher (`REQ-05`), Khách hủy đơn hoàn kho (`REQ-07`). Không nêu Out-of-scope (thanh toán online bên thứ 3). | F01 |
| 4 | Hạng mục kiểm thử bao phủ 100% SRS | **K** | Thiếu hẳn kiểm tra logic chiết khấu trần của Voucher UEH10 tại `VoucherService.java` và hoàn tồn kho khi khách tự hủy đơn tại `OrderService.java`. | F01 |
| 5 | Có ma trận truy vết hai chiều (RTM) | **K** | Các hạng mục kiểm thử viết rời rạc, không gắn mã yêu cầu REQ-01 đến REQ-07 để truy vết. | F08 |
| 6 | Chiến lược và mức kiểm thử phù hợp | **Đ** | Có kết hợp kiểm thử tích hợp tự động Backend và kiểm thử giao diện React. | – |
| 7 | Có tiêu chí vào/ra, đình chỉ/tiếp tục | **K** | Hoàn toàn không có mục Entry/Exit Criteria cho luồng đặt hàng và hủy đơn. | F02 |
| 8 | Tiêu chí đạt/không đạt đo lường được | **K** | Chỉ ghi "hệ thống phản hồi nhanh", không có chỉ số ms cho API tạo đơn hay tra cứu. | F10 |
| 9 | Mô tả môi trường và dữ liệu kiểm thử | **K** | Không đề cập các dữ liệu biên quan trọng (sản phẩm tồn kho = 0, tồn kho = 1, voucher giảm tối đa). | F06 |
| 10 | Vai trò và trách nhiệm cụ thể | **K** | Ghi chung chung "cả nhóm cùng test", không ai chịu trách nhiệm chính luồng Khách hàng. | F07 |
| 11 | Có lịch trình và ước lượng công sức | **K** | Dồn vào tuần cuối, không có số giờ công cho việc test giỏ hàng, đặt hàng, hủy đơn. | F03 |
| 12 | Nêu công cụ kiểm thử và quản lý lỗi | **Đ** | Có đề cập Postman, JUnit và DevTools. | – |
| 13 | Có phân tích rủi ro kiểm thử | **K** | Thiếu phân tích rủi ro thất thoát doanh thu do tính sai voucher hoặc mất dữ liệu giỏ hàng LocalStorage. | F09 |
| 14 | Thuật ngữ và sản phẩm bàn giao nhất quán | **K** | Dùng từ "Hủy đơn" nhưng không đồng bộ với enum `CANCELLED` trong `OrderStatus.java`. | F05, F12 |
| 15 | Ngôn ngữ rõ ràng, dễ hiểu | **Đ** | Trình bày tiếng Việt tương đối dễ đọc. | – |

**Kết luận của Inspector 1:** Test Plan v0.1 chỉ đạt 4/15 tiêu chí (26.7%). Đề nghị hội đồng Inspection yêu cầu Author viết lại toàn bộ phần phạm vi luồng khách hàng và bổ sung RTM.
