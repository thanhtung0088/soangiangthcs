import React, { useState } from 'react';
import ModuleShell, { ModuleInput, ModuleSelect } from '../ModuleShell';
import { MON_HOC_THCS } from '../../constants/subjects';
import FileAttach, { AttachedFile } from '../FileAttach';
import { generatePPTLayout, generateSlideImage } from '../../services/geminiService';
import { exportSlideDeckToPptx, exportSlideDeckToWord } from '../../services/exportService';
import { SlideDeckResult } from '../../types';

const SlidePPT: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [form, setForm] = useState({ subject: 'Toán học', grade: '6', title: '', duration: '12' });
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SlideDeckResult | null>(null);
  const [images, setImages] = useState<Record<number, string>>({});
  const [genImgLoading, setGenImgLoading] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!form.title) return alert('Vui lòng nhập chủ đề bài giảng');
    setLoading(true);
    setError('');
    setImages({});
    try {
      const res = await generatePPTLayout(form, Number(form.duration) || 12, attachments.map((a) => a.file));
      setResult(res);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenImage = async (soThuTu: number, moTa: string) => {
    setGenImgLoading(soThuTu);
    try {
      const img = await generateSlideImage(moTa);
      setImages((prev) => ({ ...prev, [soThuTu]: img }));
    } catch (e) {
      alert('Không tạo được ảnh: ' + (e as Error).message);
    } finally {
      setGenImgLoading(null);
    }
  };

  return (
    <ModuleShell
      title="Bài giảng trình chiếu PPT"
      accent="ppt"
      icon="fa-display"
      onBack={onBack}
      loading={loading}
      hasResult={!!result}
      onGenerate={handleGenerate}
      exportButtons={
        result
          ? [
              { label: 'Xuất PPTX', icon: 'fa-file-powerpoint', color: 'bg-orange-600', onClick: () => exportSlideDeckToPptx(result, images) },
              { label: 'Xuất kịch bản Word', icon: 'fa-file-word', color: 'bg-blue-600', onClick: () => exportSlideDeckToWord(result) },
              { label: 'Mở Canva', icon: 'fa-palette', color: 'bg-purple-600', onClick: () => window.open('https://www.canva.com/create/presentations/', '_blank') },
            ]
          : []
      }
      formArea={
        <>
          <ModuleSelect value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} options={MON_HOC_THCS} />
          <ModuleInput value={form.grade} onChange={(v) => setForm({ ...form, grade: v })} placeholder="Lớp..." />
          <ModuleInput value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Chủ đề bài giảng..." />
          <ModuleInput value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} placeholder="Số slide mong muốn (VD: 12)" />
          <FileAttach files={attachments} onChange={setAttachments} />
        </>
      }
      resultArea={
        error ? (
          <p className="text-red-500 font-bold">{error}</p>
        ) : result ? (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-center uppercase text-ppt">{result.chuDe}</h2>
            {result.slides.map((s) => (
              <div key={s.soThuTu} className="border border-slate-100 rounded-md p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                    SLIDE {s.soThuTu} - {s.phanTienTrinh}
                  </p>
                  <p className="font-bold text-lg mb-2">{s.tieuDe}</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 mb-3">
                    {s.noiDungGachDau.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  {s.cauHoiTuongTac && <p className="text-xs text-ppt font-bold mb-1">❓ {s.cauHoiTuongTac}</p>}
                  <p className="text-xs italic text-slate-400">Ghi chú GV: {s.ghiChuGiangVien}</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  {images[s.soThuTu] ? (
                    <img src={images[s.soThuTu]} className="rounded-md w-full object-cover" />
                  ) : (
                    <button
                      onClick={() => handleGenImage(s.soThuTu, s.goiYHinhAnh)}
                      disabled={genImgLoading === s.soThuTu}
                      className="text-xs font-black uppercase bg-slate-100 hover:bg-slate-200 rounded-md px-4 py-3 w-full"
                    >
                      {genImgLoading === s.soThuTu ? 'Đang tạo ảnh...' : 'Tạo ảnh minh hoạ AI'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {result.goiYTroChoiHoatDongNhom && (
              <div className="border-l-4 border-ppt/30 pl-4">
                <p className="font-black uppercase text-xs text-slate-400 mb-1">Gợi ý trò chơi / hoạt động nhóm</p>
                <p className="text-slate-600 text-sm">{result.goiYTroChoiHoatDongNhom}</p>
              </div>
            )}
            {result.cauHoiKiemTraNhanhCuoiBai?.length > 0 && (
              <div className="border-l-4 border-ppt/30 pl-4">
                <p className="font-black uppercase text-xs text-slate-400 mb-1">Câu hỏi kiểm tra nhanh cuối bài</p>
                <ol className="list-decimal pl-5 text-sm text-slate-600">
                  {result.cauHoiKiemTraNhanhCuoiBai.map((q, i) => <li key={i}>{q}</li>)}
                </ol>
              </div>
            )}
          </div>
        ) : null
      }
    />
  );
};

export default SlidePPT;
