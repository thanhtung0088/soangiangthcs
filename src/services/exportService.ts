import { Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import {
  KHBD5512Result,
  SlideDeckResult,
  OutlineResult,
  Test7991Result,
  WorksheetResult,
  InteractiveGameResult,
  VideoScriptResult,
  SKKNResult,
} from '../types';
import {
  FONT,
  tieuDeChinh,
  tieuDeMuc,
  tieuDeMucCon,
  vanBanThuong,
  gachDau,
  dongTrong,
  taoBang,
  tieuDeQuocHieu,
} from './docxHelpers';

async function taiXuong(doc: Document, tenFile: string) {
  const blob = await Packer.toBlob(doc);
  saveAs(blob, tenFile);
}

// ============================================================
// 1. XUẤT WORD - KHBD 5512
// ============================================================
export async function exportKHBD5512ToWord(kq: KHBD5512Result) {
  const children: Paragraph[] = [
    ...tieuDeQuocHieu(),
    dongTrong(),
    tieuDeChinh('KẾ HOẠCH BÀI DẠY'),
    vanBanThuong(`Môn học: ${kq.monHoc}          Lớp: ${kq.lop}          Số tiết: ${kq.soTiet}`, { bold: true }),
    vanBanThuong(`Tên bài dạy: ${kq.tenBai}`, { bold: true }),
    vanBanThuong(`Bộ sách giáo khoa: ${kq.boSachGiaoKhoa}`, { italics: true }),
    dongTrong(),
    tieuDeMuc('I. MỤC TIÊU'),
    tieuDeMucCon('1. Về phẩm chất'),
    ...kq.mucTieu.phamChat.map(gachDau),
    tieuDeMucCon('2. Về năng lực chung'),
    ...kq.mucTieu.nangLucChung.map(gachDau),
    tieuDeMucCon('3. Về năng lực đặc thù'),
    ...kq.mucTieu.nangLucDacThu.map(gachDau),
    tieuDeMucCon('4. Yêu cầu cần đạt'),
    ...kq.mucTieu.yeuCauCanDat.map(gachDau),
    tieuDeMuc('II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU'),
    tieuDeMucCon('1. Thiết bị của giáo viên'),
    ...kq.thietBiHocLieu.thietBiGiaoVien.map(gachDau),
    tieuDeMucCon('2. Học liệu'),
    ...kq.thietBiHocLieu.hocLieu.map(gachDau),
    tieuDeMucCon('3. Thiết bị của học sinh'),
    ...kq.thietBiHocLieu.thietBiHocSinh.map(gachDau),
    ...(kq.thietBiHocLieu.phanMemHocLieuSo.length
      ? [tieuDeMucCon('4. Phần mềm, học liệu số'), ...kq.thietBiHocLieu.phanMemHocLieuSo.map(gachDau)]
      : []),
    tieuDeMuc('III. TIẾN TRÌNH DẠY HỌC'),
  ];

  kq.tienTrinh.forEach((hd, idx) => {
    children.push(tieuDeMucCon(hd.tenHoatDong || `Hoạt động ${idx + 1}`));
    children.push(vanBanThuong(`a) Mục tiêu: ${hd.mucTieu}`, { indent: true }));
    children.push(vanBanThuong(`b) Nội dung: ${hd.noiDung}`, { indent: true }));
    children.push(vanBanThuong(`c) Sản phẩm: ${hd.sanPham}`, { indent: true }));
    children.push(vanBanThuong(`d) Tổ chức thực hiện: ${hd.toChucThucHien}`, { indent: true }));
    children.push(vanBanThuong(`đ) Kiểm tra, đánh giá: ${hd.kiemTraDanhGia}`, { indent: true }));
    children.push(dongTrong());
  });

  if (kq.tichHopLienMon.length) {
    children.push(tieuDeMuc('IV. TÍCH HỢP LIÊN MÔN'));
    kq.tichHopLienMon.forEach((t) => children.push(gachDau(t)));
  }
  if (kq.giaoDucSTEM) {
    children.push(tieuDeMuc('V. GIÁO DỤC STEM'));
    children.push(vanBanThuong(kq.giaoDucSTEM));
  }
  if (kq.phatTrienNangLucSo.length) {
    children.push(tieuDeMuc('VI. PHÁT TRIỂN NĂNG LỰC SỐ'));
    kq.phatTrienNangLucSo.forEach((t) => children.push(gachDau(t)));
  }
  if (kq.longGhepGiaoDuc.length) {
    children.push(tieuDeMuc('VII. LỒNG GHÉP GIÁO DỤC'));
    kq.longGhepGiaoDuc.forEach((t) => children.push(gachDau(t)));
  }
  if (kq.phuongPhapDayHoc.length) {
    children.push(tieuDeMuc('VIII. PHƯƠNG PHÁP, KĨ THUẬT DẠY HỌC'));
    kq.phuongPhapDayHoc.forEach((t) => children.push(gachDau(t)));
  }
  children.push(tieuDeMuc('IX. PHÂN HOÁ HỌC SINH VÀ LƯU Ý TỔ CHỨC'));
  children.push(vanBanThuong(`Phân hoá học sinh: ${kq.phanHoaHocSinh}`));
  children.push(vanBanThuong(`Lưu ý khi tổ chức dạy học: ${kq.luuYDayHoc}`));

  const doc = new Document({ sections: [{ children }] });
  await taiXuong(doc, `KHBD_5512_${kq.tenBai.replace(/\s+/g, '_')}.docx`);
}

// ============================================================
// 2. XUẤT PPTX - Bài giảng trình chiếu (+ ảnh minh hoạ nếu có)
// ============================================================
export async function exportSlideDeckToPptx(kq: SlideDeckResult, hinhAnh?: Record<number, string>) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'A4', width: 10, height: 5.63 });
  pptx.layout = 'A4';

  const bia = pptx.addSlide();
  bia.background = { color: '0269A4' };
  bia.addText(kq.chuDe, { x: 0.5, y: 2, w: 9, h: 1.5, fontSize: 36, bold: true, color: 'FFFFFF', align: 'center' });

  kq.slides.forEach((s) => {
    const slide = pptx.addSlide();
    slide.addText(`${s.phanTienTrinh.toUpperCase()}`, { x: 0.4, y: 0.15, w: 9.2, h: 0.35, fontSize: 11, bold: true, color: '999999' });
    slide.addText(s.tieuDe, { x: 0.4, y: 0.5, w: 9.2, h: 0.7, fontSize: 26, bold: true, color: '0269A4' });

    const anh = hinhAnh?.[s.soThuTu];
    const textWidth = anh ? 5.4 : 9.2;

    slide.addText(
      s.noiDungGachDau.map((b) => ({ text: b, options: { bullet: true, breakLine: true } })),
      { x: 0.5, y: 1.4, w: textWidth, h: 3.4, fontSize: 16, color: '333333' }
    );

    if (s.cauHoiTuongTac) {
      slide.addText(`❓ ${s.cauHoiTuongTac}`, { x: 0.5, y: 4.9, w: textWidth, h: 0.6, fontSize: 13, italic: true, color: '0269A4' });
    }

    if (anh) {
      slide.addImage({ data: anh, x: 6.1, y: 1.4, w: 3.4, h: 3.4 });
    }

    if (s.ghiChuGiangVien) {
      slide.addNotes(s.ghiChuGiangVien);
    }
  });

  if (kq.cauHoiKiemTraNhanhCuoiBai?.length) {
    const cungCo = pptx.addSlide();
    cungCo.addText('CỦNG CỐ - KIỂM TRA NHANH', { x: 0.4, y: 0.3, w: 9.2, h: 0.7, fontSize: 26, bold: true, color: '0269A4' });
    cungCo.addText(
      kq.cauHoiKiemTraNhanhCuoiBai.map((q) => ({ text: q, options: { bullet: true, breakLine: true } })),
      { x: 0.5, y: 1.3, w: 9.2, h: 3.8, fontSize: 16, color: '333333' }
    );
  }

  await pptx.writeFile({ fileName: `BaiGiang_${kq.chuDe.replace(/\s+/g, '_')}.pptx` });
}

