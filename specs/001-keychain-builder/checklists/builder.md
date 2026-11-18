# Checklist chất lượng yêu cầu: Keychain Builder

**Mục đích**: Rà soát chất lượng yêu cầu trước khi tạo tasks cho thiết kế, xuất/chia sẻ và trải nghiệm di động.
**Ngày tạo**: 2026-11-18
**Feature**: [Keychain Builder](../spec.md)

## Tính đầy đủ

- [ ] CHK001 Các lựa chọn khung, khoen và trạng thái mặc định đã được mô tả đủ để phân biệt dữ liệu demo với dữ liệu được duyệt sử dụng thực tế chưa? [Spec §FR-001, §FR-002] [Assumption]
- [ ] CHK002 Yêu cầu về kích thước 3–10 cm và lỗ 4 mm đã xác định rõ cách áp dụng cho từng hình dạng và kích thước sản phẩm chưa? [Spec §FR-003, §FR-004]
- [ ] CHK003 Các thao tác với ảnh và phạm vi áp dụng cho từng mặt đã được mô tả đầy đủ, bao gồm cả trạng thái khi chưa có ảnh chưa? [Spec §FR-005–FR-010] [Gap]
- [ ] CHK004 Các chế độ mặt sau của acrylic trong và cách chuyển sang một mặt khi chọn màu đục đã được mô tả đầy đủ, kể cả việc giữ ảnh mặt sau chưa? [Spec §FR-006, §FR-026–FR-029]
- [ ] CHK005 Yêu cầu xuất PNG đã xác định nội dung cần có và không có trong ảnh xuất, bao gồm khung, khoen, nền và các mặt chưa? [Spec §FR-012–FR-015] [Gap]

## Tính rõ ràng

- [ ] CHK006 Các thuật ngữ kích thước sản phẩm, silhouette và vùng ảnh đã được định nghĩa rõ để tránh nhầm lẫn giữa kích thước vật lý và vùng nhìn thấy chưa? [Spec §FR-003–FR-010] [Ambiguity]
- [ ] CHK007 Các quy tắc crop, vị trí và giới hạn biến đổi ảnh đã đủ rõ cho ảnh dọc, ảnh ngang và ảnh có độ phân giải nhỏ chưa? [Spec §FR-005–FR-010] [Gap]
- [ ] CHK008 Danh sách màu, nhãn hiển thị và ý nghĩa của màu trong/đục đã đủ rõ để người thiết kế và người tạo tasks diễn giải giống nhau chưa? [Spec §FR-026–FR-029]
- [ ] CHK009 Yêu cầu xác nhận và reset khi chuyển từ acrylic trong sang đục đã xác định rõ dữ liệu nào thay đổi, được giữ lại và được khôi phục chưa? [Spec §FR-026–FR-029] [Ambiguity]
- [ ] CHK010 Trạng thái lưu, xuất và tạo liên kết đã có thuật ngữ và thông điệp đủ rõ để phân biệt đang xử lý, thành công và thất bại chưa? [Spec §FR-012–FR-017] [Gap]

## Tính nhất quán

- [ ] CHK011 Các yêu cầu hình học, crop và silhouette có thống nhất giữa bản xem 2D, bản xem 3D và PNG xuất, kể cả khi đổi kích thước hoặc chế độ mặt sau không? [Spec §FR-003–FR-010]
- [ ] CHK012 Quy tắc dùng ảnh mặt trước tạo silhouette có nhất quán với các lựa chọn ảnh mặt sau và acrylic đục không? [Spec §FR-006–FR-010, §FR-026–FR-029]
- [ ] CHK013 Snapshot bất biến, liên kết tham số và việc không lưu trạng thái trong trình duyệt có mô tả nhất quán thiết kế nào được mở lại sau khi tiếp tục chỉnh sửa không? [Spec §FR-014–FR-017, §FR-024–FR-025] [Ambiguity]
- [ ] CHK014 Giả định quy đổi 1 cm bằng 100 px có nhất quán với yêu cầu kích thước vật lý và chất lượng ảnh xuất, và phạm vi áp dụng của giả định này đã rõ chưa? [Spec §FR-003, §FR-012] [Plan] [Assumption]

