/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0269a4',
          dark: '#014f7d',
        },
        // Màu riêng cho từng luồng soạn giảng (dùng cho nút, tiêu đề, viền, spinner...)
        khbd: '#0269a4',       // xanh dương - KHBD 5512
        ppt: '#f97316',        // cam - Bài giảng PPT
        outline: '#0d9488',    // xanh ngọc - Đề cương ôn tập
        test: '#e11d48',       // đỏ hồng - Đề kiểm tra 7991
        worksheet: '#4f46e5',  // chàm - Phiếu học tập
        game: '#db2777',       // hồng - Trò chơi tương tác
        video: '#7c3aed',      // tím - Kịch bản video
        skkn: '#b45309',       // vàng đồng - Sáng kiến kinh nghiệm
      },
    },
  },
  plugins: [],
};