/** Xuất kịch bản bài giảng (kèm ghi chú GV + mô tả ảnh) ra Word, dùng khi GV chưa cần PPT ngay. */
export async function exportSlideDeckToWord(kq: SlideDeckResult) {
  const children: Paragraph[] = [tieuDeChinh(`KỊCH BẢN BÀI GIẢNG: ${kq.chuDe.toUpperCase()}`)];
  kq.slides.forEach((s) => {
    children.push(tieuDeMuc(`Slide ${s.soThuTu} [${s.phanTienTrinh}]: ${s.tieuDe}`));
    s.noiDungGachDau.forEach((b) => children.push(gachDau(b)));
    children.push(vanBanThuong(`Ghi chú giảng viên: ${s.ghiChuGiangVien}`, { italics: true, indent: true }));
    children.push(vanBanThuong(`Gợi ý hình ảnh minh hoạ: ${s.goiYHinhAnh}`, { italics: true, indent: true }));
    if (s.cauHoiTuongTac) children.push(vanBanThuong(`Câu hỏi tương tác: ${s.cauHoiTuongTac}`, { indent: true }));
    children.push(dongTrong());
  });
  if (kq.goiYTroChoiHoatDongNhom) {
    children.push(tieuDeMuc('Gợi ý trò chơi / hoạt động nhóm'));
    children.push(vanBanThuong(kq.goiYTroChoiHoatDongNhom));
  }
  if (kq.cauHoiKiemTraNhanhCuoiBai?.length) {
    children.push(tieuDeMuc('Câu hỏi kiểm tra nhanh cuối bài'));
    kq.cauHoiKiemTraNhanhCuoiBai.forEach((q, i) => children.push(vanBanThuong(`${i + 1}. ${q}`)));
  }
  if (kq.yTuongThietKe) {
    children.push(tieuDeMuc('Ý tưởng thiết kế'));
    children.push(vanBanThuong(kq.yTuongThietKe));
  }
  const doc = new Document({ sections: [{ children }] });
  await taiXuong(doc, `KichBan_${kq.chuDe.replace(/\s+/g, '_')}.docx`);
}

