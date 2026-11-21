# Feature Specification: Keychain Builder

**Feature Branch**: `main` (chưa tạo branch riêng)

**Created**: 2026-11-18

**Status**: Draft

**Input**: Ý tưởng tại [`inputs/idea.md`](./inputs/idea.md).

## Visual Reference

Ảnh `inputs/mockup-preview.png` là tham chiếu bố cục và visual language cho
implementation. Nó không thay thế các yêu cầu chức năng, dữ liệu, hình học hoặc
quyền riêng tư trong tài liệu này.

- Desktop dùng hai cột: vùng preview lớn bên trái và control panel hẹp bên phải.
- Preview có nút quay về, tiêu đề INUT Keychain Builder, nhãn DEMO, toggle
  `Mặt trước/Mặt sau` khi xem 2D, toggle `2D/3D`, các công cụ căn giữa/fit và
  vùng thao tác trực quan. Ở 3D, không hiện toggle mặt; người dùng xoay mô hình
  để xem hai mặt vật lý.
- Control panel được chia thành năm nhóm số thứ tự với accent cam: hình dáng &
  móc, ảnh thiết kế, mặt sau, acrylic và Export PNG.
- Mobile giữ preview ở trên, controls ở dưới theo cùng thứ tự và nút Export PNG
  luôn dễ tiếp cận mà không che nội dung.
- Bảng màu dùng nền đen/than, panel nổi, viền tối, chữ trắng/xám và cam làm
  primary accent. Hình preview phải trông rõ là acrylic/reactive showcase, nhưng
  không mô tả thành mô hình sản xuất hoặc kim loại 3D thật.

## Clarifications

### Session 2026-11-18

- Q: Ai được xem ảnh và bản nháp? → A: Bất kỳ ai có liên kết chia sẻ và nhân sự INUT được phân quyền. **Đã được thay thế** bởi clarification về asset Sanity công khai bên dưới.
- Q: Người nhận link được làm gì? → A: Xem và tải PNG, không sửa bản gốc; có thể chỉnh trong phiên mới rồi Export thiết kế mới.
- Q: Flow lưu và khôi phục thực tế là gì? → A: Không đăng nhập hoặc lưu thiết kế trong trình duyệt; ảnh và cấu hình được lưu trong Sanity, chỉ tạo link có tham số khi Export thành công để mở lại thiết kế. Quyết định này thay thế các câu trả lời trước về quyền chủ sở hữu trên trình duyệt, tự thu hồi link và khách tự xóa.
- Q: Acrylic màu đục được in mấy mặt và mặt còn lại hiển thị thế nào? → A: Chỉ in một mặt; mặt còn lại giữ màu acrylic đục, không in.
- Q: Xử lý thế nào khi đổi từ acrylic trong sang đục? → A: Hiện popup cảnh báo; chỉ chuyển sang đục và reset về giá trị mặc định khi khách xác nhận.
- Q: Phạm vi reset khi xác nhận đổi sang acrylic đục là gì? → A: Reset số mặt và chế độ mặt sau; giữ thiết kế, ảnh mặt sau và phần chỉnh sửa để có thể dùng lại.
- Q: Ảnh và thiết kế được lưu trong Sanity bao lâu? → A: Không tự hết hạn; nhân sự INUT xóa thủ công.
- Q: Ai được truy cập ảnh đã tải lên? → A: Dùng asset Sanity như lighter builder; bất kỳ ai có URL ảnh Sanity đều có thể xem, không cần đăng nhập. Quyết định này thay thế yêu cầu trước đó về giới hạn truy cập ảnh chỉ cho phiên chỉnh, người có link Export và nhân sự.
- Q: Khách yêu cầu xóa ảnh đã lưu như thế nào? → A: MVP không có quy trình nhận yêu cầu xóa; chỉ INUT chủ động xóa thủ công.
- Q: MVP có nút tải cả hai mặt cùng lúc hoặc thêm chữ/sticker không? → A: Chưa; tải từng mặt, ghi nhận thêm chữ/sticker là tính năng sau MVP.
- Q: Có chờ team sản xuất duyệt frame và thông số trước khi triển khai không? → A: Chưa duyệt; cứ triển khai MVP để demo, sau đó team sản xuất xác nhận và cập nhật.
- Q: Nguồn ảnh móc và license xóa nền là gì? → A: Có 10 ảnh móc trong `inputs/ring/`; người dùng xác nhận đã có license IMG.LY phù hợp.
- Q: Quyền sử dụng 10 ảnh móc đã cung cấp thế nào? → A: Người dùng xác nhận được tự do sử dụng, không bị hạn chế bản quyền.
- Q: Trước khi upload ảnh có thông báo hoặc xin đồng ý không? → A: Không thông báo và không xin đồng ý trong MVP; cần xác minh tuân thủ trước khi public.
- Q: Các quyết định về dữ liệu và quyền dùng ảnh đã được duyệt chưa? → A: Người dùng duyệt không thông báo/xin đồng ý, lưu vô hạn, không nhận yêu cầu xóa, quyền truy cập ảnh công khai và quy trình xóa thủ công; xác nhận ảnh được cung cấp được phép sử dụng.

