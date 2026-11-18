# Keychain Builder — Idea & Technical Direction

- Route: `/builder/keychain`
- Tham khảo: <https://keychain.maxmuffin.com/>
- Trạng thái: **Idea / pre-spec** (MVP = showcase + export; thiết kế sẵn để sau này nối vào đặt hàng như Lighter Builder)
- Giao diện: **dark theme**, đồng bộ với `/builder/lighters` (`components/lighter-builder/constants.ts`)
- Ưu tiên: **mobile-first** vì khoảng **70% traffic từ mobile**; các yêu cầu UX/hiệu năng bên dưới là tiêu chí triển khai, chưa phải kết quả đo của builder.

---

## 1. Mục tiêu

User tự thiết kế móc khoá acrylic online:

1. Chọn **móc/ring** có sẵn (snap clip, swivel clasp, split ring, ball chain…).
2. Chọn **frame acrylic** có sẵn (tròn, vuông, tim…) **hoặc die-cut theo viền hình**.
3. Chọn **kích thước** (3–10 cm) và **in 1 mặt / in 2 mặt**.
4. Upload hình mặt trước; chọn mặt sau xuyên acrylic, màu trắng, hoặc dùng ảnh in mặt sau. Với ảnh riêng, ảnh được crop theo cùng kích thước/vùng in mặt trước. Chỉnh move X/Y, scale, rotate, resize; tuỳ chọn **xoá nền**.
5. Xem preview **2D** và **3D xoay được**.
6. Export PNG mặt đang xem (full keychain / charm only, scale 1x/2x/3x).
7. Backend: ảnh của từng mặt được upload (đã nén) + config được lưu vào Sanity và auto-update theo config mới nhất.

Non-goals MVP: đặt hàng, thanh toán, giá, animation frames `.zip`, file in production.

---

## 2. Quyết định đã chốt

| Hạng mục          | Quyết định                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Render            | Frame **2D (SVG)**; preview có **2D và 3D xoay được**                                                                          |
| Nguồn ring/frame  | **Trong code/assets**, không quản lý catalog bằng Sanity. User cung cấp **PNG** ring cho cả 2D và 3D                           |
| Kiểu frame        | **Cả 2 trong MVP**: frame cố định + die-cut theo viền hình; đã tạo 18 SVG nháp ở §4                                            |
| Mặt in            | **1 mặt**: mặc định nhìn xuyên acrylic, hoặc mặt sau trắng. **2 mặt**: mặc định ảnh trước lật ngang, hoặc upload ảnh sau riêng |
| Remove background | `@imgly/background-removal` client-side, lazy-load khi user bấm (⚠️ xem §11)                                                   |
| Auto-save         | Upload ảnh ngay khi chọn; lưu config **debounce 15s** sau thay đổi cuối + khi export + khi rời trang                           |
| Export MVP        | PNG full keychain, PNG charm only, scale 1x/2x/3x                                                                              |
| Kích thước        | 3, 4, 5, 6, 7, 8, 9, 10 cm (cạnh dài nhất của đường cắt charm, gồm tai móc)                                                    |
| Lỗ gắn móc        | **Tròn, đường kính cố định 4 mm** ở mọi size; scale outline và tâm lỗ, không scale đường kính                                  |
| Mobile-first      | **2D mặc định**, UI cảm ứng một cột; chỉ tải 3D/remove-bg khi user yêu cầu, xem §3.2 và §5.7                                   |
| Theme             | Dark                                                                                                                           |

---

## 3. Kiến trúc tổng quan

```text
KeychainConfig (single source of truth, JSON-serializable)
        │
        ▼
 geometry utils (pure)  ──►  charm outline path (mm) + hole + print area + anchor
        │
        ├──► 2D renderer  (Canvas 2D)      → preview 2D + export PNG
        ├──► 3D renderer  (three / R3F)     → preview 3D xoay được
        └──► persistence  (API → Sanity)    → keychainDesign document
```

Nguyên tắc: **mọi renderer chỉ đọc `KeychainConfig` + geometry đã tính**, không tự giữ state riêng. Nhờ vậy 2D, 3D, export và Sanity luôn khớp nhau, và sau này order chỉ cần reference tới design.

### 3.1 KeychainConfig (đề xuất)

```ts
type KeychainBackMode = "through-acrylic" | "white" | "mirror-front" | "custom";

interface ImageTransform {
	x: number; // mm, offset từ tâm print area
	y: number;
	scale: number; // 1 = fit print area
	rotation: number; // độ
	flipX?: boolean;
}

interface KeychainSideConfig {
	imageAssetRef?: string; // Sanity asset _ref ảnh gốc đã nén
	processedAssetRef?: string; // Sanity asset _ref ảnh đã xoá nền (nếu có)
	useProcessed: boolean;
	transform: ImageTransform;
}

interface KeychainConfig {
	version: 1;
	ringId: string; // id trong data/keychain/rings.ts
	shape:
		| { type: "frame"; frameId: string }
		| { type: "die-cut"; cutBorderMm: number; smoothing: number };
	sizeCm: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
	printSides: 1 | 2;
	front: KeychainSideConfig;
	back: {
		mode: KeychainBackMode;
		custom?: KeychainSideConfig; // giữ bản nháp ảnh riêng khi đổi mode
	};
	hole: { offsetXMm: number; diameterMm: 4; bumpMm: number; gapMm: number };
	material: {
		plateOpacity: number;
		edge: number;
		bevel: number;
		thicknessMm: number;
		sheen: number;
	};
}
```

