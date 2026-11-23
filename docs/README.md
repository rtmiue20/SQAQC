# DANH MỤC HỒ SƠ VÀ TÀI LIỆU MINH CHỨNG SQA (LOTUS STORE)

**Học phần:** Đảm bảo và kiểm soát chất lượng phần mềm (SQA/QC) – UEH  
**Đề tài:** Nhóm 9 – Dự án: Lotus Store (Hệ thống Thương mại điện tử Bán hàng trực tuyến)  
**Kho lưu trữ mã nguồn:** [https://github.com/rtmiue20/SQAQC.git](https://github.com/rtmiue20/SQAQC.git)  

---

## 1. Cấu trúc Thư mục Tài liệu `docs/`

```
docs/
├── README.md                           # Trang điều hướng tổng quan hồ sơ minh chứng
├── bao-cao-sqa-phan-1-2.md             # BÁO CÁO SQA: PHẦN 1 (GIỚI THIỆU) & PHẦN 2 (CƠ SỞ LÝ THUYẾT)
├── bao-cao-sqa-toan-van.md             # BÁO CÁO SQA TOÀN VĂN (Mục 1 đến Mục 8 + Phụ lục A-D)
│
├── srs/                                # ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)
│   └── srs-v1.0.md                     # Đặc tả chi tiết 14 yêu cầu (REQ-01 -> REQ-14)
│
├── architecture/                       # KIẾN TRÚC HỆ THỐNG
│   └── system-architecture.md          # Phân hệ Backend, Frontend, MariaDB, H2, DataSeeder
│
├── theory/                             # CƠ SỞ LÝ THUYẾT SQA
│   └── sqa-theoretical-foundations.md   # Lý thuyết SQA/QC, Error-Fault-Failure, 4 phương pháp Review, IEEE 829
│
├── test-plan/                          # KẾ HOẠCH KIỂM THỬ (TEST PLAN)
│   ├── test-plan-v0.1.md               # Kế hoạch kiểm thử ban đầu (Trước TPR - Tồn tại 14 khiếm khuyết)
│   ├── test-plan-v1.0.md               # Kế hoạch kiểm thử chuẩn hóa (Sau TPR theo IEEE 829 & ISO 29119-3)
│   └── rtm.md                          # Ma trận truy vết hai chiều (Requirements Traceability Matrix)
│
└── sqa/                                # HỒ SƠ QUY TRÌNH SOFTWARE INSPECTION
    ├── tpr-plan.md                     # Kế hoạch tổ chức TPR 6 bước (Ban hành bởi Moderator)
    ├── checklists/                     # Bảng kiểm rà soát 15 tiêu chí của các Inspector
    │   ├── tpr-checklist-inspector1.md # Bảng kiểm Inspector 1 (Luồng Khách hàng & Giao dịch)
    │   └── tpr-checklist-inspector2.md # Bảng kiểm Inspector 2 (Luồng Quản trị, Môi trường, NFR)
    ├── minutes/                        # Biên bản các cuộc họp trong quy trình TPR
    │   ├── walkthrough-minutes-2026-11-11.md # Biên bản Walkthrough ngày 11/11/2026
    │   ├── inspection-minutes-2026-11-14.md  # Biên bản họp Inspection ngày 14/11/2026
    │   └── approval-minutes-2026-11-16.md    # Biên bản phê duyệt Test Plan v1.0 ngày 16/11/2026
    └── issues/                         # Danh sách khiếm khuyết và quản lý lỗi
        └── issue-log.md                # Issue Log ghi nhận F01–F14 và xác nhận đóng lỗi 100%
```

---

## 2. Liên kết Nhanh đến các Tài liệu Minh chứng Trọng tâm

1. **Minh chứng Báo cáo Phần 1 & Phần 2:**
   - [Báo cáo SQA Phần 1 & Phần 2](bao-cao-sqa-phan-1-2.md)
   - [Đặc tả yêu cầu phần mềm SRS v1.0](srs/srs-v1.0.md) (14 yêu cầu REQ-01 đến REQ-14)
   - [Kiến trúc công nghệ hệ thống](architecture/system-architecture.md) (Spring Boot 3.4.2, React 18, MariaDB/H2)
   - [Cơ sở lý thuyết SQA chuyên sâu](theory/sqa-theoretical-foundations.md) (Chuẩn IEEE 829, 1028, ISO 29119-3)

2. **Minh chứng Kế hoạch Kiểm thử & Ma trận truy vết:**
   - [Test Plan v0.1 (Bản nháp trước rà soát)](test-plan/test-plan-v0.1.md)
   - [Test Plan v1.0 (Bản chuẩn hóa sau rà soát)](test-plan/test-plan-v1.0.md)
   - [Ma trận truy vết yêu cầu (RTM)](test-plan/rtm.md)

3. **Minh chứng Quy trình Rà soát Software Inspection:**
   - [Kế hoạch TPR 6 bước](sqa/tpr-plan.md)
   - [Bảng kiểm TPR Checklist của Inspector 1](sqa/checklists/tpr-checklist-inspector1.md)
   - [Bảng kiểm TPR Checklist của Inspector 2](sqa/checklists/tpr-checklist-inspector2.md)
   - [Biên bản họp Walkthrough (11/11)](sqa/minutes/walkthrough-minutes-2026-11-11.md)
   - [Biên bản họp Inspection chính thức (14/11)](sqa/minutes/inspection-minutes-2026-11-14.md)
   - [Biên bản họp phê duyệt Test Plan v1.0 (16/11)](sqa/minutes/approval-minutes-2026-11-16.md)
   - [Danh mục 14 khiếm khuyết (Issue Log F01–F14)](sqa/issues/issue-log.md)

4. **Toàn văn Báo cáo Đề tài 9:**
   - [Báo cáo SQA Đề tài 9 Đầy đủ](bao-cao-sqa-toan-van.md)
