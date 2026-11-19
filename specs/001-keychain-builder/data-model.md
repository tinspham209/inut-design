# Data Model: Keychain Builder

**Phạm vi:** Dữ liệu để render/showcase, không phải cấu hình đặt hàng hoặc file sản xuất. [Spec](./spec.md) và [contracts](./contracts/keychain-builder.md) là nguồn hành vi.

## Catalog tĩnh

| Entity  | Thuộc tính                                                | Quy tắc                                                                                                             |
| ------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Frame   | `id`, tên, SVG `#cut/#print/#hole`, master size           | 18 mẫu nháp trong `inputs/frames/`; cạnh dài master 30 mm; không khẳng định safe area đã được duyệt                 |
| Ring    | `id`, tên hiển thị, đường dẫn PNG, anchor, tỉ lệ hiển thị | 10 ảnh `inputs/ring/`; quyền dùng theo xác nhận của user; anchor/tỉ lệ vật lý chỉ là demo cho tới khi team xác nhận |
| Acrylic | `id`, tên, loại trong/đục, màu hiển thị                   | `clear` mặc định; `red`, `yellow`, `orange`, `green`, `blue`, `white`, `black` là đục; không color picker           |

Màu hiển thị minh họa, không tự nhận là mã sản phẩm hoặc màu vật lý được duyệt.

## Thiết kế trong phiên

`KeychainConfig` có `version`, `ringId`, `shape` (`frame` + `frameId` hoặc `die-cut` + thông số đường viền), `sizeCm`, `acrylicId`, `printSides`, `backMode`, `front`, `backCustom` tùy chọn và material (`edge`, `bevel`, `thickness`, `sheen`). Front và back chứa asset gốc/đã xóa nền nếu có, `useProcessed`, transform (`xMm`, `yMm`, `scale`, `rotation`, `flipX` nếu được hỗ trợ). Transform và bounds phải được kiểm tra finite/giới hạn ở server; view zoom và góc camera không làm đổi config.

Ảnh được chọn upload ngay; state phiên giữ ảnh hiển thị và Sanity refs, không giữ thiết kế bền vững trong trình duyệt. `backCustom` được giữ khi đổi mode hoặc opaque, nhưng không được render/in khi mode không phải custom. Không tạo bản sao asset cho hai mode dùng ảnh trước.

### Cặp hợp lệ

| Acrylic | `printSides` | `backMode`        | Mặt sau                                    |
| ------- | -----------: | ----------------- | ------------------------------------------ |
| Trong   |            1 | `through-acrylic` | Nhìn xuyên ảnh trước, lật ngang một lần    |
| Trong   |            1 | `white`           | Lớp trắng theo outline, trừ lỗ             |
| Trong   |            2 | `mirror-front`    | Bản in ảnh trước lật ngang một lần         |
| Trong   |            2 | `custom`          | Ảnh riêng đúng chiều, crop theo vùng trước |
| Đục     |            1 | `material`        | Màu acrylic, không ảnh hoặc lớp in         |

Chuyển trong → đục yêu cầu popup. Hủy giữ nguyên; xác nhận đặt `printSides=1`, `backMode=material`, giữ ảnh/trạng thái khác kể cả `backCustom`. Chuyển lại trong đặt mặc định `through-acrylic`; khách có thể chọn lại custom và ảnh trước đó. Cùng kiểm tra trên server để ngăn tổ hợp sai.

## Geometry dẫn xuất

`cutPath`, `printClip`, `hole(cx, cy, radiusMm=2)`, `anchor` và die-cut mask là dữ liệu dẫn xuất từ config + asset; dùng mm. Size là cạnh dài nhất đường cắt **gồm tai**, không bao gồm ring. Không dùng pixel màn hình để suy ra mm. Geometry/worker có revision theo config và ảnh trước; chỉ render/export kết quả mới nhất.

Outline phải kín, hình + tai nằm trong envelope size, lỗ thực sự được trừ khỏi acrylic; các mảng trong giới hạn đệm đường cắt được nối thành một silhouette, còn disjoint sau khi đệm/empty/invalid báo lỗi. Mặt sau phản chiếu hình học theo hệ nhìn từ sau; crop ảnh custom theo cùng vùng và không làm đổi đường cắt. Không suy diễn thông số gia công chưa duyệt.

## Sanity `keychainDesign`

Một document = **một snapshot Export bất biến**, không phải draft tự lưu. Mỗi hành động Export tạo một UUID ngẫu nhiên duy nhất; server dùng UUID đó làm `requestId` và phần định danh document, nên retry cùng hành động có thể tìm lại cùng snapshot. Thuộc tính đề xuất:

