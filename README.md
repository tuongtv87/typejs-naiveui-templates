# Frontend Vue 3 + Electron + TypeScript + Ant Design

Đây là dự án kết hợp Vue 3, TypeScript, Electron và Ant Design, cho phép ứng dụng chạy trên nhiều nền tảng (Web, Windows, macOS, Linux).

## Yêu cầu hệ thống

- Node.js v14.x hoặc mới hơn
- npm v6.x hoặc mới hơn

## Cài đặt

```bash
npm install
```

## Phát triển

### Chạy ở môi trường Web

```bash
npm run dev
```

### Chạy ở môi trường Electron

```bash
npm run electron:dev
```

## Build

### Build cho Web

```bash
npm run build
```

### Build cho Electron (Windows, macOS, Linux)

```bash
npm run electron:build
```

## Cấu trúc dự án

- `src/`: Mã nguồn Vue 3
- `electron/`: Mã nguồn Electron
- `dist/`: Build cho Web
- `dist-electron/`: Build Electron
- `release/`: Các file cài đặt cho Windows, macOS, Linux

## Công nghệ sử dụng

- Vue 3: Framework giao diện người dùng
- TypeScript: Ngôn ngữ lập trình
- Electron: Framework cho ứng dụng desktop
- Ant Design Vue: Thư viện UI components
- Vite: Công cụ build nhanh
- Babel: Transpiler cho JavaScript
