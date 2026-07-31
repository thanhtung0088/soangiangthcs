# Soạn Giảng AI - THCS

Ứng dụng web soạn giảng AI chuyên nghiệp dành cho giáo viên THCS, gồm 8 luồng:

1. **KHBD theo CV 5512** — kế hoạch bài dạy đầy đủ 4 hoạt động, xuất Word đúng thể thức.
2. **Bài giảng trình chiếu PPT** — sinh nội dung slide, ảnh minh hoạ AI (Imagen), xuất `.pptx`, liên kết mở Canva.
3. **Đề cương ôn tập** — hệ thống kiến thức + câu hỏi ôn luyện, xuất Word.
4. **Đề kiểm tra theo CV 7991** — ma trận, bản đặc tả, đề bài, đáp án; xuất Word đầy đủ hoặc PDF nhanh để in.
5. **Phiếu học tập** — xuất Word/PDF.
6. **Trò chơi tương tác** — Ai là triệu phú, Rung chuông vàng, Ô chữ... xuất Word bộ câu hỏi.
7. **Kịch bản video minh hoạ** — storyboard chi tiết để dựng bằng Canva Video/CapCut (app không tự render video).
8. **Sáng kiến kinh nghiệm (SKKN)** — báo cáo đúng thể thức Nghị định 30/2020/NĐ-CP.

## Công nghệ

- React 18 + TypeScript + Vite + TailwindCSS
- AI: Google Gemini API (`@google/genai`, model `gemini-2.5-flash`; ảnh minh hoạ dùng `imagen-3.0-generate-002`)
- Xuất file: `docx` (Word), `pptxgenjs` (PowerPoint), `jspdf` (PDF nhanh)

## Chạy thử ở máy local

```bash
npm install
export GEMINI_API_KEY="dán_api_key_của_bạn"
npm run dev
```

Lấy API key miễn phí tại: https://aistudio.google.com/apikey

## Deploy lên Vercel