| Field                                                        | Ý nghĩa                                                                                             |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `_id`, `_type`                   | `keychainDesign.<UUID>`; UUID ngẫu nhiên là định danh, không phải secret hay authorization |
| `config.version`, `config`       | Cấu hình chuẩn gồm mode, acrylic, geometry inputs, transforms và nested image references |
| `_createdAt`                     | Thời điểm Sanity tạo document; không đặt TTL |
| Legacy fields (hidden in Studio) | Field trùng lặp từ snapshot cũ, chỉ để tương thích đọc; không ghi vào snapshot mới |

Sanity là nguồn ảnh/metadata; URL image asset có thể truy cập công khai nếu biết URL, và dataset công khai có thể cho query config. Không lưu tên, số điện thoại, token hay credential vào document. User không đăng nhập, không có chức năng chỉnh/xóa document gốc từ builder. `_id` là định danh canonical; `config.version` là phiên bản cấu hình canonical. Image references lồng trong `config.front` và `config.backCustom` là nguồn ảnh canonical; CDN URLs được dựng lại từ references khi API trả snapshot. Các snapshot cũ có URL/configVersion/field trùng lặp vẫn được đọc tương thích.

`requestId` chỉ tham gia tạo `_id` và không được ghi thành field riêng. Fingerprint được tính từ config canonical khi xử lý retry, không lưu trong document vì dataset và các field ẩn không phải cơ chế bảo mật. Snapshot mới không ghi `createdAt` tùy biến vì Sanity đã cung cấp `_createdAt`. Mỗi lần Export tạo request ID mới; retry cùng request ID và cùng config canonical trả snapshot hiện có, payload khác bị từ chối. Snapshot cũ có `requestFingerprint` vẫn được replay theo fingerprint cũ.

Khi người dùng chọn nhận báo giá từ hộp Export, builder lưu snapshot hiện tại rồi điều hướng tới form kèm ID thiết kế. Form báo giá lưu Sanity reference `keychainDesign`; đội sales có thể mở snapshot từ document báo giá hoặc thông báo Telegram. Reference này không lưu ảnh preview trùng lặp.

Có thể có asset upload chưa được document nào tham chiếu vì user rời trang hoặc Export lỗi. Theo quyết định của user, không tự xóa theo thời gian; INUT chủ động xử lý thủ công. Xóa design không xóa asset đang được snapshot khác tham chiếu. Xóa design làm link design ngừng hoạt động; Sanity CDN/cache hoặc file người khác đã tải có thể vẫn tồn tại.

## Vòng đời

1. **Editing:** Trong bộ nhớ; ảnh được upload ngay; chưa có link khôi phục.
2. **Export pending:** Chờ upload, tính geometry mới nhất, render PNG; gửi request lưu snapshot với request ID duy nhất cho lần Export.
3. **Exported:** Sanity document tồn tại; trả link có tham số và PNG. Sau reload không kèm link, builder rỗng.
4. **Opened by link:** Nạp snapshot, ảnh và config vào phiên chỉnh mới; không patch document cũ. Export tiếp tạo snapshot mới.
5. **Deleted by INUT:** Đọc trực tiếp Sanity không qua CDN trả không tìm thấy; link design không mở lại được. Không tuyên bố URL CDN ảnh đã bị thu hồi.

## Validation

- Frame/ring/acrylic ID phải nằm trong catalog; size thuộc `3..10` nguyên; `hole.diameterMm=4` nếu được gửi, nếu không server dựng cố định.
- Chỉ chấp nhận các cặp acrylic/printSides/backMode ở bảng trên; `custom` cần ảnh sau hợp lệ. Không render ảnh sau đã giữ ở các mode khác.
- Chấp nhận PNG/JPEG/WebP cho ảnh khách, kiểm tra giới hạn và dữ liệu ảnh ở server; client resize tối đa 2048 px, giới hạn file 10 MB. Không chấp nhận URL bên ngoài do client cung cấp làm nguồn ảnh server.
- Validate reference là image asset hợp lệ, số lượng ảnh, version, shape, geometry inputs và các số hữu hạn trong phạm vi cho phép; từ chối payload không hợp lệ trước khi ghi.
- Dữ liệu user được gửi và xử lý chỉ cho mục đích builder; không log payload/URL/ảnh. Thực tế lưu asset công khai và các quyết định dữ liệu vẫn cần được duyệt trước public.