### Session 2026-11-20

- Q: 3D xử lý lựa chọn mặt trước/mặt sau thế nào? → A: Ẩn bộ chọn mặt trong 3D; gắn nội dung trước và sau vào đúng hai mặt vật lý, camera xoay để xem mỗi mặt. Lựa chọn mặt 2D được giữ nguyên và chỉ dùng làm hướng camera ban đầu.
- Q: Các mode Mặt sau bên phải có tác dụng trong 3D không? → A: Có; mode đang chọn quyết định nội dung/màu của mặt sau 3D theo cùng quy tắc với 2D và PNG.
- Q: Chỉnh ảnh sau riêng ở đâu? → A: Bỏ panel chỉnh riêng; dùng toolbar chỉnh ảnh bên trái khi mặt sau được chọn trong 2D. Toolbar cập nhật transform riêng của ảnh sau; trạng thái/cảnh báo crop vẫn đặt cạnh phần tải ảnh.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Thiết kế và tải ảnh móc khóa (Priority: P1)

Khách truy cập `/builder/keychain`, chọn móc, khung, màu acrylic và kích thước, tải ảnh mặt trước, chỉnh ảnh rồi tải hình minh họa thiết kế. Giao diện dark theme ưu tiên điện thoại, với bản xem 2D mặc định.

**Why this priority**: Đây là giá trị cốt lõi: khách có thể tự tạo và chia sẻ một thiết kế mà không cần đặt hàng.

**Independent Test**: Trên điện thoại, chọn một khung và móc, tải ảnh, chỉnh vị trí và kích thước rồi tải PNG; đối chiếu ảnh tải về với mặt đang xem.

**Acceptance Scenarios**:

1. **Given** khách mở builder, **When** chọn móc, khung và một trong tám kích thước từ 3 đến 10 cm, **Then** bản xem 2D thể hiện lựa chọn đó, gồm cả lỗ gắn móc.
2. **Given** khách đã tải ảnh trước hợp lệ, **When** di chuyển, phóng thu hoặc xoay ảnh, **Then** bản xem cập nhật theo thao tác và ảnh chỉ xuất hiện trong vùng của charm.
3. **Given** khách đang xem một mặt, **When** tải PNG toàn bộ móc khóa hoặc chỉ charm ở mức 1x, 2x hoặc 3x, **Then** file thể hiện đúng mặt, lựa chọn và bố cục hiện tại trên nền trong suốt.
4. **Given** khách dùng màn hình hẹp, **When** chỉnh ảnh hoặc cuộn trang, **Then** khách vẫn tiếp cận được preview và Export, không bị tràn ngang hay nhầm thao tác cuộn với chỉnh ảnh.
5. **Given** khách chỉnh giao diện acrylic, **When** thay màu hoặc độ dày, **Then** lựa chọn được thể hiện nhất quán trong preview và PNG.
6. **Given** khách chọn acrylic trong suốt hoặc một trong bảy màu đục từ danh sách, **When** xem 2D, 3D, Export và mở lại thiết kế, **Then** màu và độ trong/đục tương ứng được giữ đúng; không có lựa chọn nhập mã màu tự do.

### User Story 2 - Chọn và chỉnh mặt sau (Priority: P1)

Với acrylic trong suốt, khách chọn thiết kế một hoặc hai mặt và cách thể hiện mặt sau. Với acrylic màu đục, thiết kế chỉ có một mặt in; mặt sau là màu acrylic không in.

**Why this priority**: Mặt sau và số mặt in quyết định thiết kế được thể hiện thế nào; chúng là phạm vi MVP đã chốt.

**Independent Test**: Dùng ảnh có chữ và khung bất đối xứng, lần lượt chọn bốn chế độ với acrylic trong suốt, rồi chọn acrylic đục và kiểm tra mặt sau không in trong preview và PNG.

**Acceptance Scenarios**:

1. **Given** thiết kế một mặt mặc định với acrylic trong suốt, **When** xem từ phía sau, **Then** khách thấy ảnh trước lật ngang qua acrylic trong, không phải một mặt in thứ hai.
2. **Given** thiết kế một mặt với acrylic trong suốt, **When** chọn mặt sau trắng, **Then** mặt sau có màu trắng theo đường bao charm và chừa lỗ gắn móc.
3. **Given** khách chọn hai mặt lần đầu với acrylic trong suốt, **When** xem từ phía sau, **Then** mặt sau mặc định là bản in thứ hai dùng ảnh trước lật ngang; thay đổi ảnh trước cũng cập nhật mặt sau.
4. **Given** khách chọn ảnh sau riêng và đang xem mặt sau trong 2D, **When** dùng toolbar chỉnh ảnh bên trái với ảnh có tỷ lệ khác, **Then** ảnh được giữ tỷ lệ, crop theo vùng/kích thước mặt trước và transform riêng được cập nhật mà không đổi đường cắt.
5. **Given** ảnh sau riêng đã được chỉnh, **When** khách chuyển sang chế độ khác rồi quay lại, **Then** ảnh và phần chỉnh trước đó được khôi phục; chỉ xóa khi khách chủ động yêu cầu.
6. **Given** khách chọn bất kỳ màu acrylic đục nào, **When** xem hoặc Export mặt sau, **Then** mặt sau chỉ có màu acrylic đã chọn và lỗ gắn móc, không có ảnh hay lớp in; các lựa chọn in hai mặt và in trắng ở mặt sau không khả dụng.
7. **Given** khách đang dùng acrylic trong và có ảnh sau riêng, **When** chọn acrylic đục, **Then** builder hiện popup cảnh báo; xác nhận mới chuyển sang một mặt với mặt sau không in, giữ nguyên ảnh trước và các lựa chọn khác; còn hủy thì giữ nguyên toàn bộ thiết kế.
8. **Given** khách đã xác nhận chuyển sang acrylic đục, **When** chọn lại acrylic trong và chọn ảnh sau riêng, **Then** ảnh sau và phần chỉnh sửa đã tải trước đó được khôi phục.

### User Story 3 - Xem thiết kế từ nhiều góc (Priority: P2)

Khách chuyển từ bản xem 2D sang bản xem 3D có thể xoay để hình dung hai mặt và độ dày charm.

**Why this priority**: Khách cần hình dung thiết kế nhưng vẫn có thể tạo và tải thiết kế bằng 2D.

**Independent Test**: Tạo thiết kế bất đối xứng cho từng mode mặt sau, mở 3D và xoay xem hai mặt; xác nhận mode đã chọn thể hiện đúng ở mặt sau, đối chiếu với 2D và PNG.

**Acceptance Scenarios**:

1. **Given** thiết kế đã có ảnh trước và cấu hình mặt sau, **When** khách mở và xoay bản xem 3D, **Then** mặt trước/sau được render đồng thời trên đúng hai mặt vật lý, hình dạng/móc/lỗ khớp 2D, và không có bộ chọn mặt trước/mặt sau trong toolbar 3D.
2. **Given** thiết bị không hỗ trợ hoặc không thể duy trì bản xem 3D, **When** khách thử mở 3D hoặc bản xem gặp lỗi, **Then** khách được thông báo, quay về 2D và giữ nguyên thiết kế.
3. **Given** khách đang xem 3D, **When** xoay hoặc thu phóng góc nhìn, **Then** thao tác đó không làm thay đổi ảnh hay cấu hình thiết kế.
4. **Given** khách thay mode ở nhóm Mặt sau khi đang xem 3D, **When** xoay qua mặt sau, **Then** mặt sau 3D thể hiện mode mới mà không cần chọn mặt trong toolbar preview.
5. **Given** khách chuyển từ 2D sang 3D rồi quay lại 2D, **When** 2D xuất hiện lại, **Then** mặt 2D đã chọn trước đó và transform từng ảnh vẫn được giữ nguyên.

### User Story 4 - Tạo charm theo viền ảnh (Priority: P2)

Khách có thể chọn đường cắt theo hình mặt trước thay cho khung cố định, sử dụng ảnh trong suốt hoặc công cụ xóa nền trước khi xem và tải thiết kế.

**Why this priority**: Die-cut và xóa nền đã được xác định là một phần MVP, dù khung cố định vẫn có thể dùng độc lập.

**Independent Test**: Tải ảnh có nền, xóa nền, chọn cắt theo viền, điều chỉnh ảnh và kiểm tra bản xem cùng PNG; thay ảnh sau để xác nhận đường cắt không đổi.

**Acceptance Scenarios**:

1. **Given** ảnh trước có vùng trong suốt, **When** khách chọn cắt theo viền, **Then** charm có đường bao theo ảnh trước, gồm tai và lỗ gắn móc.
2. **Given** ảnh trước chưa có vùng trong suốt, **When** khách chọn cắt theo viền, **Then** builder giải thích cần ảnh trong suốt hoặc gợi ý xóa nền, thay vì tạo đường cắt không hợp lệ.
3. **Given** khách yêu cầu xóa nền, **When** tác vụ thành công hoặc thất bại, **Then** builder báo trạng thái tương ứng; ảnh gốc vẫn có thể dùng lại và lỗi có hướng dẫn dùng ảnh trong suốt.
4. **Given** thiết kế die-cut có ảnh sau riêng, **When** khách thay hoặc chỉnh ảnh sau, **Then** đường cắt không đổi; khi ảnh trước thay đổi, vùng cắt và crop mặt sau cập nhật theo ảnh trước mới.

### User Story 5 - Export và mở lại thiết kế (Priority: P2)

Khách tải ảnh và chỉnh thiết kế trong phiên hiện tại. Sau khi Export thành công, khách nhận link có tham số để mở lại ảnh và cấu hình đã lưu trong Sanity, tương tự cách mở preview của lighter builder.

