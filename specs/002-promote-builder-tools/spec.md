# Feature Specification: Promote Builder Tools

**Feature Branch**: `main` (chưa tạo branch riêng)

**Created**: 2026-11-20

**Status**: Draft

**Input**: User description: "Đặt mày là 1 user bình thường khi vào website này. Giờ tao cần làm tính năng để promotion về 2 tính năng Builder, đặc biệt là Buider keychain, vì đây là tính năng mới, và tiện thể tao muốn promotion cả cho 2 cái builder này. use /speckit-specify for this new feature. 002"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Nhận diện Keychain Builder ngay khi vào trang (Priority: P1)

Người dùng bình thường mở trang chủ và nhận ra ngay rằng INUT có công cụ thiết kế
móc khóa mica trực tuyến mới, xem được giá trị chính của công cụ và đi thẳng tới
nhóm Builder để chọn Keychain Builder hoặc Lighter Builder mà không phải tìm trong
menu sản phẩm.

**Why this priority**: Keychain Builder là tính năng mới và là mục tiêu quảng bá
chính. Nếu khách không nhận thấy nó tại điểm vào website thì các lượt truy cập mới
khó chuyển thành lượt trải nghiệm công cụ.

**Independent Test**: Mở trang chủ ở kích thước điện thoại và máy tính trên một
phiên mới; chỉ với nội dung trong màn hình đầu tiên, xác nhận người kiểm thử nhận
ra nhóm Builder, hiểu Keychain Builder là tính năng mới và có thể tiếp tục tới
trang tổng hợp `/builder`.

**Acceptance Scenarios**:

1. **Given** người dùng mới mở trang chủ, **When** màn hình đầu tiên được hiển thị,
   **Then** Keychain Builder được giới thiệu nổi bật hơn các nội dung promotion
   Builder khác, đồng thời được nhận diện là tính năng mới.
2. **Given** người dùng nhìn thấy phần promotion, **When** đọc nội dung tóm tắt,
   **Then** người dùng hiểu có thể tự thiết kế móc khóa mica bằng ảnh và tùy chọn
   của mình, xem trước và tải kết quả thiết kế.
3. **Given** người dùng chọn lời kêu gọi hành động “Tự thiết kế ngay” trong Hero,
   **When** điều hướng hoàn tất, **Then** người dùng đến trang tổng hợp `/builder`
   trong cùng tab và không bị yêu cầu đăng nhập.
4. **Given** người dùng truy cập bằng màn hình điện thoại, **When** chưa cuộn trang,
   **Then** lời kêu gọi hành động “Tự thiết kế ngay” hiển thị rõ ràng trong Hero
   và đưa người dùng tới trang chọn Builder.

---

### User Story 2 - Khám phá cả hai Builder từ một khu vực thống nhất (Priority: P2)

Người dùng xem hai lựa chọn thiết kế trực tuyến trong cùng một nội dung quảng bá,
phân biệt được Keychain Builder và Lighter Builder, rồi chọn công cụ phù hợp với
sản phẩm muốn làm.

**Why this priority**: Quảng bá Keychain Builder cũng tạo cơ hội để thu hút khách
đến Lighter Builder. Hai lựa chọn cần xuất hiện như một nhóm nhưng không làm loãng
độ ưu tiên của tính năng mới.

**Independent Test**: Chỉ triển khai khu vực giới thiệu hai Builder trên trang
chủ; một người chưa từng sử dụng website phải chọn đúng công cụ cho nhu cầu móc
khóa hoặc bật lửa từ tên và mô tả hiển thị.

**Acceptance Scenarios**:

1. **Given** người dùng đang xem khu vực promotion Builder, **When** so sánh hai
   lựa chọn, **Then** cả tên sản phẩm, giá trị sử dụng và hành động tiếp theo của
   Keychain Builder và Lighter Builder đều được thể hiện riêng biệt.
2. **Given** người dùng muốn thiết kế bật lửa, **When** chọn Lighter Builder,
   **Then** người dùng đến đúng trang `/builder/lighters`.
