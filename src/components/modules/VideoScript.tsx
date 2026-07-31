import React, { useState } from 'react';
import ModuleShell, { ModuleInput, ModuleSelect } from '../ModuleShell';
import { MON_HOC_THCS } from '../../constants/subjects';
import FileAttach, { AttachedFile } from '../FileAttach';
import { generateVideoScript } from '../../services/geminiService';
import { exportVideoScriptToWord } from '../../services/exportService';
import { VideoScriptResult } from '../../types';

const VideoScript: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [form, setForm] = useState({ subject: 'Toán học', grade: '6', title: '', thoiLuong: '90 giây' });
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoScriptResult | null>(null);
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  const handleGenerate = async () => {
    if (!form.title) return alert('Vui lòng nhập tên bài học');
    setLoading(true);
    setError('');
    try {
      setResult(await generateVideoScript(form, form.thoiLuong, attachments.map((a) => a.file)));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleShell
      title="Kịch bản video minh hoạ"
      accent="video"
      icon="fa-clapperboard"
      onBack={onBack}
      loading={loading}
      hasResult={!!result}
      onGenerate={handleGenerate}
      exportButtons={
        result
          ? [
              { label: 'Xuất Word (storyboard)', icon: 'fa-file-word', color: 'bg-blue-600', onClick: () => exportVideoScriptToWord(result) },
              { label: 'Mở Canva Video', icon: 'fa-clapperboard', color: 'bg-purple-600', onClick: () => window.open('https://www.canva.com/video-editor/', '_blank') },
            ]
          : []
      }
      formArea={
        <>
          <ModuleSelect value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} options={MON_HOC_THCS} />
          <ModuleInput value={form.grade} onChange={(v) => setForm({ ...form, grade: v })} placeholder="Lớp..." />
          <ModuleInput value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Tên bài học..." />
          <ModuleInput value={form.thoiLuong} onChange={(v) => setForm({ ...form, thoiLuong: v })} placeholder="Thời lượng mục tiêu (VD: 90 giây)" />
          <FileAttach files={attachments} onChange={setAttachments} />
          <p className="text-[11px] text-slate-400 italic leading-relaxed">
            * Công cụ tạo kịch bản/storyboard chi tiết. Thầy/Cô dùng file xuất ra để dựng video bằng Canva Video, CapCut hoặc công cụ tương tự.
          </p>
        </>
      }
      resultArea={
        error ? (
          <p className="text-red-500 font-bold">{error}</p>
        ) : result ? (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-center uppercase text-video">{result.tieuDe}</h2>
            <p className="text-center text-sm text-slate-400 font-bold">Tổng thời lượng: {result.tongThoiLuong}</p>

            <div className="bg-video/5 border border-video/20 rounded-md p-4">
              <button
                onClick={() => setShowGuide((v) => !v)}
                className="w-full flex items-center justify-between text-video font-black text-xs uppercase tracking-wide"
              >
                <span><i className="fas fa-clapperboard mr-2"></i>Hướng dẫn dựng video bằng Canva từ kịch bản này</span>
                <i className={`fas fa-chevron-${showGuide ? 'up' : 'down'} text-[10px]`}></i>
              </button>
              {showGuide && (
                <ol className="list-decimal pl-5 mt-3 space-y-2 text-xs text-slate-600 leading-relaxed">
                  <li>Bấm nút <b>"Mở Canva Video"</b> ở trên (hoặc vào <a href="https://www.canva.com/video-editor/" target="_blank" rel="noreferrer" className="text-video underline">canva.com/video-editor</a>) → chọn mẫu video ngắn, tỉ lệ 16:9 hoặc 9:16 tuỳ nơi trình chiếu.</li>
                  <li>Với mỗi <b>Cảnh</b> trong kịch bản dưới đây: tạo 1 slide/trang mới trong Canva tương ứng.</li>
                  <li>Gõ đúng nội dung ở mục <b>"Lời thoại / Tiêu đề"</b> vào khung chữ trên trang đó.</li>
                  <li>Với mục <b>"Mô tả hình ảnh/clip"</b>: dán mô tả đó vào ô rồi bấm <b>"Tìm kiếm"</b> để Canva tìm ảnh/video có sẵn khớp nội dung (miễn phí). Nút <b>"Tạo"</b> (AI biến ảnh thành video chuyển động) là tính năng <b>Canva Pro trả phí</b> (biểu tượng 👑) - nếu trường bạn đã có Canva for Education thì dùng được miễn phí, nếu chưa thì cứ dùng ảnh tĩnh từ "Tìm kiếm" và bật hiệu ứng Zoom/Pan có sẵn (miễn phí) để ảnh vẫn sinh động như video.</li>
                  <li>Đặt thời lượng từng trang theo đúng số giây ghi ở "Thời lượng" của cảnh đó (nhấp vào trang → kéo thanh thời gian bên dưới).</li>
                  <li>Thêm nhạc nền: <b>"Apps" → "Âm thanh"</b>, chọn nhạc nền phù hợp không lời để không át lời thoại.</li>
                  <li>Xem lại toàn bộ (nút Play), chỉnh hiệu ứng chuyển cảnh nếu cần (kéo thả giữa 2 trang).</li>
                  <li>Bấm <b>"Chia sẻ" → "Tải xuống" → chọn MP4</b> để xuất video hoàn chỉnh.</li>
                </ol>
              )}
            </div>

            {result.cacCanh.map((c) => (
              <div key={c.canh} className="border border-slate-100 rounded-md p-4">
                <p className="font-black text-xs uppercase text-slate-400">Cảnh {c.canh} - {c.thoiLuongGiay}s</p>
                <p className="font-bold mt-1">{c.loiThoaiHoacTitle}</p>
                <p className="text-slate-500 text-sm italic mt-1">{c.moTaHinhAnh}</p>
              </div>
            ))}
          </div>
        ) : null
      }
    />
  );
};

export default VideoScript;
