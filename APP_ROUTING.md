# App Routing
```
├── /                               # Trang chủ
├── san-pham/                       # Sản phẩm
│   ├── skin-laptop/                # Skin laptop
│   │   └── [slug]/                 # Chi tiết sản phẩm
│   ├── skin-nut-phim/              # Skin nút phím
│   │   └── [slug]/                 # Chi tiết skin nút phím
│   └── lighters/                   # Bật lửa
│       └── [slug]/                 # Chi tiết bật lửa
├── services/                       # Dịch vụ (Mega menu)
│   ├── sticker/                    # Stickers
│   │   ├── sticker-sheet/          # Sticker Sheet
│   │   ├── sticker-magnet/         # Sticker Magnet
│   │   ├── sticker-diecut/         # Sticker Diecut
│   │   └── sticker-kisscut/        # Sticker Kisscut
│   ├── ca-nhan-hoa/                # Cá nhân hóa
│   │   ├── skin-laptop-customize/  # Tùy chỉnh skin laptop
│   │   ├── skin-nut-phim-customize/ # Tùy chỉnh skin nút phím
│   │   ├── skin-dien-thoai-customize/ # Tùy chỉnh skin điện thoại
│   │   └── skin-bat-lua-customize/ # Tùy chỉnh skin bật lửa
│   ├── an-pham-luu-niem/           # Ấn phẩm lưu niệm
│   │   ├── acrylic-magnet/         # Acrylic Magnet
│   │   ├── moc-khoa-mica/          # Móc khóa Mica
│   │   ├── pin-cai-ao-mica/        # Pin cài áo Mica
│   │   ├── in-postcard/            # In Postcard
│   │   ├── thank-card-gift-card/   # Thank card & Gift card
│   │   └── in-anh-da-nang/         # In ảnh Đà Nẵng
│   ├── an-pham-van-phong/          # Ấn phẩm văn phòng
│   │   ├── bang-cung-in-thong-tin/ # Bảng cứng in thông tin
│   │   ├── giay-khen-giay-chung-nhan/ # Giấy khen & Giấy chứng nhận
│   │   ├── in-bi-thu/              # In bì thư
│   │   └── so-tay-ky-yeu-so-bam-ghim/ # Sổ tay & Kỷ yếu
│   ├── an-pham-su-kien/            # Ấn phẩm sự kiện
│   │   ├── hashtag-cam-tay/        # Hashtag cầm tay
│   │   └── poster-decal/           # Poster & Decal
│   └── an-pham-tiep-thi/           # Ấn phẩm tiếp thị
│       ├── catalogue-brochure/     # Catalogue & Brochure
│       └── in-card-visit/          # In Card Visit
├── blog/                           # Blog
│   └── [slug]/                     # Chi tiết bài viết blog
├── checkout/                       # Thanh toán
│   └── lighters.tsx                # Thanh toán bật lửa
├── contact/                        # Liên hệ
│   └── form/                       # Nhận báo giá (Form)
├── about-us/                       # Về chúng tôi
├── order-tracking/                 # Theo dõi đơn hàng
│   └── lighters/                   # Theo dõi đơn bật lửa
│       └── [slug]/                 # Chi tiết đơn hàng
├── search/                         # Tìm kiếm
├── policies-terms/                 # Chính sách & Điều khoản
│   ├── chinh-sach-bao-hanh-doi-tra/
│   ├── chinh-sach-bao-ve-thong-tin-khach-hang/
│   ├── dieu-khoan-su-dung/
│   ├── faqs/
│   ├── thong-tin-doanh-nghiep/
│   └── thong-tin-thanh-toan/
└── api/                            # API Routes
    └── telegram/                   # Telegram Notifications
```

## AI Governance Structure
AI-related configuration and logic are managed in a centralized structure:
- **Source of Truth**: `/.agents/`
- **Trae/Cursor Bridge**: `/.trae/` (symlinked to `/.agents/`)
- **Copilot Bridge**: `/.github/` (symlinked to `/.agents/`)
- **Codex Bridge**: `/.codex/` (symlinked to `/.agents/`)

**Rule**: All new AI files must be created in `/.agents/`. Direct creation in `/.trae/` is prohibited.