**Why this priority**: Khách có thể mở lại hoặc chia sẻ thiết kế đã Export mà không cần đăng nhập hay lưu dữ liệu thiết kế trên trình duyệt.

**Independent Test**: Tải ảnh hai mặt, chỉnh cấu hình, Export và lưu link; đóng trình duyệt rồi mở link để đối chiếu ảnh và cấu hình. Mở builder không có link để kiểm tra không tự khôi phục.

**Acceptance Scenarios**:

1. **Given** khách chưa tải ảnh, **When** chọn ảnh, **Then** builder không hiện thông báo hoặc bước xin đồng ý riêng trước khi tải ảnh lên.
2. **Given** khách tải ảnh hợp lệ và chỉnh thiết kế, **When** chưa Export thành công, **Then** ảnh được lưu trong Sanity nhưng chưa có link khôi phục để cung cấp cho khách.
3. **Given** ảnh và cấu hình đã được lưu thành công khi Export, **When** Export hoàn tất, **Then** khách nhận PNG và link có tham số để mở lại thiết kế.
4. **Given** khách đóng trình duyệt, **When** mở builder không có link, **Then** thiết kế trong phiên trước không tự khôi phục. Khi mở link Export, ảnh và cấu hình đã lưu được khôi phục với bản xem 2D mặc định, không cần đăng nhập.
5. **Given** người khác có link Export, **When** mở link, **Then** người đó có thể xem, chỉnh trong phiên mới và Export thiết kế mới mà không sửa bản đã được link ban đầu lưu lại.
6. **Given** tải ảnh, lưu cấu hình hoặc tạo link thất bại, **When** khách tiếp tục sử dụng builder, **Then** thiết kế trong phiên hiện tại không bị xóa, lỗi được thông báo và khách có thể thử lại; không thông báo link đã sẵn sàng nếu chưa lưu thành công.
7. **Given** ảnh hoặc thiết kế đã được lưu, **When** thời gian trôi qua, **Then** hệ thống không tự xóa theo thời hạn; khi nhân sự INUT xóa thiết kế thủ công, link tới thiết kế đó không còn mở được.
8. **Given** ảnh đã được lưu thành asset Sanity thông thường, **When** bất kỳ ai có URL ảnh truy cập trực tiếp mà không đăng nhập, **Then** người đó có thể xem ảnh, kể cả khi không có link Export.

### Edge Cases