- Đơn vị nội bộ là **mm** (không phải px) → đổi size, export scale, sau này xuất file in đều đúng tỉ lệ thật.
- Chỉ chấp nhận các cặp `printSides` / `back.mode` ở bảng §5.4. `through-acrylic` và `mirror-front` đều dùng ảnh trước nhưng có **hai ý nghĩa in khác nhau**, không gộp state.
- `back.custom` chỉ được dùng để render khi mode là `custom`; giữ ảnh/transform đã upload khi đổi mode và chỉ xoá khi user chủ động xoá.
- `hole.diameterMm` luôn bằng **4**, không có slider đổi đường kính trong MVP. Zoom màn hình, đổi size, chuyển 2D/3D hoặc export 1x/2x/3x không thay đổi đường kính trong geometry mm.
- `version` để migrate config cũ khi thêm field.

### 3.2 UX mobile-first

Thiết kế từ viewport **320–430 CSS px**, không làm bản desktop rồi thu nhỏ. Desktop mới mở rộng sang preview + sidebar hai cột.

| Khu vực             | Yêu cầu trên mobile                                                                                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preview             | Ở trên, đủ chỗ nhìn toàn bộ charm/ring. Đổi 2D/3D và Trước/Sau ngay cạnh preview; **2D là mặc định**, kể cả khi mở lại draft. Có nút Fit/Reset view rõ ràng.                                                |
| Chỉnh thiết kế      | Một cột, chia nhóm **Hình dáng → Ảnh → Mặt sau → Chất liệu**; dùng accordion/bottom sheet có trạng thái thu gọn. Sheet không che hết preview, và scroll nội dung không làm kéo nhầm ảnh.                    |
| Picker              | Grid thumbnail nhẹ, tap chọn được; không bắt user hover hoặc vuốt một thanh quá dài để tìm ring/frame. Các thông số nâng cao đóng mặc định.                                                                 |
| Thanh hành động     | Export và trạng thái lưu dễ chạm bằng ngón cái; sticky dưới, có padding `env(safe-area-inset-bottom)`. Nội dung cuối trang có khoảng bù, không bị thanh này che.                                            |
| Kích thước/viewport | Không tràn ngang trang ở 320 px; nút/vùng chạm tối thiểu **44 × 44 CSS px**, input chữ tối thiểu **16 px**. Dùng `100dvh` kèm fallback phù hợp, xử lý thanh trình duyệt, bàn phím, xoay ngang và safe area. |
| Accessibility       | Label/giá trị rõ, tương phản trên dark theme; slider có input số/nút tăng giảm và thao tác bàn phím thay cho gesture. Báo progress/lỗi/lưu không chỉ bằng màu sắc.                                          |

Gesture tách theo ngữ cảnh: ở **chế độ chỉnh ảnh 2D**, một ngón kéo ảnh, hai ngón pinch scale; rotate có slider/handle riêng. Chỉ giữ pointer và chặn gesture trình duyệt trong vùng đang chỉnh; ngoài vùng đó trang vẫn cuộn và có thể zoom bình thường. Cần nút **Chỉnh ảnh / Xong** để tránh tranh chấp giữa kéo ảnh và cuộn trang. Ở 3D, gesture điều khiển orbit/zoom, không đồng thời sửa ảnh; muốn chỉnh thì chuyển về 2D.

---

## 4. Frame tự dựng và asset cần team xác nhận

### 4.1 Frame SVG nháp đã tự dựng

Đã tạo **18 mẫu** trong [`frames/`](./frames/), mỗi file là master **cạnh dài đường cắt 30 mm**, gồm tai móc, với **lỗ tròn đường kính 4 mm** tại kích thước gốc. Đã mở rộng tai móc để chứa lỗ này ở size nhỏ nhất. Đây vẫn là asset concept, **chưa phải file cắt/in production**; team cần duyệt vật liệu, khoảng an toàn và khả năng gia công. Chưa có route hay code builder sử dụng chúng.

| Frame          | SVG nháp                                          | Frame          | SVG nháp                                              |
| -------------- | ------------------------------------------------- | -------------- | ----------------------------------------------------- |
| Tròn           | [`circle`](./frames/frame-circle.svg)             | Vuông bo góc   | [`rounded-square`](./frames/frame-rounded-square.svg) |
| Photocard dọc  | [`portrait`](./frames/frame-portrait.svg)         | Trái tim       | [`heart`](./frames/frame-heart.svg)                   |
| Sao bo góc     | [`rounded-star`](./frames/frame-rounded-star.svg) | Oval           | [`oval`](./frames/frame-oval.svg)                     |
| Đám mây        | [`cloud`](./frames/frame-cloud.svg)               | Đầu gấu        | [`bear`](./frames/frame-bear.svg)                     |
| Đầu mèo        | [`cat`](./frames/frame-cat.svg)                   | Bong bóng chat | [`speech-bubble`](./frames/frame-speech-bubble.svg)   |
| Polaroid       | [`polaroid`](./frames/frame-polaroid.svg)         | Vé/ticket      | [`ticket`](./frames/frame-ticket.svg)                 |
| Lục giác       | [`hexagon`](./frames/frame-hexagon.svg)           | Khiên/badge    | [`shield`](./frames/frame-shield.svg)                 |
| Chữ nhật ngang | [`landscape`](./frames/frame-landscape.svg)       | Hình thoi      | [`diamond`](./frames/frame-diamond.svg)               |
| Giọt nước      | [`drop`](./frames/frame-drop.svg)                 | Bông hoa       | [`flower`](./frames/frame-flower.svg)                 |

Quy ước của từng file:

| Thành phần                   | Ý nghĩa                                                                                                                                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `viewBox`, `width`, `height` | `viewBox` ôm sát bounding box `#cut`; `width`/`height` có đơn vị **mm**, cạnh dài 30 mm. Tọa độ path là SVG user units, không mặc định 1 unit = 1 mm.                                                       |
| `#cut`                       | Một path kín cho biên ngoài acrylic, đã có tai móc. Không stroke, transform hay clip-path.                                                                                                                  |
| `#print`                     | Một path kín minh hoạ vùng đặt ảnh; không tự coi là vùng in an toàn đã được duyệt.                                                                                                                          |
| `#hole`                      | Circle có `data-diameter-mm="4"`; bán kính user units đã quy đổi để đường kính vật lý của master bằng **4 mm**. Màu tối chỉ đánh dấu vị trí: renderer phải trừ lỗ thật khỏi acrylic. Tâm lỗ là anchor ring. |

**Khi đổi size 3–10 cm:** scale outline, vùng in và tâm lỗ theo kích thước charm, sau đó dựng lại lỗ với **bán kính 2 mm** trong hệ geometry mm. Không resize nguyên SVG rồi dùng bán kính đã bị scale theo. Quy tắc này cũng áp dụng cho die-cut. CSS zoom hay kích thước hiển thị trên điện thoại không phải thước đo mm thực tế.

SVG giữ cấu trúc nhẹ: hai path + một circle, không ảnh nhúng, filter, mask, transform hoặc font; giữ các ID geometry khi tối ưu/minify. `viewBox` sát hình giúp thumbnail/preview không có khoảng trống thừa; chỉ parse mẫu đang dùng và cache geometry, thumbnail dùng SVG trực tiếp.

Màu trong SVG chỉ để xem nhanh hình dạng. Với Polaroid, vùng trắng/viền đáy là **ý tưởng trang trí**: code cần biểu diễn lớp viền trắng riêng thay vì giả định màu `fill` của SVG sẽ tự trở thành phần in. Die-cut theo hình user là geometry tạo động, không phải một trong các SVG cố định này.

**Team in-house cần cung cấp/xác nhận:**

1. Duyệt hoặc sửa các SVG nháp; vẽ thêm các frame độc quyền/mascot/logo, silhouette phức tạp hoặc mẫu đặc biệt mà team muốn có. Không cần vẽ lại 18 mẫu nếu đã duyệt.
2. Chốt đường cắt, bleed/vùng an toàn, khoảng cách lỗ tới mép, độ dày tai móc, dung sai/kerf và khả năng gia công **cho từng size 3–10 cm và từng loại ring**. Đường kính thiết kế đã chốt **4 mm**; team xác nhận ring có tương thích và máy cắt có đạt kích thước thành phẩm này không. Không tự đổi đường kính để bù máy.
3. Chốt cách làm mặt sau trắng và lớp trắng lót khi in 2 mặt; xác nhận vùng phủ, màu và cách tính mặt in. Không suy diễn quy trình hay giá.
4. Gửi bản đã duyệt dưới dạng SVG path kín, tách `#cut`, `#print`, `#hole` như trên, không transform/clip-path/text; nếu xưởng cần định dạng khác (AI/DXF/PDF), team cung cấp thêm. Ghi rõ version, đơn vị và kích thước/giới hạn gia công thật.

### 4.2 Ring / móc khoá

**Chỉ cần một PNG cho mỗi loại ring**, user cung cấp; dùng chung cho preview/export 2D và preview 3D. **Không yêu cầu GLB**.

| Cần có        | Gợi ý                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PNG           | Nền trong suốt, thấy trọn ring và phần nối, ảnh đủ nét cho export 3x; khoảng 1200 px cạnh dài là mức tham khảo, kiểm tra theo kích thước export thực tế.                       |
| Metadata      | ID ổn định, kích thước ring thật, vị trí điểm gắn trên PNG (toạ độ chuẩn hoá hoặc px + kích thước ảnh), hướng và cách canh ring với tâm lỗ.                                    |
| Quyền sử dụng | User dự định lấy PNG từ tool Max Muffin: chỉ đưa vào sản phẩm sau khi có quyền sử dụng phù hợp. Nếu không có quyền, dùng ảnh team tự chụp/tự vẽ hoặc asset có license phù hợp. |

Trong 3D, PNG được dán lên **plane cố định theo charm**, không phải billboard luôn quay mặt về camera. Khi xoay nghiêng, ring sẽ mỏng/phẳng và không phản chiếu kim loại như vật thể 3D thật; mặt sau là hình nhìn từ mặt sau của plane. Đây là giới hạn chấp nhận cho MVP, không phải model 360° thật.

Danh sách ring gợi ý: Snap clip, Swivel clasp, Lobster clasp, Split ring, Flat ring, Ribbed ring, Brass ring, Ball chain, Strap/dây đeo điện thoại.

### 4.3 Metadata trong code

```ts
// Đề xuất sau khi chuyển SVG đã duyệt vào public/keychain/frames/
// data/keychain/frames.ts
const frames = [
	{
		id: "heart",
		name: "Tim",
		svg: "/keychain/frames/frame-heart.svg",
		masterSizeMm: 30,
		holeDiameterMm: 4,
		enabled: true,
	},
];

// data/keychain/rings.ts
const rings = [
	{
		id: "snap-clip",
		name: "Snap Clip",
		image: "/keychain/rings/snap-clip.png",
		anchor: { x: 0.5, y: 0.92 }, // số minh hoạ, cần đo theo PNG thật
		sizeMm: 30, // số minh hoạ
		enabled: true,
	},
];
```

