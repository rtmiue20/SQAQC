# CƠ SỞ LÝ THUYẾT ĐẢM BẢO CHẤT LƯỢNG PHẦN MỀM (SQA)
## CHUYÊN ĐỀ: TEST PLAN REVIEW (TPR) THEO CHUẨN IEEE 829 & ISO 29119-3

**Đơn vị:** Trường Đại học Kinh tế TP. Hồ Chí Minh (UEH) – Khoa Công nghệ Thông tin Kinh doanh  
**Học phần:** Đảm bảo và kiểm soát chất lượng phần mềm (SQA/QC)  
**Nhóm thực hiện:** Nhóm 9 – Lotus Store  

---

## 1. SQA, QC và Chuỗi nhân quả chất lượng phần mềm

### 1.1. Bản chất và sự phân định giữa SQA và QC
Trong kỹ nghệ phần mềm hiện đại, việc phân định rõ ranh giới và mối tương quan giữa SQA (Software Quality Assurance) và QC (Software Quality Control) là yêu cầu tối quan trọng để xây dựng chiến lược quản lý chất lượng hiệu quả:

| Tiêu chí | SQA (Software Quality Assurance) | QC (Software Quality Control) |
|:---|:---|:---|
| **Bản chất** | Định hướng quy trình (Process-Oriented) | Định hướng sản phẩm (Product-Oriented) |
| **Tính chất hành động** | Chủ động (Proactive) và Phòng ngừa (Preventive) | Phản ứng (Reactive) và Phát hiện (Detective) |
| **Mục tiêu cốt lõi** | Ngăn ngừa khiếm khuyết xuất hiện trong toàn bộ quy trình phát triển | Tìm kiếm và phát hiện các khiếm khuyết còn sót lại trong bản build phần mềm |
| **Đối tượng tác động** | Kế hoạch, quy chuẩn, tài liệu quy trình, tiêu chí nghiệm thu, bảng kiểm | Mã nguồn thực thi, giao diện đồ họa, các API, cơ sở dữ liệu |
| **Phương pháp chính** | Review, Inspection, Audit, Phân tích quy trình, Chuẩn hóa biểu mẫu | Dynamic Testing (Unit Test, Integration Test, System Test, UAT) |
| **Thời điểm triển khai** | Xuyên suốt toàn bộ SDLC, bắt đầu ngay từ pha phân tích yêu cầu | Bắt đầu khi đã có các thành phần mã nguồn hoặc phần mềm chạy được |

> [!NOTE]
> Hoạt động **Test Plan Review (TPR)** thuộc phạm trù **SQA**, bởi vì đối tượng của hoạt động này là kế hoạch và quy trình kiểm thử trước khi bước vào giai đoạn thực thi. Nếu kế hoạch kiểm thử có chất lượng kém, mọi nỗ lực QC sau đó sẽ bị chệch hướng và để lọt lỗi.

### 1.2. Chuỗi nhân quả Error – Fault/Defect – Failure
Mô hình chuẩn IEEE xác định chuỗi chuyển hóa sai lệch chất lượng phần mềm qua 3 cấp độ:

```
+-------------------+       +-----------------------+       +---------------------+
|       ERROR       |  ==>  |     FAULT / DEFECT    |  ==>  |       FAILURE       |
| (Sai sót con người) |       | (Khiếm khuyết tài liệu/ |       | (Hỏng hóc vận hành  |
|                   |       |      mã nguồn)        |       |    thực tế hệ thống) |
+-------------------+       +-----------------------+       +---------------------+
  - BA hiểu sai SRS           - Test Plan bỏ sót REQ          - Khách bị trừ sai tiền
  - Dev áp lực tiến độ        - Code thiếu validate           - Tồn kho bị sai lệch
  - Tester chủ quan           - Thiết kế thiếu ràng buộc      - Rò rỉ thông tin cá nhân
```

- **Error (Mistake):** Hành vi sai lầm của con người do thiếu hiểu biết, nhầm lẫn logic, thông tin không đầy đủ hoặc áp lực công việc.
- **Fault (Defect / Bug):** Hậu quả tĩnh của Error, tồn tại dưới dạng khiếm khuyết trong tài liệu đặc tả, tài liệu thiết kế, kế hoạch kiểm thử hoặc trong các dòng mã nguồn.
- **Failure:** Hiện tượng động khi phần mềm được thực thi và có hành vi sai lệch so với mong đợi của người dùng hoặc đặc tả yêu cầu.

---

## 2. Vị trí của Software Review trong SDLC

### 2.1. Mô hình chữ V và nguyên lý Kiểm thử sớm (Early Testing)
Nguyên lý kiểm thử sớm (Shift-Left Testing) chỉ ra rằng chi phí để phát hiện và sửa chữa một lỗi tăng theo cấp số nhân qua từng giai đoạn phát triển:

$$\text{Chi phí sửa lỗi tại SRS} \times 1 \longrightarrow \text{Thiết kế} \times 5 \longrightarrow \text{Coding} \times 10 \longrightarrow \text{Kiểm thử} \times 20 \longrightarrow \text{Production} \times 100+$$

Software Review cho phép thẩm định các sản phẩm trung gian (Work Products) như SRS, Architecture Design, Test Plan ngay ở các pha đầu của SDLC, trước khi phát sinh chi phí lập trình và kiểm thử động đắt đỏ.