3. **Given** Keychain Builder và Lighter Builder được hiển thị cạnh nhau,
   **When** người dùng duyệt bằng thị giác hoặc trình đọc màn hình, **Then**
   Keychain Builder được đặt trước và gắn trạng thái “Mới” hoặc cách diễn đạt tương
   đương, còn Lighter Builder không bị trình bày như tính năng ngừng hỗ trợ.

---

### User Story 3 - Tiếp cận Builder từ các điểm vào quen thuộc (Priority: P3)

Người dùng bỏ lỡ hoặc cuộn qua promotion ở trang chủ vẫn có thể tìm lại nhóm công
cụ qua điều hướng và trang tổng hợp Builder bằng cùng cách gọi tên và mô tả.

**Why this priority**: Promotion trang chủ cần có khả năng được khám phá lại. Sự
nhất quán giữa các điểm vào giảm nhầm lẫn và hỗ trợ cả khách ghé thẳng trang sản
phẩm lẫn khách quay lại website.

**Independent Test**: Mở trang chủ, điều hướng tổng quát và trang `/builder` rồi
đối chiếu tên hai Builder, trạng thái mới của Keychain Builder và đường dẫn đích.

**Acceptance Scenarios**:

1. **Given** người dùng đang ở một trang khác, **When** tìm công cụ tự thiết kế
   trong điều hướng hiện có, **Then** người dùng tiếp cận được nhóm Builder mà
   không cần đoán đường dẫn trực tiếp.
2. **Given** người dùng mở `/builder`, **When** xem các lựa chọn, **Then** trang chỉ
   trình bày hai công cụ hiện có trong cùng ngôn ngữ với trang chủ và ưu tiên
   Keychain Builder.
3. **Given** một liên kết promotion sử dụng hình ảnh minh họa, **When** hình ảnh
   chưa tải được, **Then** tên, mô tả và lời kêu gọi hành động vẫn đủ để chọn đúng
   Builder.

### Edge Cases

- Nếu ảnh promotion của một Builder không tải được, thẻ phải giữ kích thước ổn định
  và phần văn bản dẫn tới đúng Builder vẫn hoạt động.
- Nếu người dùng dùng bàn phím hoặc trình đọc màn hình, thứ tự ưu tiên thị giác
  phải khớp thứ tự đọc và trạng thái “Mới” phải được diễn đạt bằng chữ, không chỉ
  bằng màu.
- Nếu màn hình hẹp, nội dung không được ép thành văn bản khó đọc, tạo cuộn ngang
  hoặc đặt hai hành động chồng lên nhau.
- Nếu việc đo lường lượt hiển thị hoặc lượt chọn không khả dụng, promotion vẫn
  hiển thị và điều hướng bình thường; không hiển thị lỗi cho người dùng.
- Nếu trình duyệt nhận liên kết đến Builder trong tab mới bằng chức năng hệ điều
  hành, đường dẫn mở đúng Builder hiện có mà không phụ thuộc vào trạng thái phiên
  tại trang chủ.
- Nếu khách chọn promotion sau khi một Builder đang bảo trì hoặc báo lỗi, trang
  đích hiện có chịu trách nhiệm hiển thị trạng thái rõ ràng; promotion không tự
  hứa kết quả hoặc khả dụng mà hệ thống chưa xác minh.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Trang chủ MUST giới thiệu nhóm công cụ thiết kế trực tuyến gồm
  Keychain Builder và Lighter Builder trong trải nghiệm vào website thông thường.
- **FR-002**: Keychain Builder MUST là lựa chọn được ưu tiên thị giác và được gắn
  nhãn hoặc thông điệp rõ ràng rằng đây là tính năng mới.
- **FR-003**: Hero MUST thay nội dung “Xem sản phẩm” bằng “Tự thiết kế ngay” và
  lời kêu gọi hành động này MUST dẫn tới `/builder` để người dùng mới tiếp cận
  nhóm công cụ mà không phải tìm qua menu.
- **FR-004**: Khu vực promotion MUST mô tả đủ giá trị riêng của mỗi Builder:
  Keychain Builder phục vụ thiết kế móc khóa mica; Lighter Builder phục vụ thiết
  kế bật lửa cá nhân hóa. Nội dung không được chỉ dùng nhãn chung “Builder” khiến
  người dùng phải đoán.
