// ============================================================
// THAM SỐ ĐẦU VÀO CHUNG (form bên trái ở mọi module)
// ============================================================
export interface BaseLessonInput {
  subject: string;      // Môn học
  grade: string;        // Lớp
  title: string;        // Tên bài học / chủ đề
  duration?: string;     // Số tiết
  objectives?: string;  // Mục tiêu / yêu cầu cần đạt (GV nhập tay, tuỳ chọn)
}

// ============================================================
// 1. KHBD - Kế hoạch bài dạy theo CV 5512/2020/BGDĐT
// ============================================================
export interface HoatDongStep {
  tenHoatDong: string;         // VD: "Hoạt động 1: Mở đầu"
  mucTieu: string;
  noiDung: string;
  sanPham: string;
  toChucThucHien: string;      // Mô tả các bước: Giao nhiệm vụ - Thực hiện - Báo cáo - Đánh giá, kết luận
  kiemTraDanhGia: string;      // Hình thức, công cụ, tiêu chí đánh giá của riêng hoạt động này
}

export interface KHBD5512Result {
  tenBai: string;
  monHoc: string;
  lop: string;
  soTiet: string;
  boSachGiaoKhoa: string;       // Mặc định "Kết nối tri thức với cuộc sống"
  mucTieu: {
    phamChat: string[];
    nangLucChung: string[];
    nangLucDacThu: string[];
    yeuCauCanDat: string[];    // Theo Chương trình GDPT 2018
  };
  thietBiHocLieu: {
    thietBiGiaoVien: string[];
    hocLieu: string[];
    thietBiHocSinh: string[];
    phanMemHocLieuSo: string[];
  };
  tienTrinh: HoatDongStep[]; // Mở đầu, Hình thành KT (từng đơn vị kiến thức), Luyện tập, Vận dụng (+ mở rộng nếu có)
  tichHopLienMon: string[];    // VD: "Toán: ...", "Tin học: ..."
  giaoDucSTEM: string;          // Mô tả yếu tố S-T-E-M + nhiệm vụ + sản phẩm; để trống nếu bài không phù hợp
  phatTrienNangLucSo: string[]; // Tìm kiếm thông tin, đánh giá nguồn tin, AI có trách nhiệm, đạo đức số...
  longGhepGiaoDuc: string[];    // An toàn giao thông, môi trường, tài chính, hướng nghiệp... (chỉ nội dung phù hợp)
  phuongPhapDayHoc: string[];   // Kĩ thuật/phương pháp dạy học áp dụng trong bài
  phanHoaHocSinh: string;       // Gợi ý phân hoá HS khá/giỏi và hỗ trợ HS còn hạn chế
  luuYDayHoc: string;           // Lưu ý khi dạy trực tiếp / kết hợp học liệu số
}

// ============================================================
// 2. Bài giảng trình chiếu (PPT) + minh hoạ ảnh AI + liên kết Canva
// ============================================================
export interface SlideItem {
  soThuTu: number;
  phanTienTrinh: 'Khởi động' | 'Hình thành kiến thức' | 'Luyện tập' | 'Vận dụng' | 'Củng cố - đánh giá';
  tieuDe: string;
  noiDungGachDau: string[];   // các gạch đầu dòng hiển thị trên slide
  ghiChuGiangVien: string;     // speaker notes
  goiYHinhAnh: string;         // mô tả ảnh minh hoạ AI nên tạo cho slide này
  cauHoiTuongTac?: string;     // câu hỏi/hoạt động tương tác gắn với slide (nếu có)
}

export interface SlideDeckResult {
  chuDe: string;
  slides: SlideItem[];
  goiYTroChoiHoatDongNhom: string;  // gợi ý trò chơi/hoạt động nhóm bổ trợ
  cauHoiKiemTraNhanhCuoiBai: string[];
  yTuongThietKe: string;             // gợi ý màu sắc, phong cách hình ảnh cho cả bài giảng
}

// ============================================================
// 3. Đề cương ôn tập
// ============================================================
export interface DangBaiTap {
  mucDo: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng';
  viDu: string;
  huongDanGiai: string;
}

export interface OutlineSection {
  chuDe: string;
  kienThucCanNho: string[];
  soDoTomTat: string;         // tóm tắt dạng sơ đồ tư duy / gạch nhanh
  dangBaiTap: DangBaiTap[];
  cauHoiTuLuyen: string[];    // câu hỏi tự luyện cho học sinh, không kèm đáp án
}

export interface OutlineResult {
  monHoc: string;
  phamViOnTap: string;
  thoiGianOnTap: string;
  cacPhan: OutlineSection[];
}

// ============================================================
// 4. Đề kiểm tra theo CV 7991/BGDĐT-GDTrH (ma trận + đặc tả + đề + đáp án)
// ============================================================
export interface MaTranHang {
  chuDe: string;
  nhanBiet: number;
  thongHieu: number;
  vanDungThap: number;
  vanDungCao: number;
}

export interface CauHoi {
  soCau: number;
  mucDo: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  dangCau: 'Trắc nghiệm' | 'Tự luận';
  noiDung: string;
  luaChon?: string[];       // nếu trắc nghiệm
  dapAn: string;
  diem: number;
}