### 2.2. Phân biệt Verification, Validation và Qualification
1. **Verification (Xác minh):** Kiểm tra xem sản phẩm của một pha có tuân thủ đúng yêu cầu và điều kiện đã được đặt ra ở đầu pha đó hay không (*"Are we building the product right?"*). TPR là một hoạt động Verification đối chiếu Test Plan với SRS và tiêu chuẩn IEEE 829.
2. **Validation (Xác nhận):** Đánh giá xem sản phẩm hoàn chỉnh cuối cùng có đáp ứng đúng mục đích sử dụng và mong đợi thực tế của khách hàng hay không (*"Are we building the right product?"*). Được thực hiện qua UAT.
3. **Qualification (Thẩm định điều kiện):** Xác nhận hệ thống và môi trường hạ tầng đáp ứng đầy đủ tiêu chuẩn kỹ thuật để vận hành an toàn.

---

## 3. Các phương pháp Software Review theo IEEE Std 1028

IEEE Std 1028-2008 định nghĩa 4 phương pháp rà soát phần mềm chính:

```
        Mức độ hình thức & tính chặt chẽ tăng dần
------------------------------------------------------------------->
[Informal Review]  -->  [Walkthrough]  -->  [Technical Review]  -->  [Software Inspection]
(Desk check nhanh)     (Tác giả duyệt)     (Hội đồng chuyên gia)     (Fagan Inspection 6 bước)
```

1. **Informal Review (Desk Check / Peer Review):** Đọc chéo không chính thức, không bắt buộc checklist hay biên bản, chi phí tối thiểu.
2. **Walkthrough:** Phiên họp do chính tác giả (Author) chủ trì để giải thích nội dung, lắng nghe ý kiến phản hồi và thống nhất cách hiểu.
3. **Technical Review:** Cuộc họp thẩm định chính thức của hội đồng kỹ thuật để đánh giá sự phù hợp của giải pháp công nghệ.
4. **Software Inspection (Fagan Inspection):** Phương pháp rà soát chính thức, chặt chẽ nhất, bao gồm 6 bước chuẩn:
   - **Bước 1 - Lập kế hoạch (Planning):** Xác định mục tiêu, tiêu chí vào/ra, vai trò và phân phối tài liệu.
   - **Bước 2 - Tổng quan (Overview):** Tác giả giới thiệu bối cảnh tài liệu qua Walkthrough ngắn.
   - **Bước 3 - Rà soát cá nhân (Preparation):** Các Inspector tự nghiên cứu độc lập bằng Checklist chuyên dụng.
   - **Bước 4 - Họp Inspection (Inspection Meeting):** Reader đọc từng phần, hội đồng thảo luận, ghi nhận và phân loại khiếm khuyết vào Issue Log.
   - **Bước 5 - Sửa lỗi (Rework):** Author khắc phục toàn bộ các khiếm khuyết được thống nhất.
   - **Bước 6 - Kiểm tra xác nhận (Follow-up):** Moderator kiểm tra việc đóng lỗi và phê duyệt tài liệu.

---

## 4. Ba trục cốt lõi của Test Plan Review (TPR)

Theo IEEE Std 829-2008 và ISO/IEC/IEEE 29119-3, chất lượng tài liệu Test Plan được thẩm định qua 3 trục:

### 4.1. Tính đầy đủ (Completeness)
Một Test Plan được coi là đầy đủ khi có đủ 15 thành phần cốt lõi:
1. Định danh tài liệu và lịch sử phiên bản.
2. Mục tiêu kiểm thử gắn với mục tiêu chất lượng.
3. Phạm vi kiểm thử (In-scope và Out-of-scope).
4. Bao phủ 100% các yêu cầu nghiệp vụ trong SRS.
5. Ma trận truy vết hai chiều (RTM).
6. Chiến lược kiểm thử và các cấp độ kiểm thử phù hợp.
7. Tiêu chí vào/ra (Entry/Exit Criteria) và đình chỉ/tiếp tục.
8. Tiêu chí đạt/không đạt (Pass/Fail Criteria) đo lường được.
9. Đặc tả môi trường thử nghiệm và cấu hình cơ sở dữ liệu.
10. Kế hoạch chuẩn bị dữ liệu kiểm thử (Test Data).
11. Phân công vai trò và trách nhiệm rõ ràng.
12. Lịch trình kiểm thử chi tiết và ước lượng công sức.
13. Công cụ kiểm thử và quy trình quản lý lỗi.
14. Kế hoạch quản trị rủi ro kiểm thử.
15. Danh mục sản phẩm bàn giao (Deliverables) và tài liệu tham chiếu.

### 4.2. Tính nhất quán (Consistency)
- **Nhất quán nội tại:** Lịch trình phải tương xứng với số lượng nhân sự; tiêu chí kết thúc kiểm thử phải tương thích với yêu cầu chất lượng.
- **Nhất quán với hệ thống:** Trạng thái đơn hàng, cấu trúc bảng dữ liệu, tên hàm API phải đồng bộ tuyệt đối với mã nguồn (VD: `OrderStatus.java` quy định `PENDING, SHIPPING, COMPLETED, CANCELLED`).

### 4.3. Khả năng truy vết (Traceability)
Khả năng truy vết đảm bảo mối liên kết chặt chẽ hai chiều giữa Yêu cầu (SRS) và Kế hoạch kiểm thử (Test Plan):

$$\text{Yêu cầu SRS (REQ-xx)} \iff \text{Hạng mục kiểm thử (TP-xx)} \iff \text{Ca kiểm thử (TC-xxx)}$$

- **Truy vết thuận:** Đảm bảo không bỏ sót yêu cầu nào của khách hàng (No coverage gaps).
- **Truy vết nghịch:** Đảm bảo mọi ca kiểm thử đều có lý do tồn tại chính đáng, phục vụ đúng yêu cầu nghiệp vụ (No gold plating).