// ============================================================
// 3. XUẤT WORD - Đề cương ôn tập
// ============================================================
export async function exportOutlineToWord(kq: OutlineResult) {
  const children: Paragraph[] = [
    tieuDeChinh('ĐỀ CƯƠNG ÔN TẬP'),
    vanBanThuong(`Môn học: ${kq.monHoc}          Phạm vi ôn tập: ${kq.phamViOnTap}          Thời gian: ${kq.thoiGianOnTap}`, {
      bold: true,
    }),
    dongTrong(),
  ];
  kq.cacPhan.forEach((p, idx) => {
    children.push(tieuDeMuc(`${idx + 1}. ${p.chuDe}`));
    children.push(tieuDeMucCon('Kiến thức cần nhớ'));
    p.kienThucCanNho.forEach((k) => children.push(gachDau(k)));
    if (p.soDoTomTat) {
      children.push(tieuDeMucCon('Sơ đồ tóm tắt'));
      children.push(vanBanThuong(p.soDoTomTat, { italics: true, indent: true }));
    }
    children.push(tieuDeMucCon('Phân dạng bài tập'));
    p.dangBaiTap.forEach((d) => {
      children.push(vanBanThuong(`[${d.mucDo}] Ví dụ: ${d.viDu}`, { bold: true, indent: true }));
      children.push(vanBanThuong(`Hướng dẫn giải: ${d.huongDanGiai}`, { indent: true, italics: true }));
    });
    children.push(tieuDeMucCon('Câu hỏi tự luyện'));
    p.cauHoiTuLuyen.forEach((c, i) => children.push(vanBanThuong(`Câu ${i + 1}: ${c}`, { indent: true })));
    children.push(dongTrong());
  });
  const doc = new Document({ sections: [{ children }] });
  await taiXuong(doc, `DeCuongOnTap_${kq.monHoc.replace(/\s+/g, '_')}.docx`);
}

