import { BaseLessonInput } from '../types';

/**
 * TOÀN BỘ PROMPT MẪU CHI TIẾT CHO 8 LUỒNG SOẠN GIẢNG.
 * Mỗi hàm trả về 1 chuỗi prompt hoàn chỉnh, yêu cầu Gemini trả JSON THUẦN
 * (không markdown, không code-fence) để app parse trực tiếp thành dữ liệu có cấu trúc,
 * phục vụ xuất Word/PPT/PDF đúng chuẩn.
 */

export const BO_SACH_GIAO_KHOA = 'Kết nối tri thức với cuộc sống';

const KHUNG_CHUNG = (input: BaseLessonInput) => `
Môn học: ${input.subject}
Lớp: ${input.grade}
Tên bài học/chủ đề: ${input.title}
Số tiết: ${input.duration || '1 tiết'}
Bộ sách giáo khoa: ${BO_SACH_GIAO_KHOA} (bám sát nội dung, thứ tự kiến thức, thuật ngữ của bộ sách này, không tự ý thay đổi kiến thức cốt lõi)
Yêu cầu cần đạt GV cung cấp (nếu có): ${input.objectives || 'Không có, hãy tự đề xuất theo Chương trình GDPT 2018'}
`;

// 1. KHBD 5512 -----------------------------------------------------------
export const promptKHBD5512 = (input: BaseLessonInput) => `
Vai trò: Bạn là chuyên gia xây dựng Kế hoạch bài dạy của Bộ GD&ĐT Việt Nam, am hiểu Chương trình GDPT 2018, Công văn 5512/BGDĐT-GDTrH và bộ sách giáo khoa "${BO_SACH_GIAO_KHOA}".

Hãy soạn Kế hoạch bài dạy (KHBD) cho bài học sau, xây dựng theo đúng cấu trúc Phụ lục IV Công văn 5512/BGDĐT-GDTrH:
${KHUNG_CHUNG(input)}

=== I. MỤC TIÊU ===
Xác định rõ: phẩm chất, năng lực chung, năng lực đặc thù môn học, yêu cầu cần đạt theo Chương trình GDPT 2018.

=== II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU ===
Liệt kê cụ thể, thực tế (không placeholder): thiết bị của giáo viên, học liệu, thiết bị của học sinh, phần mềm/học liệu số (nếu có).

=== III. TIẾN TRÌNH DẠY HỌC ===
Thiết kế ĐÚNG 4 hoạt động bắt buộc (bổ sung thêm hoạt động mở rộng/dự án/nhiệm vụ về nhà vào cuối mảng tienTrinh nếu phù hợp):
1. Hoạt động mở đầu
2. Hoạt động hình thành kiến thức mới (nếu bài có nhiều đơn vị kiến thức, có thể tách thành nhiều hoạt động con hình thành kiến thức, đặt liên tiếp nhau trong mảng)
3. Hoạt động luyện tập
4. Hoạt động vận dụng

Mỗi hoạt động BẮT BUỘC có đủ 5 mục: Mục tiêu, Nội dung, Sản phẩm, Tổ chức thực hiện, Kiểm tra đánh giá.
- "toChucThucHien" phải nêu rõ 4 bước: Giao nhiệm vụ - Thực hiện nhiệm vụ - Báo cáo thảo luận - Đánh giá, kết luận.
- "kiemTraDanhGia" nêu rõ: hình thức đánh giá, công cụ đánh giá, tiêu chí đánh giá, minh chứng (kết hợp đánh giá thường xuyên/tự đánh giá/đánh giá đồng đẳng/đánh giá của GV khi phù hợp).

=== TÍCH HỢP BẮT BUỘC (chỉ đưa nội dung THỰC SỰ phù hợp với bài học, không gượng ép) ===
- "tichHopLienMon": liên hệ với các môn phù hợp (Toán, Khoa học, Tin học, Lịch sử, Địa lí, GDCD, Công nghệ, Mỹ thuật, Âm nhạc...), mỗi phần tử dạng "Tên môn: nội dung liên hệ cụ thể". Để mảng rỗng nếu không có liên hệ hợp lý.
- "giaoDucSTEM": nếu bài học phù hợp, mô tả rõ yếu tố Science-Technology-Engineering-Mathematics, nhiệm vụ STEM thực tế và sản phẩm học tập; nếu không phù hợp thì để chuỗi rỗng "".
- "phatTrienNangLucSo": lồng ghép tìm kiếm thông tin, đánh giá nguồn tin, sử dụng AI có trách nhiệm, khai thác Internet an toàn, sử dụng phần mềm học tập, trình bày sản phẩm số, bảo vệ dữ liệu cá nhân, đạo đức số - chỉ liệt kê nội dung thực sự áp dụng được trong bài.
- "longGhepGiaoDuc": chọn lọc trong số các chủ đề sau nếu phù hợp với nội dung bài (an toàn giao thông, bảo vệ môi trường, biến đổi khí hậu, tiết kiệm năng lượng, quyền con người, giáo dục giới tính, bình đẳng giới, phòng chống bạo lực học đường, phòng chống ma tuý, phòng chống đuối nước, phòng chống thiên tai, giáo dục tài chính, giáo dục địa phương, giáo dục hướng nghiệp, giáo dục quốc phòng an ninh, học tập và làm theo tư tưởng đạo đức phong cách Hồ Chí Minh); nêu rõ vị trí tích hợp trong từng ý. Để mảng rỗng nếu không có nội dung phù hợp.

=== ĐỔI MỚI PHƯƠNG PHÁP DẠY HỌC ===
"phuongPhapDayHoc": liệt kê các phương pháp/kĩ thuật thực sự dùng trong bài (ưu tiên: dạy học phát hiện và giải quyết vấn đề, dạy học hợp tác, dạy học theo dự án, khăn trải bàn, mảnh ghép, think-pair-share, trạm học tập, trò chơi học tập, KWL, sơ đồ tư duy...).

=== PHÂN HOÁ VÀ LƯU Ý TỔ CHỨC ===
- "phanHoaHocSinh": gợi ý nhiệm vụ/câu hỏi nâng cao cho HS khá giỏi và biện pháp hỗ trợ HS còn hạn chế.
- "luuYDayHoc": lưu ý khi tổ chức dạy học trực tiếp hoặc kết hợp học liệu số.

Yêu cầu chung: nội dung bám sát bộ sách "${BO_SACH_GIAO_KHOA}" và Chương trình GDPT 2018, không bịa số liệu, không dùng ký hiệu markdown (**, #, -) trong nội dung text (chỉ trả văn bản thuần trong JSON), hoạt động cụ thể - khả thi - có thời lượng dự kiến hợp lý, văn phong hành chính giáo dục.

Chỉ trả về DUY NHẤT một object JSON theo đúng schema (không thêm lời dẫn, không markdown code-fence):
{
  "tenBai": string,
  "monHoc": string,
  "lop": string,
  "soTiet": string,
  "boSachGiaoKhoa": "${BO_SACH_GIAO_KHOA}",
  "mucTieu": { "phamChat": string[], "nangLucChung": string[], "nangLucDacThu": string[], "yeuCauCanDat": string[] },
  "thietBiHocLieu": { "thietBiGiaoVien": string[], "hocLieu": string[], "thietBiHocSinh": string[], "phanMemHocLieuSo": string[] },
  "tienTrinh": [
    { "tenHoatDong": string, "mucTieu": string, "noiDung": string, "sanPham": string, "toChucThucHien": string, "kiemTraDanhGia": string }
  ],
  "tichHopLienMon": string[],
  "giaoDucSTEM": string,
  "phatTrienNangLucSo": string[],
  "longGhepGiaoDuc": string[],
  "phuongPhapDayHoc": string[],
  "phanHoaHocSinh": string,
  "luuYDayHoc": string
}
`;