Metadata safe area và cặp ring/size hợp lệ phải theo số liệu đã duyệt; đường kính lỗ luôn 4 mm, còn anchor/kích thước ring trong ví dụ cần đo lại. Nếu sau này thật sự cần CMS, có thể migrate catalog sang Sanity (`keychainRing`, `keychainFrame`) mà không đổi `KeychainConfig` vì chỉ lưu `id`.

---

## 5. Hướng kỹ thuật chi tiết

### 5.1 Geometry pipeline (dùng chung 2D + 3D + export)

**Frame cố định**

1. Parse `#cut`, `#print`, `#hole` từ SVG (`SVGLoader` của three hoặc parse path → `Path2D`).
2. Scale outline theo `s = sizeCm × 10 / max(cutBBox.width, cutBBox.height)` từ SVG units sang mm, gồm tai móc; dịch origin nhất quán cho mọi path và tâm lỗ. Sau khi đổi tâm lỗ sang mm, đặt **`r = 2` mm**, không nhân `r` của master với `s`. Kiểm tra lỗ, tai và khoảng cách mép cho từng tổ hợp; nếu không đạt ngưỡng đã duyệt thì chặn tổ hợp đó, không thu nhỏ lỗ.
3. Tính/kiểm tra vùng in theo khoảng an toàn **mm thực tế** của team; `#print` nháp chỉ là điểm xuất phát. Cùng dùng geometry này để clip ảnh trước và ảnh sau, trừ lỗ (2D: `ctx.clip(path2d)`; 3D: texture/mask trên shape).
4. Khi nhìn từ mặt sau, phản chiếu geometry sang hệ tọa độ nhìn từ sau; không thay đổi hình dáng hoặc kích thước vật lý của charm.

**Die-cut theo viền hình**

1. Lấy alpha mask của **ảnh trước** sau transform (sau remove bg, hoặc ảnh PNG trong suốt sẵn). Ảnh không có alpha → gợi ý remove bg hoặc báo lỗi.
2. **Dilate** mask theo `cutBorderMm` (blur + threshold trên offscreen canvas, hoặc distance transform).
3. Trace contour bằng marching squares (`d3-contour`) → **simplify** (`simplify-js`) → smooth (Chaikin).
4. **Union** với tab lỗ móc bằng `polygon-clipping` → 1 outline kín. Tab phải chứa lỗ **bán kính 2 mm** cộng khoảng an toàn đã duyệt; bố trí cả hình + tab trong envelope kích thước đã chọn. Kiểm tra lại bounding box cuối, không scale cả lỗ sau khi union.
5. Chạy trong **Web Worker** để không block UI; recompute khi đổi ảnh/transform/border (debounce ~150ms).

Chỉ mặt trước quyết định silhouette die-cut; **không union với ảnh sau**. Ảnh sau riêng được crop/clip vào cùng mask và kích thước hình trước khi nhìn từ mặt sau. Thay ảnh sau không làm đổi đường cắt; thay ảnh/transform mặt trước thì tính lại geometry và cập nhật crop phía sau.

Output chung: `{ cutPath: Vec2[], printClip: Vec2[] | null, hole: { cx, cy, r: 2 }, anchor: Vec2 }` (mm). Với die-cut, giữ thêm mask/silhouette mặt trước cần thiết để crop mặt sau chính xác. API cũng validate `diameterMm === 4`; preview/export không dùng một bản lỗ khác.

### 5.2 Preview 2D (Canvas 2D)

- Layer order: shadow → acrylic plate (opacity) → ảnh hoặc lớp trắng của mặt đang xem → white edge/bevel highlight → sheen gradient → ring PNG gắn ở `anchor`; lỗ luôn được trừ.
- Mặc định preview **đứng yên**, nhất là trên mobile; swing chỉ chạy khi user bật, có Pause/Replay và tôn trọng `prefers-reduced-motion`.
- Interaction trực tiếp trên canvas theo §3.2: drag = move X/Y, wheel/pinch = scale, handle/slider = rotate/resize; slider + number input trong panel là nguồn chính xác. Không làm mất khả năng cuộn trang.
- Zoom canvas (−/100%/+/Fit) chỉ là view transform, không ảnh hưởng config.

### 5.3 Preview 3D xoay được (three + R3F — đã có trong repo)

- Acrylic: `THREE.Shape` từ `cutPath` → `ExtrudeGeometry` (depth = `thicknessMm`, bevel theo `bevel`), `MeshPhysicalMaterial` (`transmission`, `roughness` thấp, `ior ≈ 1.49`, `thickness`).
- Ảnh/lớp trắng: texture + mask dùng chung pipeline Canvas 2D, gắn lên đúng mặt acrylic. Chế độ xuyên acrylic chỉ có **1 thiết kế in**, không tạo nhầm một mặt in thứ hai; mode trắng phủ mặt sau theo `#cut` và chừa lỗ.
- Lỗ: thêm `hole` vào `shape.holes`.
- Ring: `PlaneGeometry` + texture PNG trong suốt, canh điểm gắn theo anchor, cố định và xoay cùng charm. Có thể dùng vật liệu hai mặt; khi nhìn từ sau PNG sẽ bị lật, khi nhìn cạnh ring gần như biến mất. Không dùng billboard luôn hướng camera và không cần GLB.
- Quy đổi UV/hệ trục mặt sau sao cho góc nhìn sau trong 3D khớp 2D/export; tránh lật ảnh hai lần. Dùng hình có chữ/mũi tên và frame bất đối xứng để kiểm tra.
- Controls: `OrbitControls` (giới hạn polar angle), **auto-rotate tắt mặc định**. `ContactShadows`/`Environment` và transmission theo chất lượng thiết bị; mobile ưu tiên shadow tĩnh, environment nhỏ và vật liệu nhẹ hơn, không bật mọi hiệu ứng mặc định.
- Lazy load toàn bộ 3D bằng `next/dynamic({ ssr: false })` — chỉ tải khi user chuyển sang tab 3D.