1. Đẩy code lên GitHub repo.
2. Vào [vercel.com](https://vercel.com) → **New Project** → chọn repo này.
3. Vercel tự nhận diện Vite, không cần chỉnh Build Command/Output Directory.
4. Vào **Project Settings → Environment Variables**, thêm:
   - `GEMINI_API_KEY` = API key của bạn (Production + Preview + Development).
5. Deploy. Nếu gặp lỗi 404 khi refresh trang, kiểm tra file `vercel.json` đã có trong repo (đã cấu hình sẵn rewrite về `index.html`).

## Cấu trúc thư mục

```
src/
  types.ts                    # Schema dữ liệu cho cả 8 luồng
  prompts/promptTemplates.ts  # Toàn bộ prompt mẫu chi tiết gửi Gemini
  services/
    geminiService.ts          # Gọi Gemini API (text + ảnh)
    exportService.ts          # Xuất Word/PPTX/PDF cho từng luồng
    docxHelpers.ts            # Style dùng chung khi build file Word (Times New Roman, quốc hiệu, bảng...)
  components/
    Dashboard.tsx              # Màn hình chọn luồng
    ModuleShell.tsx             # Layout UI dùng chung (form trái - kết quả phải)
    modules/                    # 8 module tương ứng 8 luồng
  App.tsx
```

## Việc cần làm tiếp (gợi ý)

- Thêm xác thực người dùng thật (Firebase Auth) thay cho bản mock localStorage hiện tại (Đăng ký/Đăng nhập, license) nếu muốn dùng đa thiết bị và xác thực license tự động khi nhận được chuyển khoản.
- Đếm "đang online" hiện là số ước lượng hiển thị minh hoạ; cần WebSocket/Firebase Realtime DB nếu muốn số liệu thật.
- Thêm lưu lịch sử bài soạn (Firestore) để GV xem lại các bài đã soạn trước đó.
- Tinh chỉnh thêm layout PPTX (theme màu theo môn học, logo trường).
- Cân nhắc thêm rate-limit/quota phía server (Vercel Serverless Function) để tránh lộ API key và kiểm soát chi phí Gemini, thay vì gọi thẳng từ client như bản hiện tại.

## Tính năng giao diện mới (cập nhật gần nhất)

- **Bo góc nhỏ nhất**: toàn bộ thẻ/nút/input dùng `rounded-md`/`rounded-lg` (trước là bo tròn lớn).
- **Đính kèm tài liệu tham khảo**: mỗi luồng có nút "+" cho phép tải lên tối đa 8 file (ảnh/Word/PDF/PPT) từ máy, hiển thị danh sách kèm nút "x" xoá. Ảnh và PDF được gửi trực tiếp cho Gemini (đa phương thức); Word/PPT chỉ được đưa tên file vào ngữ cảnh (Gemini không đọc trực tiếp nội dung nhị phân Word/PPT qua inlineData).
- **Dropdown 16 môn học THCS** theo Chương trình GDPT 2018, dùng chung cho cả 8 luồng.
- **HeaderBar**: avatar tải từ máy (lưu localStorage), Đăng ký/Đăng nhập (mock, lưu cục bộ trình duyệt), ngày tháng hiện tại, nút "Nâng cấp Pro" mở modal 3 gói (Tháng/Năm học/Trường học) kèm thông tin chuyển khoản (Nguyễn Thanh Tùng - 0916033681 - STK 916033681 - Ngân hàng Đông Á/Vikki Digital Bank) + mã QR Zalo, và nút tạo mã license (client-side, cần đối soát thủ công qua Zalo).
- **Footer**: số người đang online (ước lượng hiển thị), tổng lượt truy cập (đếm bằng localStorage), hộp góp ý nhanh, dòng "Lập trình và TK: Nguyễn Thanh Tùng".
- **Giao diện Glassmorphism**: nền gradient nhiều màu + các thẻ `glass`/`glass-card`/`glass-dark` (backdrop-blur) định nghĩa trong `src/index.css`.
- **Chatbot góc dưới bên phải**: icon robot 🤖 nổi nhẹ (animation `animate-float`), bấm vào mở khung chat gọi Gemini để hỗ trợ nhanh cách dùng app.
- **SKKN**: đã tích hợp đầy đủ theo prompt mẫu chi tiết bạn cung cấp (Phần I Mở đầu, Phần II Nội dung với 4 chương, Phần III Kết luận - Kiến nghị, bảng số liệu trước/sau, tài liệu tham khảo, phụ lục).
- **Bài giảng PPT / Đề cương / Phiếu học tập / Trò chơi**: đã cập nhật theo đúng cấu trúc trong file "FROMPT_TỔNG_HỢP_SOẠN_GIẢNG" và "PROMPT_MẪU...POWERPOINT" bạn gửi.

### Lưu ý quan trọng về các tính năng mock

Đăng ký/đăng nhập, license, số người online và tổng lượt truy cập trong bản này đều là **mô phỏng phía client** (lưu trong `localStorage` của trình duyệt), phù hợp để demo/dùng nội bộ. Không dùng được đa thiết bị, không có xác thực thanh toán tự động. Khi triển khai chính thức cho nhiều GV, cần backend thực sự (Firebase/Node.js) để: xác thực tài khoản, xác minh license sau khi nhận chuyển khoản, và đếm truy cập/online chính xác dùng chung giữa mọi người dùng.

## Lưu ý bảo mật

Bản hiện tại gọi Gemini API **trực tiếp từ trình duyệt** (giống file mẫu gốc), nghĩa là `GEMINI_API_KEY` sẽ lộ trong bundle JS phía client. Phù hợp để dùng nội bộ/thử nghiệm. Nếu triển khai cho nhiều GV dùng công khai, nên chuyển các hàm trong `geminiService.ts` sang chạy trong Vercel Serverless Function (`/api/*`) để giấu key — có thể yêu cầu bổ sung ở lượt sau.