export interface Test7991Result {
  monHoc: string;
  lop: string;
  thoiGianLamBai: string;
  maTran: MaTranHang[];
  banDacTa: string[];
  deBai: CauHoi[];
  huongDanCham: string;
}

// ============================================================
// 5. Phiếu học tập
// ============================================================
export interface WorksheetTask {
  soThuTu: number;
  yeuCau: string;
  hinhThuc: 'Cá nhân' | 'Nhóm';
  khoangTraLoi?: string; // gợi ý số dòng/kích thước khung trả lời
}

export interface WorksheetResult {
  tenPhieu: string;
  monHoc: string;
  lop: string;
  hoTenHocSinh: boolean;
  mucTieuPhieu: string;
  nhiemVu: WorksheetTask[];
  phanTuDanhGia: string;  // câu hỏi/thang tự đánh giá cuối phiếu
}

// ============================================================
// 6. Trò chơi tương tác
// ============================================================
export interface GameQuestion {
  cauHoi: string;
  dapAnDung: string;
  dapAnNhieu?: string[];
  goiY?: string;
}

export interface InteractiveGameResult {
  tenTroChoi: string;
  theLoai: string;        // VD: Ai là triệu phú, Rung chuông vàng, Ô chữ, Vòng quay may mắn
  mucTieuHocTap: string;
  cachChoi: string;
  hinhThucToChuc: 'Cá nhân' | 'Nhóm' | 'Cả lớp';
  dungCuChuanBi: string[];
  cachTinhDiemVaTraoThuong: string;
  cauHoi: GameQuestion[];
}

// ============================================================
// 7. Kịch bản video minh hoạ bài giảng (storyboard, để đưa vào CapCut/Canva Video/Pictory)
// ============================================================
export interface VideoScene {
  canh: number;
  thoiLuongGiay: number;
  loiThoaiHoacTitle: string;
  moTaHinhAnh: string;    // prompt tạo ảnh/clip AI cho cảnh này
  ghiChuKyThuat?: string; // hiệu ứng chuyển cảnh, nhạc nền, v.v.
}

export interface VideoScriptResult {
  tieuDe: string;
  tongThoiLuong: string;
  cacCanh: VideoScene[];
}

// ============================================================
// 8. Sáng kiến kinh nghiệm (SKKN)
// ============================================================
export interface BangSoLieuHang {
  tieuChi: string;
  truoc: string;
  sau: string;
}

export interface GiaiPhapSKKN {
  tenGiaiPhap: string;
  mucTieu: string;
  noiDung: string;
  cachThucHien: string;
  viDuMinhHoa: string;
  dieuKienThucHien: string;
  diemMoi: string;
  hieuQuaDuKien: string;
}

export interface SKKNResult {
  // Thông tin chung
  tenSangKien: string;
  monHoc: string;
  khoiLop: string;
  donViCongTac: string;
  doiTuongApDung: string;
  namHoc: string;
  linhVuc: string;

  // PHẦN I. MỞ ĐẦU
  lyDoChonDeTai: string;             // thực trạng, khó khăn GV, hạn chế HS, yêu cầu đổi mới, ý nghĩa đề tài
  mucTieuNghienCuu: { mucTieuChung: string; mucTieuCuThe: string[] };
  doiTuongNghienCuu: string;
  phamViNghienCuu: string;
  phuongPhapNghienCuu: string[];     // điều tra, quan sát, thực nghiệm sư phạm, phân tích số liệu...

  // PHẦN II. NỘI DUNG
  coSoLyLuan: string;                 // cơ sở pháp lý, CT GDPT 2018, quan điểm phát triển phẩm chất năng lực (tóm tắt, không sao chép nguyên văn)
  thucTrang: {
    dacDiemHocSinh: string;
    dieuKienCoSoVatChat: string;
    thucTrangDayHoc: string;
    khoKhan: string;
    nguyenNhan: string;
    bangSoLieuKhaoSatDauNam: BangSoLieuHang[];
  };
  cacGiaiPhap: GiaiPhapSKKN[];
  hieuQuaSauApDung: {
    bangSoSanhTruocSau: BangSoLieuHang[];
    phanTichNguyenNhanCaiThien: string;
    ghiChuSoLieu: string; // vd: "Số liệu minh hoạ, cần thay thế bằng số liệu thực tế của đơn vị."
  };

  // PHẦN III. KẾT LUẬN VÀ KIẾN NGHỊ
  ketLuan: { tinhHieuQua: string; tinhMoi: string; khaNangNhanRong: string; giaTriThucTien: string };
  kienNghi: { doiVoiNhaTruong: string; doiVoiToChuyenMon: string; doiVoiGiaoVien: string; doiVoiPhongGDDT: string };
  taiLieuThamKhao: string[];
  phuLuc: string[];  // gợi ý các phụ lục nên đính kèm: phiếu khảo sát, KHBD, phiếu học tập, rubric, biểu đồ...
}

// ============================================================
// Loại module (dùng cho điều hướng dashboard)
// ============================================================
export type ModuleKey =
  | 'khbd5512'
  | 'slideppt'
  | 'outline'
  | 'test7991'
  | 'worksheet'
  | 'game'
  | 'video'
  | 'skkn';