// ============================================================
// 4. XUẤT WORD - Đề kiểm tra CV 7991 (ma trận + đặc tả + đề + đáp án)
// ============================================================
export async function exportTest7991ToWord(kq: Test7991Result) {
  const children: any[] = [
    tieuDeChinh('MA TRẬN - BẢN ĐẶC TẢ - ĐỀ KIỂM TRA'),
    vanBanThuong(`Môn học: ${kq.monHoc}          Lớp: ${kq.lop}          Thời gian làm bài: ${kq.thoiGianLamBai}`, {
      bold: true,
    }),
    dongTrong(),
    tieuDeMuc('I. MA TRẬN ĐỀ KIỂM TRA'),
    taoBang(
      ['Chủ đề', 'Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'],
      kq.maTran.map((m) => [m.chuDe, String(m.nhanBiet), String(m.thongHieu), String(m.vanDungThap), String(m.vanDungCao)])
    ),
    dongTrong(),
    tieuDeMuc('II. BẢN ĐẶC TẢ ĐỀ KIỂM TRA'),
    ...kq.banDacTa.map((d, i) => vanBanThuong(`${i + 1}. ${d}`)),
    new Paragraph({ children: [new PageBreak()] }),
    tieuDeMuc('III. ĐỀ BÀI'),
  ];

  kq.deBai.forEach((c) => {
    children.push(vanBanThuong(`Câu ${c.soCau} (${c.mucDo} - ${c.diem} điểm): ${c.noiDung}`, { bold: true }));
    if (c.luaChon && c.luaChon.length) {
      c.luaChon.forEach((lc, i) => children.push(vanBanThuong(`${String.fromCharCode(65 + i)}. ${lc}`, { indent: true })));
    }
    children.push(dongTrong());
  });

  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(tieuDeMuc('IV. ĐÁP ÁN'));
  kq.deBai.forEach((c) => children.push(vanBanThuong(`Câu ${c.soCau}: ${c.dapAn} (${c.diem} điểm)`)));
  children.push(dongTrong());
  children.push(tieuDeMuc('V. HƯỚNG DẪN CHẤM'));
  children.push(vanBanThuong(kq.huongDanCham));

  const doc = new Document({ sections: [{ children }] });
  await taiXuong(doc, `DeKiemTra_7991_${kq.monHoc.replace(/\s+/g, '_')}.docx`);
}

/** Xuất PDF nhanh cho đề kiểm tra (bản đề, không kèm ma trận) - dùng khi GV cần in ngay. */
export function exportTest7991ToPdf(kq: Test7991Result) {
  const pdf = new jsPDF();
  let y = 15;
  const lh = 7;
  const pageH = 280;

  const themDong = (text: string, opts: { bold?: boolean; size?: number } = {}) => {
    pdf.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    pdf.setFontSize(opts.size || 11);
    const lines = pdf.splitTextToSize(text, 180) as string[];
    lines.forEach((line) => {
      if (y > pageH) {
        pdf.addPage();
        y = 15;
      }
      pdf.text(line, 15, y);
      y += lh;
    });
  };

  themDong(`ĐỀ KIỂM TRA - ${kq.monHoc} - Lớp ${kq.lop}`, { bold: true, size: 14 });
  themDong(`Thời gian làm bài: ${kq.thoiGianLamBai}`);
  y += 3;
  kq.deBai.forEach((c) => {
    themDong(`Câu ${c.soCau} (${c.diem} điểm): ${c.noiDung}`, { bold: true });
    c.luaChon?.forEach((lc, i) => themDong(`   ${String.fromCharCode(65 + i)}. ${lc}`));
    y += 2;
  });

  pdf.save(`DeKiemTra_7991_${kq.monHoc.replace(/\s+/g, '_')}.pdf`);
}

