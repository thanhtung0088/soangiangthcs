import React, { useState } from 'react';
import ModuleShell, { ModuleInput, ModuleSelect } from '../ModuleShell';
import { MON_HOC_THCS } from '../../constants/subjects';
import FileAttach, { AttachedFile } from '../FileAttach';
import { generateOutline } from '../../services/geminiService';
import { exportOutlineToWord } from '../../services/exportService';
import { OutlineResult } from '../../types';

const OutlineReview: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [form, setForm] = useState({ subject: 'Toán học', grade: '6', title: '' });
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OutlineResult | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!form.title) return alert('Vui lòng nhập phạm vi ôn tập');
    setLoading(true);
    setError('');
    try {
      setResult(await generateOutline(form, attachments.map((a) => a.file)));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleShell
      title="Soạn đề cương ôn tập"
      accent="outline"
      icon="fa-list-check"
      onBack={onBack}
      loading={loading}
      hasResult={!!result}
      onGenerate={handleGenerate}
      exportButtons={result ? [{ label: 'Xuất Word', icon: 'fa-file-word', color: 'bg-blue-600', onClick: () => exportOutlineToWord(result) }] : []}
      formArea={
        <>
          <ModuleSelect value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} options={MON_HOC_THCS} />
          <ModuleInput value={form.grade} onChange={(v) => setForm({ ...form, grade: v })} placeholder="Lớp..." />
          <ModuleInput value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Phạm vi ôn tập (VD: Giữa kỳ 1)..." />
          <FileAttach files={attachments} onChange={setAttachments} />
        </>
      }
      resultArea={
        error ? (
          <p className="text-red-500 font-bold">{error}</p>
        ) : result ? (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-center uppercase text-outline">
              Đề cương ôn tập - {result.monHoc} - {result.phamViOnTap}
            </h2>
            {result.cacPhan.map((p, i) => (
              <div key={i} className="border-l-4 border-outline/30 pl-4">
                <p className="font-bold text-lg mb-2">{i + 1}. {p.chuDe}</p>
                <p className="font-black text-xs uppercase text-slate-400 mb-1">Kiến thức cần nhớ</p>
                <ul className="list-disc pl-5 mb-2 text-slate-600">{p.kienThucCanNho.map((k, j) => <li key={j}>{k}</li>)}</ul>
                {p.soDoTomTat && (
                  <>
                    <p className="font-black text-xs uppercase text-slate-400 mb-1">Sơ đồ tóm tắt</p>
                    <p className="text-slate-500 italic mb-2 whitespace-pre-wrap">{p.soDoTomTat}</p>
                  </>
                )}
                <p className="font-black text-xs uppercase text-slate-400 mb-1">Phân dạng bài tập</p>
                <div className="space-y-2 mb-2">
                  {p.dangBaiTap.map((d, j) => (
                    <div key={j} className="bg-slate-50 rounded-md p-3">
                      <p className="font-bold text-sm">[{d.mucDo}] {d.viDu}</p>
                      <p className="text-xs text-slate-500 italic mt-1">Hướng dẫn giải: {d.huongDanGiai}</p>
                    </div>
                  ))}
                </div>
                <p className="font-black text-xs uppercase text-slate-400 mb-1">Câu hỏi tự luyện</p>
                <ol className="list-decimal pl-5 text-slate-600">{p.cauHoiTuLuyen.map((c, j) => <li key={j}>{c}</li>)}</ol>
              </div>
            ))}
          </div>
        ) : null
      }
    />
  );
};

export default OutlineReview;