// 2. Bài giảng trình chiếu (PPT) ------------------------------------------
export const promptSlidePPT = (input: BaseLessonInput, soSlide: number = 12) => `
Bạn là một giáo viên giàu kinh nghiệm và chuyên gia thiết kế bài giảng PowerPoint dựa trên chương trình sách giáo khoa "${BO_SACH_GIAO_KHOA}".
Hãy xây dựng nội dung cho khoảng ${soSlide} slide cho bài học sau:
${KHUNG_CHUNG(input)}

Yêu cầu chi tiết:
- Slide 1: trang bìa (tên bài, môn, lớp).
- Cấu trúc bài giảng rõ ràng theo đúng 5 phần, mỗi slide gán đúng 1 giá trị "phanTienTrinh": "Khởi động" (gây hứng thú, liên hệ thực tế) -> "Hình thành kiến thức" (chia nhỏ từng đơn vị kiến thức) -> "Luyện tập" -> "Vận dụng" -> "Củng cố - đánh giá".
- Mỗi slide: tiêu đề ngắn gọn rõ ràng, tối đa 5 gạch đầu dòng, mỗi gạch đầu dòng dưới 15 từ, ngôn ngữ sư phạm dễ hiểu, phù hợp định hướng phát triển năng lực học sinh.
- "ghiChuGiangVien": lời dẫn/diễn giải GV có thể nói khi trình chiếu slide đó (phần notes, không hiện trên slide).
- "goiYHinhAnh": mô tả chi tiết hình ảnh minh hoạ AI phù hợp nội dung slide, viết bằng tiếng Anh để tối ưu cho công cụ tạo ảnh.
- "cauHoiTuongTac": nếu slide đó phù hợp có câu hỏi tương tác hoặc hoạt động học tập ngắn, nêu rõ; nếu không có thì để chuỗi rỗng "".
- "goiYTroChoiHoatDongNhom": gợi ý 1 trò chơi hoặc hoạt động nhóm bổ trợ cho bài (tuỳ chọn nâng cao).
- "cauHoiKiemTraNhanhCuoiBai": 3-5 câu hỏi kiểm tra nhanh cuối bài.
- "yTuongThietKe": gợi ý màu sắc/phong cách hình ảnh cho tổng thể bài giảng, bám sát bộ sách "${BO_SACH_GIAO_KHOA}".

Chỉ trả về DUY NHẤT JSON theo schema:
{
  "chuDe": string,
  "slides": [
    { "soThuTu": number, "phanTienTrinh": "Khởi động"|"Hình thành kiến thức"|"Luyện tập"|"Vận dụng"|"Củng cố - đánh giá", "tieuDe": string, "noiDungGachDau": string[], "ghiChuGiangVien": string, "goiYHinhAnh": string, "cauHoiTuongTac": string }
  ],
  "goiYTroChoiHoatDongNhom": string,
  "cauHoiKiemTraNhanhCuoiBai": string[],
  "yTuongThietKe": string
}
`;