// ============================================================
// 5. XUẤT WORD & PDF - Phiếu học tập
// ============================================================
export async function exportWorksheetToWord(kq: WorksheetResult) {
  const children: Paragraph[] = [
    tieuDeChinh(kq.tenPhieu.toUpperCase()),
    vanBanThuong(`Môn học: ${kq.monHoc}          Lớp: ${kq.lop}`),
    vanBanThuong(`Mục tiêu: ${kq.mucTieuPhieu}`, { italics: true }),
  ];
  if (kq.hoTenHocSinh) children.push(vanBanThuong('Họ và tên học sinh: ..............................................................'));
  children.push(dongTrong());
  kq.nhiemVu.forEach((nv) => {
    children.push(vanBanThuong(`${nv.soThuTu}. (${nv.hinhThuc}) ${nv.yeuCau}`, { bold: true }));
    if (nv.khoangTraLoi) children.push(vanBanThuong(`(${nv.khoangTraLoi})`, { italics: true, indent: true }));
    children.push(dongTrong());
  });
  if (kq.phanTuDanhGia) {
    children.push(tieuDeMuc('Tự đánh giá'));
    children.push(vanBanThuong(kq.phanTuDanhGia));
  }
  const doc = new Document({ sections: [{ children }] });
  await taiXuong(doc, `PhieuHocTap_${kq.tenPhieu.replace(/\s+/g, '_')}.docx`);
}