- Ảnh không hợp lệ, quá lớn, tải lên thất bại hoặc được thay trong lúc xử lý: báo lỗi hoặc bỏ kết quả cũ, giữ trạng thái thiết kế nhất quán và cho phép thử lại.
- Ảnh sau khác tỷ lệ, bị crop nhiều hoặc đang được lưu khi đổi chế độ: báo phần bị crop và không kéo giãn, mất bản nháp hay đổi đường cắt.
- Ảnh sau riêng được giữ khi đổi sang acrylic đục nhưng không hiển thị hoặc được tính là mặt in trong lúc acrylic đục đang được chọn.
- Ảnh trước có nhiều mảng gần nhau: nối các mảng bằng khoảng đệm đường cắt để tạo một contour. Mảng vẫn tách rời sau khi nối, alpha rỗng hoặc contour không hợp lệ: cảnh báo và yêu cầu khách điều chỉnh hoặc đổi ảnh; không xuất bản xem như thể hợp lệ.
- Link không hợp lệ hoặc trỏ tới thiết kế/ảnh đã bị xóa: báo không còn khả dụng, không hiển thị sai thiết kế và cho phép bắt đầu thiết kế mới.
- Khách đóng trình duyệt trước khi Export thành công hoặc không giữ lại link: trạng thái phiên bị mất và không tự khôi phục dù ảnh có thể đã được lưu trong Sanity.
- Xóa thiết kế có ảnh vẫn được thiết kế khác sử dụng: giữ ảnh đó cho đến khi không còn thiết kế nào tham chiếu.
- Nếu team sản xuất xác nhận một tổ hợp khung, kích thước hoặc móc không gia công được, cập nhật builder để chặn tổ hợp đó và giải thích; không tự thay đường kính lỗ 4 mm.
- Xóa nền, 3D hoặc Export vượt khả năng thiết bị: báo rõ, giữ thiết kế, cho thử lại hoặc lựa chọn phù hợp hơn; không âm thầm đổi mức Export.
- Khách rời trang hoặc mất kết nối trước khi Export và lưu hoàn tất: không hứa khôi phục được phiên hoặc tạo được link.
- Với acrylic trong suốt, các lựa chọn mặt sau mặc định hoặc nhìn xuyên phải phản chiếu ảnh trước đúng một lần từ góc nhìn phía sau; ảnh sau riêng giữ đúng chiều khách chỉnh. Acrylic đục không cho nhìn xuyên ảnh trước.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Builder MUST có tại `/builder/keychain`, dùng dark theme, ưu tiên thao tác trên điện thoại và mở ở chế độ xem 2D.
- **FR-002**: Khách MUST chọn được móc và khung cố định trong danh mục MVP, hoặc chọn cắt theo viền ảnh trước. MVP demo MAY dùng frame nháp và ảnh móc được cung cấp trước khi team sản xuất duyệt; quyền sử dụng các asset khác, nếu bổ sung, MUST được xác nhận trước khi public.
- **FR-003**: Khách MUST chọn được kích thước 3, 4, 5, 6, 7, 8, 9 hoặc 10 cm, đo theo cạnh dài nhất của đường cắt charm bao gồm tai móc.
- **FR-004**: Lỗ gắn móc MUST là hình tròn đường kính thiết kế 4 mm ở mọi kích thước và hình dạng, không thay đổi khi đổi góc xem hay mức Export. Thông số gia công và tổ hợp hợp lệ được team sản xuất xác nhận sau khi demo MVP; preview không khẳng định đã được duyệt gia công.
- **FR-005**: Khách MUST tải ảnh trước và di chuyển, phóng thu, xoay hoặc chỉnh kích thước ảnh; builder MUST hiển thị kết quả trong vùng charm.
- **FR-006**: Với acrylic trong suốt, builder MUST hỗ trợ bốn trạng thái hợp lệ: một mặt nhìn xuyên, một mặt sau trắng, hai mặt dùng ảnh trước lật ngang, và hai mặt dùng ảnh sau riêng. Chọn trắng chuyển sang một mặt; chọn ảnh riêng chuyển sang hai mặt. Với acrylic đục, builder MUST chỉ cho phép in một mặt; mặt sau giữ màu acrylic, không có ảnh hoặc lớp in.
- **FR-007**: Hai trạng thái dùng ảnh trước MUST cập nhật theo ảnh trước hiện tại; khi nhìn trực diện từ sau ảnh được lật ngang đúng một lần. Trạng thái nhìn xuyên và trạng thái in hai mặt MUST được lưu phân biệt.
- **FR-008**: Ảnh sau riêng MUST giữ tỷ lệ, mặc định được căn giữa và crop phủ vùng in/silhouette mặt trước, có thể chỉnh độc lập bằng toolbar chỉnh ảnh bên trái khi mặt sau được chọn trong 2D; không có panel chỉnh ảnh sau riêng. Trạng thái/cảnh báo crop MUST nằm cạnh phần tải ảnh. Đổi chế độ hoặc chuyển sang acrylic đục MUST giữ ảnh và chỉnh sửa cho đến khi khách chủ động xóa. Ảnh sau được giữ nhưng không hiển thị hoặc tính là mặt in khi chọn acrylic đục.
- **FR-009**: Khách MUST chuyển xem mặt trước/mặt sau trong 2D; toggle này MUST ẩn trong 3D. Bản xem 3D MUST gắn texture/màu mặt trước và mặt sau lên đúng hai mặt vật lý cùng lúc; người dùng xoay camera để xem, không đổi map của cả hai mặt bằng lựa chọn 2D. Móc trong 3D có thể là hình phẳng, không được mô tả như mô hình kim loại 3D thực.
- **FR-010**: Die-cut MUST dựa trên silhouette ảnh trước sau chỉnh sửa, gồm tai và lỗ; ảnh sau không quyết định đường cắt. Thay ảnh hoặc chỉnh ảnh trước MUST cập nhật đường cắt và crop mặt sau trước khi Export.
- **FR-011**: Khách MUST có thể chủ động yêu cầu xóa nền cho ảnh trước hoặc ảnh sau riêng, xem trạng thái xử lý, dùng lại ảnh gốc và nhận hướng dẫn thay thế khi xử lý thất bại. Kết quả của ảnh cũ MUST không thay thế ảnh mới.
- **FR-012**: Khách MUST tải PNG nền trong suốt của mặt đang xem, chọn toàn bộ móc khóa hoặc chỉ charm và mức 1x/2x/3x. Nếu mức chọn không thực hiện được, builder MUST báo lỗi và cho chọn mức khác, không tự giảm mức.
- **FR-013**: Khách MUST xem được trạng thái tải ảnh, xử lý, lưu và Export; khi có lỗi, builder MUST giữ thiết kế hiện tại và cung cấp cách thử lại hoặc phương án thay thế phù hợp.
- **FR-014**: Hệ thống MUST lưu ảnh khi khách chọn, không hiện thông báo hoặc bước xin đồng ý riêng trong MVP; khi Export, hệ thống MUST lưu cấu hình và liên kết tới ảnh trong Sanity trước khi cung cấp link khôi phục. Không yêu cầu tự lưu cấu hình sau 15 giây hoặc khi rời trang.
- **FR-015**: Link nhận được sau Export MUST mở lại ảnh và cấu hình đã lưu, gồm ảnh sau riêng được giữ khi chọn acrylic đục, các chỉnh sửa và lựa chọn mặt sau; bản xem mở lại mặc định là 2D. Mở builder không có link MUST không tự khôi phục phiên trước.
- **FR-016**: Ảnh MUST được lưu dưới dạng asset Sanity thông thường như lighter builder; bất kỳ ai có URL ảnh đều có thể xem mà không cần đăng nhập, kể cả khi không có link Export. Phiên đang chỉnh và người có link Export hợp lệ MUST xem được ảnh liên quan; người mở link có thể chỉnh trong phiên mới và Export thiết kế mới mà không sửa bản thiết kế được link ban đầu lưu lại.
- **FR-017**: Thiết kế, ảnh đã Export và ảnh đã tải lên nhưng không Export MUST không tự hết hạn hoặc tự bị xóa theo thời gian; nhân sự INUT chủ động xóa thủ công, MVP không cung cấp quy trình nhận yêu cầu xóa từ khách. Link không tự hết hạn theo thời gian và MUST không mở được thiết kế đã bị xóa. Việc lưu/xóa MUST tuân theo chính sách đã được người dùng duyệt và không được xóa ảnh còn được thiết kế khác tham chiếu.
- **FR-018**: Trên mobile, builder MUST có vùng chạm tối thiểu 44 × 44 CSS px, chữ nhập tối thiểu 16 px, không tràn ngang ở độ rộng 320 px và không để thanh hành động che nội dung. Có cách chỉnh chính xác và thao tác bằng bàn phím, không chỉ bằng gesture hoặc màu sắc.
- **FR-019**: Trong chế độ chỉnh ảnh 2D, khách MUST có thể kéo và phóng thu ảnh bằng cảm ứng mà không ngăn cuộn/zoom thông thường ngoài vùng chỉnh; ở 3D các thao tác này chỉ điều khiển góc nhìn. Có điều khiển Fit/Reset view.
- **FR-020**: Builder MUST mặc định không tự chạy chuyển động; nếu có chuyển động tùy chọn, khách có thể dừng/phát lại và tùy chọn giảm chuyển động của thiết bị được tôn trọng.
- **FR-021**: Builder MUST ghi nhận lượt xem và các hành động chọn móc, hình dáng, màu acrylic, mặt sau, tải ảnh, xóa nền, đổi chế độ xem và Export trong cả GA4 và Umami, không ghi trùng cho cùng một hành động trong mỗi hệ thống.
- **FR-022**: Builder MUST thông báo preview và màu sắc/kích thước hiển thị chỉ mang tính minh họa; PNG Export không phải file in hoặc file cắt production.
- **FR-023**: Khách MUST có thể điều chỉnh màu acrylic và độ dày; các thay đổi MUST được phản ánh nhất quán trong preview, ảnh xuất và cấu hình đã Export. Không cung cấp điều chỉnh kiểu cạnh hoặc độ bóng. Độ trong/đục phụ thuộc lựa chọn acrylic và không thể chỉnh để biến màu đục thành trong hoặc acrylic trong thành đục.
- **FR-024**: Tính khả dụng của link MUST theo điều kiện lưu thành công đã nêu tại FR-014; mỗi lần Export thiết kế đã chỉnh MUST tạo snapshot mới và MUST không làm thay đổi nội dung của link trước.
- **FR-025**: Builder MUST không yêu cầu đăng nhập và không lưu bền vững ảnh, cấu hình, link hoặc quyền khôi phục trên trình duyệt của khách. Sau khi đóng trình duyệt, khách chỉ mở lại được thiết kế đã Export bằng link.
- **FR-026**: Builder MUST cung cấp dropdown gồm đúng tám lựa chọn acrylic: trắng trong suốt; đỏ, vàng, cam, xanh lá, xanh biển, trắng và đen đục. Mặc định là trắng trong suốt. Không có ô chọn hoặc nhập màu tự do theo mã hex.
- **FR-027**: Màu acrylic và tính trong/đục MUST được thể hiện nhất quán ở 2D, 3D và PNG, được lưu trong cấu hình Export và khôi phục đúng khi mở link. Vùng không có ảnh trên acrylic đục hiển thị màu acrylic, không nhìn xuyên qua tấm.
- **FR-028**: Khi khách chuyển từ acrylic trong sang acrylic đục, builder MUST hiện popup: “Acrylic đục chỉ in một mặt. Mặt sau sẽ là màu acrylic và lựa chọn mặt sau sẽ được đặt lại. Ảnh mặt sau đã tải vẫn được giữ.” Popup MUST có lựa chọn xác nhận và hủy. Nếu hủy hoặc đóng popup, builder MUST giữ nguyên thiết kế.
- **FR-029**: Khi xác nhận popup, builder MUST chuyển sang acrylic đục đã chọn, reset số mặt về một và mặt sau về màu acrylic không in. Ảnh trước, móc, khung, kích thước, các phần chỉnh sửa khác và ảnh sau riêng đã tải MUST được giữ. Khi chọn lại acrylic trong, mặc định một mặt nhìn xuyên; khách có thể chọn lại ảnh sau riêng đã giữ.
- **FR-030**: Builder MUST bám cấu trúc responsive trong `inputs/mockup-preview.png`: desktop hai cột preview/control panel, mobile preview-before-controls, thứ tự năm nhóm control, công cụ preview dễ tiếp cận và primary Export nổi bật. Chi tiết visual MAY thích ứng với MUI/theme hiện hữu, nhưng MUST bảo toàn thứ tự nhiệm vụ và hierarchy đã mô tả.
- **FR-031**: Trong 3D, cả hai mặt MUST được render đồng thời bằng cấu hình ảnh/mặt sau hiện tại; xoay camera MUST bộc lộ mặt vật lý tương ứng. Bộ chọn `Mặt trước/Mặt sau` MUST không hiển thị trong 3D; lựa chọn mặt 2D chỉ định hướng camera ban đầu và MUST NOT đổi texture/màu của cả hai mặt. Khi quay về 2D, mặt đã chọn trước đó MUST được giữ.
- **FR-032**: Bốn mode mặt sau MUST ảnh hưởng đến bề mặt sau của mesh 3D như trong 2D/PNG: xuyên mica dùng ảnh trước phản chiếu đúng một lần theo góc nhìn phía sau; lót trắng hiển thị nền trắng có lỗ; in hai mặt dùng ảnh trước làm mặt in thứ hai; ảnh riêng dùng ảnh và transform riêng đã tải. Chuyển mode khi đang ở 3D MUST cập nhật mặt sau mà không cần thoát 3D.
- **FR-033**: Khi 2D đang xem mặt sau ở mode ảnh riêng, toolbar chỉnh ảnh bên trái MUST thao tác `backCustom` (pan/zoom/rotate/flip/reset) và giữ transform độc lập với ảnh trước. Builder MUST bỏ panel “Chỉnh riêng ảnh mặt sau”; phần crop/status/upload errors vẫn hiện cạnh upload và không bị mất.
- **FR-034**: Chuyển 2D↔3D MUST giữ lựa chọn mặt 2D, ảnh trước/sau, mode mặt sau và transform. Điều khiển camera trong 3D MUST chỉ đổi camera, không dispatch thay đổi transform thiết kế.

