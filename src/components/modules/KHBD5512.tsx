import React, { useState } from 'react';
import ModuleShell, { ModuleInput, ModuleTextarea, ModuleSelect } from '../ModuleShell';
import { MON_HOC_THCS } from '../../constants/subjects';
import FileAttach, { AttachedFile } from '../FileAttach';
import { generateLessonPlan } from '../../services/geminiService';
import { exportKHBD5512ToWord } from '../../services/exportService';
import { KHBD5512Result } from '../../types';

const KHBD5512: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [form, setForm] = useState({ subject: 'Toán học', grade: '6', title: '', duration: '1 tiết', objectives: '' });
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KHBD5512Result | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!form.title) return alert('Vui lòng nhập tên bài học');
    setLoading(true);
    setError('');
    try {
      const res = await generateLessonPlan(form, attachments.map((a) => a.file));
      setResult(res);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleShell
      title="Soạn KHBD theo CV 5512"
      accent="khbd"
      icon="fa-book-open"
      onBack={onBack}
      loading={loading}
      hasResult={!!result}
      onGenerate={handleGenerate}
      exportButtons={
        result
          ? [{ label: 'Xuất Word', icon: 'fa-file-word', color: 'bg-blue-600', onClick: () => exportKHBD5512ToWord(result) }]
          : []
      }
      formArea={
        <>
          <ModuleSelect value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} options={MON_HOC_THCS} />
          <ModuleInput value={form.grade} onChange={(v) => setForm({ ...form, grade: v })} placeholder="Lớp..." />
          <ModuleInput value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} placeholder="Số tiết..." />
          <ModuleInput value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Tên bài học..." />
          <ModuleTextarea
            value={form.objectives}
            onChange={(v) => setForm({ ...form, objectives: v })}
            placeholder="Yêu cầu cần đạt (tuỳ chọn, để trống để AI tự đề xuất)..."
          />
          <FileAttach files={attachments} onChange={setAttachments} />
        </>
      }
      resultArea={
        error ? (
          <p className="text-red-500 font-bold">{error}</p>
        ) : result ? (
          <div className="space-y-6 font-serif text-slate-700 leading-relaxed">
            <h2 className="text-2xl font-black text-center uppercase">{result.tenBai}</h2>
            <p className="text-center text-sm font-bold text-slate-400">
              {result.monHoc} - Lớp {result.lop} - {result.soTiet} - SGK {result.boSachGiaoKhoa}
            </p>

            <div>
              <h3 className="font-black uppercase text-khbd mb-2">I. Mục tiêu</h3>
              <p className="font-bold italic mb-1">1. Phẩm chất</p>
              <ul className="list-disc pl-6 mb-2">{result.mucTieu.phamChat.map((k, i) => <li key={i}>{k}</li>)}</ul>
              <p className="font-bold italic mb-1">2. Năng lực chung</p>
              <ul className="list-disc pl-6 mb-2">{result.mucTieu.nangLucChung.map((k, i) => <li key={i}>{k}</li>)}</ul>
              <p className="font-bold italic mb-1">3. Năng lực đặc thù</p>
              <ul className="list-disc pl-6 mb-2">{result.mucTieu.nangLucDacThu.map((k, i) => <li key={i}>{k}</li>)}</ul>
              <p className="font-bold italic mb-1">4. Yêu cầu cần đạt</p>
              <ul className="list-disc pl-6">{result.mucTieu.yeuCauCanDat.map((k, i) => <li key={i}>{k}</li>)}</ul>
            </div>

            <div>
              <h3 className="font-black uppercase text-khbd mb-2">II. Thiết bị dạy học và học liệu</h3>
              <p className="font-bold italic mb-1">Thiết bị của giáo viên</p>
              <ul className="list-disc pl-6 mb-2">{result.thietBiHocLieu.thietBiGiaoVien.map((k, i) => <li key={i}>{k}</li>)}</ul>
              <p className="font-bold italic mb-1">Học liệu</p>
              <ul className="list-disc pl-6 mb-2">{result.thietBiHocLieu.hocLieu.map((k, i) => <li key={i}>{k}</li>)}</ul>
              <p className="font-bold italic mb-1">Thiết bị của học sinh</p>
              <ul className="list-disc pl-6">{result.thietBiHocLieu.thietBiHocSinh.map((k, i) => <li key={i}>{k}</li>)}</ul>
              {result.thietBiHocLieu.phanMemHocLieuSo.length > 0 && (
                <>
                  <p className="font-bold italic mb-1 mt-2">Phần mềm, học liệu số</p>
                  <ul className="list-disc pl-6">{result.thietBiHocLieu.phanMemHocLieuSo.map((k, i) => <li key={i}>{k}</li>)}</ul>
                </>
              )}
            </div>

            <div>
              <h3 className="font-black uppercase text-khbd mb-2">III. Tiến trình dạy học</h3>
              {result.tienTrinh.map((hd, i) => (
                <div key={i} className="mb-4 border-l-4 border-khbd/30 pl-4">
                  <p className="font-bold italic">{hd.tenHoatDong}</p>
                  <p><b>a) Mục tiêu:</b> {hd.mucTieu}</p>
                  <p><b>b) Nội dung:</b> {hd.noiDung}</p>
                  <p><b>c) Sản phẩm:</b> {hd.sanPham}</p>
                  <p><b>d) Tổ chức thực hiện:</b> {hd.toChucThucHien}</p>
                  <p><b>đ) Kiểm tra, đánh giá:</b> {hd.kiemTraDanhGia}</p>
                </div>
              ))}
            </div>

            {result.tichHopLienMon.length > 0 && (
              <div>
                <h3 className="font-black uppercase text-khbd mb-2">IV. Tích hợp liên môn</h3>
                <ul className="list-disc pl-6">{result.tichHopLienMon.map((t, i) => <li key={i}>{t}</li>)}</ul>
              </div>
            )}
            {result.giaoDucSTEM && (
              <div>
                <h3 className="font-black uppercase text-khbd mb-2">V. Giáo dục STEM</h3>
                <p>{result.giaoDucSTEM}</p>
              </div>
            )}
            {result.phatTrienNangLucSo.length > 0 && (
              <div>
                <h3 className="font-black uppercase text-khbd mb-2">VI. Phát triển năng lực số</h3>
                <ul className="list-disc pl-6">{result.phatTrienNangLucSo.map((t, i) => <li key={i}>{t}</li>)}</ul>
              </div>
            )}
            {result.longGhepGiaoDuc.length > 0 && (
              <div>
                <h3 className="font-black uppercase text-khbd mb-2">VII. Lồng ghép giáo dục</h3>
                <ul className="list-disc pl-6">{result.longGhepGiaoDuc.map((t, i) => <li key={i}>{t}</li>)}</ul>
              </div>
            )}
            {result.phuongPhapDayHoc.length > 0 && (
              <div>
                <h3 className="font-black uppercase text-khbd mb-2">VIII. Phương pháp, kĩ thuật dạy học</h3>
                <ul className="list-disc pl-6">{result.phuongPhapDayHoc.map((t, i) => <li key={i}>{t}</li>)}</ul>
              </div>
            )}
            <div>
              <h3 className="font-black uppercase text-khbd mb-2">IX. Phân hoá học sinh và lưu ý tổ chức</h3>
              <p><b>Phân hoá học sinh:</b> {result.phanHoaHocSinh}</p>
              <p><b>Lưu ý tổ chức:</b> {result.luuYDayHoc}</p>
            </div>
          </div>
        ) : null
      }
    />
  );
};

export default KHBD5512;
