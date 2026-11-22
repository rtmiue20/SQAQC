# TRƯỜNG ĐẠI HỌC KINH TẾ TP. HỒ CHÍ MINH (UEH)
## KHOA CÔNG NGHỆ THÔNG TIN KINH DOANH
### Học phần: Đảm bảo và kiểm soát chất lượng phần mềm (SQA/QC)

---

# BÁO CÁO ĐẢM BẢO CHẤT LƯỢNG KẾ HOẠCH KIỂM THỬ
### Đề tài: Nhóm 9 – Dự án: Lotus Store (Hệ thống Thương mại điện tử Bán hàng trực tuyến)
**Kho lưu trữ mã nguồn:** [https://github.com/rtmiue20/SQAQC.git](https://github.com/rtmiue20/SQAQC.git)

---

## 1. Giới thiệu dự án
Lotus Store là hệ thống web thương mại điện tử chuyên cung cấp các sản phẩm thời trang và phụ kiện trực tuyến (áo sơ mi, quần jeans, tai nghe, balo). Dự án do nhóm tự phát triển với mã nguồn đầy đủ, có các chức năng hoạt động hoàn chỉnh và được quản lý công khai tại kho lưu trữ [https://github.com/rtmiue20/SQAQC.git](https://github.com/rtmiue20/SQAQC.git). Hệ thống phục vụ hai nhóm đối tượng: khách hàng mua sắm trực tuyến tinh gọn và ban quản trị cửa hàng quản lý danh mục, đơn hàng và doanh thu.

### 1.1. Kiến trúc công nghệ của hệ thống Lotus Store
Hệ thống Lotus Store được thiết kế theo kiến trúc phân tầng hiện đại, phân tách độc lập giữa phần mềm máy chủ và giao diện người dùng:
- **Phân hệ Backend (thư mục `backend/`):** Sử dụng Java 21 trên nền tảng Spring Boot 3.4.2, tích hợp Spring Web MVC xây dựng RESTful API, Spring Data JPA kết hợp Hibernate ORM tương tác cơ sở dữ liệu, và Bean Validation (`jakarta.validation`) kiểm tra dữ liệu đầu vào. Ngoại lệ nghiệp vụ được điều hướng xử lý tập trung qua `GlobalExceptionHandler` (trả về `ApiErrorResponse`) và kiểm soát chia sẻ tài nguyên nguồn gốc chéo tại `CorsConfig`.
- **Phân hệ Frontend (thư mục `frontend/`):** Phát triển dưới dạng ứng dụng đơn trang (SPA) bằng React 18, ngôn ngữ TypeScript, Vite và bộ khung giao diện Tailwind CSS v3. Trạng thái giỏ hàng được quản lý độc lập tại hook `useCart` và lưu trữ bền vững trong LocalStorage (khóa định danh `lotus_store_cart_v1`), đảm bảo không thất thoát dữ liệu khi làm mới trang.
- **Cơ sở dữ liệu và Môi trường thử nghiệm:** Sử dụng MariaDB 11 với 4 bảng chuẩn hóa gồm `products` (sản phẩm), `vouchers` (mã giảm giá), `orders` (đơn hàng) và `order_items` (chi tiết mặt hàng). Dự án tích hợp cấu hình H2 in-memory qua Spring Profile `'h2'` (`application-h2.properties`) phục vụ chạy kiểm thử tích hợp tự động nhanh chóng và độc lập. Đồng thời, hệ thống cung cấp API Seed Reset (`POST /api/seed/reset`) qua lớp `DataSeeder` để khôi phục toàn bộ dữ liệu mẫu (8 sản phẩm biên, 2 voucher, 4 đơn hàng mẫu) về trạng thái ban đầu, hỗ trợ kiểm thử lặp lại.

### 1.2. Danh mục đặc tả yêu cầu phần mềm (SRS - REQ-01 đến REQ-14)
Tài liệu SRS v1.0 của Lotus Store xác định 14 yêu cầu nghiệp vụ cốt lõi, được phân nhóm thành 3 khối chức năng:
- **Phân hệ Khách hàng (REQ-01 đến REQ-07):** REQ-01 (Hiển thị và lọc danh mục sản phẩm theo Áo, Quần, Phụ kiện); REQ-02 (Xem chi tiết sản phẩm và phản ánh trạng thái tồn kho biên: khóa nút mua khi tồn kho = 0, kiểm soát mua vượt khi tồn kho = 1); REQ-03 (Quản lý giỏ hàng: thêm, bớt, xóa, tính tạm tính và lưu LocalStorage); REQ-04 (Đặt hàng trực tuyến thanh toán COD, thu thập thông tin người nhận và tạo đơn trạng thái PENDING); REQ-05 (Áp dụng mã giảm giá: voucher UEH10 giảm 10% tối đa 50.000đ cho đơn từ 200.000đ, voucher FREESHIP giảm trực tiếp 30.000đ); REQ-06 (Khách hàng tra cứu lịch sử đơn hàng của chính mình thông qua số điện thoại đặt hàng); REQ-07 (Khách hàng tự hủy đơn hàng Chờ xác nhận và hệ thống tự động hoàn trả số lượng hàng tồn kho).
- **Phân hệ Quản trị và Tiện ích (REQ-08 đến REQ-11):** REQ-08 (Admin thêm mới/cập nhật sản phẩm, kiểm tra tính hợp lệ dữ liệu đầu vào: giá bán phải lớn hơn 0 và tồn kho không âm); REQ-09 (Quản lý vòng đời trạng thái đơn hàng: Chờ xác nhận -> Đang giao hàng -> Hoàn thành hoặc Hủy đơn có hoàn kho); REQ-10 (Bảng điều khiển Dashboard thống kê doanh thu thực tế, số lượng đơn theo trạng thái và cảnh báo tồn kho sắp hết dưới 5 sản phẩm); REQ-11 (Tiện ích khôi phục dữ liệu mẫu kiểm thử qua API Seed Reset).
- **Yêu cầu phi chức năng (REQ-12 đến REQ-14):** REQ-12 (NFR-01 - Hiệu năng phản hồi: Thời gian phản hồi API giao dịch dưới 500ms, thời gian tải trang danh mục dưới 1.5s); REQ-13 (NFR-02 - Bảo mật và quyền riêng tư: Kiểm soát nghiêm ngặt tham số đầu vào trong API tra cứu, ngăn chặn tuyệt đối tình trạng rò rỉ đơn hàng của khách hàng khác khi để trống số điện thoại hoặc nhập ký tự đặc biệt); REQ-14 (NFR-03 - Toàn vẹn giao dịch và nhất quán tồn kho: Đảm bảo giao dịch tạo và hủy đơn theo chuẩn ACID, ngăn ngừa Race Condition làm sai lệch tồn kho).

### 1.3. Bối cảnh tài liệu Test Plan hiện có (v0.1) và lý do lựa chọn Đề tài 9
Tài liệu kế hoạch kiểm thử hiện có của dự án (phiên bản v0.1) được soạn thảo sơ lược trong giai đoạn đầu lập trình bởi một thành viên nhóm. Tài liệu chỉ mới vạch ra một số mục tiêu chung và công cụ dự kiến, chưa theo quy chuẩn quốc tế, bỏ sót nhiều phân hệ cốt lõi (Voucher, Hủy đơn, Giá Admin, Bảo mật tra cứu SĐT, Báo cáo doanh thu), thiếu tiêu chí vào/ra và phân công mơ hồ ("cả nhóm cùng test vào tuần cuối").
Nhóm chọn Đề tài 9 "Đảm bảo chất lượng kế hoạch kiểm thử (Test Plan Review - TPR)" vì nhận thức rõ rằng: Test Plan là tài liệu kim chỉ nam định hướng cho toàn bộ chiến dịch kiểm thử chất lượng. Theo mô hình khuếch đại khiếm khuyết (Defect Amplification), một sai sót hoặc khoảng trống ở kế hoạch kiểm thử sẽ nhân bản thành hàng loạt ca kiểm thử thiếu sót, tạo ra vùng mù kiểm thử khiến các lỗi nghiêm trọng lọt ra môi trường thật. Do đó, Test Plan Review (TPR) là rào chắn SQA đầu tiên và quan trọng nhất để phòng ngừa rủi ro.

### 1.4. Mục tiêu và phạm vi của báo cáo SQA
Báo cáo tập trung vào phạm vi SQA (quy trình, tiêu chí, rà soát, phòng ngừa) với 5 mục tiêu cụ thể: (1) Xây dựng bộ tiêu chí đánh giá và Bảng kiểm rà soát TPR Checklist gồm 15 tiêu chí dựa trên chuẩn IEEE Std 829-2008 và ISO/IEC/IEEE 29119-3; (2) Tổ chức thực hiện quy trình rà soát hình thức Software Inspection 6 bước; (3) Đánh giá chất lượng tài liệu trên 3 trục: Tính đầy đủ, Tính nhất quán và Khả năng truy vết (qua Ma trận truy vết RTM); (4) Phân tích rủi ro và nâng cấp Test Plan thành phiên bản chuẩn hóa v1.0; (5) Đánh giá hiệu quả SQA trong việc định hướng phát hiện chính xác 4 lỗi nghiệp vụ tiềm ẩn trong mã nguồn của Lotus Store (SQA-BUG-01 đến SQA-BUG-04). Báo cáo không đi sâu vào kiểm thử chức năng chuyên sâu như một đề tài QC độc lập.

---

## 2. Cơ sở lý thuyết SQA

### 2.1. SQA, QC và chuỗi nhân quả Error – Fault/Defect – Failure
Trong kỹ nghệ phần mềm, SQA và QC luôn song hành nhưng giữ vai trò và bản chất hoàn toàn khác biệt:
- **SQA (Software Quality Assurance)** là hoạt động mang tính định hướng quy trình (Process-Oriented), chủ động (Proactive) và phòng ngừa (Preventive), tập trung xây dựng, giám sát và cải tiến quy trình phát triển nhằm ngăn chặn khiếm khuyết xuất hiện ngay từ đầu. Ngược lại, **QC (Software Quality Control)** là hoạt động định hướng sản phẩm (Product-Oriented), phản ứng (Reactive) và phát hiện (Detective), tập trung thực thi các ca kiểm thử trên phần mềm đã hình thành nhằm tìm kiếm lỗi trước khi bàn giao. Hoạt động Test Plan Review (TPR) thuộc phạm trù SQA vì đối tượng rà soát là tài liệu quy trình kiểm thử trước khi đội ngũ QC bắt đầu viết và chạy test case.
- **Chuỗi nhân quả chất lượng:** Sai sót của con người (Error) xuất phát từ nhận thức không đầy đủ hoặc áp lực tiến độ; sai sót này tạo ra khiếm khuyết (Fault/Defect) tiềm ẩn trong tài liệu hoặc mã nguồn; khi hệ thống thực thi, khiếm khuyết sẽ bộc lộ thành hỏng hóc (Failure). Trong Lotus Store, việc người soạn thảo Test Plan v0.1 bỏ sót các phân hệ kiểm thử trọng yếu là một Fault trong tài liệu. Nếu không có TPR để phát hiện sớm, Fault này sẽ che khuất các lỗi nghiệp vụ trong mã nguồn (như lỗi không giới hạn mức giảm giá tối đa hay rò rỉ đơn hàng), dẫn đến Failure nghiêm trọng khi hệ thống vận hành thực tế.

### 2.2. Vị trí của Software Review trong SDLC, Verification, Validation, Qualification
Trong vòng đời phát triển phần mềm (SDLC) theo mô hình chữ V cũng như quy trình Agile, rà soát tĩnh (Static Review) được triển khai song hành cùng từng pha phát triển nhằm thực thi nguyên lý kiểm thử sớm (Early Testing). Bốn khái niệm nền tảng bao gồm:
- **Xác minh (Verification):** Đánh giá xem sản phẩm của một giai đoạn có đáp ứng tiêu chuẩn và đặc tả đã đề ra không ("Are we building the product right?"). TPR thuộc nhóm Verification vì đối chiếu Test Plan với SRS và chuẩn IEEE 829.
- **Xác nhận (Validation):** Đánh giá xem phần mềm sau khi hoàn thành có đáp ứng đúng nhu cầu thực tế của người dùng không ("Are we building the right product?"), thường được hiện thực hóa qua kiểm thử UAT.
- **Thẩm định điều kiện (Qualification):** Kiểm chứng và xác nhận hệ thống phần mềm, cơ sở dữ liệu và môi trường thử nghiệm đạt đủ các điều kiện kỹ thuật cần thiết để đưa vào vận hành (cấu hình Spring Boot, MariaDB, Seed Data).

### 2.3. Các phương pháp Software Review
Software Review là kỹ thuật kiểm thử tĩnh không cần thực thi chương trình. Theo chuẩn IEEE 1028 và bài giảng môn học, có 4 phương pháp rà soát chính:
- **Informal Review (Desk Check / Peer Check):** Hình thức không chính thức, linh hoạt, do cá nhân tự đọc hoặc nhờ đồng nghiệp xem lướt qua, chi phí thấp nhưng hiệu quả không đồng đều.
- **Walkthrough (Duyệt tài liệu):** Do tác giả chủ trì trình bày để chia sẻ kiến thức, làm sáng tỏ logic và tiếp nhận phản hồi ban đầu từ các thành viên.
- **Technical Review:** Cuộc họp chính thức có sự tham gia của các chuyên gia kỹ thuật nhằm thẩm định tính khả thi kỹ thuật và đưa ra quyết định phê duyệt.
- **Software Inspection (Fagan Inspection):** Phương pháp rà soát chính thức, chặt chẽ nhất, tuân thủ quy trình chuẩn 6 bước, có checklist chuẩn, thu thập số liệu định lượng và phân công 5 vai trò độc lập (Moderator, Author, Reader, Recorder, Inspector).

#### Bảng 1. So sánh các phương pháp Software Review và mức độ áp dụng trong dự án
| Phương pháp | Mức độ hình thức | Người chủ trì & vai trò | Công cụ / Tiêu chí | Sản phẩm đầu ra | Áp dụng trong dự án |
|:---|:---|:---|:---|:---|:---|
| **Informal / Desk Check** | Thấp (Không chính thức) | Cá nhân tác giả hoặc đồng nghiệp | Đọc trực tiếp, không bắt buộc checklist | Ghi chú cá nhân, sửa lỗi nhanh | Inspector tự đọc tài liệu trước họp |
| **Walkthrough** | Trung bình (Bán chính thức) | Tác giả tài liệu chủ trì buổi họp | Tài liệu dự thảo, kịch bản nghiệp vụ | Biên bản góp ý, danh sách câu hỏi | Họp giới thiệu Test Plan v0.1 (11/11) |
| **Technical Review** | Cao (Chính thức) | Trưởng nhóm kỹ thuật / chuyên gia | Tiêu chuẩn kỹ thuật, đối chiếu | Biên bản thẩm định kỹ thuật | Đánh giá kiến trúc tích hợp hệ thống |
| **Software Inspection** | Rất cao (Nghiêm ngặt) | Moderator, Reader, Recorder, Inspector | Bảng kiểm Checklist chuẩn, đo lường | Biên bản Inspection, Defect Log | Phương pháp chính thực hiện TPR |

### 2.4. Bản chất và các khía cạnh cốt lõi của Test Plan Review (TPR)
Test Plan Review (TPR) là quá trình thanh tra, thẩm định có hệ thống đối với tài liệu kế hoạch kiểm thử trước khi thiết kế test case. Chất lượng của kế hoạch kiểm thử được đánh giá dựa trên 3 trục cốt lõi theo chuẩn IEEE Std 829-2008 và ISO/IEC/IEEE 29119-3:
1. **Tính đầy đủ (Completeness):** Kế hoạch phải bao quát 100% các yêu cầu SRS và chứa đủ các phần tử thiết yếu: phạm vi cần test, phạm vi ngoài test, tiêu chí vào/ra, tiêu chí đình chỉ/tiếp tục, môi trường thử nghiệm, phân công vai trò, tiến độ và quản lý rủi ro.
2. **Tính nhất quán (Consistency):** Các mục trong tài liệu không được mâu thuẫn nội tại (lịch trình phải khớp nguồn lực, tiêu chí ra phải khớp tiêu chuẩn chất lượng) và phải đồng bộ hoàn hảo với SRS, thiết kế CSDL và quy trình quản lý dự án.
3. **Khả năng truy vết (Traceability):** Mỗi yêu cầu trong SRS phải có ít nhất một mục kiểm thử tương ứng trong Test Plan và ngược lại, được quản lý chặt chẽ thông qua Ma trận truy vết yêu cầu (RTM).

---

## 3. Phương pháp SQA áp dụng
Để hoạt động đảm bảo chất lượng kế hoạch kiểm thử (Test Plan Review – TPR) của dự án Lotus Store được thực hiện một cách bài bản, khách quan và có thể kiểm chứng, nhóm vận dụng quy trình SQA khép kín gồm 8 giai đoạn nối tiếp nhau:

$$\text{Phân tích dự án} \rightarrow \text{Xác định mục tiêu} \rightarrow \text{Lập kế hoạch SQA} \rightarrow \text{Xây dựng tiêu chí \& checklist} \rightarrow \text{Thực hiện review} \rightarrow \text{Ghi nhận vấn đề} \rightarrow \text{Đề xuất cải tiến} \rightarrow \text{Đánh giá hiệu quả}$$

Quy trình này được thiết kế bám sát kiến trúc phân tầng của Lotus Store trong kho mã nguồn SQAQC, gồm: phân hệ Backend Spring Boot (`com.aurastore`) với các tầng Controller, Service, Repository, DTO và bộ kiểm thử tích hợp `AuraStoreIntegrationTest.java`; phân hệ Frontend React/TypeScript tách biệt luồng khách hàng (`components/customer/`) và luồng quản trị (`components/admin/`); phân hệ cơ sở dữ liệu (`database/schema.sql`); cùng quy chuẩn kiểm soát thay đổi tại `.github/PULL_REQUEST_TEMPLATE.md`. Toàn bộ tiêu chí và bảng kiểm (Checklist) được xây dựng dựa trên hai tiêu chuẩn quốc tế: IEEE Std 829-2008 và ISO/IEC/IEEE 29119-3.

### 3.1. Mục tiêu và tiêu chí đánh giá chất lượng Test Plan
Mục tiêu cốt lõi của hoạt động SQA ở giai đoạn này là phát hiện và loại bỏ sớm các khoảng trống nghiệp vụ, mâu thuẫn nội tại và thiếu sót về điều kiện kiểm thử trong Test Plan v0.1, trước khi đội ngũ QC bắt tay vào thiết kế ca kiểm thử chi tiết (Test Case). Sau khi được rà soát và hoàn thiện, Test Plan phiên bản v1.0 phải đồng thời thỏa mãn 06 tiêu chí định lượng (TC1 – TC6) trình bày trong Bảng 2.

#### Bảng 2. Bộ tiêu chí đánh giá chất lượng kế hoạch kiểm thử (TC1 – TC6)
| Mã | Tiêu chí | Ngưỡng đạt | Đặc tính | Phương pháp kiểm chứng trên dự án Lotus Store |
|:---|:---|:---|:---|:---|
| **TC1** | Tính đầy đủ | Có đủ 15 mục của checklist | Đầy đủ | Đối chiếu từng mục của Test Plan với 15 tiêu chí trong Bảng kiểm TPR, được chuẩn hóa theo IEEE 829 và ISO 29119-3. |
| **TC2** | Bao phủ yêu cầu | 100% yêu cầu có hạng mục kiểm thử | Truy vết | Kiểm tra Ma trận truy vết hai chiều (RTM) để bảo đảm cả 14 yêu cầu (REQ-01 đến REQ-14) đều được ánh xạ tới hạng mục kiểm thử tương ứng ở Backend (`controller/`, `service/`) và Frontend (`customer/`, `admin/`). |
| **TC3** | Tính nhất quán | 0 mâu thuẫn với SRS và trong nội bộ tài liệu | Nhất quán | Đối chiếu chéo các quy tắc nghiệp vụ (mã giảm giá, vòng đời đơn hàng, hoàn tồn kho, kiểm tra đầu vào) giữa Test Plan, SRS v1.0 và cấu trúc dữ liệu `database/schema.sql`. |
| **TC4** | Khả năng đo lường | 100% tiêu chí đạt/không đạt đo được | Kiểm chứng được | Rà soát tiêu chí Pass/Fail và Entry/Exit, yêu cầu lượng hóa bằng chỉ số cụ thể: tỷ lệ pass, ngưỡng phản hồi $\le 500$ ms và $\le 1,5$ s, 0 lỗi rò rỉ dữ liệu. |
| **TC5** | Trách nhiệm và tiến độ | Mỗi hoạt động có người phụ trách và thời hạn | Khả thi | Kiểm tra bảng phân công vai trò và lịch trình, bảo đảm mọi hạng mục kiểm thử đều gắn với nhân sự cụ thể, mốc thời gian và ước lượng công sức hợp lý. |
| **TC6** | Chất lượng sau review | 0 vấn đề Critical/Major còn mở | Hiệu quả TPR | Xác minh toàn bộ khiếm khuyết trong Issue Log (F01–F14) đã được khắc phục triệt để và được Moderator đóng trạng thái ở bước Follow-up. |

Phân loại mức độ nghiêm trọng của khiếm khuyết kế hoạch kiểm thử (Defect Severity):
- **Critical (Nghiêm trọng):** thiếu sót khiến không thể phát hiện các lỗi trọng yếu về bảo mật hoặc tính toàn vẹn dữ liệu giao dịch, hoặc bỏ sót hoàn toàn các nhóm yêu cầu cốt lõi trong SRS.
- **Major (Quan trọng):** thiếu sót ảnh hưởng trực tiếp đến tính khả thi, khả năng đo lường hoặc khả năng quản trị quá trình kiểm thử (thiếu tiêu chí Entry/Exit, thiếu môi trường hoặc dữ liệu biên, thiếu RTM hoặc lịch trình).
- **Minor (Thứ yếu):** sai lệch về định danh phiên bản, lịch sử thay đổi, thuật ngữ, cách trình bày hoặc tài liệu tham chiếu, nhưng không làm sai lệch phạm vi kỹ thuật.

### 3.2. Test Plan Review Checklist
Bảng 3 trình bày chi tiết 15 tiêu chí, đối tượng đối chiếu thực tế trong dự án Lotus Store và kết quả đánh giá hiện trạng Test Plan v0.1 trước khi cải tiến (Đ là Đạt, K là Không đạt; cột Vấn đề ghi mã khiếm khuyết F01 đến F14).

#### Bảng 3. Test Plan Review Checklist và kết quả đánh giá hiện trạng Test Plan v0.1
| # | Tiêu chí kiểm tra | Tham chiếu đối chiếu thực tế trên Lotus Store | Kết quả v0.1 | Vấn đề |
|:---:|:---|:---|:---:|:---:|
| 1 | Có định danh, phiên bản và lịch sử thay đổi nhất quán | Mã tài liệu, phiên bản v0.1 → v1.0, ngày cập nhật và người phê duyệt. | K | F11 |
| 2 | Mục tiêu kiểm thử rõ ràng, gắn với mục tiêu chất lượng | Bảo đảm độ tin cậy nghiệp vụ bán hàng trực tuyến, toàn vẹn tồn kho và trải nghiệm người dùng. | Đ | – |
| 3 | Nêu rõ phạm vi cần kiểm thử và ngoài phạm vi | Phân định rõ các phân hệ trong phạm vi (Product, Order, Voucher, Dashboard, Seed) và ngoài phạm vi (cổng thanh toán trực tuyến thực tế, vận chuyển bên thứ ba). | K | F01 |
| 4 | Hạng mục kiểm thử bao phủ 100% yêu cầu trong SRS | Bao phủ đủ REQ-01 đến REQ-11 (chức năng) và REQ-12 đến REQ-14 (phi chức năng: hiệu năng, bảo mật tra cứu, toàn vẹn ACID). | K | F01 |
| 5 | Có ma trận truy vết hai chiều yêu cầu ↔ test | Liên kết 1-1 và hai chiều giữa REQ-01–REQ-14 với các nhóm hạng mục kiểm thử tương ứng. | K | F08 |
| 6 | Chiến lược và mức kiểm thử phù hợp (unit, tích hợp, hệ thống, UAT) | Kết hợp kiểm thử tích hợp tự động ở Backend (`AuraStoreIntegrationTest.java`) với kiểm thử hệ thống đầu-cuối (E2E) trên giao diện React và UAT. | Đ | – |
| 7 | Có tiêu chí vào/ra, đình chỉ/tiếp tục kiểm thử | Quy định rõ Entry/Exit Criteria và Suspension/Resumption Criteria (ví dụ: đình chỉ khi API `POST /api/seed/reset` lỗi hoặc môi trường Backend không khởi động được). | K | F02 |
| 8 | Tiêu chí đạt/không đạt đo lường được | Định lượng rõ cho từng nhóm chức năng và NFR (ví dụ: độ trễ API $\le 500$ ms, tải danh mục $\le 1,5$ s, tính giảm giá chính xác theo `VoucherService.java`). | K | F10 |
| 9 | Mô tả môi trường và dữ liệu kiểm thử | Đặc tả đầy đủ Java 21, Spring Boot 3.4.2, MariaDB 11 (`database/schema.sql`), profile H2 (`application-h2.properties`, `application-test.properties`), Vite/React 18 và bộ dữ liệu biên từ `DataSeeder.java`. | K | F04, F06 |
| 10 | Vai trò, trách nhiệm cụ thể | Phân rõ trách nhiệm giữa Test Lead, Tester luồng Customer (`CartDrawer.tsx`, `OrderLookup.tsx`), Tester luồng Admin (`OrderManagement.tsx`, `DashboardOverview.tsx`) và Developer. | K | F07 |
| 11 | Có lịch trình và ước lượng công sức | Kế hoạch thời gian theo từng pha (thiết kế, thực thi, hồi quy), gắn với mốc bàn giao của đồ án. | K | F03 |
| 12 | Nêu công cụ kiểm thử và quản lý lỗi | Xác định rõ JUnit/Spring Boot Test (`pom.xml`), Postman, DevTools của trình duyệt và GitHub Issues/Pull Request (`.github/PULL_REQUEST_TEMPLATE.md`). | Đ | – |
| 13 | Có phân tích rủi ro của hoạt động kiểm thử | Nhận diện rủi ro dữ liệu bẩn giữa các lượt chạy, xung đột cấu hình MariaDB/H2, sai lệch đồng bộ LocalStorage (`useCart.ts`) và nêu phương án giảm thiểu. | K | F09 |
| 14 | Thuật ngữ, mức lỗi, sản phẩm bàn giao và tài liệu tham chiếu nhất quán | Đồng bộ khái niệm trạng thái đơn hàng (PENDING, SHIPPING, COMPLETED, CANCELLED theo `OrderStatus.java`), thang đo Severity/Priority và danh mục tài liệu đầu ra. | K | F05, F12–F14 |
| 15 | Ngôn ngữ rõ ràng, dễ hiểu | Văn phong mạch lạc, thuật ngữ kỹ thuật nhất quán, thuận tiện cho các thành viên đọc hiểu và thực thi. | Đ | – |

*Nhận xét sơ bộ kết quả v0.1:* Đạt 4/15 tiêu chí (26,67%), không đạt 11/15 tiêu chí (73,33%), phát sinh 14 khiếm khuyết F01–F14.

---

## 4. Quá trình áp dụng
Hoạt động Test Plan Review (TPR) được tổ chức theo mô hình Software Inspection (Fagan Inspection) chuẩn IEEE 1028, diễn ra trong 01 tuần (10/11 – 16/11).

### 4.1. Tổ chức nhân sự và phân công vai trò Inspection
Nhóm gồm 05 thành viên đảm nhiệm 06 vai trò chuyên biệt, trong đó 01 thành viên kiêm nhiệm Reader và Inspector 2 (vẫn bảo đảm tính độc lập vì không kiêm nhiệm Author):

#### Bảng 4. Phân công vai trò và phạm vi trách nhiệm trong quy trình Inspection
| Vai trò | Nhân sự | Trách nhiệm cốt lõi trong quy trình TPR | Phạm vi đối chiếu chuyên sâu trên Lotus Store |
|:---|:---|:---|:---|
| **Moderator (Điều phối viên)** | Ngô Trọng Phúc | Lập kế hoạch TPR, phân phối tài liệu, điều hành phiên họp Inspection đúng tiến độ, bảo đảm tính khách quan và xác minh việc đóng lỗi ở bước Follow-up. | Giám sát tổng thể tiêu chí TC1–TC6, quản lý chất lượng biên bản và quyết định phê duyệt bản v1.0. |
| **Author (Tác giả Test Plan)** | Nguyễn Phúc Vương | Trình bày tổng quan Test Plan v0.1 tại buổi Walkthrough; giải đáp thắc mắc về ngữ cảnh soạn thảo; tiếp nhận danh sách vấn đề F01–F14 để chỉnh sửa và nâng cấp tài liệu lên v1.0. | Toàn bộ nội dung Test Plan và việc cập nhật đồng bộ trên kho lưu trữ dự án. |
| **Reader (Người đọc)** | Hà Ngọc Thiện (kiêm Inspector 2) | Đọc to và diễn giải lại từng mục của Test Plan v0.1 theo đúng trình tự trong phiên Inspection, giúp hội đồng nhận ra các điểm mơ hồ hoặc mâu thuẫn logic. | Cấu trúc tài liệu, mục tiêu, phạm vi, chiến lược, tiêu chí Entry/Exit và lịch trình. |
| **Recorder (Thư ký)** | Triệu Nguyễn Huỳnh Khang | Ghi nhận đầy đủ, chính xác mọi khiếm khuyết mà hội đồng thống nhất vào biên bản rà soát và Danh sách vấn đề (Issue Log), kèm mã định danh (F01–F14) và mức độ nghiêm trọng. | Quản lý biên bản Walkthrough, biên bản Inspection, Issue Log và Review Report. |
| **Inspector 1 (Thẩm định viên 1)** | Nguyễn Văn Minh Triều | Rà soát độc lập bằng Checklist, tập trung vào luồng nghiệp vụ Khách hàng và API giao dịch (REQ-01 đến REQ-07, REQ-13, REQ-14). | Đối chiếu Test Plan với `ProductController.java`, `OrderController.java`, `VoucherController.java`, `OrderService.java`, `VoucherService.java`, `CartDrawer.tsx`, `OrderLookup.tsx`, `useCart.ts`. |
| **Inspector 2 (Thẩm định viên 2)** | Hà Ngọc Thiện (kiêm Reader) | Rà soát độc lập bằng Checklist, tập trung vào luồng Quản trị, môi trường/dữ liệu kiểm thử và phi chức năng (REQ-08 đến REQ-12). | Đối chiếu Test Plan với `DashboardController.java`, `DashboardService.java`, `SeedController.java`, `DataSeeder.java`, `ProductFormModal.tsx`, `OrderManagement.tsx`, `DashboardOverview.tsx`, `database/schema.sql`, `application-h2.properties`, `AuraStoreIntegrationTest.java`. |

### 4.2. Diễn biến chi tiết quy trình Inspection 6 bước
#### Bảng 5. Tiến trình thực hiện quy trình Test Plan Review (6 bước Fagan Inspection)
| Bước | Thời gian | Hoạt động trọng tâm | Công cụ / Tài liệu đầu vào | Minh chứng đầu ra |
|:---:|:---:|:---|:---|:---|
| **1. Lập kế hoạch (Planning)** | 10/11 | Chọn đối tượng rà soát (Test Plan v0.1), phân công 6 vai trò cho 5 thành viên, chốt bộ tiêu chí TC1–TC6, Checklist 15 mục và lịch họp trong 1 tuần. | SRS v1.0 (REQ-01–REQ-14), Test Plan v0.1, cấu trúc mã nguồn SQAQC. | Kế hoạch TPR (`docs/sqa/tpr-plan.md`). |
| **2. Tổng quan (Overview)** | 11/11 | Tác giả giới thiệu bối cảnh, cấu trúc Test Plan v0.1 và mối liên hệ với SRS v1.0 dưới hình thức Walkthrough (60 phút). | Test Plan v0.1, SRS v1.0, `README.md` của dự án. | Biên bản walkthrough ngày 11/11. |
| **3. Rà soát cá nhân (Preparation)** | 12/11 – 13/11 | Hai Inspector tự nghiên cứu tài liệu độc lập, đối chiếu từng mục của Test Plan v0.1 với SRS và kiến trúc hệ thống bằng Checklist 15 tiêu chí. | Checklist 15 tiêu chí, SRS v1.0, mã nguồn Backend/Frontend/DB. | Bộ Checklist đã điền, kèm ghi chú sơ bộ của từng Inspector. |
| **4. Họp Inspection (Inspection Meeting)** | 14/11 | Reader đọc từng mục; hội đồng thảo luận, hợp nhất phát hiện của các Inspector, phân loại mức độ nghiêm trọng (Critical/Major/Minor) và ghi nhận Issue Log (90 phút). | Checklist cá nhân của 2 Inspector, Test Plan v0.1. | Biên bản rà soát (Inspection Minutes), Danh sách vấn đề (F01–F14). |
| **5. Sửa lỗi (Rework)** | 15/11 | Author phân tích nguyên nhân gốc rễ của 14 vấn đề, bổ sung các phần còn thiếu (RTM, Entry/Exit, NFR, dữ liệu biên, lịch trình, rủi ro) và phát hành Test Plan v1.0. | Danh sách vấn đề (F01–F14), Biên bản Inspection. | Lịch sử commit trên Git, tài liệu Test Plan v1.0. |
| **6. Kiểm tra xác nhận (Follow-up)** | 16/11 | Moderator rà soát lại từng hạng mục sửa đổi trên bản v1.0, xác nhận 100% vấn đề Critical/Major đã đóng, tổng hợp báo cáo và tổ chức họp phê duyệt. | Test Plan v1.0, Issue Log (F01–F14), tiêu chí TC1–TC6. | Review Report, Biên bản phê duyệt Test Plan v1.0. |

---

## 5. Kết quả đánh giá (Test Plan Review Report)

### 5.1. Danh sách 14 vấn đề phát hiện (F01 – F14)
Buổi Software Inspection đối chiếu Test Plan v0.1 với SRS v1.0 và kiến trúc hệ thống Lotus Store đã phát hiện 14 vấn đề: 3 Critical, 7 Major, 4 Minor.

| Mã | Mức độ | Loại | Mô tả vấn đề |
|:---:|:---:|:---:|:---|
| **F01** | Critical | Đầy đủ / Truy vết | Mục Phạm vi bỏ sót 6/14 yêu cầu trọng yếu trong SRS (REQ-05 Voucher UEH10/FREESHIP, REQ-07 Khách hủy đơn hoàn kho, REQ-08 Validate giá bán khi Admin thêm/sửa sản phẩm, REQ-12 Hiệu năng, REQ-13 Bảo mật tra cứu SĐT, REQ-14 Toàn vẹn giao dịch ACID); không nêu rõ hạng mục ngoài phạm vi (cổng thanh toán trực tuyến, đăng nhập tài khoản khách hàng). |
| **F02** | Critical | Đầy đủ | Thiếu hoàn toàn tiêu chí vào/ra (Entry/Exit Criteria) và tiêu chí đình chỉ/tiếp tục kiểm thử (Suspension/Resumption Criteria). |
| **F03** | Critical | Đầy đủ | Không có lịch trình kiểm thử và ước lượng công sức chi tiết; chỉ ghi chung chung "thực hiện kiểm thử vào tuần cuối". |
| **F04** | Major | Nhất quán | Môi trường kiểm thử chưa đồng bộ với kiến trúc dự án: chỉ nêu kiểm thử thủ công trên 1 trình duyệt Chrome, bỏ qua yêu cầu kiểm thử đa trình duyệt và chưa đề cập cấu hình chạy song song MariaDB 11 / H2 in-memory (`profile=h2`). |
| **F05** | Major | Nhất quán | Thuật ngữ chưa thống nhất giữa tài liệu và mã nguồn (ví dụ: trạng thái hoàn thành lúc ghi DELIVERED trong SRS nhưng mã nguồn OrderStatus dùng COMPLETED; tài liệu còn lẫn tên dự án cũ); Test Plan định nghĩa 3 mức độ lỗi trong khi quy trình quản lý lỗi dùng 4 mức. |
| **F06** | Major | Đầy đủ | Không mô tả cấu hình môi trường (Java 21, Spring Boot 3.4.2, React 18/Vite, MariaDB 11/H2) và bỏ sót kế hoạch chuẩn bị dữ liệu mẫu kiểm thử (DataSeeder, API `POST /api/seed/reset`, các giá trị tồn kho biên 0/1/3/20, voucher UEH10/FREESHIP và 4 đơn hàng mẫu ORD-1001 đến ORD-1004). |
| **F07** | Major | Đầy đủ | Phân công trách nhiệm mơ hồ ("cả nhóm cùng test"), không chỉ định người phụ trách từng phân hệ (Khách hàng, Quản trị, API/Integration, NFR). |
| **F08** | Major | Truy vết | Các hạng mục kiểm thử trong v0.1 không gắn mã yêu cầu (REQ-01 đến REQ-14), chưa có Ma trận truy vết yêu cầu (RTM). |
| **F09** | Major | Đầy đủ | Thiếu phân tích rủi ro của hoạt động kiểm thử (đặc biệt là rủi ro lọt lỗi tính giảm giá, sai lệch tồn kho khi hủy đơn và rò rỉ dữ liệu khách hàng). |
| **F10** | Major | Đo lường | Yêu cầu hiệu năng chỉ mô tả định tính ("hệ thống phản hồi nhanh"), chưa định lượng theo REQ-12 (API giao dịch $\le 500$ms; tải danh mục phía khách $\le 1,5$ giây) nên không thể xác định đạt/không đạt. |
| **F11** | Minor | Nhất quán | Số phiên bản và ngày cập nhật ở phần tiêu đề không khớp với bảng lịch sử thay đổi. |
| **F12** | Minor | Đầy đủ | Thiếu danh sách sản phẩm bàn giao (Test Deliverables) như Test Plan v1.0, RTM, bộ Test Case, báo cáo Integration Test (`mvnw test`) và Bug Report. |
| **F13** | Minor | Đầy đủ | Thiếu mục tài liệu tham chiếu (SRS v1.0, lược đồ CSDL `database/schema.sql`, kho mã nguồn [https://github.com/rtmiue20/SQAQC.git](https://github.com/rtmiue20/SQAQC.git)). |
| **F14** | Minor | Trình bày | Đánh số đề mục và định dạng bảng biểu trong tài liệu chưa liên tục. |

### 5.2. Đánh giá tính đầy đủ, tính nhất quán và khả năng truy vết
- **Tính đầy đủ:** Chỉ 4/15 tiêu chí trong checklist đạt yêu cầu (27%). Các khoảng trống lớn nhất tập trung ở quản trị kiểm thử (tiêu chí vào/ra, môi trường, dữ liệu mẫu, lịch trình, rủi ro) và bỏ sót tới 6/14 yêu cầu trong SRS — bao gồm toàn bộ 3 yêu cầu phi chức năng (REQ-12, REQ-13, REQ-14).
- **Tính nhất quán:** Tồn tại 3 nhóm mâu thuẫn (F04, F05, F11) giữa Test Plan v0.1 với SRS và mã nguồn thực tế.
- **Khả năng truy vết:** Trước rà soát, chỉ 8/14 yêu cầu (57%) được nhắc tới nhưng không gắn mã REQ. RTM sau rà soát đã bao phủ 100% (14/14).

#### Ma trận truy vết yêu cầu ↔ hạng mục kiểm thử (RTM)
| Mã REQ | Nội dung yêu cầu (SRS v1.0) | Trước TPR (v0.1) | Sau TPR (v1.0) |
|:---|:---|:---:|:---|
| **REQ-01** | Quản lý danh mục, lọc (Áo/Quần/Phụ kiện), tìm kiếm sản phẩm | Có (chưa gắn mã) | TP-01 → TC-001..008 |
| **REQ-02** | Xem chi tiết sản phẩm & tồn kho biên (stock = 0, stock = 1) | Có (chưa gắn mã) | TP-02 → TC-009..014 |
| **REQ-03** | Quản lý giỏ hàng & đồng bộ localStorage (`lotus_store_cart_v1`) | Có (chưa gắn mã) | TP-03 → TC-015..022 |
| **REQ-04** | Đặt hàng trực tuyến COD & kiểm tra SĐT (9–12 chữ số) | Có (chưa gắn mã) | TP-04 → TC-023..030 |
| **REQ-05** | Áp dụng mã giảm giá (UEH10 giảm 10% tối đa 50.000đ, FREESHIP 30.000đ) | **Thiếu** | TP-05 → TC-031..038 |
| **REQ-06** | Khách hàng tra cứu lịch sử đơn hàng theo SĐT | Có (chưa gắn mã) | TP-06 → TC-039..043 |
| **REQ-07** | Khách hàng hủy đơn PENDING & tự động hoàn trả tồn kho | **Thiếu** | TP-07 → TC-044..048 |
| **REQ-08** | Admin thêm/sửa sản phẩm & validate (price > 0, stock $\ge$ 0) | **Thiếu** | TP-08 → TC-049..056 |
| **REQ-09** | Admin quản lý vòng đời trạng thái đơn & hoàn kho khi Admin hủy | Có (chưa gắn mã) | TP-09 → TC-057..064 |
| **REQ-10** | Dashboard doanh thu thực tế & cảnh báo tồn kho thấp (< 5) | Có (chưa gắn mã) | TP-10 → TC-065..070 |
| **REQ-11** | Tiện ích khôi phục dữ liệu mẫu (`POST /api/seed/reset`) | Có (chưa gắn mã) | TP-11 → TC-071..074 |
| **REQ-12** | NFR-01: Hiệu năng (API $\le$ 500ms; tải danh mục $\le$ 1,5 giây) | **Thiếu** | TP-12 → TC-NFR-01..04 |
| **REQ-13** | NFR-02: Bảo mật tra cứu đơn hàng (chặn SĐT rỗng/ký tự đặc biệt) | **Thiếu** | TP-13 → TC-NFR-05..08 |
| **REQ-14** | NFR-03: Toàn vẹn giao dịch ACID & nhất quán tồn kho | **Thiếu** | TP-14 → TC-NFR-09..12 |

### 5.3. Phân tích rủi ro khi kế hoạch kiểm thử chưa phù hợp
| ID | Rủi ro | P (1-5) | I (1-5) | Điểm (P×I) | Hệ quả và biện pháp kiểm soát |
|:---:|:---|:---:|:---:|:---:|:---|
| **R1** | Bỏ sót kiểm thử nghiệp vụ tiền tệ, tồn kho và bảo mật (REQ-05, 07, 08, 13) | 5 | 5 | **25** | Lọt lỗi tính sai mức giảm giá UEH10, lưu sản phẩm giá âm, mất tồn kho khi khách hủy đơn và rò rỉ toàn bộ đơn hàng khách hàng khác. Biện pháp: Bổ sung đủ 14/14 yêu cầu và lập RTM (F01, F08). |
| **R2** | Không có tiêu chí vào/ra và tiêu chí đình chỉ | 4 | 4 | **16** | Không xác định được thời điểm kết thúc kiểm thử hoặc kiểm thử trên bản build chưa ổn định gây lãng phí công sức. Biện pháp: Định nghĩa rõ Entry/Exit/Suspension Criteria (F02). |
| **R3** | Không rõ người chịu trách nhiệm từng phân hệ | 4 | 4 | **16** | Trùng lặp hoặc bỏ sót ca kiểm thử giữa phần Customer, Admin và API. Biện pháp: Phân công rõ vai trò và đầu mục phụ trách (F07). |
| **R4** | Thiếu chuẩn hóa môi trường và dữ liệu mẫu biên | 4 | 3 | **12** | Dữ liệu kiểm thử bị biến đổi giữa các lần chạy, không tái hiện được các ca biên tồn kho (0, 1, 3) hoặc voucher trên 500.000đ. Biện pháp: Chuẩn hóa môi trường MariaDB/H2 và quy định gọi `POST /api/seed/reset` trước mỗi đợt test (F04, F06). |
| **R5** | Dồn toàn bộ kiểm thử vào tuần cuối | 4 | 3 | **12** | Khi phát hiện lỗi nghiêm trọng (Critical/Major) không còn đủ thời gian cho đội phát triển sửa và chạy kiểm thử hồi quy. Biện pháp: Lập lịch kiểm thử song song theo từng đợt/sprint (F03). |

---

## 6. Đề xuất cải tiến

### 6.1. Test Plan cải tiến (v1.0)
| Hạng mục | Trước TPR (v0.1) | Sau TPR (v1.0) |
|:---|:---|:---|
| **Phạm vi & Truy vết** | 8/14 yêu cầu, chưa gắn mã REQ, thiếu mục ngoài phạm vi | Bao phủ 14/14 yêu cầu kèm RTM hai chiều (REQ ↔ TP ↔ TC); nêu rõ phạm vi ngoài kiểm thử (thanh toán online, xác thực tài khoản khách hàng). |
| **Tiêu chí vào/ra & đình chỉ** | Không có | Vào: Build backend/frontend chạy ổn định, `mvnw test` biên dịch thành công, Test Case đã được review. Ra: 100% TC mức Critical/High đạt, $\ge 95\%$ tổng TC đạt, 0 lỗi Critical/Major chưa xử lý. Đình chỉ: API chính lỗi hoặc chặn > 30% bộ Test Case. |
| **Tiêu chí đo lường NFR** | "Hệ thống phản hồi nhanh" | API giao dịch (tạo đơn, tra cứu, áp voucher) $\le 500$ms; tải danh mục phía khách $\le 1,5$ giây; 0 trường hợp rò rỉ dữ liệu đơn hàng khi SĐT rỗng/ký tự đặc biệt; 100% giao dịch hủy đơn đồng bộ tồn kho. |
| **Môi trường & Dữ liệu mẫu** | Chỉ ghi sơ sài "Chrome" | Backend Java 21 / Spring Boot 3.4.2 (port 8080), Frontend React 18 / TypeScript / Vite (port 5173), MariaDB 11 & H2 in-memory (`profile=h2`), trình duyệt Chrome/Edge/Firefox. Bắt buộc reset dữ liệu mẫu qua `POST /api/seed/reset` (8 sản phẩm biên 0/1/3/20, 2 voucher UEH10/FREESHIP, 4 đơn ORD-1001–ORD-1004). |
| **Vai trò & Lịch trình** | "Cả nhóm cùng test", tuần cuối | Phân công cụ thể theo từng vai trò (Test Lead, Tester phân hệ Customer/Admin, Dev hỗ trợ Integration Test) kèm lịch trình và ước lượng giờ công. |
| **Quản lý rủi ro** | Không có | Bổ sung bảng phân tích rủi ro R1–R5 kèm phương án dự phòng và ngưỡng kích hoạt. |
| **Thuật ngữ & Bàn giao** | Lệch tên trạng thái, 3 mức lỗi, thiếu bàn giao | Thống nhất thuật ngữ với mã nguồn (PENDING, SHIPPING, COMPLETED, CANCELLED), chuẩn hóa 4 mức lỗi (Critical, Major, Minor, Trivial), bổ sung danh mục bàn giao và tài liệu tham chiếu. |

### 6.2. Cải tiến quy trình lập kế hoạch kiểm thử
1. **Chuẩn hóa biểu mẫu theo IEEE 829 / ISO 29119-3:** Mọi dự án mới bắt buộc sử dụng mẫu Test Plan chuẩn có sẵn các mục tiêu chí vào/ra, môi trường, dữ liệu biên và quản lý rủi ro.
2. **Bắt buộc lập RTM ngay từ bước lập kế hoạch:** Không phê duyệt Test Plan nếu tỷ lệ bao phủ yêu cầu dưới 100% hoặc chưa có liên kết hai chiều với SRS.
3. **Thiết lập cổng kiểm soát chất lượng (Quality Gate):** Mọi Test Plan phải qua bước đọc chéo (Peer Check) và buổi Inspection bằng Checklist; chỉ được phép triển khai viết Test Case khi còn 0 vấn đề Critical/Major.
4. **Định lượng sớm yêu cầu phi chức năng (NFR):** Các tiêu chí hiệu năng, bảo mật và toàn vẹn dữ liệu phải có ngưỡng số cụ thể từ giai đoạn SRS để Test Plan chuyển hóa trực tiếp thành tiêu chí đạt/không đạt.
5. **Quản lý phiên bản đồng bộ với mã nguồn:** Lưu trữ Test Plan và các biên bản rà soát trong kho Git cùng mã nguồn, thống nhất thuật ngữ (`OrderStatus`, mã API) với đội phát triển ngay khi có thay đổi.

### 6.3. Đánh giá hiệu quả SQA và minh chứng phòng ngừa sai sót thực tế
#### a) Chỉ số cải thiện chất lượng tài liệu Test Plan:
| Chỉ số | Trước TPR (v0.1) | Sau TPR (v1.0) | Mức cải thiện |
|:---|:---:|:---:|:---:|
| Tỷ lệ bao phủ yêu cầu SRS | 57% (8/14) | 100% (14/14) | **+43 điểm %** |
| Tiêu chí Checklist đạt | 27% (4/15) | 100% (15/15) | **+73 điểm %** |
| Vấn đề Critical / Major còn mở | 10 (3 Critical, 7 Major) | 0 | **-10 vấn đề** |
| Yêu cầu phi chức năng có ngưỡng đo | 0/3 | 3/3 | **+3 yêu cầu** |
| Hoạt động kiểm thử có phân công rõ | 0% | 100% | **+100 điểm %** |

#### b) Minh chứng hiệu quả: Định hướng phát hiện chính xác 4 lỗi nghiệp vụ tiềm ẩn
Với khoảng 14 giờ công rà soát (5 thành viên), hoạt động TPR đã khắc phục sớm 14 khiếm khuyết tài liệu trước khi bước vào giai đoạn thực thi kiểm thử. Quan trọng hơn, việc bổ sung đúng các yêu cầu bị bỏ sót (F01) và chuẩn hóa dữ liệu biên (F06) trong Test Plan v1.0 đã trực tiếp định hướng thiết kế các ca kiểm thử phát hiện chính xác 4 lỗi nghiệp vụ nghiêm trọng đang tồn tại trong mã nguồn bản phát hành Beta của Lotus Store:

| Mã lỗi | Yêu cầu liên quan (bổ sung nhờ TPR) | Vị trí mã nguồn | Bản chất lỗi phát hiện khi thực thi theo Test Plan v1.0 |
|:---:|:---|:---|:---|
| **SQA-BUG-01** | REQ-08 (Validate tạo sản phẩm) | `ProductService.java` (`createProduct`) | Bỏ qua kiểm tra `price > 0` khi Admin thêm sản phẩm mới, cho phép lưu sản phẩm có giá bán bằng 0 hoặc số âm (VD: -50.000đ). |
| **SQA-BUG-02** | REQ-05 (Giới hạn trần Voucher UEH10) | `VoucherService.java` (`calculateDiscount`) | Khi tổng tạm tính > 500.000đ, hệ thống bỏ qua bước chặn trần theo `voucher.getMaxDiscount()` (50.000đ), trừ thẳng 10% tổng đơn (VD: đơn 1.000.000đ bị giảm 100.000đ thay vì 50.000đ). |
| **SQA-BUG-03** | REQ-07, REQ-14 (Khách hủy đơn & toàn vẹn tồn kho) | `OrderService.java` (`cancelOrderByCustomer`) | Khi khách hàng tự hủy đơn PENDING qua `POST /api/orders/{id}/customer-cancel`, hệ thống chỉ đổi trạng thái sang CANCELLED mà không cộng hoàn trả tồn kho sản phẩm (trong khi luồng Admin hủy đơn vẫn hoàn kho bình thường). |
| **SQA-BUG-04** | REQ-06, REQ-13 (Bảo mật tra cứu đơn hàng) | `OrderService.java` (`lookupByPhone`) & `OrderController.java` | Khi gọi `GET /api/orders/lookup` với SĐT để trống hoặc chứa ký tự đặc biệt (VD: `@#$%`, `@@@`), hệ thống trả về toàn bộ danh sách đơn hàng của mọi khách hàng (`findAllByOrderByCreatedAtDesc`) thay vì từ chối/báo lỗi. |

---

## 7. Vai trò của TPR trong phòng ngừa sai sót
TPR (Test Plan Review) đóng vai trò quan trọng trong việc phòng ngừa sai sót ngay từ giai đoạn lập kế hoạch kiểm thử. Thông qua việc rà soát Test Plan bằng checklist, nhóm có thể phát hiện sớm những thiếu sót như phạm vi kiểm thử chưa đầy đủ, thiếu tiêu chí vào/ra, chưa phân công trách nhiệm rõ ràng và chưa có kế hoạch quản lý rủi ro.

Việc phát hiện và sửa các vấn đề này trước khi viết Test Case giúp hạn chế tình trạng bỏ sót yêu cầu, kiểm thử không đúng hướng hoặc phát sinh lỗi trong các giai đoạn tiếp theo. Đồng thời, TPR giúp các thành viên thống nhất cách hiểu về yêu cầu, xác định trách nhiệm cụ thể và bảo đảm khả năng truy vết giữa yêu cầu với các hạng mục kiểm thử.

Qua quá trình rà soát, nhóm có thể cải thiện chất lượng tài liệu Test Plan, giảm chi phí sửa chữa sai sót và hạn chế rủi ro khi triển khai kiểm thử thực tế. Tuy nhiên, TPR chỉ giúp phát hiện vấn đề trong tài liệu và quy trình lập kế hoạch, không thể thay thế việc thực hiện kiểm thử phần mềm. Hiệu quả của TPR còn phụ thuộc vào chất lượng checklist và khả năng đánh giá của những người tham gia rà soát.

---

## 8. Kết luận
Qua bài thực hiện, nhóm đã tìm hiểu và áp dụng phương pháp Software Quality Assurance (SQA) thông qua hoạt động Test Plan Review (TPR). Nhóm đã xây dựng các tiêu chí đánh giá, checklist rà soát, tiến hành Inspection để phát hiện vấn đề, phân tích rủi ro và đề xuất cải tiến Test Plan.

Kết quả rà soát cho thấy việc sử dụng checklist và thực hiện TPR giúp phát hiện những thiếu sót trong tài liệu, cải thiện phạm vi kiểm thử, khả năng truy vết yêu cầu và việc phân công trách nhiệm. Sau khi cải tiến, Test Plan có cơ sở rõ ràng hơn để triển khai hoạt động kiểm thử. Qua đó, nhóm nhận thấy việc rà soát tài liệu từ sớm có ý nghĩa quan trọng trong việc nâng cao chất lượng phần mềm, hạn chế sai sót và giảm chi phí sửa lỗi ở các giai đoạn sau.

---

## Phụ lục A. Bảng phân công và mức độ đóng góp
| STT | Thành viên | Nhiệm vụ | Đóng góp (%) |
|:---:|:---|:---|:---:|
| 1 | **Ngô Trọng Phúc** (Moderator) | Lập kế hoạch TPR, điều phối họp, xác nhận đóng vấn đề | 100% |
| 2 | **Nguyễn Phúc Vương** (Author) | Soạn Test Plan v0.1, sửa thành v1.0 | 100% |
| 3 | **Hà Ngọc Thiện** (Reader) | Xây dựng checklist, đọc tài liệu trong buổi Inspection | 100% |
| 4 | **Triệu Nguyễn Huỳnh Khang** (Recorder) | Ghi biên bản, danh sách vấn đề, Review Report | 100% |
| 5 | **Nguyễn Văn Minh Triều** (Inspector) | Ma trận truy vết, phân tích rủi ro, đo hiệu quả, viết báo cáo | 100% |

---

## Phụ lục B. Danh mục minh chứng SQA
| Minh chứng | Nội dung | Vị trí trong kho mã nguồn |
|:---|:---|:---|
| **Kế hoạch TPR** | Mục tiêu, vai trò, lịch rà soát | [`docs/sqa/tpr-plan.md`](sqa/tpr-plan.md) |
| **Test Plan v0.1 và v1.0** | Bản trước và sau cải tiến | [`docs/test-plan/`](test-plan/) |
| **TPR Checklist đã điền** | Checklist từng inspector | [`docs/sqa/checklists/`](sqa/checklists/) |
| **Biên bản rà soát** | Biên bản walkthrough, Inspection, phê duyệt | [`docs/sqa/minutes/`](sqa/minutes/) |
| **Danh sách vấn đề** | F01–F14 kèm trạng thái đóng | [`docs/sqa/issues/issue-log.md`](sqa/issues/issue-log.md) |
| **Ma trận truy vết** | REQ ↔ hạng mục kiểm thử | [`docs/test-plan/rtm.md`](test-plan/rtm.md) |

---

## Phụ lục C. Biên bản rà soát (mẫu)
| Mục | Nội dung |
|:---|:---|
| **Tài liệu rà soát** | Test Plan Lotus Store v1.0, đối chiếu SRS v1.0 |
| **Hình thức** | Inspection, họp trực tuyến 90 phút, ngày 14/11/2026 |
| **Người tham gia** | Moderator, Author, Reader, Recorder, 2 Inspector (đủ thành phần) |
| **Thời gian chuẩn bị** | Mỗi inspector khoảng 2 giờ rà soát cá nhân |
| **Kết quả** | 14 vấn đề (3 Critical, 7 Major, 4 Minor); quyết định: không phê duyệt, sửa và rà soát lại |
| **Hành động** | Author sửa toàn bộ F01–F14 trong 1 ngày; Moderator kiểm tra việc đóng vấn đề |
| **Họp phê duyệt lại** | Test Plan v1.0 được phê duyệt ngày 16/11/2026, 0 vấn đề Critical/Major còn mở |

---

## Phụ lục D. Tài liệu tham khảo
1. Bài giảng Software Quality Assurance & Quality Control Overview, UEH, 2026.
2. IEEE Std 829-2008, *IEEE Standard for Software and System Test Documentation*.
3. ISO/IEC/IEEE 29119-3:2013, *Software and systems engineering — Software testing — Part 3: Test documentation*.
4. IEEE Std 1028-2008, *IEEE Standard for Software Reviews and Audits*.
5. ISO/IEC 9126 / ISO/IEC 25010, *Software engineering — Software product Quality Requirements and Evaluation (SQuaRE)*.
