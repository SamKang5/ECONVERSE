# ECONVERSE

ECONVERSE là một dự án học tập cá nhân được xây bằng React + TypeScript + Vite. Ứng dụng hướng tới học sinh THCS và THPT Việt Nam, giúp việc học Kinh tế học cơ bản và Tài chính cá nhân trở nên nhẹ hơn thông qua bài học ngắn, quiz nhận XP, theo dõi tiến độ và một thú cưng ảo có thể tùy biến.

## Ứng dụng này có gì

- Hai tuyến học chính: `Economics` và `Finance`
- Bài học ngắn theo dạng script, dễ đọc và dễ theo dõi
- Quiz thử thách với cơ chế sai thì làm lại, đúng thì nhận XP một lần
- Theo dõi tiến độ học và chuỗi ngày học
- Pet học tập có level, XP, tên riêng và khả năng đổi loài
- Shop phụ kiện dùng XP kiếm được từ việc học
- Góc `Tips` có mẹo nhớ bài, meme vui và media mockup
- Dữ liệu được lưu cục bộ bằng `localStorage`

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Lucide React
- LocalStorage

## How to run local demo

Requirements: Node.js 20+ and npm 10+.

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the local demo

   ```bash
   npm run dev
   ```

3. Open the demo

   ```text
   http://127.0.0.1:3000/
   ```

4. Optional verification

   ```bash
   npm run typecheck
   npm run build
   ```

Notes:
- No `.env` file is required for the current frontend demo.
- The Vite dev server is pinned to port `3000`. If that port is already in use, free it first and rerun `npm run dev`.
- The npm scripts intentionally call `vite` and `tsc` through `node ./node_modules/...` because plain `.bin` resolution can fail on Windows when the project folder path contains Unicode or special characters.

## Chạy local

Yêu cầu: Node.js 20+ và npm 10+

1. Cài dependencies

   ```bash
   npm install
   ```

2. Chạy môi trường local

   ```bash
   npm run dev
   ```

3. Kiểm tra TypeScript

   ```bash
   npm run typecheck
   ```

4. Build production

   ```bash
   npm run build
   ```

Phiên bản hiện tại không cần biến môi trường.

## Cấu trúc đáng chú ý

- `src/App.tsx`: điều phối state, route tab-level, lưu localStorage
- `src/components/Header.tsx`: điều hướng chính desktop/mobile
- `src/components/Dashboard.tsx`: landing screen, CTA, tiến độ, streak, pet status
- `src/components/LearnPage.tsx`: flow học gồm chọn chủ đề, xem bài, tóm tắt, quiz
- `src/components/QuizCard.tsx`: card câu hỏi với feedback và retry logic
- `src/components/PetPage.tsx`: trang pet, cá nhân hóa pet, kết nối với tiến độ học
- `src/components/ShopPage.tsx`: trang shop riêng cho việc mua/trang bị item
- `src/components/ShopItemCard.tsx`: hiển thị trạng thái item như sở hữu, khóa, đủ XP
- `src/components/MediaPage.tsx`: mẹo nhớ bài, meme builder và media mockup
- `src/components/PetDisplay.tsx`: render pet chính

## Hạn chế hiện tại

- Frontend-only, chưa có backend
- Tiến độ học và pet chỉ lưu bằng `localStorage`
- Chưa có đăng nhập hoặc đồng bộ đa thiết bị
- Phần “video lesson” hiện là mô phỏng bằng script, chưa có video/audio thật
- Nội dung bài học và media feed hiện vẫn đang hard-code trong frontend

## Hướng cải thiện tiếp theo

- Thêm nhiều bài học hơn cho từng tuyến
- Mở rộng hệ thống pet progression và shop economy
- Bổ sung thêm mẹo học ngắn, progress insights và content đa dạng hơn
- Tiếp tục polish responsive, spacing và motion cho trải nghiệm học tập mượt hơn