// 3. Đề cương ôn tập -------------------------------------------------------
export const promptOutline = (input: BaseLessonInput) => `
Bạn là giáo viên có kinh nghiệm giảng dạy theo định hướng phát triển năng lực. Hãy xây dựng đề cương ôn tập bám sát chương trình sách "${BO_SACH_GIAO_KHOA}" và định hướng của Công văn 7991.
Phạm vi ôn tập: ${input.title}
${KHUNG_CHUNG(input)}

Yêu cầu:
- Hệ thống hoá kiến thức theo từng chủ đề trong "cacPhan".
- Mỗi chủ đề gồm: "kienThucCanNho" (kiến thức trọng tâm, ngắn gọn dễ nhớ), "soDoTomTat" (tóm tắt dạng sơ đồ tư duy bằng văn bản, dùng dấu -> hoặc xuống dòng thể hiện quan hệ), "dangBaiTap" (phân dạng bài tập theo 3 mức độ Nhận biết/Thông hiểu/Vận dụng, MỖI dạng có 1 ví dụ minh hoạ cụ thể + hướng dẫn giải chi tiết), "cauHoiTuLuyen" (câu hỏi tự luyện cho học sinh, KHÔNG kèm đáp án, độ khó tăng dần).
- Ngôn ngữ rõ ràng, phù hợp học sinh, dễ in hoặc phát cho học sinh.
- Không bịa kiến thức sai với Chương trình GDPT 2018.

Chỉ trả về DUY NHẤT JSON theo schema:
{
  "monHoc": string,
  "phamViOnTap": string,
  "thoiGianOnTap": string,
  "cacPhan": [
    { "chuDe": string, "kienThucCanNho": string[], "soDoTomTat": string, "dangBaiTap": [ { "mucDo": "Nhận biết"|"Thông hiểu"|"Vận dụng", "viDu": string, "huongDanGiai": string } ], "cauHoiTuLuyen": string[] }
  ]
}
`;