- **FR-005**: Lời kêu gọi hành động tổng quan trong Hero MUST dẫn tới `/builder`.
  Mỗi lời kêu gọi dành riêng trong phần promotion Builder MUST dẫn trực tiếp tới
  đúng Builder: `/builder/keychain` hoặc `/builder/lighters`.
- **FR-006**: Promotion ở trang chủ MUST cho phép người dùng hiểu và chọn một trong
  hai Builder trước khi cần biết quy trình đặt hàng, báo giá hoặc tạo tài khoản.
- **FR-007**: Tên, thứ tự ưu tiên và mô tả chính của hai Builder MUST nhất quán
  giữa promotion trên trang chủ và trang `/builder`.
- **FR-008**: Khi người dùng truy cập bằng điện thoại, hai lựa chọn MUST được đọc
  và thao tác theo thứ tự Keychain rồi Lighter, không cuộn ngang và không có lời
  kêu gọi hành động chồng hoặc bị che.
- **FR-009**: Promotion MUST hỗ trợ bàn phím, có tiêu đề và nhãn liên kết có ý
  nghĩa cho trình đọc màn hình, và truyền tải ưu tiên “Mới” bằng chữ thay vì chỉ
  phụ thuộc vào màu sắc.
- **FR-010**: Nếu một asset minh họa promotion không khả dụng, nội dung chữ và
  đường dẫn tương ứng MUST tiếp tục khả dụng, đọc được và không đẩy các tương
  tác khác ra khỏi bố cục.
- **FR-011**: Hệ thống MUST ghi nhận việc hiển thị và lựa chọn promotion để đánh
  giá mức tiếp cận và chuyển đổi, với mỗi hành động được ghi nhận tối đa một lần
  trong mỗi hệ thống đo lường hiện có.
- **FR-012**: Dữ liệu quan sát cho promotion MUST chỉ chứa loại Builder, vị trí
  promotion và hành động; không được chứa ảnh tải lên, nội dung thiết kế, thông
  tin liên hệ, đường dẫn chia sẻ hay dữ liệu định danh cá nhân.
- **FR-013**: Tính năng promotion MUST không thay đổi trạng thái thiết kế, dữ
  liệu lưu trữ, thao tác trong hai Builder, quy trình đặt hàng hay giá sản phẩm
  hiện có.
- **FR-014**: Nội dung promotion MUST chỉ tuyên bố các khả năng đã có của Builder
  và không đưa ra giá, số lượng tối thiểu, thời gian giao hàng hoặc cam kết sản
  xuất chưa được xác minh.
- **FR-015**: Người dùng MUST có thể tìm đến nhóm Builder qua điểm điều hướng sẵn
  có và promotion trên trang chủ; không bắt buộc đồng thời cả hai điểm để hoàn
  thành nhiệm vụ.

### Key Entities

- **Builder Promotion**: Nội dung giới thiệu một công cụ thiết kế, gồm tên,
  trạng thái mới nếu có, mô tả giá trị, hình minh họa tùy chọn, vị trí hiển thị và
  hành động đi tới công cụ.
- **Builder Destination**: Điểm đến tương ứng với một công cụ đã tồn tại, gồm loại
  sản phẩm và đường dẫn công khai. Keychain Builder và Lighter Builder là hai
  điểm đến trong phạm vi.
- **Promotion Engagement**: Dữ kiện quan sát cho lần hiển thị hoặc lựa chọn một
  promotion, chỉ dùng để đo tiếp cận và chuyển đổi và không chứa dữ liệu thiết kế
  hay thông tin cá nhân.

### Cross-Cutting Constraints

- **Privacy and data**: Promotion không thu nhận hoặc yêu cầu ảnh, thông tin
  liên hệ, dữ liệu thiết kế hay thông tin thanh toán. Sự kiện quan sát phải dùng
  trường dữ liệu tối thiểu và không nhận giá trị từ ảnh, query chia sẻ hoặc hồ sơ
  khách hàng.
- **Security and validation**: Đường dẫn promotion chỉ được trỏ tới hai điểm đến
  công khai đã biết. Promotion không xử lý hoặc lưu payload từ Builder và không
  thay thế các kiểm tra an toàn của trang đích.