### Key Entities _(include if feature involves data)_

- **Thiết kế trong phiên**: Các lựa chọn, ảnh hai mặt và phần chỉnh sửa đang thực hiện; không tự khôi phục sau khi đóng trình duyệt.
- **Thiết kế đã Export**: Cấu hình và ảnh đã lưu trong Sanity cùng link có tham số để mở lại phiên bản đó.
- **Charm**: Hình dáng cố định hoặc die-cut, màu và tính trong/đục của acrylic, kích thước, đường cắt, vùng ảnh, tai và lỗ gắn móc.
- **Móc**: Loại móc, hình minh họa, kích thước và vị trí gắn được duyệt.
- **Mặt thiết kế**: Mặt trước hoặc mặt sau; ảnh gốc/đã xóa nền, cách hiển thị và các điều chỉnh liên quan.
- **Ảnh xuất**: Mặt được chọn, toàn bộ móc khóa hoặc chỉ charm, mức độ phân giải và nội dung phản ánh thiết kế hiện tại.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Trong kiểm thử sử dụng, ít nhất 90% người tham gia hoàn tất chọn móc, khung, kích thước, chỉnh ảnh và tải PNG trong 5 phút mà không cần trợ giúp.
- **SC-002**: Trong bộ kiểm thử nghiệm thu, 100% tổ hợp được cho phép của tám kích thước giữ lỗ thiết kế 4 mm; 100% chế độ mặt sau cho kết quả đúng chiều và số mặt in ở 2D, 3D và PNG.
- **SC-003**: Với ảnh tối đa 2048 px, tương tác kéo/phóng thu preview đạt mục tiêu tối thiểu 30 FPS trên ít nhất một điện thoại Android tầm trung và một iPhone được chọn làm thiết bị chuẩn, cho cả khung cố định và die-cut.
- **SC-004**: Các luồng chính hoạt động không tràn ngang, không che Export tại độ rộng 320, 360, 390 và 430 px; kiểm tra thêm xoay ngang, bàn phím và safe area trên Android Chrome và iOS Safari.
- **SC-005**: Trong kiểm thử, 100% link được cung cấp sau Export thành công mở lại đúng ảnh và cấu hình đã lưu mà không cần đăng nhập; mở builder không có link sau khi đóng trình duyệt không khôi phục phiên trước.
- **SC-006**: Trong kiểm thử, cả sáu lựa chọn Export (hai phạm vi × ba mức) thể hiện đúng mặt đang chọn; khi thiết bị không hỗ trợ một lựa chọn, 100% trường hợp báo rõ thay vì âm thầm giảm chất lượng.
- **SC-007**: Các hành động được liệt kê trong FR-021 được ghi nhận đúng một lần cho mỗi hệ thống theo từng hành động trong kiểm thử, không gửi ảnh hoặc dữ liệu cá nhân trong thuộc tính sự kiện.
- **SC-008**: Trong kiểm thử, 100% link Export cho phép mở lại và chỉnh trong phiên mới; Export phiên mới không thay đổi thiết kế được link cũ mở. Link không hợp lệ hoặc tới thiết kế đã xóa hiển thị lỗi rõ ràng.
- **SC-009**: Trong kiểm thử, cả tám lựa chọn acrylic hiển thị và được khôi phục đúng màu/tính trong hoặc đục; với cả bảy màu đục, mặt sau không in và không thể chọn in hai mặt. Xác nhận hoặc hủy popup và khôi phục ảnh sau hoạt động đúng ở 100% trường hợp kiểm thử.
- **SC-010**: Trong kiểm thử với thời gian mô phỏng 30, 90 và 365 ngày, ảnh, thiết kế và link không tự hết hạn; 100% link tới thiết kế đã bị INUT xóa thủ công báo không còn khả dụng.
- **SC-011**: Trong kiểm thử với ảnh giả lập, 100% URL asset Sanity được tạo cho thiết kế có thể mở trực tiếp mà không cần đăng nhập hoặc link Export; phiên đang chỉnh và link Export hợp lệ vẫn xem được ảnh.
- **SC-012**: Với ảnh bất đối xứng trong cả bốn mode mặt sau, 100% kiểm thử 3D thể hiện đúng ảnh/màu trên hai mặt vật lý khi xoay, không có toggle mặt trong 3D, và đổi mode bên phải cập nhật mặt sau mà không cần thoát 3D. Toolbar 2D chỉnh ảnh sau riêng phải cập nhật đúng transform độc lập và không làm đổi ảnh trước.