export function exportWorksheetToPdf(kq: WorksheetResult) {
  const pdf = new jsPDF();
  let y = 15;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text(kq.tenPhieu, 15, y);
  y += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Môn học: ${kq.monHoc} - Lớp: ${kq.lop}`, 15, y);
  y += 10;
  kq.nhiemVu.forEach((nv) => {
    const lines = pdf.splitTextToSize(`${nv.soThuTu}. (${nv.hinhThuc}) ${nv.yeuCau}`, 180) as string[];
    lines.forEach((line) => {
      if (y > 280) {
        pdf.addPage();
        y = 15;
      }
      pdf.text(line, 15, y);
      y += 7;
    });
    y += 8; // chừa khoảng trống trả lời
  });
  pdf.save(`PhieuHocTap_${kq.tenPhieu.replace(/\s+/g, '_')}.pdf`);
}

// ============================================================
// 6. XUẤT WORD - Trò chơi tương tác (bộ câu hỏi + hướng dẫn)
// ============================================================
export async function exportGameToWord(kq: InteractiveGameResult) {
  const children: Paragraph[] = [
    tieuDeChinh(kq.tenTroChoi.toUpperCase()),
    vanBanThuong(`Thể loại: ${kq.theLoai}          Hình thức: ${kq.hinhThucToChuc}`, { bold: true }),
    tieuDeMuc('Mục tiêu học tập'),
    vanBanThuong(kq.mucTieuHocTap),
    tieuDeMuc('Cách chơi'),
    vanBanThuong(kq.cachChoi),
  ];
  if (kq.dungCuChuanBi.length) {
    children.push(tieuDeMuc('Dụng cụ cần chuẩn bị'));
    kq.dungCuChuanBi.forEach((d) => children.push(gachDau(d)));
  }
  children.push(tieuDeMuc('Cách tính điểm và trao thưởng'));
  children.push(vanBanThuong(kq.cachTinhDiemVaTraoThuong));
  children.push(tieuDeMuc('Bộ câu hỏi'));
  kq.cauHoi.forEach((c, i) => {
    children.push(vanBanThuong(`Câu ${i + 1}: ${c.cauHoi}`, { bold: true }));
    children.push(vanBanThuong(`Đáp án đúng: ${c.dapAnDung}`, { indent: true }));
    if (c.dapAnNhieu?.length) children.push(vanBanThuong(`Đáp án nhiễu: ${c.dapAnNhieu.join(', ')}`, { indent: true }));
    if (c.goiY) children.push(vanBanThuong(`Gợi ý: ${c.goiY}`, { indent: true, italics: true }));
    children.push(dongTrong());
  });
  const doc = new Document({ sections: [{ children }] });
  await taiXuong(doc, `TroChoi_${kq.tenTroChoi.replace(/\s+/g, '_')}.docx`);
}

// ============================================================
// 7. XUẤT WORD - Kịch bản video minh hoạ (storyboard)
// ============================================================
export async function exportVideoScriptToWord(kq: VideoScriptResult) {
  const children: Paragraph[] = [
    tieuDeChinh(kq.tieuDe.toUpperCase()),
    vanBanThuong(`Tổng thời lượng dự kiến: ${kq.tongThoiLuong}`, { bold: true }),
    dongTrong(),
  ];
  kq.cacCanh.forEach((c) => {
    children.push(tieuDeMuc(`Cảnh ${c.canh} (${c.thoiLuongGiay} giây)`));
    children.push(vanBanThuong(`Lời thoại / Tiêu đề trên màn hình: ${c.loiThoaiHoacTitle}`));
    children.push(vanBanThuong(`Mô tả hình ảnh/clip: ${c.moTaHinhAnh}`, { italics: true, indent: true }));
    if (c.ghiChuKyThuat) children.push(vanBanThuong(`Ghi chú kỹ thuật: ${c.ghiChuKyThuat}`, { indent: true }));
    children.push(dongTrong());
  });
  const doc = new Document({ sections: [{ children }] });
  await taiXuong(doc, `KichBanVideo_${kq.tieuDe.replace(/\s+/g, '_')}.docx`);
}

// ============================================================
// 8. XUẤT WORD - Sáng kiến kinh nghiệm (SKKN), thể thức Nghị định 30/2020/NĐ-CP
// ============================================================
export async function exportSKKNToWord(kq: SKKNResult) {
  const bangSoLieu = (rows: { tieuChi: string; truoc: string; sau: string }[]) =>
    taoBang(['Tiêu chí', 'Trước', 'Sau'], rows.map((r) => [r.tieuChi, r.truoc, r.sau]));

  const children: any[] = [
    ...tieuDeQuocHieu(),
    dongTrong(),
    tieuDeChinh('SÁNG KIẾN KINH NGHIỆM'),
    vanBanThuong(`Tên sáng kiến: ${kq.tenSangKien}`, { bold: true }),
    vanBanThuong(
      `Môn học: ${kq.monHoc}          Khối lớp: ${kq.khoiLop}          Năm học: ${kq.namHoc}`,
      { bold: true }
    ),
    vanBanThuong(`Đơn vị công tác: ${kq.donViCongTac}`),
    vanBanThuong(`Đối tượng áp dụng: ${kq.doiTuongApDung}`),
    vanBanThuong(`Lĩnh vực: ${kq.linhVuc}`),
    new Paragraph({ children: [new PageBreak()] }),

    tieuDeChinh('PHẦN I. MỞ ĐẦU'),
    tieuDeMuc('1. Lý do chọn đề tài'),
    vanBanThuong(kq.lyDoChonDeTai),
    tieuDeMuc('2. Mục tiêu nghiên cứu'),
    vanBanThuong(`Mục tiêu chung: ${kq.mucTieuNghienCuu.mucTieuChung}`),
    vanBanThuong('Mục tiêu cụ thể:', { bold: true }),
    ...kq.mucTieuNghienCuu.mucTieuCuThe.map(gachDau),
    tieuDeMuc('3. Đối tượng nghiên cứu'),
    vanBanThuong(kq.doiTuongNghienCuu),
    tieuDeMuc('4. Phạm vi nghiên cứu'),
    vanBanThuong(kq.phamViNghienCuu),
    tieuDeMuc('5. Phương pháp nghiên cứu'),
    ...kq.phuongPhapNghienCuu.map(gachDau),

    new Paragraph({ children: [new PageBreak()] }),
    tieuDeChinh('PHẦN II. NỘI DUNG'),
    tieuDeMuc('Chương 1. Cơ sở lý luận'),
    vanBanThuong(kq.coSoLyLuan),

    tieuDeMuc('Chương 2. Thực trạng'),
    vanBanThuong(`Đặc điểm học sinh: ${kq.thucTrang.dacDiemHocSinh}`),
    vanBanThuong(`Điều kiện cơ sở vật chất: ${kq.thucTrang.dieuKienCoSoVatChat}`),
    vanBanThuong(`Thực trạng dạy học: ${kq.thucTrang.thucTrangDayHoc}`),
    vanBanThuong(`Khó khăn: ${kq.thucTrang.khoKhan}`),
    vanBanThuong(`Nguyên nhân: ${kq.thucTrang.nguyenNhan}`),
    ...(kq.thucTrang.bangSoLieuKhaoSatDauNam.length
      ? [tieuDeMucCon('Bảng số liệu khảo sát đầu năm'), bangSoLieu(kq.thucTrang.bangSoLieuKhaoSatDauNam), dongTrong()]
      : []),

    tieuDeMuc('Chương 3. Các giải pháp thực hiện'),
  ];

  kq.cacGiaiPhap.forEach((gp, idx) => {
    children.push(tieuDeMucCon(`Giải pháp ${idx + 1}: ${gp.tenGiaiPhap}`));
    children.push(vanBanThuong(`Mục tiêu: ${gp.mucTieu}`, { indent: true }));
    children.push(vanBanThuong(`Nội dung: ${gp.noiDung}`, { indent: true }));
    children.push(vanBanThuong(`Cách thực hiện: ${gp.cachThucHien}`, { indent: true }));
    children.push(vanBanThuong(`Ví dụ minh hoạ: ${gp.viDuMinhHoa}`, { indent: true, italics: true }));
    children.push(vanBanThuong(`Điều kiện thực hiện: ${gp.dieuKienThucHien}`, { indent: true }));
    children.push(vanBanThuong(`Điểm mới: ${gp.diemMoi}`, { indent: true }));
    children.push(vanBanThuong(`Hiệu quả dự kiến: ${gp.hieuQuaDuKien}`, { indent: true }));
    children.push(dongTrong());
  });

  children.push(tieuDeMuc('Chương 4. Hiệu quả sau khi áp dụng'));
  if (kq.hieuQuaSauApDung.bangSoSanhTruocSau.length) {
    children.push(bangSoLieu(kq.hieuQuaSauApDung.bangSoSanhTruocSau));
    children.push(dongTrong());
  }
  children.push(vanBanThuong(`Phân tích nguyên nhân cải thiện: ${kq.hieuQuaSauApDung.phanTichNguyenNhanCaiThien}`));
  if (kq.hieuQuaSauApDung.ghiChuSoLieu) {
    children.push(vanBanThuong(kq.hieuQuaSauApDung.ghiChuSoLieu, { italics: true }));
  }

  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(tieuDeChinh('PHẦN III. KẾT LUẬN VÀ KIẾN NGHỊ'));
  children.push(tieuDeMuc('1. Kết luận'));
  children.push(vanBanThuong(`Tính hiệu quả: ${kq.ketLuan.tinhHieuQua}`));
  children.push(vanBanThuong(`Tính mới: ${kq.ketLuan.tinhMoi}`));
  children.push(vanBanThuong(`Khả năng nhân rộng: ${kq.ketLuan.khaNangNhanRong}`));
  children.push(vanBanThuong(`Giá trị thực tiễn: ${kq.ketLuan.giaTriThucTien}`));
  children.push(tieuDeMuc('2. Kiến nghị'));
  children.push(vanBanThuong(`Đối với nhà trường: ${kq.kienNghi.doiVoiNhaTruong}`));
  children.push(vanBanThuong(`Đối với tổ chuyên môn: ${kq.kienNghi.doiVoiToChuyenMon}`));
  children.push(vanBanThuong(`Đối với giáo viên: ${kq.kienNghi.doiVoiGiaoVien}`));
  children.push(vanBanThuong(`Đối với Phòng GD&ĐT: ${kq.kienNghi.doiVoiPhongGDDT}`));

  if (kq.taiLieuThamKhao.length) {
    children.push(tieuDeMuc('DANH MỤC TÀI LIỆU THAM KHẢO'));
    kq.taiLieuThamKhao.forEach((t, i) => children.push(vanBanThuong(`${i + 1}. ${t}`)));
  }
  if (kq.phuLuc.length) {
    children.push(tieuDeMuc('PHỤ LỤC (đề xuất bổ sung)'));
    kq.phuLuc.forEach((t) => children.push(gachDau(t)));
  }

  const doc = new Document({ sections: [{ children }] });
  await taiXuong(doc, `SKKN_${kq.tenSangKien.replace(/\s+/g, '_')}.docx`);
}
