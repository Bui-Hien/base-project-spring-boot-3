# Core & Frontend - Shop Bán Tài Khoản Game Tích Hợp Hệ Thống Tự Động Hóa

Dự án là một hệ thống Full-Stack hoàn chỉnh được thiết kế để quản lý và vận hành cửa hàng bán tài khoản game trực tuyến (mặc định cấu hình cho Roblox và các danh mục tương tự). Hệ thống được trang bị các tính năng tự động hóa nâng cao như cổng thanh toán (VNPay, VietQR), chuyển đổi & truyền phát video (HLS streaming), hệ thống bảo mật phân quyền động (RBAC), và gửi thông báo tự động qua Telegram Bot.

---

## 🛠️ Công Nghệ Sử Dụng

### 1. Backend
- **Framework chính**: Spring Boot `3.4.2` (Java 17)
- **Bảo mật**: Spring Security 6 (Stateless Session) & JSON Web Token (JJWT `0.11.5`)
- **Cơ sở dữ liệu & ORM**: Spring Data JPA, Hibernate, MySQL Connector J
- **Giao dịch**: Spring Transaction Management (`spring-tx`)
- **Gửi Email**: Spring Mail Starter (Tích hợp SMTP Gmail cho xác thực tài khoản & OTP)
- **Tương tác Telegram**: TelegramBots Webhook (`6.9.7.1` & `9.1.0` abilities)
- **Xử lý tài liệu & Hình ảnh**: Apache POI (Excel `.xlsx`), Thumbnailator (tối ưu hóa hình ảnh tải lên)
- **Phân tích động**: Reflections Library (`0.10.2`)
- **Tiện ích toán học & bộ nhớ**: exp4j (tính toán công thức), JOL Core (Java Object Layout)
- **Xử lý đa phương tiện**: Chạy ngầm FFmpeg để chuyển đổi video sang định dạng HLS

### 2. Frontend
- **Framework**: React JS (sử dụng CRA `react-scripts 5.0.1`)
- **Giao diện & UI**: Material UI (`@mui/material` v6/v7), Styled Components
- **CSS**: Vanilla CSS & Tailwind CSS v3
- **Quản lý trạng thái (State Management)**: MobX & MobX React Lite
- **Router**: React Router DOM v6 (`6.22.3`)
- **Trình phát Video**: HLS.js (Chạy video dạng HTTP Live Streaming phân đoạn `.ts`)
- **Đa ngôn ngữ**: i18next & react-i18next
- **Biểu đồ**: Recharts (Thống kê và phân tích trực quan)
- **Các thư viện bổ sung**: Monaco Editor (Trình soạn thảo mã nguồn), React Big Calendar (Quản lý lịch biểu), Swiper (Slide trình chiếu), React Toastify (Thông báo nhanh)

---

## ✨ Các Tính Năng Nổi Bật

### 🔒 1. Phân Quyền & Bảo Mật Hệ Thống (RBAC)
- **Kiến trúc RBAC đầy đủ**: Hệ thống quản lý quyền truy cập thông qua mô hình phân quyền chặt chẽ: `User` -> `Group` -> `Role` -> `Permission`. Tất cả cấu hình phân quyền được lưu trữ trực tiếp trong cơ sở dữ liệu.
- **Xác thực JWT an toàn**: JWT token bao gồm Access Token và Refresh Token. Các Access Token được lưu trữ và kiểm soát thông qua bảng cơ sở dữ liệu `tbl_user_token`, cho phép Admin có quyền thu hồi (Revoke) phiên đăng nhập của người dùng ngay lập tức từ xa.
- **Bảo vệ tài khoản**: 
  - Đăng ký tài khoản yêu cầu kích hoạt qua đường link gửi về Email.
  - Tính năng quên mật khẩu & đổi mật khẩu thông qua OTP Email.
  - Cơ chế khóa tài khoản tạm thời (`isAccountNonLocked = false`) khi người dùng đăng nhập sai vượt quá 5 lần (`maxFailedLoginAttempts`).

### 💳 2. Tự Động Hóa Thanh Toán (VNPay & VietQR)
- **Cổng thanh toán VNPay**: Tự động tạo link thanh toán VNPay Sandbox với mã checksum chữ ký điện tử HmacSHA512 an toàn. Xử lý IPN callback, đối soát chữ ký phản hồi từ VNPay để cập nhật kết quả giao dịch và chuyển hướng người dùng về trang giao dịch tương ứng.
- **Tích hợp VietQR**: Tự động truy xuất thông tin tài khoản ngân hàng và cấu hình VietQR từ database thông qua `SystemConfig`, tự động gen mã QR chuyển khoản ngân hàng chứa đầy đủ thông tin số tiền và nội dung chuyển khoản động (`NAP_TIEN`).

### 📹 3. Chia Nhỏ Upload Video & Truyền Phát HLS (HTTP Live Streaming)
- **Chunked Upload**: Hỗ trợ tải lên các file video dung lượng lớn bằng cách chia nhỏ thành các tệp tin nhỏ (`.part`), tránh hiện tượng tràn bộ nhớ đệm (OutOfMemory) và lỗi timeout đường truyền.
- **Chuyển đổi video HLS chạy ngầm (Async)**: Sau khi các phân đoạn video được ghép lại hoàn chỉnh thành file `.mp4`, hệ thống sẽ kích hoạt một tiến trình bất đồng bộ (`@Async` chạy trên `ThreadPoolTaskExecutor` riêng biệt) gọi trực tiếp công cụ `FFmpeg` để phân tách video thành manifest `manifest.m3u8` và các file segment nhỏ `.ts` (mỗi segment dài 6 giây, mã hóa libx264 và âm thanh aac).
- **Trình phát mượt mà & Tối ưu hóa**: Phía Frontend sử dụng thư viện `HLS.js` kết hợp với thẻ video HTML5 để stream trực tiếp từ các segment giúp tải video nhanh hơn, giảm độ trễ, và người dùng không cần tải toàn bộ video về máy. File mp4 gốc và các chunk tạm thời sẽ được tự động xóa bỏ để tiết kiệm dung lượng đĩa cứng.

