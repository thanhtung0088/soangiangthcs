import React, { useState } from 'react';
import ModuleShell, { ModuleInput, ModuleSelect } from '../ModuleShell';
import { MON_HOC_THCS } from '../../constants/subjects';
import FileAttach, { AttachedFile } from '../FileAttach';
import { generateSKKN } from '../../services/geminiService';
import { exportSKKNToWord } from '../../services/exportService';
import { SKKNResult } from '../../types';

const SKKN: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [form, setForm] = useState({
    subject: 'Toán học',
    grade: '6',
    tenSangKien: '',
    donViCongTac: '',
    doiTuongApDung: '',
    namHoc: '',
    boiCanh: '',
  });
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SKKNResult | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!form.tenSangKien) return alert('Vui lòng nhập tên sáng kiến');
    setLoading(true);
    setError('');
    try {
      setResult(await generateSKKN(form, attachments.map((a) => a.file)));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const bangSoLieu = (rows: { tieuChi: string; truoc: string; sau: string }[]) => (
    <table className="w-full text-sm border-collapse mb-3">
      <thead>
        <tr className="bg-slate-50">
          <th className="border p-2 text-left">Tiêu chí</th>
          <th className="border p-2">Trước</th>
          <th className="border p-2">Sau</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td className="border p-2">{r.tieuChi}</td>
            <td className="border p-2 text-center">{r.truoc}</td>
            <td className="border p-2 text-center">{r.sau}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <ModuleShell
      title="Soạn Sáng kiến kinh nghiệm"
      accent="skkn"
      icon="fa-award"
      onBack={onBack}
      loading={loading}
      hasResult={!!result}
      onGenerate={handleGenerate}
      exportButtons={result ? [{ label: 'Xuất Word', icon: 'fa-file-word', color: 'bg-blue-600', onClick: () => exportSKKNToWord(result) }] : []}
      formArea={
        <>
          <ModuleSelect value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} options={MON_HOC_THCS} />
          <ModuleInput value={form.grade} onChange={(v) => setForm({ ...form, grade: v })} placeholder="Khối lớp áp dụng..." />
          <ModuleInput value={form.tenSangKien} onChange={(v) => setForm({ ...form, tenSangKien: v })} placeholder="Tên sáng kiến..." />
          <ModuleInput value={form.donViCongTac} onChange={(v) => setForm({ ...form, donViCongTac: v })} placeholder="Đơn vị công tác (VD: Trường THCS Bình Mỹ)..." />
          <ModuleInput value={form.doiTuongApDung} onChange={(v) => setForm({ ...form, doiTuongApDung: v })} placeholder="Đối tượng áp dụng (tuỳ chọn)..." />
          <ModuleInput value={form.namHoc} onChange={(v) => setForm({ ...form, namHoc: v })} placeholder="Năm học (VD: 2025-2026)..." />
          <textarea
            value={form.boiCanh}
            onChange={(e) => setForm({ ...form, boiCanh: e.target.value })}
            placeholder="Bối cảnh/thực trạng thực tế tại trường (tuỳ chọn)..."
            className="w-full bg-white/70 border border-white/60 rounded-md px-5 py-4 text-sm font-bold min-h-[100px]"
          />
          <FileAttach files={attachments} onChange={setAttachments} />
        </>
      }
      resultArea={
        error ? (
          <p className="text-red-500 font-bold">{error}</p>
        ) : result ? (
          <div className="space-y-5 font-serif leading-relaxed text-slate-700">
            <h2 className="text-xl font-black text-center uppercase text-skkn">{result.tenSangKien}</h2>
            <p className="text-center text-sm text-slate-400 font-bold">
              {result.monHoc} - Khối {result.khoiLop} - {result.donViCongTac} - Năm học {result.namHoc}
            </p>

            <div className="border-t border-slate-100 pt-4">
              <p className="font-black uppercase text-skkn mb-2">PHẦN I. MỞ ĐẦU</p>
              <p className="font-bold italic">1. Lý do chọn đề tài</p>
              <p className="mb-2">{result.lyDoChonDeTai}</p>
              <p className="font-bold italic">2. Mục tiêu nghiên cứu</p>
              <p>Mục tiêu chung: {result.mucTieuNghienCuu.mucTieuChung}</p>
              <ul className="list-disc pl-6 mb-2">{result.mucTieuNghienCuu.mucTieuCuThe.map((m, i) => <li key={i}>{m}</li>)}</ul>
              <p className="font-bold italic">3. Đối tượng nghiên cứu</p>
              <p className="mb-2">{result.doiTuongNghienCuu}</p>
              <p className="font-bold italic">4. Phạm vi nghiên cứu</p>
              <p className="mb-2">{result.phamViNghienCuu}</p>
              <p className="font-bold italic">5. Phương pháp nghiên cứu</p>
              <ul className="list-disc pl-6">{result.phuongPhapNghienCuu.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="font-black uppercase text-skkn mb-2">PHẦN II. NỘI DUNG</p>
              <p className="font-bold italic">Chương 1. Cơ sở lý luận</p>
              <p className="mb-3">{result.coSoLyLuan}</p>

              <p className="font-bold italic">Chương 2. Thực trạng</p>
              <p><b>Đặc điểm học sinh:</b> {result.thucTrang.dacDiemHocSinh}</p>
              <p><b>Điều kiện cơ sở vật chất:</b> {result.thucTrang.dieuKienCoSoVatChat}</p>
              <p><b>Thực trạng dạy học:</b> {result.thucTrang.thucTrangDayHoc}</p>
              <p><b>Khó khăn:</b> {result.thucTrang.khoKhan}</p>
              <p className="mb-2"><b>Nguyên nhân:</b> {result.thucTrang.nguyenNhan}</p>
              {result.thucTrang.bangSoLieuKhaoSatDauNam.length > 0 && bangSoLieu(result.thucTrang.bangSoLieuKhaoSatDauNam)}

              <p className="font-bold italic">Chương 3. Các giải pháp thực hiện</p>
              {result.cacGiaiPhap.map((gp, i) => (
                <div key={i} className="mb-3 pl-4 border-l-4 border-skkn/30">
                  <p className="font-bold">{i + 1}. {gp.tenGiaiPhap}</p>
                  <p><b>Mục tiêu:</b> {gp.mucTieu}</p>
                  <p><b>Nội dung:</b> {gp.noiDung}</p>
                  <p><b>Cách thực hiện:</b> {gp.cachThucHien}</p>
                  <p className="italic"><b>Ví dụ minh hoạ:</b> {gp.viDuMinhHoa}</p>
                  <p><b>Điểm mới:</b> {gp.diemMoi}</p>
                  <p><b>Hiệu quả dự kiến:</b> {gp.hieuQuaDuKien}</p>
                </div>
              ))}

              <p className="font-bold italic">Chương 4. Hiệu quả sau khi áp dụng</p>
              {result.hieuQuaSauApDung.bangSoSanhTruocSau.length > 0 && bangSoLieu(result.hieuQuaSauApDung.bangSoSanhTruocSau)}
              <p className="mb-1">{result.hieuQuaSauApDung.phanTichNguyenNhanCaiThien}</p>
              {result.hieuQuaSauApDung.ghiChuSoLieu && (
                <p className="text-xs italic text-slate-400">{result.hieuQuaSauApDung.ghiChuSoLieu}</p>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="font-black uppercase text-skkn mb-2">PHẦN III. KẾT LUẬN VÀ KIẾN NGHỊ</p>
              <p className="font-bold italic">Kết luận</p>
              <p>Tính hiệu quả: {result.ketLuan.tinhHieuQua}</p>
              <p>Tính mới: {result.ketLuan.tinhMoi}</p>
              <p>Khả năng nhân rộng: {result.ketLuan.khaNangNhanRong}</p>
              <p className="mb-2">Giá trị thực tiễn: {result.ketLuan.giaTriThucTien}</p>
              <p className="font-bold italic">Kiến nghị</p>
              <p>Đối với nhà trường: {result.kienNghi.doiVoiNhaTruong}</p>
              <p>Đối với tổ chuyên môn: {result.kienNghi.doiVoiToChuyenMon}</p>
              <p>Đối với giáo viên: {result.kienNghi.doiVoiGiaoVien}</p>
              <p>Đối với Phòng GD&ĐT: {result.kienNghi.doiVoiPhongGDDT}</p>
            </div>

            {result.taiLieuThamKhao.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <p className="font-black uppercase text-skkn mb-2">Tài liệu tham khảo</p>
                <ol className="list-decimal pl-6">{result.taiLieuThamKhao.map((t, i) => <li key={i}>{t}</li>)}</ol>
              </div>
            )}
            {result.phuLuc.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <p className="font-black uppercase text-skkn mb-2">Phụ lục đề xuất</p>
                <ul className="list-disc pl-6">{result.phuLuc.map((t, i) => <li key={i}>{t}</li>)}</ul>
              </div>
            )}
          </div>
        ) : null
      }
    />
  );
};

export default SKKN;