// 4. Đề kiểm tra CV 7991 ----------------------------------------------------
export const promptTest7991 = (
  input: { subject: string; grade: string; type: 'Trắc nghiệm' | 'Tự luận' | 'Kết hợp'; soCau?: number }
) => `
Bạn là chuyên gia ra đề kiểm tra THCS theo Công văn 7991/BGDĐT-GDTrH về xây dựng ma trận, bản đặc tả và đề kiểm tra định kỳ.
Môn học: ${input.subject}
Lớp: ${input.grade}
Bộ sách giáo khoa: ${BO_SACH_GIAO_KHOA} (nội dung câu hỏi bám sát mạch kiến thức của bộ sách này)
Dạng đề: ${input.type}
Số câu mong muốn: ${input.soCau || 'phù hợp thời lượng 45 phút'}

Yêu cầu bắt buộc theo đúng quy trình CV 7991:
1. Ma trận đề: liệt kê từng chủ đề kiến thức với số câu ở 4 mức độ Nhận biết/Thông hiểu/Vận dụng/Vận dụng cao.
2. Bản đặc tả: mô tả yêu cầu cần đạt tương ứng với từng câu hỏi trong ma trận.
3. Đề bài: đủ số câu, đúng tỉ lệ mức độ đã nêu trong ma trận, câu hỏi rõ ràng không đánh đố, gắn với thực tiễn khi phù hợp, có đáp án và điểm số từng câu (tổng điểm = 10).
4. Hướng dẫn chấm rõ ràng, công bằng.
- Nội dung câu hỏi bám sát chương trình GDPT 2018, KHÔNG bịa kiến thức.

Chỉ trả về DUY NHẤT JSON theo schema:
{
  "monHoc": string,
  "lop": string,
  "thoiGianLamBai": string,
  "maTran": [ { "chuDe": string, "nhanBiet": number, "thongHieu": number, "vanDungThap": number, "vanDungCao": number } ],
  "banDacTa": string[],
  "deBai": [
    { "soCau": number, "mucDo": "Nhận biết"|"Thông hiểu"|"Vận dụng"|"Vận dụng cao", "dangCau": "Trắc nghiệm"|"Tự luận", "noiDung": string, "luaChon": string[], "dapAn": string, "diem": number }
  ],
  "huongDanCham": string
}
`;

// 5. Phiếu học tập ----------------------------------------------------------
export const promptWorksheet = (input: BaseLessonInput) => `
Bạn là giáo viên thiết kế hoạt động học tập tích cực theo định hướng phát triển năng lực học sinh, bám sát sách "${BO_SACH_GIAO_KHOA}".
Hãy tạo Phiếu học tập cho bài: ${input.title}
${KHUNG_CHUNG(input)}

Yêu cầu:
- "mucTieuPhieu": nêu rõ mục tiêu của phiếu học tập.
- "nhiemVu": các nhiệm vụ gồm câu hỏi dẫn dắt và bài tập thực hành, đánh số thứ tự rõ ràng, độ khó tăng dần; mỗi nhiệm vụ ghi rõ "hinhThuc" là "Cá nhân" hay "Nhóm"; "khoangTraLoi" gợi ý khoảng trống trả lời (VD: "3 dòng kẻ", "1 bảng 2 cột", "khung vẽ hình").
- "phanTuDanhGia": phần cuối phiếu cho học sinh tự đánh giá mức độ hoàn thành/hiểu bài của bản thân.
- Nội dung ngắn gọn, trực quan, khuyến khích tư duy, dạng bảng/khung rõ ràng, dễ in phát.

Chỉ trả về DUY NHẤT JSON theo schema:
{
  "tenPhieu": string,
  "monHoc": string,
  "lop": string,
  "hoTenHocSinh": true,
  "mucTieuPhieu": string,
  "nhiemVu": [ { "soThuTu": number, "yeuCau": string, "hinhThuc": "Cá nhân"|"Nhóm", "khoangTraLoi": string } ],
  "phanTuDanhGia": string
}
`;