### 🤖 4. Telegram Notification Webhook Bot
- **Webhook Bot**: Hệ thống cấu hình Telegram Bot dạng Webhook (`TelegramWebhookBot`) để tối ưu hóa hiệu năng, nhận cập nhật tức thời từ Telegram API.
- **Liên kết tài khoản**: Người dùng có thể bấm vào link định dạng `https://t.me/<bot_username>?start=<user_uuid>`. Khi nhận được lệnh `/start`, bot sẽ trích xuất UUID, tìm kiếm người dùng trong hệ thống và lưu lại Chat ID của họ để tự động gửi thông báo biến động số dư hoặc giao dịch thành công.
- **Bảo mật Rate Limiter**: Sử dụng Google Guava `RateLimiter` trên mỗi Chat ID để tránh tình trạng Spam tấn công hệ thống Bot.

---

## ⚙️ Cấu Hình Môi Trường Hệ Thống

File cấu hình chính của Backend nằm tại `Backend/src/main/resources/application.yml`. Các tham số quan trọng cần lưu ý:

```yaml
spring:
  # Cấu hình tải tệp tin dung lượng lớn
  servlet:
    multipart:
      max-file-size: 2GB
      max-request-size: 2GB
  
  # Kết nối Cơ sở dữ liệu MySQL
  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3333/core?createDatabaseIfNotExist=true}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:root}
  
  # Cấu hình SMTP gửi mail kích hoạt/OTP
  mail:
    host: smtp.gmail.com
    port: 587
    username: buixuanhienmy@gmail.com
    password: oikykwowpdyyoqkm # Mật khẩu ứng dụng Gmail

# Thư mục lưu trữ tệp tin tải lên hệ thống
save-file-folder: ${SAVE_FILE_FOLDER:D:/roblox}
save-file-folder-public: ${save-file-folder}/public

# Đường dẫn cài đặt công cụ FFmpeg để transcode video
ffmpeg:
  path: C:/workspace/roblox/env/ffmpeg-2025-11-24-git-c732564d2e-essentials_build/bin/ffmpeg.exe

# Telegram Bot config
telegram:
  bots:
    transaction:
      username: hien_dev_test_bot
      token: 8420880049:AAGcTJrNfLtBvlbteVT40p4UFzwHT8id7_o
      webhookPath: /api/telegram/public/noti

# Cổng kết nối CORS của Frontend client
cors:
  allowed-origins: "http://localhost:3000, http://localhost:8071"
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Bước 1: Khởi động cơ sở dữ liệu
- Chạy MySQL Server (đảm bảo port trùng khớp với cấu hình trong `application.yml`, mặc định là `3333` hoặc chỉnh sửa lại theo môi trường của bạn).
- Tạo cơ sở dữ liệu tên là `core`.

### Bước 2: Cài đặt và khởi chạy Backend
1. Truy cập vào thư mục `Backend`:
   ```bash
   cd Backend
   ```
2. Đảm bảo đã cài đặt Java SDK 17 và Maven. Chạy lệnh để compile dự án:
   ```bash
   mvn clean compile
   ```
3. Khởi chạy ứng dụng Spring Boot:
   ```bash
   mvn spring-boot:run
   ```
   *Backend sẽ khởi chạy trên cổng mặc định là `8071`.*

### Bước 3: Cài đặt và khởi chạy Frontend
1. Truy cập vào thư mục `Frontend`:
   ```bash
   cd Frontend
   ```
2. Cài đặt các gói phụ thuộc bằng Yarn hoặc Npm:
   ```bash
   yarn install
   # hoặc
   npm install
   ```
3. Chạy Frontend trong môi trường phát triển (Development):
   ```bash
   yarn start
   # hoặc
   npm start
   ```
   *Frontend ứng dụng React sẽ được mở trên trình duyệt tại địa chỉ `http://localhost:3000`.*

---

## 📂 Cấu Trúc Dự Án Chính

```text
├── Backend/
│   ├── src/main/java/com/buihien/core/
│   │   ├── configuration/     # Cấu hình Spring Security, JWT PreFilter, Telegram Bot, VNPay...
│   │   ├── controller/        # REST APIs (Auth, User, Group, Role, Payment, Video, File...)
│   │   ├── domain/            # JPA Entities (User, Role, Group, FileDescription...)
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── repository/        # Spring Data JPA Repositories
│   │   └── service/           # Lớp nghiệp vụ (Business Service & Implementations)
│   └── pom.xml                # Quản lý Maven dependencies backend
│
├── Frontend/
│   ├── src/
│   │   ├── auth/              # Dịch vụ đăng nhập/đăng ký/quên mật khẩu API
│   │   ├── common/            # Bố cục giao diện chung (Layout, Loading, Navigation...)
│   │   ├── service/           # Các hàm gọi API Axios tương ứng với Service backend
│   │   ├── stores.js          # Quản lý MobX Root Store
│   │   ├── App.js             # Entrypoint định tuyến chính & check vai trò người dùng (Roles)
│   │   └── views/             # Các màn hình chính (User, Group, Role, SystemConfig, Login)
│   └── package.json           # Quản lý package dependencies frontend
└── README.md                  # Hướng dẫn dự án hiện tại
```