- **Accessibility and motion**: Mọi nội dung phải đọc được và dùng được bằng bàn
  phím, ảnh có phần mô tả phù hợp, độ ưu tiên không chỉ dựa vào màu, và chuyển
  động trang trí phải tuân theo thiết lập giảm chuyển động của người dùng.
- **Observability**: Ghi nhận lượt hiển thị và lượt chọn cho hai Builder trong cả
  hai hệ thống đo lường hiện có, loại trừ lặp khi tải hoặc điều hướng; sự cố đo
  lường không được làm gián đoạn điều hướng.
- **Compatibility**: Giữ nguyên hai đường dẫn Builder hiện có, bố cục và hợp đồng
  điều hướng chung của website, dữ liệu trong Builder, quy trình báo giá/đặt
  hàng và các nội dung commerce hiện có.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Trong kiểm thử khả dụng với ít nhất 10 người chưa từng vào hai
  Builder, tối thiểu 90% nhận ra Keychain Builder trong vòng 10 giây sau khi mở
  trang chủ và xác định đúng đây là công cụ thiết kế móc khóa mới.
- **SC-002**: Tối thiểu 95% người kiểm thử chọn đúng Builder mong muốn trong lần
  chọn đầu tiên dựa trên phần mô tả của promotion.
- **SC-003**: 100% lời kêu gọi “Tự thiết kế ngay” trong Hero dẫn đúng tới
  `/builder`; từ mỗi thẻ Builder trong phần promotion, người dùng đến đúng trang
  đích trong một lần chọn.
- **SC-004**: Trên các viewport phổ biến từ 360 px đến 1440 px, không phát hiện
  cuộn ngang, hành động bị che, văn bản cắt mất ý nghĩa hoặc thao tác chồng lấn
  trong khu vực promotion.
- **SC-005**: Người kiểm thử hoàn thành được hai luồng mở Builder chỉ bằng bàn
  phím, và trình đọc màn hình đọc được tên, trạng thái mới, mô tả, thứ tự và điểm
  đến của từng liên kết.
- **SC-006**: Trong kiểm thử tương tác, một thao tác người dùng tạo không quá một
  sự kiện lựa chọn cho mỗi hệ thống đo lường và không có thuộc tính chứa thông
  tin cá nhân hoặc nội dung thiết kế.
- **SC-007**: Khi ảnh minh họa bị mô phỏng lỗi hoặc đo lường bị vô hiệu hóa, 100%
  lời kêu gọi hành động vẫn hiển thị đúng nội dung, giữ bố cục ổn định và điều
  hướng được tới Builder.
- **SC-008**: Sau triển khai, tỷ lệ lượt truy cập trang chủ chuyển sang một trong
  hai Builder được đo được riêng; mục tiêu vận hành trong 30 ngày đầu là tối
  thiểu 5% với ít nhất 1.000 lượt xem promotion đủ điều kiện, trong đó Keychain
  Builder chiếm ít nhất 70% tổng lượt chọn hai Builder.

## Assumptions

- Người dùng đích là khách bình thường, không cần đăng nhập và không cần biết
  cấu trúc kỹ thuật của website.
- Keychain Builder và Lighter Builder đã có trang công khai và hành vi hiện tại;
  feature này chỉ mở rộng khả năng khám phá, không xây lại hai công cụ.
- Hai asset thumbnail hiện có đủ để dùng cho promotion; không cần tạo cam kết
  sản phẩm hoặc nội dung thương mại mới.
- Nhãn “Mới” áp dụng cho Keychain Builder trong giai đoạn ra mắt. Việc gỡ nhãn
  hoặc cập nhật chiến dịch sau này không thuộc phạm vi feature này.
- Promotion có thể xuất hiện tại nhiều điểm trên trang chủ nếu cùng dẫn trực tiếp
  đến hai Builder và không tạo hành động lặp khó hiểu; màn hình đầu tiên vẫn giữ
  mục tiêu nổi bật Keychain Builder.
- Chỉ hai Builder hiện có thuộc phạm vi; không giả định thêm Builder thứ ba, trang
  đăng ký, hệ thống tài khoản hay thay đổi cho quy trình đặt hàng.