## Assumptions

- MVP là toàn bộ các phase 1–4 trong idea, gồm khung cố định, bốn chế độ mặt sau cho acrylic trong suốt, acrylic đục một mặt, 3D, die-cut, xóa nền, lưu/khôi phục và analytics. Thứ tự triển khai không làm thay đổi phạm vi MVP.
- Đặt hàng, thanh toán, giá, giỏ hàng, file in/cắt production, ZIP animation, acrylic nhũ/holo/glitter, nút tải đồng thời cả hai mặt và chia sẻ trước khi Export nằm ngoài MVP; khách có thể tải từng mặt riêng và chia sẻ link sau Export. Thêm chữ và sticker lên charm là tính năng dự kiến sau MVP.
- Các 18 SVG trong [`inputs/frames/`](./inputs/frames/) là bản nháp, chưa được duyệt để gia công. Được phép dùng để triển khai và demo MVP; sau demo, team sản xuất xác nhận hình dáng, vùng in, tai/lỗ, dung sai, lớp trắng và từng tổ hợp móc/kích thước để cập nhật. Không coi preview hoặc asset nháp là file sản xuất đã duyệt.
- Bảy màu đục là danh sách khách yêu cầu, không khẳng định tồn kho hoặc mã màu cụ thể; team xác nhận mẫu vật liệu và khả năng in sau demo MVP.
- Có 10 ảnh móc trong [`inputs/ring/`](./inputs/ring/); theo xác nhận của người dùng, chúng được tự do sử dụng, không bị hạn chế bản quyền. Vẫn cần xác nhận thông tin gắn và kích thước; không mặc định các asset bên thứ ba khác được phép tái sử dụng.
- Người dùng đã duyệt MVP không thông báo hoặc xin đồng ý trước khi upload, ảnh không tự hết hạn, không có quy trình khách yêu cầu xóa, URL ảnh công khai và quy trình INUT xóa thủ công. Vẫn cần xác minh nghĩa vụ bảo vệ dữ liệu áp dụng trước khi public; việc phê duyệt này không tự chứng minh tuân thủ.
- Người dùng xác nhận đã có license IMG.LY phù hợp; cần kiểm tra phạm vi và điều kiện sử dụng thực tế trước khi public.
- Không có tài khoản, lưu thiết kế bền vững trên trình duyệt, khôi phục tự động, quyền chủ sở hữu riêng, chức năng khách tự thu hồi link hoặc tự xóa dữ liệu trong MVP. Người có link sau Export có thể mở lại và chỉnh trong phiên mới.
- Các tỷ lệ và thời gian trong SC-001 là mục tiêu đề xuất để nghiệm thu, không phải kết quả đã đo hoặc cam kết kinh doanh đã được duyệt.
- Chi tiết kỹ thuật và phương án triển khai trong [idea gốc](./inputs/idea.md) là đầu vào cho bước plan, không mặc nhiên là yêu cầu công nghệ của spec; khi có mâu thuẫn, spec và các clarification mới nhất được ưu tiên. Các chỉ tiêu hiệu năng và sử dụng ở trên là mục tiêu nghiệm thu, không phải số đo đã đạt.