// 6. Trò chơi tương tác -------------------------------------------------------
export const promptGame = (input: BaseLessonInput, theLoai: string = 'Ai là triệu phú') => `
Bạn là giáo viên sáng tạo, hãy thiết kế trò chơi học tập tương tác giúp học sinh hứng thú và củng cố kiến thức bài: ${input.title}
${KHUNG_CHUNG(input)}
Thể loại trò chơi: ${theLoai}

Yêu cầu:
- Tên trò chơi hấp dẫn (có thể giữ hoặc biến tấu từ thể loại đã chọn).
- "mucTieuHocTap": mục tiêu học tập của trò chơi.
- "cachChoi": luật chơi rõ ràng, GV có thể áp dụng ngay trên lớp kể cả không có phần mềm hỗ trợ.
- "hinhThucToChuc": "Cá nhân", "Nhóm" hoặc "Cả lớp" - ưu tiên dễ triển khai trong lớp đông học sinh, tăng tương tác, phù hợp thời gian tiết học.
- "dungCuChuanBi": liệt kê dụng cụ cần chuẩn bị (có thể rỗng nếu không cần).
- "cachTinhDiemVaTraoThuong": nêu rõ cách tính điểm và hình thức trao thưởng/khích lệ.
- "cauHoi": bộ câu hỏi bám sát nội dung bài học (8-15 câu), có đáp án đúng rõ ràng; với trò chơi trắc nghiệm cần thêm đáp án nhiễu hợp lý trong "dapAnNhieu"; với trò chơi dạng gợi ý/ô chữ có thể thêm "goiY".

Chỉ trả về DUY NHẤT JSON theo schema:
{
  "tenTroChoi": string,
  "theLoai": string,
  "mucTieuHocTap": string,
  "cachChoi": string,
  "hinhThucToChuc": "Cá nhân"|"Nhóm"|"Cả lớp",
  "dungCuChuanBi": string[],
  "cachTinhDiemVaTraoThuong": string,
  "cauHoi": [ { "cauHoi": string, "dapAnDung": string, "dapAnNhieu": string[], "goiY": string } ]
}
`;

// 7. Kịch bản video minh hoạ ---------------------------------------------------
export const promptVideoScript = (input: BaseLessonInput, thoiLuongMucTieu: string = '90 giây') => `
Bạn là chuyên gia dựng kịch bản video giáo dục ngắn để minh hoạ bài học: ${input.title}
${KHUNG_CHUNG(input)}
Tổng thời lượng mục tiêu: ${thoiLuongMucTieu}

Yêu cầu:
- Chia thành các cảnh (scene) ngắn, mỗi cảnh 5-15 giây.
- Mỗi cảnh gồm: lời thoại/tiêu đề hiện trên màn hình, mô tả hình ảnh/clip minh hoạ (viết bằng tiếng Anh, chi tiết, phù hợp để đưa vào công cụ tạo ảnh/video AI hoặc dựng trong Canva Video/CapCut), và ghi chú kỹ thuật (hiệu ứng chuyển cảnh, nhạc nền gợi ý).
- Nội dung khoa học chính xác, phù hợp lứa tuổi THCS.
Lưu ý: đây là kịch bản/storyboard để GV tự dựng bằng công cụ dựng video (Canva Video, CapCut...); ứng dụng này KHÔNG tự render ra file video.

Chỉ trả về DUY NHẤT JSON theo schema:
{
  "tieuDe": string,
  "tongThoiLuong": string,
  "cacCanh": [ { "canh": number, "thoiLuongGiay": number, "loiThoaiHoacTitle": string, "moTaHinhAnh": string, "ghiChuKyThuat": string } ]
}
`;