### 5.4 In 1 mặt / 2 mặt và lựa chọn mặt sau

| Số mặt / `back.mode`      | Trạng thái         | Mặt sau khi nhìn trực diện từ sau                                                                                             |
| ------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **1** / `through-acrylic` | **Mặc định 1 mặt** | Thấy ảnh trước **lật ngang xuyên qua acrylic trong**; không in ảnh thứ hai.                                                   |
| **1** / `white`           | Tuỳ chọn           | Màu trắng phủ mặt sau của charm theo outline, trừ lỗ; không có ảnh riêng ở sau. Kỹ thuật/lớp trắng chờ team xác nhận.         |
| **2** / `mirror-front`    | **Mặc định 2 mặt** | In bản sao ảnh trước **lật ngang** lên mặt sau; là mặt in thứ hai, không phải chỉ nhìn xuyên acrylic.                         |
| **2** / `custom`          | Tuỳ chọn           | Upload ảnh sau riêng; tự crop theo cùng kích thước và vùng hình của mặt trước, sau đó có thể chỉnh vị trí/scale/rotate riêng. |

Đề xuất UI:

1. Chọn **In 1 mặt / In 2 mặt**. Lần đầu chọn 1 mặt mặc định `through-acrylic`; chọn 2 mặt mặc định `mirror-front`.
2. Nhóm **Mặt sau** có ba lựa chọn dễ hiểu: **Ảnh trước lật ngang**, **Màu trắng**, **Upload ảnh riêng**. Lựa chọn đầu ánh xạ sang `through-acrylic` khi 1 mặt hoặc `mirror-front` khi 2 mặt; caption phải nói rõ _nhìn xuyên_ hay _in mặt sau_. Chọn trắng tự chuyển về 1 mặt; chọn upload riêng tự chuyển sang 2 mặt.
3. Toggle **Mặt trước / Mặt sau** để xem/chỉnh; 2D và PNG theo mặt đang chọn, 3D xoay để xem cả hai. Hai mode mặc định dùng ảnh/transform/remove-bg hiện tại của mặt trước và cập nhật theo mọi thay đổi, không upload bản sao.
4. Ảnh sau riêng mặc định căn giữa, **giữ tỉ lệ ảnh, cover rồi crop** theo cùng vùng in/silhouette và kích thước vật lý của mặt trước; không kéo giãn. User vẫn có thể điều chỉnh transform riêng, nhưng không đổi kích thước vật lý hoặc đường cắt của charm. Cảnh báo phần ảnh bị crop.
5. Đổi mode không tự xoá ảnh sau/transform đã upload; khi chọn lại ảnh riêng, khôi phục bản nháp. Xoá chỉ khi user chủ động yêu cầu.

Quy ước kiểm thử: nếu mặt trước hiển thị chữ hoặc mũi tên bất đối xứng, cả `through-acrylic` và `mirror-front` phải hiển thị ảnh **lật ngang đúng một lần** trong góc nhìn trực diện từ sau; `custom` giữ đúng chiều như user thấy khi chỉnh mặt sau. Outline bất đối xứng cũng phải khớp góc nhìn sau ở 2D, 3D và export. Hai mode lật có thể trông gần giống nhưng vẫn lưu số mặt in khác nhau.

### 5.5 Remove background

- Lazy `import("@imgly/background-removal")` chỉ khi user bấm “Xoá nền”; hiện progress tải model + xử lý.
- Self-host model/wasm (option `publicPath`) để không phụ thuộc CDN bên thứ ba và cache tốt.
- Không preload model khi vào trang hoặc chọn frame. Trên mobile, báo trước tải dữ liệu/xử lý có thể nặng; có progress, hủy tác vụ khi được hỗ trợ và bỏ kết quả cũ nếu user đã thay ảnh. Worker/lazy-load không bảo đảm máy yếu xử lý được.
- Kết quả là PNG có alpha → nén WebP (giữ alpha) → upload lên Sanity như `processedAssetRef`; giữ ảnh gốc để user tắt/bật lại.
- Fallback khi máy yếu / trình duyệt lỗi wasm: báo lỗi thân thiện, gợi ý upload PNG trong suốt.

### 5.6 Export PNG

- Render lại bằng renderer 2D trên **offscreen canvas** theo kích thước thật × scale (1x/2x/3x), nền trong suốt.
  - `Full keychain`: charm + ring.
  - `Charm only`: chỉ acrylic + ảnh.
  - Export **mặt đang chọn**: mặt sau phản ánh đúng xuyên acrylic / trắng / lật ngang / ảnh riêng. User chuyển mặt để export thêm file còn lại; không bắt buộc ZIP.
- Tên file: `inut-keychain-<designId>-<front|back>-<variant>@<scale>x.png`.
- Mỗi lần export: flush auto-save ngay (không chờ debounce) + track analytics.
- Export tách khỏi canvas preview/DPR: dựng lại từ config/geometry, không chụp canvas đang bị hạ chất lượng. Dùng `toBlob` bất đồng bộ và giới hạn tổng pixel theo khả năng thiết bị; nếu export 3x vượt giới hạn, báo rõ và cho user chọn scale nhỏ hơn, không âm thầm đổi scale.
- 1x/2x/3x là hệ số độ phân giải PNG, **không phải hệ số kích thước mm**. Giữ tỉ lệ lỗ/charm theo geometry; PNG showcase không phải file in chuẩn kích thước, nhất là khi được resize/in ở DPI khác.

