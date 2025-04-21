# Naive UI Frontend Project (Tinker)

Đây là một dự án frontend được xây dựng bằng Vue 3, Vite và thư viện component Naive UI. Dự án này bao gồm các chức năng cơ bản như đăng nhập, giao diện người dùng chính với menu bên và header, cùng khả năng chuyển đổi theme sáng/tối.

## Công nghệ sử dụng

*   **Framework:** [Vue 3](https://vuejs.org/) (Composition API)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **UI Library:** [Naive UI](https://www.naiveui.com/)
*   **Routing:** [Vue Router](https://router.vuejs.org/)
*   **Icons:** [@vicons/ionicons5](https://vicons.js.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **(Tiềm năng):** [Electron](https://www.electronjs.org/) (Có sẵn các script trong `package.json`)

## Tính năng chính

*   **Đăng nhập:** Trang đăng nhập đơn giản, xác thực dựa trên biến môi trường.
*   **Giao diện chính:** Bố cục với Header, Menu bên trái (Sider) có thể thu gọn và vùng Nội dung (Content).
*   **Theme Sáng/Tối:** Chuyển đổi giữa theme sáng và tối, lựa chọn được lưu vào `localStorage`.
*   **Sử dụng Naive UI:** Tận dụng các component sẵn có của Naive UI.

## Cấu trúc thư mục

```
.
├── dist/                     # Thư mục build cho web
├── dist-electron/            # Thư mục build cho Electron (nếu sử dụng)
├── node_modules/             # Dependencies
├── public/                   # Tài nguyên tĩnh
├── src/
│   ├── assets/               # Hình ảnh, fonts,...
│   ├── components/           # Các component tái sử dụng (vd: NaiveLayout.vue)
│   ├── layout/               # Các component layout chính (vd: LoginLayout.vue)
│   ├── router/               # Cấu hình Vue Router (index.ts)
│   ├── styles/               # (Optional) CSS/SCSS toàn cục hoặc theo module
│   ├── views/                # Các component tương ứng với route (vd: HomeView.vue)
│   ├── App.vue               # Component gốc của ứng dụng
│   └── main.ts               # Điểm khởi đầu ứng dụng Vue
├── .env                      # (Cần tạo) File chứa biến môi trường
├── .gitignore
├── index.html                # Template HTML chính
├── package.json              # Thông tin dự án và dependencies
├── README.md                 # File này
├── tsconfig.json             # Cấu hình TypeScript
└── vite.config.ts            # Cấu hình Vite
```

## Cài đặt

1.  **Clone repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```
2.  **Cài đặt dependencies:**
    ```bash
    npm install
    # hoặc
    yarn install
    ```

## Cấu hình Biến Môi trường

Tạo một file tên là `.env` ở thư mục gốc của dự án và thêm các biến sau để cấu hình thông tin đăng nhập:

```env
VITE_LOGIN_USER=your_username
VITE_LOGIN_PASS=your_password
```

Thay `your_username` và `your_password` bằng thông tin đăng nhập bạn muốn sử dụng.

## Chạy dự án

### Chế độ Development (Web)

```bash
npm run dev
# hoặc
yarn dev
```

Mở trình duyệt và truy cập vào địa chỉ được cung cấp (thường là `http://localhost:5173`).

### Chế độ Development (Electron)

(Yêu cầu Electron đã được cài đặt)

```bash
npm run electron:dev
# hoặc
yarn electron:dev
```

## Build dự án

### Build cho Web

```bash
npm run build
# hoặc
yarn build
```

Kết quả build sẽ nằm trong thư mục `dist/`.

### Build cho Electron

(Yêu cầu Electron và electron-builder đã được cài đặt và cấu hình)

```bash
npm run electron:build
# hoặc
yarn electron:build
```

Kết quả build sẽ nằm trong thư mục `release/`.