// 8. Sáng kiến kinh nghiệm (SKKN) ----------------------------------------------
export const promptSKKN = (input: {
  tenSangKien: string;
  subject: string;
  grade: string;
  donViCongTac?: string;
  doiTuongApDung?: string;
  namHoc?: string;
  boiCanh?: string;
}) => `
Bạn là chuyên gia nghiên cứu khoa học sư phạm ứng dụng và có nhiều kinh nghiệm viết Sáng kiến kinh nghiệm (SKKN) cho giáo viên THCS theo Chương trình GDPT 2018. Bạn hiểu thực tế dạy học tại các trường THCS ở Việt Nam và biết cách xây dựng một sáng kiến có tính mới, tính sáng tạo, tính khoa học và có khả năng áp dụng hiệu quả trong thực tiễn.

Thông tin đầu vào:
Tên đề tài: ${input.tenSangKien}
Môn học: ${input.subject}
Khối lớp: ${input.grade}
Đơn vị công tác: ${input.donViCongTac || 'Trường THCS (GV chưa cung cấp tên cụ thể, hãy để dạng "Trường THCS ...")'}
Đối tượng áp dụng: Học sinh lớp ${input.grade}${input.doiTuongApDung ? ' - ' + input.doiTuongApDung : ''}
Thời gian thực hiện: Năm học ${input.namHoc || '(GV chưa cung cấp, hãy để dạng "20xx - 20xx")'}
Bối cảnh/thực trạng do GV cung cấp (nếu có): ${input.boiCanh || 'GV chưa cung cấp, hãy đề xuất bối cảnh thực tế phổ biến ở trường THCS'}
Bộ sách giáo khoa đang giảng dạy: ${BO_SACH_GIAO_KHOA}

Yêu cầu về nội dung: Sáng kiến phải phù hợp Chương trình GDPT 2018; xuất phát từ khó khăn thực tế trong giảng dạy; có số liệu minh chứng trước và sau khi áp dụng (nếu GV chưa có số liệu thực tế, tạo bộ số liệu giả định hợp lý và ghi chú rõ trong "ghiChuSoLieu": "Số liệu minh hoạ, cần thay thế bằng số liệu thực tế của đơn vị."); có tính mới, không sao chép tài liệu; có khả năng áp dụng rộng rãi tại các trường THCS; ngôn ngữ khoa học nhưng gần gũi với giáo viên phổ thông; bám sát thực tế lớp học, không mang tính lý thuyết chung chung.

=== PHẦN I. MỞ ĐẦU ===
- "lyDoChonDeTai": làm rõ thực trạng hiện nay, khó khăn của giáo viên, hạn chế của học sinh, yêu cầu đổi mới giáo dục, ý nghĩa của đề tài.
- "mucTieuNghienCuu": { "mucTieuChung", "mucTieuCuThe" (mảng các mục tiêu cụ thể) }.
- "doiTuongNghienCuu", "phamViNghienCuu".
- "phuongPhapNghienCuu": chọn trong số điều tra, quan sát, thực nghiệm sư phạm, phân tích số liệu, thống kê, so sánh, nghiên cứu tài liệu.

=== PHẦN II. NỘI DUNG ===
Chương 1 - "coSoLyLuan": trình bày cơ sở pháp lý, Chương trình GDPT 2018, quan điểm phát triển phẩm chất/năng lực, tài liệu liên quan; CHỈ TÓM TẮT, không sao chép nguyên văn văn bản pháp luật.

Chương 2 - "thucTrang": phân tích cụ thể "dacDiemHocSinh", "dieuKienCoSoVatChat", "thucTrangDayHoc", "khoKhan", "nguyenNhan"; kèm "bangSoLieuKhaoSatDauNam" (mảng {tieuChi, truoc, sau} - ở chương này "sau" có thể để trống hoặc ghi "-" vì là số liệu khảo sát ĐẦU NĂM, ưu tiên đưa tỷ lệ HS đạt yêu cầu/kết quả khảo sát đầu năm/mức độ hứng thú học tập).

Chương 3 - "cacGiaiPhap": đây là phần trọng tâm. Đề xuất 3-5 giải pháp, có thể chọn trong số: đổi mới phương pháp dạy học, ứng dụng CNTT, ứng dụng AI hỗ trợ giáo viên, chuyển đổi số trong dạy học, thiết kế học liệu số, dạy học STEM, dạy học dự án, tăng cường hoạt động trải nghiệm, phân hoá học sinh, kiểm tra đánh giá theo năng lực, khai thác hiệu quả SGK "${BO_SACH_GIAO_KHOA}", phát triển năng lực số, tích hợp giáo dục địa phương/môi trường/an toàn giao thông/quyền con người... (chỉ chọn nội dung phù hợp với đề tài). Mỗi giải pháp trong mảng gồm đủ: "tenGiaiPhap", "mucTieu", "noiDung", "cachThucHien", "viDuMinhHoa" (ví dụ thực tế trong lớp học), "dieuKienThucHien", "diemMoi", "hieuQuaDuKien".

Chương 4 - "hieuQuaSauApDung": { "bangSoSanhTruocSau" (mảng {tieuChi, truoc, sau}, ví dụ tiêu chí "Hoàn thành tốt", "Hoàn thành", "Chưa hoàn thành"), "phanTichNguyenNhanCaiThien", "ghiChuSoLieu" }.

=== PHẦN III. KẾT LUẬN VÀ KIẾN NGHỊ ===
- "ketLuan": { "tinhHieuQua", "tinhMoi", "khaNangNhanRong", "giaTriThucTien" }.
- "kienNghi": { "doiVoiNhaTruong", "doiVoiToChuyenMon", "doiVoiGiaoVien", "doiVoiPhongGDDT" }.
- "taiLieuThamKhao": trích dẫn theo đúng quy định, ưu tiên Chương trình GDPT 2018, Thông tư 32/2018/TT-BGDĐT, các công văn hướng dẫn của Bộ GD&ĐT, tài liệu chuyên môn, sách giáo khoa, tài liệu khoa học giáo dục.
- "phuLuc": gợi ý các phụ lục nên bổ sung nếu phù hợp (phiếu khảo sát, hình ảnh minh hoạ, kế hoạch bài dạy, phiếu học tập, rubric đánh giá, biểu đồ, bảng thống kê, sản phẩm học sinh).

Yêu cầu chất lượng: viết theo văn phong hành chính, khoa học; không sao chép tài liệu có sẵn; lập luận chặt chẽ, logic; giải pháp khả thi trong điều kiện trường THCS công lập; bám sát thực tế dạy học; có minh chứng cụ thể; nội dung có thể chỉnh sửa tối thiểu để nộp hội đồng xét duyệt. KHÔNG dùng ký hiệu markdown (**, #, -) trong nội dung text, chỉ trả văn bản thuần trong JSON.

Chỉ trả về DUY NHẤT một object JSON theo đúng schema (không thêm lời dẫn, không markdown code-fence):
{
  "tenSangKien": string,
  "monHoc": string,
  "khoiLop": string,
  "donViCongTac": string,
  "doiTuongApDung": string,
  "namHoc": string,
  "linhVuc": string,
  "lyDoChonDeTai": string,
  "mucTieuNghienCuu": { "mucTieuChung": string, "mucTieuCuThe": string[] },
  "doiTuongNghienCuu": string,
  "phamViNghienCuu": string,
  "phuongPhapNghienCuu": string[],
  "coSoLyLuan": string,
  "thucTrang": {
    "dacDiemHocSinh": string, "dieuKienCoSoVatChat": string, "thucTrangDayHoc": string, "khoKhan": string, "nguyenNhan": string,
    "bangSoLieuKhaoSatDauNam": [ { "tieuChi": string, "truoc": string, "sau": string } ]
  },
  "cacGiaiPhap": [
    { "tenGiaiPhap": string, "mucTieu": string, "noiDung": string, "cachThucHien": string, "viDuMinhHoa": string, "dieuKienThucHien": string, "diemMoi": string, "hieuQuaDuKien": string }
  ],
  "hieuQuaSauApDung": {
    "bangSoSanhTruocSau": [ { "tieuChi": string, "truoc": string, "sau": string } ],
    "phanTichNguyenNhanCaiThien": string,
    "ghiChuSoLieu": string
  },
  "ketLuan": { "tinhHieuQua": string, "tinhMoi": string, "khaNangNhanRong": string, "giaTriThucTien": string },
  "kienNghi": { "doiVoiNhaTruong": string, "doiVoiToChuyenMon": string, "doiVoiGiaoVien": string, "doiVoiPhongGDDT": string },
  "taiLieuThamKhao": string[],
  "phuLuc": string[]
}
`;