### 5.7 Ngân sách xử lý cho mobile

Đây là hướng triển khai và mục tiêu cần đo, **chưa phải cam kết đã đạt trên thiết bị thật**.

| Hạng mục    | Cách giữ UI nhẹ                                                                                                                                                                                                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tải đầu     | Chỉ tải builder 2D và asset cần dùng; Three/R3F, model remove-bg và công cụ contour nằm ở chunk riêng. Không mount 3D ẩn hoặc tải toàn bộ ring PNG độ phân giải lớn khi vào trang.                                                                                                                              |
| Preview     | Canvas theo kích thước hiển thị; DPR mobile cap khoảng **1–1.5**, giảm chất lượng nếu frame time xấu. Cấu hình preview không làm đổi geometry hoặc chất lượng export.                                                                                                                                           |
| Render loop | Gom pointer update theo `requestAnimationFrame`, chỉ vẽ khi state/view đổi. R3F dùng demand rendering khi đứng yên; animation do user bật mới cần loop. Pause khi tab/trang không hiển thị.                                                                                                                     |
| Geometry    | Cache frame theo shape/size; không parse SVG, trace alpha, simplify hay dựng lại mesh trên từng pointer event. Die-cut chạy worker, debounce và bỏ job/kết quả lỗi thời; kéo ảnh dùng preview nhẹ rồi cập nhật outline chính xác khi dừng. Export phải đợi geometry của config mới nhất, không dùng outline cũ. |
| Ảnh/texture | Dùng bản resize phù hợp cho preview, không giữ nhiều canvas ảnh đầy đủ cho cả hai mặt. Giới hạn upload/độ phân giải trước xử lý nặng; revoke object URL và dispose texture/geometry/material khi thay hoặc unmount.                                                                                             |
| WebGL       | Feature-detect thay vì chỉ dựa user-agent; nếu thiếu WebGL, mất context hoặc không đạt mức dùng được, quay về 2D và giữ config. Giải phóng renderer 3D khi không dùng, không để hai renderer chạy ngầm.                                                                                                         |
| Tác vụ dài  | Upload, remove-bg và export có trạng thái riêng, progress/lỗi/thử lại; không khoá toàn bộ trang bằng xử lý đồng bộ. Có fallback khi Worker/OffscreenCanvas không được hỗ trợ.                                                                                                                                   |

Tiêu chí nghiệm thu khi triển khai: kiểm tra ở **320, 360, 390, 430 px**, cả xoay ngang/bàn phím/safe area, Android Chrome và iOS Safari. Dùng ít nhất một Android tầm trung và một iPhone làm thiết bị chuẩn; ghi rõ model/browser và đo thay vì chỉ dùng desktop responsive mode. Mục tiêu tương tác preview thông thường **≥30 FPS** khi drag/pinch với ảnh tối đa 2048 px, thử cả frame và die-cut; nếu 3D nặng thì giảm hiệu ứng/DPR hoặc fallback 2D.

Các luồng cần chạy trên mobile: upload/thay/xoá ảnh, đủ bốn mode mặt sau, crop ảnh khác tỉ lệ, chuyển 2D/3D, đổi đủ tám size với lỗ 4 mm, remove-bg thành công/lỗi, export 1x/2x/3x, reload draft và mất WebGL context. Không được tràn ngang, che nút Export hoặc mất config khi đổi mode/chất lượng.

---

## 6. Backend & Sanity

### 6.1 Schema mới `keychainDesign` (`sanity/schemas/keychainDesign.js`)

| Field            | Type                           | Ghi chú                                                                  |
| ---------------- | ------------------------------ | ------------------------------------------------------------------------ |
| `draftId`        | string (readOnly)              | UUID sinh ở client, unique                                               |
| `status`         | string                         | `draft` → `exported` → `ordered`                                         |
| `config`         | object (mirror KeychainConfig) | Lưu field có cấu trúc thay vì JSON string để query/hiển thị trong Studio |
| `frontImage`     | image                          | Ảnh mặt trước đã nén                                                     |
| `frontProcessed` | image                          | Ảnh mặt trước đã xoá nền                                                 |
| `backImage`      | image                          | Ảnh mặt sau riêng đã nén; có thể giữ khi đổi mode để khôi phục bản nháp  |
| `backProcessed`  | image                          | Ảnh mặt sau riêng đã xoá nền                                             |
| `previewImage`   | image                          | PNG preview nhỏ (~800px) cập nhật khi export                             |
| `exportCount`    | number                         |                                                                          |
| `lastSavedAt`    | datetime                       |                                                                          |
| `revision`       | number                         | Chống bản lưu cũ ghi đè config mới hơn                                   |
| `order`          | reference (sau này)            | Link tới order khi đặt hàng                                              |

Lưu asset reference tại các trường image trên; khi đọc/ghi, API ánh xạ sang `front` / `back.custom` của config, tránh có hai bản reference độc lập dễ lệch nhau. Hai mode lấy ảnh mặt trước và mode trắng không tạo bản sao ảnh ở Sanity.

Không chủ động thu thập tên/SĐT ở document này; **ảnh user vẫn có thể chứa thông tin cá nhân**.

### 6.2 API routes