## Tiêu chí chấp nhận và khả năng đo lường

- [ ] CHK015 Các tiêu chí chấp nhận có xác định mức tương đồng cần đạt giữa 2D, 3D và PNG, kể cả sai lệch cho phép nếu có, chưa? [Spec §FR-010] [Gap]
- [ ] CHK016 Chất lượng và kích thước PNG xuất có tiêu chí đo lường đủ rõ cho toàn bộ dải kích thước sản phẩm chưa? [Spec §FR-003, §FR-012] [Gap]
- [ ] CHK017 Mục tiêu di động tối thiểu 30 FPS đã xác định thiết bị, điều kiện đo và thao tác đại diện để đánh giá nhất quán chưa? [Plan] [Gap]
- [ ] CHK018 Các tiêu chí thành công về xuất và mở liên kết có xác định rõ kết quả có thể quan sát được mà không phụ thuộc vào chi tiết triển khai chưa? [Spec §FR-012–FR-017, §SC-001–SC-011] [Gap]

## Kịch bản và trường hợp biên

- [ ] CHK019 Yêu cầu tải ảnh đã bao phủ loại tệp hoặc kích thước không hợp lệ, lỗi tải và cách người dùng tiếp tục hoặc thử lại chưa? [Spec §FR-011–FR-013] [Gap]
- [ ] CHK020 Các yêu cầu đã mô tả điều gì xảy ra khi thao tác xuất hoặc tạo liên kết thất bại, bao gồm khả năng thử lại mà không mất thiết kế chưa? [Spec §FR-012–FR-017] [Gap]
- [ ] CHK021 Việc mở liên kết ẩn danh sau khi đóng trang, mất phiên hoặc trên thiết bị khác đã có yêu cầu rõ về dữ liệu được khôi phục và lỗi khi tài nguyên không còn truy cập được chưa? [Spec §FR-014–FR-017, §FR-024–FR-025] [Gap]
- [ ] CHK022 Các giới hạn hình học đã bao phủ ảnh hoặc đường viền sát mép, lỗ treo chồng lên nội dung và kích thước cực trị chưa? [Spec §FR-003–FR-010] [Gap]
- [ ] CHK023 Yêu cầu đổi màu qua lại đã nêu rõ hành vi khi người dùng hủy xác nhận và khi quay lại màu trong sau khi đã chọn màu đục chưa? [Spec §FR-026–FR-029] [Ambiguity]

## Trải nghiệm di động và khả năng tiếp cận

- [ ] CHK024 Bố cục và các thao tác chính trên màn hình 320, 360, 390 và 430 px đã có yêu cầu về khả năng sử dụng và tránh che khuất nội dung chưa? [Spec §FR-001, §FR-018–FR-020] [Plan] [Gap]
- [ ] CHK025 Các điều khiển ảnh, lựa chọn màu và chuyển chế độ xem đã có yêu cầu rõ về nhãn, thao tác bàn phím, trạng thái focus và phương án không phụ thuộc cử chỉ chưa? [Spec §FR-005–FR-010, §FR-018–FR-020, §FR-026] [Gap]
- [ ] CHK026 Yêu cầu giảm chuyển động và hiệu ứng acrylic đã xác định cách trình bày thay thế mà vẫn giữ thông tin cần thiết chưa? [Spec §FR-020, §FR-023] [Gap]

## Phụ thuộc và giả định

- [ ] CHK027 Trạng thái duyệt hình học demo, tiêu chuẩn vật lý và nguồn ảnh khoen đã được phân biệt rõ với các yêu cầu sẵn sàng cho sản phẩm thực tế chưa? [Spec §FR-002–FR-004] [Assumption]
- [ ] CHK028 Phụ thuộc của tách nền và lưu ảnh lên Sanity đã nêu rõ giới hạn, lỗi và tác động đến xuất hoặc chia sẻ khi dịch vụ không khả dụng chưa? [Spec §FR-011–FR-017] [Gap]

## Ghi chú

- Các mục đánh giá tài liệu yêu cầu, không xác nhận tính năng đã được triển khai hoặc kiểm thử.
- `[Gap]`, `[Ambiguity]` và `[Assumption]` đánh dấu nội dung cần xem xét, không mặc định là yêu cầu mới.