| Route                                    | Mô tả                                                                                                                                                                            |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /api/sanity/upload-image` (có sẵn) | Tái dùng để upload ảnh qua `uploadImageToSanity` (`api-client/sanity-upload.ts`, đã nén WebP, max 2048px)                                                                        |
| `PUT /api/keychain/design`               | Upsert theo `draftId` (`createIfNotExists` + `patch.set`). Validate bằng `yup`, rate-limit bằng `utils/rateLimit`, chỉ nhận `ringId/frameId/size` hợp lệ trong `data/keychain/*` |

- Token Sanity chỉ ở server (`api-client/sanity-server.ts`), không lộ ra browser.
- `draftId` lưu localStorage key **`inut-keychain-draft`** (tách biệt `inut-lighters-cart`) → reload trang khôi phục thiết kế và ảnh custom đã lưu. ID đơn thuần không phải cơ chế cấp quyền; cần xác thực/quyền truy cập draft phù hợp ở server.
- Upload mặt sau riêng theo cùng quy trình nén/validate như mặt trước; đổi mode/lật ảnh không upload trùng. Config, mode, transform và reference mới nhất được lưu cùng revision để request cũ không ghi đè bản mới.
- Validate cặp `printSides` / `back.mode` và **`hole.diameterMm === 4`** ở server, không chỉ dựa UI.
- Lưu khi rời trang: thử `fetch(..., { keepalive: true })` / `navigator.sendBeacon` trên `pagehide`; trình duyệt không bảo đảm gửi thành công, nên vẫn cần debounce, flush khi export và trạng thái lưu/lỗi.
- Chỉ gửi khi config thay đổi thực sự (so sánh hash) để không spam Sanity.

### 6.3 Dọn rác & privacy

- Ảnh upload ngay khi chọn → sẽ có nhiều draft bỏ dở. Đề xuất cron (giống `pages/api/cron/*`) xoá `keychainDesign` `status = draft` > 30 ngày và asset không còn được tham chiếu.
- Thông báo dưới nút upload cần nói rõ ảnh được lưu để phục vụ thiết kế, chính sách lưu/xoá và quyền truy cập; xác nhận consent phù hợp trước khi triển khai.
- Kiểm tra cấu hình dataset và quyền đọc asset: URL asset Sanity có thể truy cập công khai tuỳ cấu hình. Không coi UUID hoặc việc ẩn URL trong UI là bảo mật; nếu ảnh cần riêng tư, chọn storage/quyền truy cập phù hợp trước khi public.

---

## 7. Cấu trúc code đề xuất

```text
pages/builder/keychain/index.tsx           # SSG page, dynamic import builder (ssr: false)
pages/api/keychain/design.ts               # upsert design
components/keychain-builder/
  KeychainBuilder.tsx                      # layout + state wiring
  RingPicker.tsx  FramePicker.tsx  SizeSidesPicker.tsx  BackModePicker.tsx
  ImageControls.tsx  MaterialControls.tsx  ExportPanel.tsx
  preview/Preview2D.tsx  preview/Preview3D.tsx
  render/drawKeychain.ts                   # Canvas 2D renderer dùng chung preview + export + texture 3D
  geometry/frameGeometry.ts  geometry/dieCut.worker.ts
  hooks/useKeychainConfig.ts  hooks/useAutoSave.ts  hooks/useRemoveBackground.ts
  constants.ts  types.ts
data/keychain/rings.ts  data/keychain/frames.ts
public/keychain/rings/*  public/keychain/frames/*
api-client/keychain.ts
sanity/schemas/keychainDesign.js
```

SVG hiện nằm trong `specs/001-keychain-builder/inputs/frames/` dưới dạng nháp; chỉ đưa bản được chọn/duyệt sang `public/keychain/frames/` khi triển khai. Ring PNG do user cung cấp sau khi xác nhận quyền sử dụng.

State: `useReducer` hoặc `zustand` (đã có) — không thêm thư viện state mới.

Thư viện mới: `@imgly/background-removal`, `d3-contour`, `simplify-js`, `polygon-clipping` (đều lazy/worker).

---

## 8. Analytics (GA4 + Umami qua `utils/analytics.ts` & `utils/umamiAnalytics.ts`)

| Event                       | Khi nào                    | Params chính                                 |
| --------------------------- | -------------------------- | -------------------------------------------- |
| `keychain_builder_view`     | Vào trang                  | —                                            |
| `keychain_ring_select`      | Chọn ring                  | `ring_id`                                    |
| `keychain_shape_select`     | Chọn frame / die-cut       | `shape_type`, `frame_id`                     |
| `keychain_back_mode_select` | Chọn cách hiển thị mặt sau | `print_sides`, `back_mode`                   |
| `keychain_image_upload`     | Upload thành công          | `side`                                       |
| `keychain_remove_bg`        | Xoá nền xong / lỗi         | `side`, `success`, `duration_ms`             |
| `keychain_view_mode`        | Đổi 2D ↔ 3D                | `mode`                                       |
| `keychain_export`           | Export                     | `variant`, `scale`, `print_sides`, `size_cm` |

Mỗi hành động chỉ track **1 lần** cho mỗi hệ thống (không duplicate).

---

## 9. Chuẩn bị cho đặt hàng (phase sau)

- Cart item mới với `builderType: "keychain"`, `keychainDesignId`, `previewImage`, `sizeCm`, `printSides`, `ringId`, `quantity` — **giữ nguyên key `inut-lighters-cart`** và shape item cũ (chỉ thêm field optional, không phá lighter).
- Lưu/cố định thêm `back.mode`, ảnh và transform của từng mặt vào snapshot design khi đặt hàng. `through-acrylic` và `mirror-front` phải giữ khác nhau dù nhìn tương tự; `white` thuộc lựa chọn 1 mặt trong UI, nhưng lớp trắng/cách tính sản xuất cần team duyệt.
- Giá tính ở `utils/priceCalculator.ts` theo `sizeCm × printSides × ring × quantity` (+ phụ phí die-cut nếu có). **Chưa có bảng giá — không tự đặt giá.**
- Order: thêm item type keychain vào order schema (hoặc `ordersKeychain` riêng) với reference tới `keychainDesign`; `_key` unique cho mỗi array item. Khi đặt hàng → `keychainDesign.status = "ordered"` + set `order`.
- File in production sau này: `print-front.png` / `print-back.png` theo DPI đã duyệt + `cut-line.svg` từ geometry mm, giữ lỗ 4 mm. Geometry hiện tại chỉ là nền tảng; còn cần quy cách in, bleed, lớp trắng và dung sai đã duyệt, **chưa có file production sẵn**.
- Deep-link admin/designer: `/builder/keychain?designId=...` (tương tự `previewUrl` của lighter builder).

---

## 10. Phân phase

| Phase | Nội dung                                                                                                                                                      |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | **Đã tạo 18 master SVG 3 cm, lỗ 4 mm.** Team duyệt/chỉnh geometry và thông số gia công; user cung cấp ring PNG có quyền sử dụng, kèm metadata. Không cần GLB. |
| 1     | Route + layout dark **mobile-first**, picker, upload + transform cảm ứng, preview 2D mặc định, export PNG; dựng/kiểm tra lỗ 4 mm ở mọi size.                  |
| 2     | Đủ các mode mặt sau 1/2 mặt, crop ảnh sau riêng theo mặt trước, preview 3D lazy-load với ring PNG và quality/fallback mobile.                                 |
| 3     | Die-cut theo viền ảnh trước + remove background (worker, lazy-load, hủy/bỏ job cũ).                                                                           |
| 4     | Sanity + auto-save + khôi phục draft + cron + analytics; QA Android/iOS, đo hiệu năng và hoàn tất tiêu chí mobile ở §5.7.                                     |
| 5     | Sau MVP: đặt hàng, cart, pricing, order schema, file in production.                                                                                           |

**Phase 1–4 đều thuộc MVP**, không lùi die-cut, 2 mặt hay 3D sang sau MVP. Phase 4 có thể làm song song từ Phase 1 nếu muốn thu thập dữ liệu sớm.

---

## 11. Rủi ro

| Rủi ro                                                                                                                          | Giảm thiểu                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **License AGPL-3.0** của `@imgly/background-removal` — dùng trên web thương mại có thể buộc open-source hoặc mua license IMG.LY | Xác nhận với IMG.LY / mua commercial license trước khi public; giữ abstraction `removeBackground()` để đổi sang server API (remove.bg, rembg self-host)  |
| Model remove-bg nặng (~40–80MB), chậm trên mobile                                                                               | Lazy load, self-host + cache, progress UI, chỉ chạy khi user bấm                                                                                         |
| 3D + acrylic transmission nặng trên máy yếu                                                                                     | Lazy load, giảm DPR, fallback 2D, tắt transmission trên mobile                                                                                           |
| Mobile thiếu RAM hoặc canvas/WebGL context bị mất lúc xử lý/export                                                              | Giới hạn ảnh/pixel, dispose tài nguyên, progress và retry/fallback 2D giữ config; không chạy nhiều tác vụ nặng đồng thời.                                |
| Ring PNG phẳng khi xoay 3D, lật khi nhìn từ sau, không có phản chiếu kim loại thật                                              | Xác nhận đây là giới hạn MVP; nếu sau này cần chân thực mới cân nhắc model 3D riêng.                                                                     |
| Ring từ website khác có thể không có quyền tái sử dụng                                                                          | Chỉ dùng khi có quyền/license phù hợp; nếu không, dùng ảnh team tự tạo hoặc asset được cấp phép.                                                         |
| Scale nguyên SVG làm lỗ không còn 4 mm; tai/khoảng an toàn có thể chưa đạt gia công                                             | Dựng lại lỗ r = 2 mm sau khi scale outline, kiểm tra 18 frame × 8 size và die-cut; team duyệt dung sai/khoảng an toàn, không dùng bản nháp làm file cắt. |
| Crop mặt sau hoặc phản chiếu 2D/3D sai chiều                                                                                    | Dùng chung geometry; test frame bất đối xứng, ảnh có chữ, cả 4 mode và 8 size; chỉ mặt trước quyết định silhouette.                                      |
| Die-cut ra outline xấu (ảnh nhiều mảnh rời, lỗ nhỏ)                                                                             | Dọn contour/fill lỗ nội bộ, border và tai theo ngưỡng đã duyệt; giữ riêng lỗ gắn móc 4 mm, cảnh báo nếu hình không gia công được.                        |
| Spam upload / Sanity quota                                                                                                      | Rate limit, debounce, hash so sánh, giới hạn 10MB/2048px, cron dọn                                                                                       |
| Preview ≠ sản phẩm thật                                                                                                         | Disclaimer kích thước/màu xấp xỉ (như maxmuffin)                                                                                                         |

---

## 12. Câu hỏi còn mở

1. Ngoài export từng mặt đang xem, có cần nút tải **cả hai mặt** thành 2 file riêng? (Không cần ZIP animation trong MVP.)
2. Team sản xuất xác nhận nền sau trắng, lớp trắng lót, safe area/tai, dung sai gia công để đạt **lỗ thành phẩm 4 mm** và các cặp ring/size hợp lệ.
3. Có cần thêm text/sticker lên charm không? (Đề xuất để sau.)
4. Có cần chọn loại acrylic (trong, nhũ, holo, glitter) để chuẩn bị cho đặt hàng?
5. Quyền dùng ring PNG tham khảo, consent và chính sách lưu/xoá/quyền đọc ảnh user.
